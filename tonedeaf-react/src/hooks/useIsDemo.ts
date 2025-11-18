import { useShallow } from "zustand/shallow";
import { useTonedeafStore, type TonedeafState } from "~/hooks/useTonedeafStore";

type DemoState = {
    isDemo: TonedeafState['isDemo'],
    setIsDemo: TonedeafState['setIsDemo'],
}

/**
 * If session is demo returns true
 * @returns {boolean}
 */
export function useIsDemo(): DemoState {
    return useTonedeafStore(useShallow((state) => {
        return {
            isDemo: state.isDemo,
            setIsDemo: state.setIsDemo
        }
    }));
}