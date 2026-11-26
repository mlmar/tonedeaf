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
        enabled: !isDemo,
        queryFn: getProfile,
    })
    return data;
}

/**
 * Polls for playback data from Spotify or the demo endpoint.
 */
export function useNowPlaying(interval: number = 10000): Awaited<ReturnType<typeof getNowPlaying>> | undefined {
    const { isDemo } = useIsDemo();

    const { data } = useQuery({
        queryKey: [isDemo, 'now-playing'],
        queryFn: () => isDemo ? getDemoNowPlaying() : getNowPlaying(),
        refetchInterval: interval
    })
    return data;
}

/**
 * Fetches artists and genres
 * @param {number} timeFrameIndex 
 * @param {string | null} genre
 */
export const useArtistsAndGenres = (timeFrameIndex: number, genre: string | null = Config.GENRE) => {
    const { isDemo } = useIsDemo();
    const query = useQuery({
        ...QUERY_CONFIG,
        queryKey: [isDemo, timeFrameIndex, 'artists'],
        queryFn: async () => isDemo ? await getDemoArtists(timeFrameIndex) : await getTopArtists(timeFrameIndex)
    });

    const { data, error, isFetching, refetch } = query;

    // Rank before filtering to keep each artist's original position in the list.
    const artists = data?.map((artist, i) => ({ ...artist, rank: i + 1 }))
        .filter((artist) => genre !== null && (genre === Config.GENRE || artist.genres.includes(genre)));

    return {
        artists,
        genres: data ? countGenres(data) : [],
        error,
        isFetching,
        refetch,
    };
};

/**
 * Fetches tracks and features
 * @param {number} timeFrameIndex 
 */
export const useTracksAndFeatures = (timeFrameIndex: number) => {
    const { isDemo } = useIsDemo();
    return useQuery({
        ...QUERY_CONFIG,
        queryKey: [isDemo, timeFrameIndex, 'tracks'],
        queryFn: async () => isDemo ? await getDemoTracksAndFeatures(timeFrameIndex) : await getTracksAndFeatures(timeFrameIndex),
    });
};

/**
 * Fetches recent tracks
 */
export const useRecent = () => {
    const { isDemo } = useIsDemo();
    return useQuery({
        ...QUERY_CONFIG,
        queryKey: [isDemo, 'recent'],
        queryFn: async () => {
            if (isDemo) {
                return getDemoRecentTracks();
            }
            return await getRecentTracks();
        }
    });
};

/**
 * Fetches genre seeds
 */
export const useGenreSeeds = () => {
    const { isDemo } = useIsDemo();
    return useQuery({
        ...QUERY_CONFIG,
        queryKey: [isDemo, 'genre-seeds'],
        queryFn: async () => {
            if (isDemo) {
                return await getDemoGenreSeeds();
            }
            return await getGenreSeeds();
        },
    });
};
