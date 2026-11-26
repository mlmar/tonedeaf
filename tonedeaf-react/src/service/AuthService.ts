const authPath = '/api/auth';
const refreshMargin = 60_000;
const sessionLock = 'tonedeaf-spotify-session';
const sessionChannel = 'tonedeaf-auth';

type Session = {
    sessionId: string;
    accessToken: string;
    expiresAt: number;
};

let session: Session | null = null;
let sessionVersion = 0;
let endingSessionId: string | undefined;
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

function withSessionLock<T>(action: () => Promise<T>): Promise<T> {
    return navigator.locks ? navigator.locks.request(sessionLock, action) : action();
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

async function requestSession(version: number, rejectedAccessToken?: string) {
    return withSessionLock(async () => {
        assertSessionVersion(version);

        const requestData = {
            sessionId: session?.sessionId,
            rejectedAccessToken,
        };
        let response = await postAuth('/session', requestData);

        assertSessionVersion(version);
        if (response.status === 401 && response.headers.get('X-Tonedeaf-Refresh-Rejected') === '1') {
            // The server marked the rejected refresh token. This request can
            // pick up a replacement cookie that another tab already wrote.
            response = await postAuth('/session', requestData);
            assertSessionVersion(version);
        }

        if (response.status === 401) {
            if (session) {
                forgetSession();
            }

            return null;
        }

        if (!response.ok) {
            throw new Error('Spotify session temporarily unavailable');
        }

        const next: Session = await response.json();
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

export async function logout() {
    // A retry still targets the session that was visible before local state cleared.
    const sessionId = session?.sessionId ?? endingSessionId;
    endingSessionId = sessionId;
    forgetSession();

    await withSessionLock(async () => {
        const response = await postAuth('/logout', { sessionId });
        if (!response.ok) {
            throw new Error('Could not log out of Tonedeaf');
        }
    });

    endingSessionId = undefined;
    if (sessionId && typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel(sessionChannel);
        channel.postMessage({ type: 'logout', sessionId });
        channel.close();
    }
}
