import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import SpotifyWebApi from 'spotify-web-api-js';
import { logout, restoreSession } from '~/service/AuthService';
import { createPlaylist, getProfile } from '~/util/SpotifyUtil';

vi.unmock('~/util/SpotifyUtil');
vi.mock('spotify-web-api-js', () => ({
    default: class {
        setAccessToken() {}
        getMe() {}
        createPlaylist() {}
        addTracksToPlaylist() {}
    },
}));

const sdk = {
    setAccessToken: vi.spyOn(SpotifyWebApi.prototype, 'setAccessToken'),
    getMe: vi.spyOn(SpotifyWebApi.prototype, 'getMe'),
    createPlaylist: vi.spyOn(SpotifyWebApi.prototype, 'createPlaylist'),
    addTracksToPlaylist: vi.spyOn(SpotifyWebApi.prototype, 'addTracksToPlaylist'),
};

beforeEach(() => vi.clearAllMocks());

function sessionResponse(accessToken: string, expiresIn = 3600_000) {
    return Response.json({
        sessionId: 'test-session',
        accessToken,
        expiresAt: Date.now() + expiresIn,
    });
}

function spotifyError(status: number) {
    const error = new XMLHttpRequest();
    Object.defineProperty(error, 'status', { value: status });
    return error;
}

afterEach(async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 204 })));
    await logout();
    vi.unstubAllGlobals();
    for (const method of Object.values(sdk)) {
        method.mockReset();
    }
});

test('parallel Spotify requests share a refresh near token expiry', async () => {
    const fetchAuth = vi.fn()
        .mockResolvedValueOnce(sessionResponse('expiring', 30_000))
        .mockResolvedValueOnce(sessionResponse('fresh'));
    vi.stubGlobal('fetch', fetchAuth);
    sdk.getMe.mockResolvedValue({ id: 'test-account' });

    await restoreSession();
    const profiles = await Promise.all([getProfile(), getProfile()]);

    expect(profiles).toEqual([{ id: 'test-account' }, { id: 'test-account' }]);
    expect(fetchAuth).toHaveBeenCalledTimes(2);
    expect(sdk.setAccessToken.mock.calls).toEqual([['fresh'], [''], ['fresh'], ['']]);
});

test('playlist recovery retries the rejected add-tracks request only once', async () => {
    const fetchAuth = vi.fn()
        .mockResolvedValueOnce(sessionResponse('original'))
        .mockResolvedValueOnce(sessionResponse('fresh'));
    vi.stubGlobal('fetch', fetchAuth);
    using click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    sdk.createPlaylist.mockResolvedValue({ id: 'new-playlist', uri: 'spotify:playlist:new-playlist' });
    sdk.addTracksToPlaylist
        .mockRejectedValueOnce(spotifyError(401))
        .mockResolvedValueOnce({ snapshot_id: 'playlist-snapshot' });

    await restoreSession();
    const result = await createPlaylist('test-account', 'Test playlist', [{ uri: 'spotify:track:first' }]);

    expect(click).toHaveBeenCalledOnce();
    expect(result).toEqual({ snapshot_id: 'playlist-snapshot' });
    expect(sdk.createPlaylist).toHaveBeenCalledOnce();
    expect(sdk.addTracksToPlaylist.mock.calls).toEqual([
        ['new-playlist', ['spotify:track:first']],
        ['new-playlist', ['spotify:track:first']],
    ]);
    expect(fetchAuth.mock.calls[1][1].body).toBe(JSON.stringify({
        sessionId: 'test-session',
        rejectedAccessToken: 'original',
    }));
});

test('a second 401 stops request recovery', async () => {
    const fetchAuth = vi.fn()
        .mockResolvedValueOnce(sessionResponse('original'))
        .mockResolvedValueOnce(sessionResponse('fresh'));
    vi.stubGlobal('fetch', fetchAuth);
    using logError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    sdk.getMe.mockRejectedValue(spotifyError(401));

    await restoreSession();

    await expect(getProfile()).rejects.toThrow('Failed to fetch user profile');
    expect(sdk.getMe).toHaveBeenCalledTimes(2);
    expect(logError).toHaveBeenCalledOnce();
    expect(fetchAuth).toHaveBeenCalledTimes(2);
});

test('a rejected refresh can pick up credentials another tab already replaced', async () => {
    const fetchAuth = vi.fn()
        .mockResolvedValueOnce(sessionResponse('original', 30_000))
        .mockResolvedValueOnce(new Response(null, {
            status: 401,
            headers: { 'X-Tonedeaf-Refresh-Rejected': '1' },
        }))
        .mockResolvedValueOnce(sessionResponse('replacement'));
    vi.stubGlobal('fetch', fetchAuth);
    sdk.getMe.mockResolvedValue({ id: 'test-account' });

    await restoreSession();
    const profile = await getProfile();

    expect(profile).toEqual({ id: 'test-account' });
    expect(fetchAuth).toHaveBeenCalledTimes(3);
    expect(sdk.setAccessToken.mock.calls).toEqual([['replacement'], ['']]);
});
