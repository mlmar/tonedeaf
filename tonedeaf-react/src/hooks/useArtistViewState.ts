import { useShallow } from "zustand/shallow";
import { useTonedeafStore, type TonedeafState } from "~/hooks/useTonedeafStore";

type ArtistViewStateState = {
    artistTimeFrameIndex: TonedeafState['artistTimeFrameIndex'],
    artistViewIndex: TonedeafState['artistViewIndex'],
    setArtistTimeFrameIndex: TonedeafState['setArtistTimeFrameIndex'],
    setArtistViewIndex: TonedeafState['setArtistViewIndex']
}

export function useArtistViewState(): ArtistViewStateState {
    return useTonedeafStore(useShallow((state) => {
        return {
            artistTimeFrameIndex: state.artistTimeFrameIndex,
            artistViewIndex: state.artistViewIndex,
            setArtistTimeFrameIndex: state.setArtistTimeFrameIndex,
            setArtistViewIndex: state.setArtistViewIndex
        }
    }));
}