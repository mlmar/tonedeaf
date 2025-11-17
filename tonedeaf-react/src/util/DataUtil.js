/**
 * @module DataUtil
 * @description Data fetching and caching utility for the Spotify API.
 *
 * This module:
 * - Manages in-memory caching of API responses to reduce redundant API calls
 * - Provides pre-fetching functionality to load data on app initialization
 * - Handles demo mode by redirecting requests to cached demo data
 * - Organizes data fetching for now playing, artists, genres, tracks, features, and recommendations
 */

import { cache } from "./Cache.js";
import { getDemo } from "~/service/DemoService.js";
import {
    getNowPlaying,
    getTopArtistsAndGenres,
    getTracksAndFeatures,
    getRecentTracks,
    getGenreSeeds,
} from "./SpotifyUtil.js";
import { createLookup } from "./StatsUtil.js";

/**
 * Fetches demo data and populates the cache with demo values
 * @async
 * @returns {Promise<boolean>} True if demo data was successfully loaded
 */
export const fetchDemo = async () => {
    const demoCache = await getDemo();
    for (let prop in demoCache) {
        cache[prop] = demoCache[prop];
    }
    return true;
};

/**
 * Pre-fetches all data required for the app on initialization
 *
 * Fetches:
 * - Currently playing track
 * - Top artists and genres for all three time ranges (long_term, medium_term, short_term)
 * - Top tracks and audio features for all three time ranges
 * - Available genre seeds for recommendations
 * - Recently played tracks
 * - Creates lookup tables for stats processing
 *
 * @async
 * @returns {Promise<boolean>} True when all data has been fetched and cached
 */
export const preFetch = async () => {
    await fetchNowPlaying();
    await fetchArtistsAndGenres(0);
    await fetchArtistsAndGenres(1);
    await fetchArtistsAndGenres(2);

    await fetchTracksAndFeatures(0);
    await fetchTracksAndFeatures(1);
    await fetchTracksAndFeatures(2);
    await fetchSeeds();
    await fetchRecent();
    createLookup();

    return true;
};

// Expose preFetch to window for manual triggering in console
window.preFetch = preFetch;

/**
 * Fetches or retrieves cached currently playing track
 * Returns cached data for demo mode
 *
 * @async
 * @returns {Promise<Object|null>} Track object for currently playing or most recently played track
 */
export const fetchNowPlaying = async () => {
    if (cache["demo"]) {
        return cache["nowPlaying"];
    } else {
        const response = await getNowPlaying();
        cache["nowPlaying"] = response;
        return response;
    }
};

/**
 * Fetches or retrieves cached top artists and genres for a specific time range
 * Checks cache first before making API request
 *
 * @async
 * @param {number} timeFrameIndex - Index for time range (0='long_term', 1='medium_term', 2='short_term')
 * @returns {Promise<{artists: any[], genres: any[]}>} Object containing artists array and genres array
 */
export const fetchArtistsAndGenres = async (timeFrameIndex) => {
    const artistsCache = cache["artists"][timeFrameIndex];
    const genresCache = cache["genres"][timeFrameIndex];
    if (artistsCache && genresCache) {
        // search cache first
        console.log("Retrieving from cache");
        return { artists: artistsCache, genres: genresCache };
    } else {
        // signed in
        const { artists, genres } = await getTopArtistsAndGenres(
            timeFrameIndex
        );

        console.log("Cacheing artists");
        cache["artists"][timeFrameIndex] = artists;
        cache["genres"][timeFrameIndex] = genres;

        return { artists, genres };
    }
};

/**
 * Fetches or retrieves cached top tracks with audio features and calculated averages for a specific time range
 * Checks cache first before making API request
 *
 * @async
 * @param {number} timeFrameIndex - Index for time range (0='long_term', 1='medium_term', 2='short_term')
 * @returns {Promise<{tracks: any[], features: any[], averages: Object}>} Object containing tracks, audio features, and calculated averages
 */
export const fetchTracksAndFeatures = async (timeFrameIndex) => {
    const tracksCache = cache["tracks"][timeFrameIndex];
    const featuresCache = cache["features"][timeFrameIndex];
    const averagesCache = cache["averages"][timeFrameIndex];
    if (tracksCache) {
        // search cache first
        console.log("Retrieving from cache");
        return {
            tracks: tracksCache,
            features: featuresCache,
            averages: averagesCache,
        };
    } else {
        // signed in
        const { tracks, features, averages } = await getTracksAndFeatures(
            timeFrameIndex
        );

        console.log("Cacheing tracks and features");
        cache["tracks"][timeFrameIndex] = tracks;
        cache["features"][timeFrameIndex] = features;
        cache["averages"][timeFrameIndex] = averages;

        return { tracks, features, averages };
    }
};

/**
 * Fetches or retrieves cached recently played tracks
 * Checks cache first before making API request
 *
 * @async
 * @returns {Promise<any[]|null>} Array of recently played track objects or null
 */
export const fetchRecent = async () => {
    const recentCache = cache["recent"];
    if (recentCache) {
        console.log("Fetching demo recent tracks");
        return recentCache;
    } else {
        cache["recent"] = null;
        const tracks = await getRecentTracks();

        console.log("Cacheing recent");
        cache["recent"] = tracks;

        return tracks;
    }
};

/**
 * Fetches or retrieves cached available genre seeds for recommendations
 * Checks cache first before making API request
 *
 * @async
 * @returns {Promise<string[]|null>} Array of available genre strings or null
 */
export const fetchSeeds = async () => {
    const seedsCache = cache["genreSeeds"];
    if (seedsCache) {
        return seedsCache;
    } else {
        const seeds = await getGenreSeeds();
        console.log("Cacheing seeds");
        cache["genreSeeds"] = seeds;
        return seeds;
    }
};
