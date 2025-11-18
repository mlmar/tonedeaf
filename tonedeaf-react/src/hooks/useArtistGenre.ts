import { useShallow } from "zustand/shallow";
import { useTonedeafStore, type TonedeafState } from "~/hooks/useTonedeafStore";

type ArtistGenreState = {
    artistGenre: TonedeafState['artistGenre'],
    setArtistGenre: TonedeafState['setArtistGenre'],
}

export function useArtistGenre(): ArtistGenreState {
    return useTonedeafStore(useShallow(state => {
        return {
            artistGenre: state.artistGenre,
            setArtistGenre: state.setArtistGenre
        }
    }))
}