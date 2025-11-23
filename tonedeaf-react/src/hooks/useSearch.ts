import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { search } from "~/util/SpotifyUtil";

const searchCache = new Map<string, SpotifyApi.TrackObjectFull[] | SpotifyApi.ArtistObjectFull[]>();

/**
 * Retrieve search results for query
 * @param query -- value to search
 * @param searchIndex -- 0 = artists, 1 = tracks
 */
export function useSearch(query: string = '', searchIndex: number, delay = 500) {
    const timeoutRef = useRef<NodeJS.Timeout>(null);

    const { data, isLoading } = useQuery({
        queryKey: [query, searchIndex, 'search'],
        queryFn: async () => {
            if (query.trim() === '') {
                return []
            }

            const searchCacheKey = query + '_' + searchIndex;
            if (searchCache.has(searchCacheKey)) {
                return searchCache.get(searchCacheKey);
            }

            async function debouncedSearch() {
                const searchResults = await search(query, searchIndex);
                searchCache.set(searchCacheKey, searchResults);
                timeoutRef.current = null;
                return searchResults
            }

            // Debounce search term
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            return await new Promise<Awaited<ReturnType<typeof search>>>((resolve) => {
                timeoutRef.current = setTimeout(async () => {
                    const results = await debouncedSearch();
                    resolve(results)
                }, timeoutRef.current ? delay : 0);
            });
        }
    })

    return { data, isLoading }
}