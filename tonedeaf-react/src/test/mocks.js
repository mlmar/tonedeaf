import { vi } from 'vitest';
import { getDemoData } from '~/test/testUtils';

const demoData = getDemoData();

/**
 * Mock SpotifyUtil directly in case components import util services.
 * This prevents any network requests to the Spotiy API during unit tests and
 * ensures deterministic results.
 */
vi.mock('~/util/SpotifyUtil', async (importOriginal) => {
    const original = await importOriginal();
    return {
        ...original,
        getProfile: vi.fn(async () => null),
        getTopArtists: vi.fn(async (timeFrameIndex) => demoData.artists[timeFrameIndex]),
        getTracksAndFeatures: vi.fn(async (timeFrameIndex) => {
            return {
                tracks: demoData.tracks[timeFrameIndex],
                features: demoData.features[timeFrameIndex],
                averages: demoData.averages[timeFrameIndex],
            };
        }),
        getGenreSeeds: vi.fn(async () => demoData.genreSeeds),
        getNowPlaying: vi.fn(async () => demoData.nowPlaying),
        getRecentTracks: vi.fn(async () => demoData.recent),
    };
});

/**
 * Mock DemoService directly in case components import demo services
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
