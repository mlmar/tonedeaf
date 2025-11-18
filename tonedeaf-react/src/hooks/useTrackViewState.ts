import { useShallow } from "zustand/shallow";
import { useTonedeafStore, type TonedeafState } from "~/hooks/useTonedeafStore";

type TrackViewStateState = {
    trackTimeFrameIndex: TonedeafState['trackTimeFrameIndex'],
    trackViewIndex: TonedeafState['trackViewIndex'],
    setTrackTimeFrameIndex: TonedeafState['setTrackTimeFrameIndex'],
    setTrackViewIndex: TonedeafState['setTrackViewIndex']
}

export function useTrackViewState(): TrackViewStateState {
    return useTonedeafStore(useShallow((state) => {
        return {
            trackTimeFrameIndex: state.trackTimeFrameIndex,
            trackViewIndex: state.trackViewIndex,
            setTrackTimeFrameIndex: state.setTrackTimeFrameIndex,
            setTrackViewIndex: state.setTrackViewIndex
        }
    }));
}