import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode, type ReactNode } from 'react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { useLogin } from '~/hooks/useLogin';
import { useTonedeafStore } from '~/hooks/useTonedeafStore';
import { logout } from '~/service/AuthService';

let sessionId: string;

beforeEach(() => {
    sessionId = crypto.randomUUID();
});

function sessionResponse() {
    return Response.json({
        sessionId,
        accessToken: 'test-access',
        expiresAt: Date.now() + 3600_000,
    });
}

function setup(response: () => Promise<Response>) {
    const fetchAuth = vi.fn(response);
    vi.stubGlobal('fetch', fetchAuth);
    const queryClient = new QueryClient();

    function wrapper({ children }: { children: ReactNode }) {
        return (
            <StrictMode>
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            </StrictMode>
        );
    }

    return { ...renderHook(useLogin, { wrapper }), fetchAuth, queryClient };
}

afterEach(async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 204 })));
    await act(() => logout());
    vi.unstubAllGlobals();
});

test('starts in a loading state and restores the session without user action', async () => {
    const { result, fetchAuth } = setup(async () => sessionResponse());

    expect(result.current.status).toBe('loading');
    await waitFor(() => expect(result.current.status).toBe('signed-in'));
    expect(fetchAuth).toHaveBeenCalledOnce();
    expect(fetchAuth).toHaveBeenCalledWith('/api/auth/session', expect.objectContaining({ method: 'POST' }));
});

test('a missing session leaves the welcome screen available', async () => {
    const { result } = setup(async () => new Response(null, { status: 401 }));

    await waitFor(() => expect(result.current.status).toBe('signed-out'));
});

test('a temporary startup failure can restore the saved session on retry', async () => {
    const { result, fetchAuth } = setup(async () => new Response(null, { status: 503 }));

    await waitFor(() => expect(result.current.status).toBe('unavailable'));

    fetchAuth.mockResolvedValueOnce(sessionResponse());
    act(() => result.current.retry());

    await waitFor(() => expect(result.current.status).toBe('signed-in'));
});

test('logout clears account data and remains retryable when the server is unavailable', async () => {
    const { result, queryClient, fetchAuth } = setup(async () => sessionResponse());
    await waitFor(() => expect(result.current.status).toBe('signed-in'));

    queryClient.setQueryData([false, 'user-info'], { id: 'previous-account' });
    useTonedeafStore.getState().setNavIndex(3);
    let savedTarget: string | null = null;
    fetchAuth.mockImplementationOnce(async () => {
        savedTarget = window.sessionStorage.getItem('tonedeaf-pending-logout');
        return new Response(null, { status: 503 });
    });

    await act(() => result.current.signOut());

    expect(result.current.status).toBe('logout-failed');
    expect(savedTarget).toBe(sessionId);
    expect(window.sessionStorage.getItem('tonedeaf-pending-logout')).toBe(sessionId);
    expect(queryClient.getQueryData([false, 'user-info'])).toBeUndefined();
    expect(useTonedeafStore.getState().navIndex).toBe(0);

    fetchAuth.mockResolvedValueOnce(new Response(null, { status: 204 }));
    act(() => result.current.retry());

    await waitFor(() => expect(result.current.status).toBe('signed-out'));
    expect(window.sessionStorage.getItem('tonedeaf-pending-logout')).toBeNull();
    expect(fetchAuth.mock.calls).toHaveLength(3);
});

test('startup resumes a saved logout once before restoring any session', async () => {
    // Seed the marker without an in-memory session, as on a reload.
    window.sessionStorage.setItem('tonedeaf-pending-logout', sessionId);
    const { result, fetchAuth } = setup(async () => new Response(null, { status: 503 }));

    expect(result.current.status).toBe('loading');
    await waitFor(() => expect(result.current.status).toBe('logout-failed'));
    expect(fetchAuth).toHaveBeenCalledExactlyOnceWith('/api/auth/logout', expect.objectContaining({
        body: JSON.stringify({ sessionId }),
    }));
    expect(window.sessionStorage.getItem('tonedeaf-pending-logout')).toBe(sessionId);

    fetchAuth.mockResolvedValueOnce(new Response(null, { status: 204 }));
    act(() => result.current.retry());

    await waitFor(() => expect(result.current.status).toBe('signed-out'));
    expect(fetchAuth).toHaveBeenCalledTimes(2);
    expect(window.sessionStorage.getItem('tonedeaf-pending-logout')).toBeNull();
});

test.each([
    [401, 'signed-out'],
    [503, 'unavailable'],
] as const)('exiting demo after a startup %i returns to %s', async (responseStatus, loginStatus) => {
    const { result, fetchAuth } = setup(async () => new Response(null, { status: responseStatus }));
    await waitFor(() => expect(result.current.status).toBe(loginStatus));

    act(() => useTonedeafStore.getState().setIsDemo(true));
    act(() => result.current.exitDemo());

    expect(result.current.status).toBe(loginStatus);
    expect(useTonedeafStore.getState().isDemo).toBe(false);
    expect(fetchAuth).toHaveBeenCalledOnce();
});
