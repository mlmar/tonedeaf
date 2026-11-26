const express = require("express");
const { createCipheriv, createDecipheriv, randomBytes } = require("node:crypto");

const app = (module.exports = express());
const router = express.Router();

const isDevelopment = process.env.DEV === "true";
const localHome = "http://127.0.0.1:8888";
const viteHome = "http://127.0.0.1:3000";
const home = isDevelopment ? localHome : "https://tonedeaf.vercel.app";
const redirectUri = home + "/api/auth/callback";

const selectorCookie = "tonedeaf_session";
const sessionLifetime = 180 * 24 * 60 * 60 * 1000;
const stateLifetime = 10 * 60 * 1000;
const refreshMargin = 60 * 1000;
const cookieOptions = {
    httpOnly: true,
    secure: !isDevelopment,
    sameSite: "lax",
    path: "/api/auth",
};

const scope = [
    "user-read-private",
    "user-read-email",
    "user-read-playback-state",
    "user-follow-read",
    "user-library-read",
    "playlist-read-private",
    "playlist-read-collaborative",
    "user-top-read",
    "user-read-playback-position",
    "user-read-recently-played",
    "playlist-modify-private",
    "playlist-modify-public",
    "user-modify-playback-state",
].join(" ");

app.use("/auth", router);
router.use((_req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
});

function getSelector(req) {
    const selector = req.cookies[selectorCookie];
    return /^[a-f0-9]{32}$/.test(selector) ? selector : null;
}

function oauthCookie(selector) {
    return "tonedeaf_oauth_" + selector;
}

function credentialsCookie(selector) {
    return "tonedeaf_credentials_" + selector;
}

function rejectedRefreshCookie(selector) {
    return "tonedeaf_rejected_refresh_" + selector;
}

function signedOutCookie(selector) {
    return "tonedeaf_signed_out_" + selector;
}

function clearCredentials(res, selector) {
    if (selector) {
        res.clearCookie(credentialsCookie(selector), cookieOptions);
        res.clearCookie(oauthCookie(selector), cookieOptions);
        res.clearCookie(rejectedRefreshCookie(selector), cookieOptions);
    }
}

function sessionKey() {
    const value = process.env.AUTH_SESSION_SECRET || "";
    return /^[a-fA-F0-9]{64}$/.test(value) ? Buffer.from(value, "hex") : null;
}

function saveCredentials(res, selector, session, key) {
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    // Bind the encrypted credentials to the browser's current session selector.
    cipher.setAAD(Buffer.from(selector));
    const encrypted = Buffer.concat([cipher.update(JSON.stringify(session)), cipher.final()]);
    const cookie = Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64url");
    res.cookie(credentialsCookie(selector), cookie, {
        ...cookieOptions,
        maxAge: Math.max(0, session.sessionExpiresAt - Date.now()),
    });
}

function readCredentials(req, selector, key) {
    const value = selector && req.cookies[credentialsCookie(selector)];
    if (!value || req.cookies[signedOutCookie(selector)]) {
        return null;
    }

    try {
        const cookie = Buffer.from(value, "base64url");
        const decipher = createDecipheriv("aes-256-gcm", key, cookie.subarray(0, 12));
        decipher.setAAD(Buffer.from(selector));
        decipher.setAuthTag(cookie.subarray(12, 28));
        const decoded = Buffer.concat([decipher.update(cookie.subarray(28)), decipher.final()]);
        const session = JSON.parse(decoded.toString());
        const revoked = req.cookies[rejectedRefreshCookie(selector)];

        if (session.refreshVersion === revoked || session.sessionExpiresAt <= Date.now()) {
            return null;
        }

        return session;
    } catch {
        return null;
    }
}

function returnHome(destination, res, error) {
    const url = new URL("/", destination);
    if (error) {
        url.searchParams.set("auth_error", error);
    }

    res.redirect(url.toString());
}

function beginAuthorization(req, res, changeAccount = false) {
    const useVite = isDevelopment && req.query.return === "vite";
    const destination = useVite ? viteHome : home;
    const key = sessionKey();
    if (!key) {
        returnHome(destination, res, "unavailable");
        return;
    }

    const previousSelector = getSelector(req);
    // A top-level link can be followed from another site. Replacing an active
    // session first requires the same-origin logout request.
    if (readCredentials(req, previousSelector, key)) {
        returnHome(destination, res);
        return;
    }

    clearCredentials(res, previousSelector);
    if (previousSelector) {
        res.clearCookie(signedOutCookie(previousSelector), cookieOptions);
    }

    const selector = randomBytes(16).toString("hex");
    const state = randomBytes(32).toString("hex");

    // Only authorization start sets the selector. A late callback or refresh
    // can write credentials for its selector without replacing a newer session.
    res.cookie(selectorCookie, selector, { ...cookieOptions, maxAge: sessionLifetime });
    res.cookie(oauthCookie(selector), { state, useVite }, {
        ...cookieOptions,
        maxAge: stateLifetime,
    });

    const url = new URL("https://accounts.spotify.com/authorize");
    url.search = new URLSearchParams({
        response_type: "code",
        client_id: process.env.CLIENT_ID,
        scope,
        redirect_uri: redirectUri,
        state,
    }).toString();

    if (changeAccount) {
        url.searchParams.set("show_dialog", "true");
    }

    res.redirect(url.toString());
}

router.get("/login", (req, res) => beginAuthorization(req, res));
router.get("/change_user", (req, res) => beginAuthorization(req, res, true));

async function spotifyTokenRequest(params) {
    const credentials = Buffer.from(
        process.env.CLIENT_ID + ":" + process.env.CLIENT_S,
    ).toString("base64");
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { Authorization: "Basic " + credentials },
        body: new URLSearchParams(params),
        signal: AbortSignal.timeout(8000),
    });

    const body = await response.json();
    return { status: response.status, body };
}

function hasAccessToken(body) {
    return typeof body?.access_token === "string" && body.access_token.length > 0
        && Number.isFinite(body.expires_in) && body.expires_in > 0;
}

router.get("/callback", async (req, res) => {
    const selector = getSelector(req);
    const pending = selector && req.cookies[oauthCookie(selector)];
    const destination = isDevelopment && pending?.useVite ? viteHome : home;
    const { code, state, error } = req.query;

    if (typeof state !== "string" || !pending?.state || state !== pending.state
        || req.cookies[signedOutCookie(selector)]) {
        returnHome(destination, res, "state_mismatch");
        return;
    }

    res.clearCookie(oauthCookie(selector), cookieOptions);
    if (error || typeof code !== "string" || !code) {
        returnHome(destination, res, "denied");
        return;
    }

    const key = sessionKey();
    if (!key) {
        returnHome(destination, res, "unavailable");
        return;
    }

    try {
        const { status, body } = await spotifyTokenRequest({
            grant_type: "authorization_code",
            redirect_uri: redirectUri,
            code,
        });

        if (status !== 200 || !hasAccessToken(body)
            || typeof body.refresh_token !== "string" || !body.refresh_token) {
            returnHome(destination, res, "exchange_failed");
            return;
        }

        const now = Date.now();
        saveCredentials(res, selector, {
            accessToken: body.access_token,
            refreshToken: body.refresh_token,
            refreshVersion: randomBytes(16).toString("hex"),
            expiresAt: now + body.expires_in * 1000,
            sessionExpiresAt: now + sessionLifetime,
        }, key);
    } catch {
        returnHome(destination, res, "exchange_failed");
        return;
    }

    returnHome(destination, res);
});

function requireAppRequest(req, res, next) {
    const origin = req.get("Origin");
    const isAppOrigin = origin === home || (isDevelopment && origin === viteHome);

    if (!isAppOrigin || req.get("X-Tonedeaf-Auth") !== "1") {
        res.sendStatus(403);
        return;
    }

    next();
}

function sendSession(res, selector, { accessToken, expiresAt }) {
    res.json({ sessionId: selector, accessToken, expiresAt });
}

const parseAuthRequest = express.json({ limit: "8kb" });

router.post("/session", requireAppRequest, parseAuthRequest, async (req, res) => {
    const key = sessionKey();
    if (!key) {
        res.sendStatus(503);
        return;
    }

    const selector = getSelector(req);
    const session = readCredentials(req, selector, key);
    const { sessionId, rejectedAccessToken } = req.body || {};
    if (!session || (sessionId && sessionId !== selector)) {
        res.sendStatus(401);
        return;
    }

    if (session.expiresAt > Date.now() + refreshMargin && rejectedAccessToken !== session.accessToken) {
        sendSession(res, selector, session);
        return;
    }

    try {
        const { status, body } = await spotifyTokenRequest({
            grant_type: "refresh_token",
            refresh_token: session.refreshToken,
        });

        if (status === 400 && body?.error === "invalid_grant") {
            // Mark only the rejected refresh token. A late rejection must not
            // delete credentials written by another tab after token rotation.
            res.cookie(rejectedRefreshCookie(selector), session.refreshVersion, {
                ...cookieOptions,
                maxAge: Math.max(0, session.sessionExpiresAt - Date.now()),
            });
            res.set("X-Tonedeaf-Refresh-Rejected", "1");
            res.sendStatus(401);
            return;
        }

        if (status !== 200 || !hasAccessToken(body)) {
            res.sendStatus(503);
            return;
        }

        const refreshed = {
            ...session,
            accessToken: body.access_token,
            expiresAt: Date.now() + body.expires_in * 1000,
        };
        if (body.refresh_token && body.refresh_token !== session.refreshToken) {
            refreshed.refreshToken = body.refresh_token;
            refreshed.refreshVersion = randomBytes(16).toString("hex");
        }

        saveCredentials(res, selector, refreshed, key);
        sendSession(res, selector, refreshed);
    } catch {
        res.sendStatus(503);
    }
});

router.post("/logout", requireAppRequest, parseAuthRequest, (req, res) => {
    const selector = getSelector(req);
    if (selector && req.body?.sessionId === selector) {
        clearCredentials(res, selector);
        // Mark this selector only. A delayed logout cannot clear a newer
        // selector, and a delayed refresh cannot re-enable the old one.
        res.cookie(signedOutCookie(selector), "1", { ...cookieOptions, maxAge: sessionLifetime });
    }

    res.sendStatus(204);
});
