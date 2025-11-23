import type { NowPlayingTrack } from "~/util/SpotifyUtil.js";
import { get } from "./HTTPService.js";

const DEMO = 'demo';

export const getDemoArtists = async (timeFrameIndex: number) => {
    try {
        const response = await get(DEMO + '/artists');
        return response[timeFrameIndex];
    } catch (error) {
        console.warn("Error getting demo");
        console.error(error);
        throw new Error('failed to fetch demo artists data');
    }
}

export const getDemoGenres = async (timeFrameIndex: number) => {
    try {
        const response = await get(DEMO + '/genres');
        return response[timeFrameIndex];
    } catch (error) {
        console.warn("Error getting demo");
        console.error(error);
        throw new Error('failed to fetch demo genres data');
    }
}

export const getDemoTracks = async (timeFrameIndex: number) => {
    try {
        const response = await get(DEMO + '/tracks');
        return response[timeFrameIndex];
    } catch (error) {
        console.warn("Error getting demo");
        console.error(error);
        throw new Error('failed to fetch demo tracks data');
    }
}

export const getDemoFeatures = async (timeFrameIndex: number) => {
    try {
        const response = await get(DEMO + '/features');
        return response[timeFrameIndex];
    } catch (error) {
        console.warn("Error getting demo");
        console.error(error);
        throw new Error('failed to fetch demo features data');
    }
}

export const getDemoAverages = async (timeFrameIndex: number) => {
    try {
        const response = await get(DEMO + '/averages');
        return response[timeFrameIndex];
    } catch (error) {
        console.warn("Error getting demo");
        console.error(error);
        throw new Error('failed to fetch demo averages data');
    }
}

export const getDemoTracksAndFeatures = async (timeFrameIndex: number) => {
    try {
        const tracks = await getDemoTracks(timeFrameIndex);
        const features = await getDemoFeatures(timeFrameIndex);
        const averages = await getDemoAverages(timeFrameIndex);
        return { tracks, features, averages }
    } catch (error) {
        console.warn("Error getting demo");
        console.error(error);
        throw new Error('failed to fetch demo tracks and features data');
    }
}

export const getDemoGenreSeeds = async (): Promise<string[]> => {
    try {
        const response = await get(DEMO + '/genre-seeds');
        return response;
    } catch (error) {
        console.warn("Error getting demo");
        console.error(error);
        throw new Error('failed to fetch demo genre seeds data');
    }
}

export const getDemoNowPlaying = async (): Promise<NowPlayingTrack> => {
    try {
        const response = await get(DEMO + '/now-playing');
        return response;
    } catch (error) {
        console.warn("Error getting demo");
        console.error(error);
        throw new Error('failed to fetch demo now playing data');
    }
}

export const getDemoRecentTracks = async (): Promise<SpotifyApi.PlayHistoryObject[]> => {
    try {
        const response = await get(DEMO + '/recent');
        return response;
    } catch (error) {
        console.warn("Error getting demo");
        console.error(error);
        throw new Error('failed to fetch demo recent data');
    }
}
