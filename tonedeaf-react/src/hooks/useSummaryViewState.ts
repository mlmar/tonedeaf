import { useShallow } from "zustand/shallow";
import { useTonedeafStore, type TonedeafState } from "~/hooks/useTonedeafStore";

type SummaryViewStateState = {
    summaryTimeFrameIndex: TonedeafState['summaryTimeFrameIndex'],
    setSummaryTimeFrameIndex: TonedeafState['setSummaryTimeFrameIndex']
}

export function useSummaryViewState(): SummaryViewStateState {
    return useTonedeafStore(useShallow((state) => {
        return {
            summaryTimeFrameIndex: state.summaryTimeFrameIndex,
            setSummaryTimeFrameIndex: state.setSummaryTimeFrameIndex
        }
    }));
}