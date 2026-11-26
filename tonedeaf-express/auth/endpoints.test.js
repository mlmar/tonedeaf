const assert = require("node:assert/strict");
const { once } = require("node:events");
const { after, afterEach, before, mock, test } = require("node:test");

process.env.AUTH_SESSION_SECRET = "ab".repeat(32);
process.env.DEV = "false";

const app = require("../index.js");
const localFetch = globalThis.fetch;
const origin = "https://tonedeaf.vercel.app";
const spotifyTokenUrl = "https://accounts.spotify.com/api/token";

let server;
let baseUrl;

before(async () => {
    server = app.listen(0, "127.0.0.1");
    await once(server, "listening");
    baseUrl = "http://127.0.0.1:" + server.address().port + "/api/auth";
});

after(async () => {
    server.close();
    await once(server, "close");
});
afterEach(() => mock.restoreAll());

function mockSpotify(handler) {
    return mock.method(globalThis, "fetch", async (url, options) => {
        assert.equal(url, spotifyTokenUrl);
        assert.equal(options.method, "POST");
        return handler(options.body);
    });
}

function request(path, cookies, options = {}) {
    return localFetch(baseUrl + path, {
        redirect: "manual",
        ...options,
        headers: {
            Cookie: [...cookies].map(([name, value]) => name + "=" + value).join("; "),
            ...options.headers,
        },
    });
}

function post(path, cookies, data) {
    return request(path, cookies, {
        method: "POST",
        headers: {
            Origin: origin,
            "X-Tonedeaf-Auth": "1",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

function applyCookies(response, cookies) {
    for (const line of response.headers.getSetCookie()) {
        const [cookie] = line.split(";");
        const separator = cookie.indexOf("=");
        const name = cookie.slice(0, separator);
        const value = cookie.slice(separator + 1);

        if (value) {
            cookies.set(name, value);
        } else {
            cookies.delete(name);
        }
    }
}

async function start(cookies, path = "/login") {
    const response = await request(path, cookies);
    applyCookies(response, cookies);
    return new URL(response.headers.get("Location"));
}

async function authorize(cookies, code = "first", path) {
    const dialog = await start(cookies, path);
    const response = await request(
        "/callback?" + new URLSearchParams({ code, state: dialog.searchParams.get("state") }),
        cookies,
    );
    applyCookies(response, cookies);
    return response;
}

function tokenResponse(accessToken, refreshToken, expiresIn = 3600) {
    return Response.json({
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: expiresIn,
    });
}

test("authorization sets protected cookies and restores across requests without another exchange", async () => {
    const spotify = mockSpotify((params) => {
        assert.equal(params.get("grant_type"), "authorization_code");
        assert.equal(params.get("redirect_uri"), origin + "/api/auth/callback");
        return tokenResponse("first-access", "first-refresh");
    });
    const cookies = new Map();

    const callback = await authorize(cookies);
    assert.equal(callback.headers.get("Location"), origin + "/");
    assert.equal(callback.headers.get("Cache-Control"), "no-store");

    const credentials = callback.headers.getSetCookie().find((cookie) => cookie.includes("tonedeaf_credentials_"));
    assert.ok(credentials);
    assert.match(credentials, /Path=\/api\/auth; Expires=.+; HttpOnly; Secure; SameSite=Lax/);
    assert.doesNotMatch(credentials, /first-access|first-refresh/);

    const response = await post("/session", cookies);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    const session = await response.json();
    assert.equal(session.accessToken, "first-access");
    assert.ok(session.expiresAt > Date.now());
    assert.deepEqual(Object.keys(session), ["sessionId", "accessToken", "expiresAt"]);
    assert.equal(spotify.mock.callCount(), 1);
});

test("invalid state, denied authorization, and untrusted POSTs cannot establish sessions", async () => {
    const spotify = mockSpotify(() => assert.fail("Spotify should not be called"));
    const cookies = new Map();
    const dialog = await start(cookies, "/change_user");
    assert.equal(dialog.searchParams.get("show_dialog"), "true");

    const mismatch = await request("/callback?state=wrong&code=first", cookies);
    assert.match(mismatch.headers.get("Location"), /auth_error=state_mismatch$/);
    const denial = await request("/callback?" + new URLSearchParams({
        error: "access_denied",
        state: dialog.searchParams.get("state"),
    }), cookies);
    assert.match(denial.headers.get("Location"), /auth_error=denied$/);
    applyCookies(denial, cookies);
    assert.equal((await post("/session", cookies)).status, 401);

    for (const path of ["/session", "/logout"]) {
        const forbidden = await request(path, cookies, {
            method: "POST",
            headers: { Origin: "https://another.example", "X-Tonedeaf-Auth": "1" },
        });
        assert.equal(forbidden.status, 403);
    }

    assert.equal(spotify.mock.callCount(), 0);
});

test("refreshes near expiry, retains and replaces refresh tokens, and deduplicates stale 401s", async () => {
    const refreshTokens = [];
    mockSpotify((params) => {
        if (params.get("grant_type") === "authorization_code") {
            return tokenResponse("original-access", "original-refresh", 30);
        }

        refreshTokens.push(params.get("refresh_token"));
        switch (refreshTokens.length) {
            case 1: return tokenResponse("second-access");
            case 2: return tokenResponse("third-access", "rotated-refresh", 30);
            default: return tokenResponse("fourth-access");
        }
    });
    const cookies = new Map();
    await authorize(cookies);

    const firstRefresh = await post("/session", cookies);
    const session = await firstRefresh.json();
    applyCookies(firstRefresh, cookies);
    assert.equal(session.accessToken, "second-access");

    const lateRejection = await post("/session", cookies, {
        sessionId: session.sessionId,
        rejectedAccessToken: "original-access",
    });
    assert.deepEqual(await lateRejection.json(), session);

    const forced = await post("/session", cookies, {
        sessionId: session.sessionId,
        rejectedAccessToken: "second-access",
    });
    assert.equal((await forced.json()).accessToken, "third-access");
    applyCookies(forced, cookies);

    const nextRefresh = await post("/session", cookies);
    assert.equal((await nextRefresh.json()).accessToken, "fourth-access");
    assert.deepEqual(refreshTokens, ["original-refresh", "original-refresh", "rotated-refresh"]);
});

test("temporary refresh failures preserve credentials while invalid_grant discards them", async () => {
    const cookies = new Map();
    let refreshAttempts = 0;
    const spotify = mockSpotify((params) => {
        if (params.get("grant_type") === "authorization_code") {
            return tokenResponse("first-access", "first-refresh", 30);
        }

        refreshAttempts += 1;
        if (refreshAttempts === 1) {
            throw new Error("provider timeout");
        }

        return Response.json({ error: "invalid_grant" }, { status: 400 });
    });
    await authorize(cookies);

    const temporary = await post("/session", cookies);
    assert.equal(temporary.status, 503);
    assert.deepEqual(temporary.headers.getSetCookie(), []);

    const revoked = await post("/session", cookies);
    assert.equal(revoked.status, 401);
    applyCookies(revoked, cookies);
    assert.equal((await post("/session", cookies)).status, 401);
    assert.equal(spotify.mock.callCount(), 3);
});

test("late refresh credentials cannot restore a logged-out session or replace a new account", async () => {
    let releaseRefresh;
    let markRefreshing;
    const refreshing = new Promise((resolve) => { markRefreshing = resolve; });
    mockSpotify((params) => {
        if (params.get("grant_type") === "authorization_code") {
            const code = params.get("code");
            return tokenResponse(code + "-access", code + "-refresh", code === "first" ? 30 : 3600);
        }

        return new Promise((resolve) => {
            releaseRefresh = () => resolve(tokenResponse("stale-access"));
            markRefreshing();
        });
    });
    const cookies = new Map();
    await authorize(cookies);

    const delayedResponse = post("/session", cookies);
    await refreshing;

    const previousSessionId = cookies.get("tonedeaf_session");
    const logout = await post("/logout", cookies, { sessionId: previousSessionId });
    assert.equal(logout.status, 204);
    applyCookies(logout, cookies);
    const signedOut = new Map(cookies);

    await authorize(cookies, "second", "/change_user");
    releaseRefresh();
    const response = await delayedResponse;
    applyCookies(response, cookies);
    applyCookies(logout, cookies);

    const staleLogout = await post("/logout", cookies, { sessionId: previousSessionId });
    assert.equal(staleLogout.status, 204);
    assert.deepEqual(staleLogout.headers.getSetCookie(), []);

    const current = await post("/session", cookies);
    assert.equal((await current.json()).accessToken, "second-access");

    applyCookies(response, signedOut);
    assert.equal((await post("/session", signedOut)).status, 401);
});

test("a late invalid_grant does not invalidate a refresh token rotated by another tab", async () => {
    let releaseRejection;
    let markRefreshing;
    const refreshing = new Promise((resolve) => { markRefreshing = resolve; });
    let refreshCount = 0;
    mockSpotify((params) => {
        if (params.get("grant_type") === "authorization_code") {
            return tokenResponse("first-access", "first-refresh", 30);
        }

        refreshCount += 1;
        if (refreshCount === 1) {
            return new Promise((resolve) => {
                releaseRejection = () => resolve(Response.json({ error: "invalid_grant" }, { status: 400 }));
                markRefreshing();
            });
        }

        return tokenResponse("rotated-access", "rotated-refresh");
    });
    const cookies = new Map();
    await authorize(cookies);

    const lateRefresh = post("/session", cookies);
    await refreshing;
    const successfulRefresh = await post("/session", cookies);
    applyCookies(successfulRefresh, cookies);

    releaseRejection();
    const revoked = await lateRefresh;
    assert.equal(revoked.status, 401);
    applyCookies(revoked, cookies);

    const current = await post("/session", cookies);
    assert.equal((await current.json()).accessToken, "rotated-access");
    assert.equal(refreshCount, 2);
});
