import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { INITIAL_TONEDEAF_STATE, useTonedeafStore } from '~/hooks/useTonedeafStore';
import { hasPendingLogout, logout, restoreSession, SessionEndedError, subscribeToSessionEnd } from '~/service/AuthService';
import { HOME_URL } from '~/util/System';

type LoginStatus = 'loading' | 'signed-in' | 'signed-out' | 'unavailable' | 'logout-failed';

function cleanCallbackUrl() {
    const url = new URL(window.location.href);
    const authError = url.searchParams.get('auth_error');
    // Remove legacy callback fragments without using their credentials.
    if (authError || /(?:^#|&)(?:access_token|refresh_token|error)=/.test(url.hash)) {
        url.searchParams.delete('auth_error');
        url.hash = '';
        window.history.replaceState(window.history.state, '', url);
    }
}

// Keep startup, logout, and demo navigation in sync with the browser session.
export function useLogin() {
    const queryClient = useQueryClient();
    const [status, setStatus] = useState<LoginStatus>('loading');
    const [authError, setAuthError] = useState(() => new URLSearchParams(window.location.search).has('auth_error'));
    const [retryCount, setRetryCount] = useState(0);
    const statusRef = useRef<LoginStatus>('loading');

    const updateStatus = useCallback((next: LoginStatus) => {
        statusRef.current = next;
        setStatus(next);
    }, []);

    useEffect(() => {
        cleanCallbackUrl();
    }, []);

    // Clear private state when a session ends and ignore startup results after cleanup.
    useEffect(() => {
        let active = true;

        function clearPrivateState() {
            // Removing the cached queries also cancels their pending results.
            queryClient.clear();
            useTonedeafStore.setState(INITIAL_TONEDEAF_STATE);
        }

        const unsubscribe = subscribeToSessionEnd(() => {
            if (useTonedeafStore.getState().isDemo) {
                return;
            }

            clearPrivateState();
            if (!hasPendingLogout() && statusRef.current !== 'logout-failed') {
                updateStatus('signed-out');
            }
        });

        async function initialize() {
            if (hasPendingLogout()) {
                // An interrupted logout takes precedence over the session cookie.
                try {
                    await logout();
                    if (active) {
                        updateStatus('signed-out');
                    }
                } catch {
                    if (active) {
                        updateStatus('logout-failed');
                    }
                }

                return;
            }

            try {
                const session = await restoreSession();
                if (active && statusRef.current === 'loading') {
                    updateStatus(session ? 'signed-in' : 'signed-out');
                }
            } catch (error) {
                if (active && statusRef.current === 'loading') {
                    const next = error instanceof SessionEndedError ? 'signed-out' : 'unavailable';
                    updateStatus(next);
                }
            }
        }

        function recheckSession() {
            if (statusRef.current === 'signed-in') {
                // A temporary failure leaves the current session available to retry.
                void restoreSession().catch(() => undefined);
            }
        }

        void initialize();
        window.addEventListener('focus', recheckSession);
        window.addEventListener('pageshow', recheckSession);

        return () => {
            active = false;
            unsubscribe();
            window.removeEventListener('focus', recheckSession);
            window.removeEventListener('pageshow', recheckSession);
        };
    }, [queryClient, retryCount, updateStatus]);

    async function signOut() {
        setAuthError(false);
        updateStatus('loading');

        try {
            await logout();
            updateStatus('signed-out');
        } catch {
            updateStatus('logout-failed');
        }
    }

    function retry() {
        if (status === 'logout-failed') {
            void signOut();
            return;
        }

        updateStatus('loading');
        setRetryCount((count) => count + 1);
    }

    function exitDemo() {
        queryClient.clear();
        useTonedeafStore.setState(INITIAL_TONEDEAF_STATE);
        window.history.replaceState(window.history.state, '', HOME_URL);
    }

    return { status, authError, retry, signOut, exitDemo };
}
