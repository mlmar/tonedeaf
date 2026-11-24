import type demoData from '../../../tonedeaf-express/demo/DemoData.json';
import type { NowPlayingTrack, RecentTrack } from '~/util/SpotifyUtil';
import { get } from './HTTPService.js';

type TimedDemoEndpoint = 'artists' | 'genres' | 'tracks' | 'features' | 'averages';

type DemoResponses = Pick<typeof demoData, TimedDemoEndpoint | 'recent'> & {
    'genre-seeds': typeof demoData.genreSeeds;
    'now-playing': typeof demoData.nowPlaying;
};

// Express serves these fixtures directly from the demo endpoints.
async function getDemoData<Endpoint extends keyof DemoResponses>(endpoint: Endpoint): Promise<DemoResponses[Endpoint]> {
    const response = await get<DemoResponses[Endpoint]>('/demo/' + endpoint);

    if (response === null) {
        throw new Error('Failed to fetch demo data for ' + endpoint);
    }

    return response;
}

async function getDemoTimeFrame<Endpoint extends TimedDemoEndpoint>(
    endpoint: Endpoint,
    timeFrameIndex: number,
): Promise<DemoResponses[Endpoint][number]> {
    const timeFrames = await getDemoData<Endpoint>(endpoint);
    const data = timeFrames[timeFrameIndex];

    if (data === undefined) {
        throw new Error('Missing demo time frame for ' + endpoint);
    }

    return data;
}

export const getDemoArtists = (timeFrameIndex: number) => getDemoTimeFrame('artists', timeFrameIndex);
export const getDemoGenres = (timeFrameIndex: number) => getDemoTimeFrame('genres', timeFrameIndex);
export const getDemoTracks = (timeFrameIndex: number) => getDemoTimeFrame('tracks', timeFrameIndex);
export const getDemoFeatures = (timeFrameIndex: number) => getDemoTimeFrame('features', timeFrameIndex);
export const getDemoAverages = (timeFrameIndex: number) => getDemoTimeFrame('averages', timeFrameIndex);

export const getDemoTracksAndFeatures = async (timeFrameIndex: number) => {
    const tracks = await getDemoTracks(timeFrameIndex);
    const features = await getDemoFeatures(timeFrameIndex);
    const averages = await getDemoAverages(timeFrameIndex);
    return { tracks, features, averages };
};

export const getDemoGenreSeeds = () => getDemoData('genre-seeds');
export const getDemoNowPlaying = (): Promise<NowPlayingTrack> => getDemoData('now-playing');
export const getDemoRecentTracks = (): Promise<RecentTrack[]> => getDemoData('recent');
