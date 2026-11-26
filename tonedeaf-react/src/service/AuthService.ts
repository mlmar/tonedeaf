const authPath = '/api/auth';
const refreshMargin = 60_000;
const sessionLock = 'tonedeaf-spotify-session';
const sessionChannel = 'tonedeaf-auth';
const pendingLogoutKey = 'tonedeaf-pending-logout';

type Session = {
    sessionId: string;
    accessToken: string;
    expiresAt: number;
};

let session: Session | null = null;
let sessionVersion = 0;
let endingSessionId: string | undefined;
let pendingLogout: Promise<void> | undefined;
let lastLoggedOutSessionId: string | undefined;
let pending: {
    promise: Promise<Session | null>;
    rejectedAccessToken?: string;
} | null = null;

const sessionEndListeners = new Set<() => void>();

export class SessionEndedError extends Error {
    constructor() {
        super('The Spotify session ended');
    }
}

export class SessionUnavailableError extends Error {
    constructor(cause?: unknown) {
        super('Spotify session temporarily unavailable', { cause });
    }
}

export function getSessionVersion() {
    return sessionVersion;
}

export function assertSessionVersion(version: number) {
    if (version !== sessionVersion) {
        throw new SessionEndedError();
    }
}

function forgetSession() {
    session = null;
    pending = null;
    sessionVersion += 1;

    for (const listener of sessionEndListeners) {
        listener();
    }
}

export function subscribeToSessionEnd(listener: () => void) {
    sessionEndListeners.add(listener);

    // Match the session ID so a stale tab cannot sign out a newer account.
    const channel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel(sessionChannel);
    if (channel) {
        channel.onmessage = (event) => {
            const message = event.data;
            if (message?.type !== 'logout' || typeof message.sessionId !== 'string') {
                return;
            }

            lastLoggedOutSessionId = message.sessionId;
            if (session?.sessionId === lastLoggedOutSessionId) {
                forgetSession();
            }
        };
    }

    return () => {
        sessionEndListeners.delete(listener);
        channel?.close();
    };
}

// Serialize cookie updates across same-origin tabs where Web Locks is available.
async function withSessionLock<T>(action: () => Promise<T>): Promise<T> {
    if (navigator.locks) {
        return await navigator.locks.request(sessionLock, action);
    }

    return action();
}

function postAuth(endpoint: string, data?: { sessionId?: string; rejectedAccessToken?: string }) {
    return fetch(authPath + endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Tonedeaf-Auth': '1',
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(12_000),
    });
}

// Resolve credentials under the tab lock and discard updates from an ended session.
async function requestSession(version: number, rejectedAccessToken?: string) {
    return withSessionLock(async () => {
        assertSessionVersion(version);

        const requestData = {
            sessionId: session?.sessionId,
            rejectedAccessToken,
        };
        let response: Response;

        try {
            response = await postAuth('/session', requestData);
            assertSessionVersion(version);
            if (response.status === 401 && response.headers.get('X-Tonedeaf-Refresh-Rejected') === '1') {
                // This request can pick up a replacement cookie that another tab already wrote.
                response = await postAuth('/session', requestData);
                assertSessionVersion(version);
            }
        } catch (error) {
            assertSessionVersion(version);
            throw new SessionUnavailableError(error);
        }

        if (response.status === 401) {
            if (session) {
                forgetSession();
            }

            return null;
        }

        if (!response.ok) {
            if (response.status >= 500 || response.status === 429) {
                throw new SessionUnavailableError();
            }

            throw new Error('Spotify session check failed');
        }

        let next: Session;

        try {
            next = await response.json();
        } catch (error) {
            assertSessionVersion(version);
            throw new SessionUnavailableError(error);
        }

        assertSessionVersion(version);

        if (next.sessionId === lastLoggedOutSessionId) {
            return null;
        }

        // A different session may have been established in another tab.
        if (session && next.sessionId !== session.sessionId) {
            forgetSession();
            return null;
        }

        session = next;
        return session;
    });
}

export function restoreSession(rejectedAccessToken?: string): Promise<Session | null> {
    if (pending) {
        // Share the current check unless it returns a token that this caller already rejected.
        const currentRequest = pending;
        return currentRequest.promise.then((result) => {
            if (rejectedAccessToken && result?.accessToken === rejectedAccessToken
                && currentRequest.rejectedAccessToken !== rejectedAccessToken) {
                return restoreSession(rejectedAccessToken);
            }

            return result;
        });
    }

    const version = sessionVersion;
    const promise = requestSession(version, rejectedAccessToken).finally(() => {
        if (pending?.promise === promise) {
            pending = null;
        }
    });
    pending = { promise, rejectedAccessToken };

    return promise;
}

export async function getAccessToken(rejectedAccessToken?: string) {
    if (!session) {
        throw new SessionEndedError();
    }

    if (session.expiresAt > Date.now() + refreshMargin
        && session.accessToken !== rejectedAccessToken) {
        return session.accessToken;
    }

    const refreshed = await restoreSession(rejectedAccessToken);
    if (!refreshed) {
        throw new SessionEndedError();
    }

    return refreshed.accessToken;
}

function readPendingLogout() {
    try {
        return window.sessionStorage.getItem(pendingLogoutKey) || undefined;
    } catch {
        return undefined;
    }
}

function writePendingLogout(sessionId: string | undefined) {
    try {
        if (sessionId) {
            window.sessionStorage.setItem(pendingLogoutKey, sessionId);
        } else {
            window.sessionStorage.removeItem(pendingLogoutKey);
        }
    } catch {
        // The initiating tab can still retry from memory when storage is blocked.
    }
}

export function hasPendingLogout() {
    return Boolean(pendingLogout || endingSessionId || readPendingLogout());
}

export function logout(): Promise<void> {
    if (pendingLogout) {
        return pendingLogout;
    }

    // Save the original target before clearing memory so reload can resume logout.
    const sessionId = endingSessionId ?? readPendingLogout() ?? session?.sessionId;
    endingSessionId = sessionId;
    writePendingLogout(sessionId);
    forgetSession();

    pendingLogout = withSessionLock(async () => {
        const response = await postAuth('/logout', { sessionId });
        if (!response.ok) {
            throw new Error('Could not log out of Tonedeaf');
        }

        endingSessionId = undefined;
        writePendingLogout(undefined);

        if (sessionId && typeof BroadcastChannel !== 'undefined') {
            const channel = new BroadcastChannel(sessionChannel);
            channel.postMessage({ type: 'logout', sessionId });
            channel.close();
        }
    }).finally(() => {
        pendingLogout = undefined;
    });

    return pendingLogout;
}
