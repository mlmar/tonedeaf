import { useQuery } from "@tanstack/react-query";
import {
    fetchArtistsAndGenres,
    fetchTracksAndFeatures,
    fetchRecent,
} from "~/util/DataUtil";
import { Config } from "~/util/Config";

// Default useQuery
const QUERY_CONFIG = {
    staleTime: Infinity
}

/**
 * Fetches artists and genres
 * @param {number} timeFrameIndex 
 * @param {string} genre 
 */
export const useArtistsAndGenres = (timeFrameIndex: number, genre: string = Config.GENRE) => {
    const { data } = useQuery({
        ...QUERY_CONFIG,
        queryKey: [timeFrameIndex, genre],
        queryFn: () => fetchArtistsAndGenres(timeFrameIndex),
        select: (data) => {
            const artists = data?.artists
                .map((artist, i) => ({ ...artist, rank: i + 1 })) // Add artist rank
                .filter((artist) => genre === Config.GENRE || artist.genres.some((g: string) => genre === g)); // Or filter artist by genre

            return {
                ...data,
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
    const { data } = useQuery({
        ...QUERY_CONFIG,
        queryKey: [timeFrameIndex],
        queryFn: () => fetchTracksAndFeatures(timeFrameIndex),
    });

    return data;
};

/**
 * Fetches recent tracks
 */
export const useRecent = () => {
    const { data } = useQuery({
        ...QUERY_CONFIG,
        queryKey: [],
        queryFn: () => fetchRecent(),
    });

    return data;
};
