import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
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
        return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
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
    fetchAuth.mockResolvedValueOnce(new Response(null, { status: 503 }));

    await act(() => result.current.signOut());

    expect(result.current.status).toBe('logout-failed');
    expect(queryClient.getQueryData([false, 'user-info'])).toBeUndefined();
    expect(useTonedeafStore.getState().navIndex).toBe(0);

    fetchAuth.mockResolvedValueOnce(new Response(null, { status: 204 }));
    act(() => result.current.retry());

    await waitFor(() => expect(result.current.status).toBe('signed-out'));
    expect(fetchAuth.mock.calls).toHaveLength(3);
});
