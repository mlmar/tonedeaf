import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { INITIAL_TONEDEAF_STATE, useTonedeafStore } from '~/hooks/useTonedeafStore';
import { logout, restoreSession, SessionEndedError, subscribeToSessionEnd } from '~/service/AuthService';
import { CHANGE_USER_URL, HOME_URL } from '~/util/System';

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

export function useLogin() {
    const queryClient = useQueryClient();
    const [status, setStatus] = useState<LoginStatus>('loading');
    const [authError, setAuthError] = useState(() => new URLSearchParams(window.location.search).has('auth_error'));
    const [retryCount, setRetryCount] = useState(0);
    const statusRef = useRef<LoginStatus>('loading');
    const changeAccount = useRef(false);

    const updateStatus = useCallback((next: LoginStatus) => {
        statusRef.current = next;
        setStatus(next);
    }, []);

    useEffect(() => {
        cleanCallbackUrl();
    }, []);

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
            if (statusRef.current !== 'logout-failed') {
                updateStatus('signed-out');
            }
        });

        async function restore() {
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

        void restore();
        window.addEventListener('focus', recheckSession);
        window.addEventListener('pageshow', recheckSession);

        return () => {
            active = false;
            unsubscribe();
            window.removeEventListener('focus', recheckSession);
            window.removeEventListener('pageshow', recheckSession);
        };
    }, [queryClient, retryCount, updateStatus]);

    async function signOut(switchAccount = false) {
        changeAccount.current = switchAccount;
        setAuthError(false);
        const request = logout();
        updateStatus('loading');

        try {
            await request;
            if (switchAccount) {
                window.location.assign(CHANGE_USER_URL);
                return;
            }

            updateStatus('signed-out');
        } catch {
            updateStatus('logout-failed');
        }
    }

    function retry() {
        if (status === 'logout-failed') {
            void signOut(changeAccount.current);
            return;
        }

        updateStatus('loading');
        setRetryCount((count) => count + 1);
    }

    function exitDemo() {
        queryClient.clear();
        useTonedeafStore.setState(INITIAL_TONEDEAF_STATE);
        updateStatus('signed-out');
        window.history.replaceState(window.history.state, '', HOME_URL);
    }

    return { status, authError, retry, signOut, exitDemo };
}
