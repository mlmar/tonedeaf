import { useShallow } from "zustand/shallow";
import { useTonedeafStore, type TonedeafState } from "~/hooks/useTonedeafStore";

type RecentViewState = {
    recentViewIndex: TonedeafState['recentViewIndex'],
    setRecentViewIndex: TonedeafState['setRecentViewIndex']
}

export function useRecentViewState(): RecentViewState {
    return useTonedeafStore(useShallow((state) => {
        return {
            recentViewIndex: state.recentViewIndex,
            setRecentViewIndex: state.setRecentViewIndex
        }
    }));
}