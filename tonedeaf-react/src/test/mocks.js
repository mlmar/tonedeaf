import { vi } from 'vitest';
import { countGenres } from '~/util/SpotifyUtil';
import { Config } from '~/util/Config';
import { getDemoData } from '~/test/testUtils';

const demoData = getDemoData();

/**
 * Mock data retrieval hooks by returning demo data json stored in the express directory
 */
vi.mock('~/hooks/SpotifyHooks.ts', async () => {
    return {
        useUserInfo: vi.fn(() => {
            return null;
        }),
        useArtistsAndGenres: vi.fn((timeFrameIndex, genre) => {
            let artists = demoData.artists[timeFrameIndex];
            const filteredArtists = artists
                ?.map((artist, i) => ({ ...artist, rank: i + 1 })) // Add artist rank
                .filter((artist) => genre === Config.GENRE || artist.genres.some((g) => genre === g)); // Or filter artist by genre

            return {
                artists: filteredArtists,
                genres: countGenres(artists),
            };
        }),
        useTracksAndFeatures: vi.fn((timeFrameIndex) => {
            return {
                tracks: demoData.tracks[timeFrameIndex],
                features: demoData.features[timeFrameIndex],
                averages: demoData.averages[timeFrameIndex],
            };
        }),
        useRecent: vi.fn(() => {
            return demoData.recent;
        }),
        useGenreSeeds: vi.fn(() => {
            return demoData.genreSeeds;
        }),
    };
});

/**
 * Also mock DemoService directly in case components import demo services
 * directly rather than through hooks. This prevents any network requests
 * to the demo express server during unit tests and ensures deterministic
 * results.
 */
vi.mock('~/service/DemoService.ts', async () => {
    return {
        getDemoArtists: vi.fn(async (timeFrameIndex) => demoData.artists[timeFrameIndex]),
        getDemoGenres: vi.fn(async (timeFrameIndex) => demoData.genres[timeFrameIndex]),
        getDemoTracks: vi.fn(async (timeFrameIndex) => demoData.tracks[timeFrameIndex]),
        getDemoFeatures: vi.fn(async (timeFrameIndex) => demoData.features[timeFrameIndex]),
        getDemoAverages: vi.fn(async (timeFrameIndex) => demoData.averages[timeFrameIndex]),
        getDemoTracksAndFeatures: vi.fn(async (timeFrameIndex) => {
            return {
                tracks: demoData.tracks[timeFrameIndex],
                features: demoData.features[timeFrameIndex],
                averages: demoData.averages[timeFrameIndex],
            };
        }),
        getDemoGenreSeeds: vi.fn(async () => demoData.genreSeeds),
        getDemoNowPlaying: vi.fn(async () => demoData.nowPlaying),
        getDemoRecentTracks: vi.fn(async () => demoData.recent),
    };
});
