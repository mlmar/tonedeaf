import { useQuery } from "@tanstack/react-query";
import { Config } from "~/util/Config";
import { useIsDemo } from "~/hooks/useIsDemo";
import { countGenres, getGenreSeeds, getNowPlaying, getProfile, getRecentTracks, getTopArtists, getTracksAndFeatures } from "~/util/SpotifyUtil";
import { getDemoArtists, getDemoGenreSeeds, getDemoNowPlaying, getDemoRecentTracks, getDemoTracksAndFeatures } from "~/service/DemoService";

// Default useQuery
const QUERY_CONFIG = {
    staleTime: Infinity
}

/**
 * Fetches user info
 */
export function useUserInfo(): Awaited<ReturnType<typeof getProfile>> | undefined {
    const { isDemo } = useIsDemo();
    const { data } = useQuery({
        ...QUERY_CONFIG,
        queryKey: [isDemo, 'user-info'],
        queryFn: async () => {
            if (isDemo) {
                return undefined;
            }
            return await getProfile()
        }
    })
    return data;
}

/**
 * If session is demo returns true
 * @returns {Awaited<ReturnType<typeof getNowPlaying>>}
 */
export function useNowPlaying(interval: number = 10000): Awaited<ReturnType<typeof getNowPlaying>> | undefined {
    const { isDemo } = useIsDemo();

    const { data } = useQuery({
        queryKey: [isDemo],
        queryFn: () => isDemo ? getDemoNowPlaying() : getNowPlaying(),
        refetchInterval: interval
    })
    return data;
}

/**
 * Fetches artists and genres
 * @param {number} timeFrameIndex 
 * @param {string} genre 
 */
export const useArtistsAndGenres = (timeFrameIndex: number, genre: string = Config.GENRE) => {
    const { isDemo } = useIsDemo();
    const { data } = useQuery({
        ...QUERY_CONFIG,
        queryKey: [isDemo, timeFrameIndex, genre, 'artists'],
        queryFn: async () => isDemo ? await getDemoArtists(timeFrameIndex) : await getTopArtists(timeFrameIndex),
        select: (data: Awaited<ReturnType<typeof getTopArtists>>) => {
            const artists = data
                .map((artist, i) => ({ ...artist, rank: i + 1 })) // Add artist rank
                .filter((artist) => genre === Config.GENRE || artist.genres.some((g: string) => genre === g)); // Or filter artist by genre

            return {
                genres: countGenres(artists),
                artists
            }
        }
    });

    return data;
};

/**
 * Fetches tracks and features
 * @param {number} timeFrameIndex 
 */
export const useTracksAndFeatures = (timeFrameIndex: number) => {
    const { isDemo } = useIsDemo();
    const { data } = useQuery({
        ...QUERY_CONFIG,
        queryKey: [isDemo, timeFrameIndex, 'tracks'],
        queryFn: async () => isDemo ? await getDemoTracksAndFeatures(timeFrameIndex) : await getTracksAndFeatures(timeFrameIndex),
    });

    return data;
};

/**
 * Fetches recent tracks
 */
export const useRecent = () => {
    const { isDemo } = useIsDemo();
    const { data } = useQuery({
        ...QUERY_CONFIG,
        queryKey: [isDemo, 'recent'],
        queryFn: async () => {
            if (isDemo) {
                return getDemoRecentTracks();
            }
            return await getRecentTracks();
        }
    });

    return data;
};

/**
 * Fetches genre seeds
 */
export const useGenreSeeds = () => {
    const { isDemo } = useIsDemo();
    const { data } = useQuery({
        ...QUERY_CONFIG,
        queryKey: [isDemo, 'genre-seeds'],
        queryFn: async () => {
            if (isDemo) {
                return await getDemoGenreSeeds();
            }
            return await getGenreSeeds();
        },
    });

    return data;
};