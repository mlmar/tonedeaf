/**
 * @module SpotifyUtil
 * @description Utility module for interacting with the Spotify Web API through the spotify-web-api-js library.
 *
 * This module:
 * - Handles all errors that occur when interacting with the Spotify Web API
 * - Trims server responses to fit the application's needs
 * - Provides helper functions for data transformation and formatting
 * - Manages authentication tokens and API calls
 * - Processes audio features, genres, tracks, and artist data
 * - Supports playlist creation and music recommendations
 */

import SpotifyWebApi from "spotify-web-api-js";

/** Spotify Web API instance for making authenticated requests */
const spotifyWebApi = new SpotifyWebApi();

/** Development mode flag for enabling debug logging */
const DEV = import.meta.env.REACT_APP_DEV;

/** Time range options for fetching user's top tracks/artists */
const RANGES = ["long_term", "medium_term", "short_term"] as const;

/**
 * NowPlayingTrack object structure returned by getNowPlaying
 */
export interface NowPlayingTrack {
    title: string | null;
    artists: string[] | null;
    image: string | null;
    duration: number | null;
    progress: number | null;
    url: string | null;
    playing: boolean | null;
    artistID: string | null;
    trackID: string | null;
}

/**
 * Average audio features object
 */
export interface AudioFeatureAverages {
    [key: string]: {
        name: string;
        total: number;
    };
}

/**
 * Genre count object
 */
export interface GenreCount {
    genre: string;
    total: number;
}

/**
 * Audio attribute configuration
 */
interface AttributeConfig {
    name: string;
    id: string;
    min: number;
    max: number;
    step: number;
    defaultMin: number;
    defaultMax: number;
}

/**
 * Sets the access token for Spotify API authentication
 * @param {string} token - The Spotify access token
 */
export const setAccessToken = (token: string): void => {
    spotifyWebApi.setAccessToken(token);
};

/**
 * Retrieves the authenticated user's Spotify profile information
 * @async
 * @returns {Promise<Object>} User profile object or null on error
 */
export const getProfile = async (): Promise<SpotifyApi.CurrentUsersProfileResponse> => {
    try {
        const response = await spotifyWebApi.getMe();
        return response;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch user profile');
    }
};

/**
 * Retrieves the currently playing track, or the most recently played track if nothing is currently playing
 * @async
 * @returns {Promise<NowPlayingTrack>} NowPlayingTrack object with properties: title, artists, image, duration, progress, url, playing, artistID, trackID
 */
export const getNowPlaying = async (): Promise<NowPlayingTrack> => {
    const track: NowPlayingTrack = {
        title: null,
        artists: null,
        image: null,
        duration: null,
        progress: null,
        url: null,
        playing: null,
        artistID: null,
        trackID: null,
    };

    try {
        const response = await spotifyWebApi.getMyCurrentPlaybackState();

        if (response?.item) {
            track.title = response.item?.name;
            track.artists = response.item?.artists.map(
                (artist: SpotifyApi.ArtistObjectSimplified) => artist.name
            );
            track.image = response.item?.album?.images?.[0]?.url;
            track.duration = response.item?.duration_ms / 1000; // convert to seconds
            track.progress = (response.progress_ms ?? 0) / 1000; // convert to seconds
            track.url = response.item?.uri;
            track.playing = response.is_playing;
            track.artistID = response.item?.artists?.[0]?.id;
            track.trackID = response.item?.id;

            if (DEV) console.log(track);

            return track;
        } else {
            const recentTracks = await getRecentTracks();
            if (recentTracks) {
                const recentTrack = recentTracks[0].track; // get the most recently played track
                track.title = recentTrack.name;
                track.artists = recentTrack.artists.map(
                    (artist: SpotifyApi.ArtistObjectSimplified) => artist.name
                );
                // track.image = recentTrack.album?.images?.[0]?.url;
                // track.url = recentTrack.album?.uri;

                if (DEV) console.log(track);

                return track;
            }
        }
        return track;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch recent tracks');
    }
};

/**
 * Retrieves the user's top artists within a specified time range
 * @async
 * @param {number} rangeIndex - Index into RANGES array (0='long_term', 1='medium_term', 2='short_term')
 * @returns {Promise<SpotifyApi.ArtistObjectFull[]>} Array of top artist objects or null on error
 */
export const getTopArtists = async (
    rangeIndex: number
): Promise<SpotifyApi.ArtistObjectFull[]> => {
    try {
        const params = { time_range: RANGES[rangeIndex], limit: 50 };
        const artists = await spotifyWebApi.getMyTopArtists(params);

        if (DEV) console.log(artists?.items);

        return artists?.items;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch top artists');
    }
};

/**
 * Retrieves the user's top tracks within a specified time range
 * @async
 * @param {number} rangeIndex - Index into RANGES array (0='long_term', 1='medium_term', 2='short_term')
 * @returns {Promise<SpotifyApi.TrackObjectFull[]>} Array of top track objects or null on error
 */
export const getTopTracks = async (
    rangeIndex: number
): Promise<SpotifyApi.TrackObjectFull[]> => {
    try {
        const params = { time_range: RANGES[rangeIndex], limit: 50 };
        const tracks = await spotifyWebApi.getMyTopTracks(params);

        if (DEV) console.log(tracks?.items);

        return tracks?.items;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch top tracks');
    }
};

/**
 * Retrieves the user's recently played tracks
 * @async
 * @returns {Promise<SpotifyApi.PlayHistoryObject[]>} Array of recently played track objects or null on error
 */
export const getRecentTracks = async (): Promise<SpotifyApi.PlayHistoryObject[]> => {
    try {
        const params = { limit: 50 };
        const tracks = await spotifyWebApi.getMyRecentlyPlayedTracks(params);

        if (DEV) console.log(tracks?.items);

        return tracks?.items;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to get recently played tracks');
    }
};

/**
 * Extracts and formats track IDs into a comma-separated string
 * @param {any[]} tracks - Array of track objects
 * @returns {string[]} Array of track IDs
 */
const getIDS = (tracks: SpotifyApi.TrackObjectFull[]): string[] => {
    return tracks.map((track: SpotifyApi.TrackObjectFull) => track.id);
};

/**
 * Calculates average audio features across multiple tracks
 * @param {SpotifyApi.TrackObjectFull[]} tracks - Array of track objects
 * @param {SpotifyApi.AudioFeaturesObject[]} features - Array of audio feature objects from Spotify API
 * @returns {AudioFeatureAverages} Object mapping audio feature names to their average values
 */
const getAudioFeaturesAverages = (tracks: SpotifyApi.TrackObjectFull[], features: SpotifyApi.AudioFeaturesObject[]): AudioFeatureAverages => {
    const length = features.length;

    const averages: AudioFeatureAverages = {
        acousticness: { name: "Acousticness", total: 0 },
        danceability: { name: "Danceability", total: 0 },
        duration: { name: "Duration (S)", total: 0 },
        energy: { name: "Energy", total: 0 },
        instrumentalness: { name: "Instrumentalness", total: 0 },
        liveness: { name: "Liveness", total: 0 },
        loudness: { name: "Loudness", total: 0 },
        mode: { name: "Mode", total: 0 },
        speechiness: { name: "Speechiness", total: 0 },
        tempo: { name: "Tempo", total: 0 },
        time_signature: { name: "Time Signature", total: 0 },
        valence: { name: "Valence", total: 0 },
        popularity: { name: "Popularity", total: 0 }, // only stat that isn't retrieved by audio features call
    };

    for (let i = 0; i < length; i++) {
        averages.acousticness.total += features[i]?.acousticness;
        averages.danceability.total += features[i]?.danceability;
        averages.duration.total += features[i]?.duration_ms / 1000;
        averages.energy.total += features[i]?.energy;
        averages.instrumentalness.total += features[i]?.instrumentalness;
        averages.liveness.total += features[i]?.liveness;
        averages.loudness.total += features[i]?.loudness;
        averages.mode.total += features[i]?.mode;
        averages.speechiness.total += features[i]?.speechiness;
        averages.tempo.total += features[i]?.tempo;
        averages.time_signature.total += features[i]?.time_signature;
        averages.valence.total += features[i]?.valence;
        averages.popularity.total += tracks[i]?.popularity;
    }

    for (const attribute in averages) {
        averages[attribute].total =
            Math.round((averages[attribute].total / length) * 100) / 100;
    }

    if (DEV) console.log(averages);

    return averages;
};

/**
 * Retrieves audio features for multiple tracks
 * @async
 * @param {SpotifyApi.TrackObjectFull[]} tracks - Array of track objects
 * @returns {Promise<SpotifyApi.AudioFeaturesObject[]>} Array of audio feature objects or null on error
 */
export const getFeatures = async (tracks: SpotifyApi.TrackObjectFull[]): Promise<SpotifyApi.AudioFeaturesObject[]> => {
    try {
        const features = await spotifyWebApi.getAudioFeaturesForTracks(
            getIDS(tracks)
        );

        if (DEV) console.log(features?.audio_features);

        return features.audio_features;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch audio features');
    }
};

/**
 * Retrieves top tracks along with their audio features and calculated averages
 * @async
 * @param {number} rangeIndex - Index into RANGES array for time range selection
 * @returns {Promise<Object>} Object containing tracks, features, and averages; or null on error
 */
export const getTracksAndFeatures = async (
    rangeIndex: number
): Promise<{
    tracks: SpotifyApi.TrackObjectFull[];
    features: SpotifyApi.AudioFeaturesObject[];
    averages: AudioFeatureAverages;
}> => {
    try {
        const tracks = await getTopTracks(rangeIndex);
        const features = await getFeatures(tracks ?? []);
        const averages = getAudioFeaturesAverages(tracks ?? [], features ?? []);
        return { tracks, features, averages };
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch tracks and features');
    }
};

/**
 * Counts genre occurrences across an array of artists
 * @param {SpotifyApi.ArtistObjectFull[]} artists - Array of artist objects
 * @returns {GenreCount[]} Sorted array of genre count objects with 'genre' and 'total' properties
 */
export const countGenres = (artists: SpotifyApi.ArtistObjectFull[]): GenreCount[] => {
    const counts: { [key: string]: number } = { all: 0 };
    artists?.forEach((artist: SpotifyApi.ArtistObjectFull) => {
        artist?.genres?.forEach((genre: string) => {
            counts[genre] = (counts[genre] || 0) + 1;
            counts["all"]++;
        });
    });

    const finalCounts: GenreCount[] = [];
    for (const genre in counts) {
        finalCounts.push({ genre, total: counts[genre] });
    }

    finalCounts.sort((a, b) => b.total - a.total);

    if (DEV) console.log(finalCounts);

    return finalCounts;
};

/**
 * Retrieves top artists and counts their genres
 * @async
 * @param {number} rangeIndex - Index into RANGES array for time range selection
 * @returns {Promise<{artists: any[]; genres: GenreCount[]}>} Object containing artists array and genres array; or null on error
 */
export const getTopArtistsAndGenres = async (
    rangeIndex: number
): Promise<{ artists: SpotifyApi.ArtistObjectFull[]; genres: GenreCount[] }> => {
    try {
        const artists = await getTopArtists(rangeIndex);
        const genres = countGenres(artists ?? []);
        return { artists, genres };
    } catch (error) {
        console.error(error);
        throw (error);
    }
};

/**
 * Extracts Spotify URIs from tracks, handling both recent and regular track formats
 * @param {any[]} tracks - Array of track objects
 * @param {boolean} recent - If true, expects track format from recently played API; if false, expects standard track format
 * @returns {string[]} Array of Spotify URIs, reversed if recent is true
 */
export const getUris = (tracks: SpotifyApi.PlayHistoryObject[] | SpotifyApi.TrackObjectFull[], recent: boolean): string[] => {
    const uris = tracks.map((track: SpotifyApi.PlayHistoryObject | SpotifyApi.TrackObjectFull) => {
        if (recent) {
            return (track as SpotifyApi.PlayHistoryObject)?.track?.uri;
        } else {
            return (track as SpotifyApi.TrackObjectFull)?.uri;
        }
    });
    return recent ? uris.reverse() : uris;
};

/**
 * Formats the current date as MM/DD/YYYY
 * @returns {string} Current date string in MM/DD/YYYY format
 */
const getDate = (): string => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    const yyyy = today.getFullYear();

    return `${mm}/${dd}/${yyyy}`;
};

/**
 * Creates a new playlist on the user's Spotify account and adds tracks to it
 * @async
 * @param {string} id - User's Spotify ID; if falsy, returns demo status
 * @param {string} text - Name for the new playlist
 * @param {Track[]} tracks - Array of track objects to add to the playlist
 * @param {boolean} recent - Whether tracks are from recently played format
 * @returns {Promise<SpotifyApi.AddTracksToPlaylistResponse>} Response object from addTracksToPlaylist or {status: 'demo'} or null on error
 */
export const createPlaylist = async (
    id: string,
    text: string,
    tracks: SpotifyApi.TrackObjectFull[],
    recent: boolean
): Promise<Partial<SpotifyApi.AddTracksToPlaylistResponse>> => {
    const params = {
        name: text,
        public: true,
        collaborative: false,
        description: "tonedeaf.vercel.app @ " + getDate(),
    };

    try {
        const playlist = await spotifyWebApi.createPlaylist(id, params);
        const uris = getUris(tracks, recent);

        console.log("Creating playlist for", text);
        const response = await spotifyWebApi.addTracksToPlaylist(
            playlist.id,
            uris
        );

        if (DEV) {
            console.log(playlist);
            console.log(response);
        }

        // window.open is blocked in ios
        const a = document.createElement("a");
        a.setAttribute("href", playlist.uri);
        a.click();
        a.remove();

        return response;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to create playlist');
    }
};

const attributesArray: [
    string,
    string,
    number,
    number,
    number,
    number,
    number
][] = [
        ["Acousticness", "acousticness", 0, 1, 0.1, 0, 1],
        ["Danceabilitiy", "danceabilitiy", 0, 1, 0.1, 0, 1],
        ["Energy", "energy", 0, 1, 0.1, 0, 1],
        ["Instrumentalness", "instrumentalness", 0, 1, 0.1, 0, 0.5],
        ["Key", "key", 0, 10, 1, 0, 10],
        ["Liveness", "liveness", 0, 1, 0.1, 0, 0.5],
        ["Loudness", "loudness", -80, 80, 1, -60, 30],
        ["Minor/Major", "mode", 0, 1, 1, 1, 1],
        ["Popularity", "popularity", 0, 100, 1, 0, 100],
        ["Speechiness", "speechiness", 0, 1, 0.1, 0, 0.3],
        ["Tempo", "tempo", 0, 200, 1, 0, 150],
        ["Time signature", "time_signature", 0, 10, 1, 0, 8],
        ["Valence", "valence", 0, 1, 0.1, 0, 1],
    ];

/**
 * Returns default audio attribute configurations for the tuner interface
 * Format: [display name, attribute id, min, max, step, defaultMin, defaultMax]
 * @returns {AttributeConfig[]} Array of attribute objects with configuration properties
 */
export const getDefaultAttributes = (): AttributeConfig[] => {
    const attributes: AttributeConfig[] = [];
    attributesArray.forEach((attribute) => {
        const attributesObj: AttributeConfig = {
            name: attribute[0],
            id: attribute[1],
            min: attribute[2],
            max: attribute[3],
            step: attribute[4],
            defaultMin: attribute[5],
            defaultMax: attribute[6],
        };

        attributes.push(attributesObj);
    });

    return attributes;
};

/**
 * Generates recommendation parameters from default attribute values
 * @returns {{[key: string]: number}} Object with min_ and max_ prefixed attributes ready for Spotify recommendations API
 */
export const getParamAttributes = (): { [key: string]: number } => {
    const params: { [key: string]: number } = {};
    getDefaultAttributes().forEach((attribute) => {
        params["min_" + attribute.id] = attribute.defaultMin;
        params["max_" + attribute.id] = attribute.defaultMax;
    });
    return params;
};

/**
 * Retrieves all available genres that can be used as seeds for recommendations
 * @async
 * @returns {Promise<Array>} Array of genre strings or null on error
 */
export const getGenreSeeds = async (): Promise<string[]> => {
    try {
        const genres = await spotifyWebApi.getAvailableGenreSeeds();

        if (DEV) console.log(genres?.genres);

        return genres?.genres;
    } catch (error) {
        console.error(error);
        throw (error);
    }
};

/**
 * Gets track recommendations based on genres and audio attribute constraints
 * @async
 * @param {Array<string>} genres - Array of genre seeds for recommendations
 * @param {Object} attributes - Audio attribute parameters (min_/max_ prefixed)
 * @returns {Promise<Array>} Array of recommended track objects or null on error
 */
export const getAttributeRecs = async (
    genres: string[],
    attributes: { [key: string]: number }
): Promise<SpotifyApi.TrackObjectSimplified[]> => {
    try {
        const params = { limit: 50, seed_genres: genres.join(), ...attributes };
        const response = await spotifyWebApi.getRecommendations(params);

        if (DEV) console.log(response.tracks);

        return response.tracks;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch attribute reccomendations');
    }
};

/** Search types: 0 = artist, 1 = track */
const SEARCH_TYPES = ['artist', 'track'] as const;

/**
 * Searches Spotify for artists or tracks
 * @async
 * @param {string} value - Search query string
 * @param {number} searchIndex - 0 for artist search, 1 for track search
 * @returns {Promise<Array>} Array of matching artist/track objects or null on error
 */
export const search = async (
    value: string,
    searchIndex: number
): Promise<SpotifyApi.ArtistObjectFull[] | SpotifyApi.TrackObjectFull[]> => {
    const query = value.replace(" ", "+");
    const types = SEARCH_TYPES[searchIndex];
    const params = { limit: 50 };

    try {
        const response = await spotifyWebApi.search(query, [types], params);
        if (response.artists) {
            return response.artists.items
        } else if (response.tracks) {
            return response.tracks.items
        } else {
            throw new Error('Failed to search artists and tracks');
        }
    } catch (error) {
        console.error(error);
        throw new Error('Failed to search artists and tracks');
    }
};

/**
 * Gets track recommendations based on seed artists and tracks
 * @async
 * @param {string} artistIDS - Comma-separated artist IDs to use as seeds
 * @param {string} trackIDS - Comma-separated track IDs to use as seeds
 * @returns {Promise<SpotifyApi.TrackObjectSimplified[]>} Array of recommended track objects or null on error
 */
export const getSearchRecs = async (
    artistIDS: string,
    trackIDS: string
): Promise<SpotifyApi.TrackObjectSimplified[]> => {
    try {
        const params = {
            seed_artists: artistIDS,
            seed_tracks: trackIDS,
            limit: 50,
        };
        const response = await spotifyWebApi.getRecommendations(params);

        if (DEV) console.log(response?.tracks);

        return response?.tracks;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch search recommendations')
    }
};
