import { useQuery } from "@tanstack/react-query";
import { useIsDemo } from "~/hooks/useIsDemo.ts";
import { getHashParams } from "~/util/HashUtil";
import { setAccessToken } from "~/util/SpotifyUtil";
import { HOME_URL } from "~/util/System";

/**
 * If hash params exist in URL, this will logs into Spotify API on mount 
 * @returns {boolean} logged in
 */
export function useLogin(): boolean {
    const { isDemo } = useIsDemo();

    const { data } = useQuery({
        queryKey: [isDemo],
        queryFn: async () => {
            if (isDemo) { // If this is a demo, then do not login
                return true;
            }

            const params = getHashParams();
            const token = params.access_token;
            if (!token) {
                return false;
            }
            setAccessToken(token); // If successful, set access token

            if (token) {
                try {
                    window.history.replaceState(null, 'tonedeaf', HOME_URL);
                } catch (error) {
                    console.error('Unable to replace history state');
                    console.error(error);
                }
            }
            return Boolean(token);
        }
    });

    return Boolean(data);
}