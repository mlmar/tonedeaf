import { create } from 'zustand';
import { Config } from '~/util/Config.ts';

export type TonedeafState = {
    isDemo: boolean,
    navIndex: number,
    summaryTimeFrameIndex: number,
    artistGenre: string | null,
    artistViewIndex: number,
    artistTimeFrameIndex: number,
    trackViewIndex: number,
    trackTimeFrameIndex: number,
    recentViewIndex: number,
    alertText: string | null,
    setIsDemo: (isDemo: boolean) => void,
    setNavIndex: (navIndex: number) => void,
    setSummaryTimeFrameIndex: (summaryTimeFrameIndex: number) => void,
    setArtistGenre: (artistGenre: string | null) => void,
    setArtistViewIndex: (artistViewIndex: number) => void,
    setArtistTimeFrameIndex: (artistTimeFrameIndex: number) => void,
    setTrackViewIndex: (trackViewIndex: number) => void,
    setTrackTimeFrameIndex: (trackTimeFrameIndex: number) => void,
    setRecentViewIndex: (recentViewIndex: number) => void,
    setAlertText: (alertText: string | null) => void
}

export const useTonedeafStore = create<TonedeafState>((set) => {
    return {
        isDemo: false,
        navIndex: 0,
        summaryTimeFrameIndex: 0,
        artistGenre: Config.GENRE,
        artistViewIndex: Config.VIEW_INDEX,
        artistTimeFrameIndex: Config.TIME_FRAME_INDEX,
        trackViewIndex: Config.VIEW_INDEX,
        trackTimeFrameIndex: Config.TIME_FRAME_INDEX,
        recentViewIndex: Config.VIEW_INDEX,
        alertText: null,
        setIsDemo: (isDemo: boolean) => set({ isDemo }),
        setNavIndex: (navIndex: number) => set((state) => {
            return {
                navIndex,
                alertText: state.isDemo ? getNavIndexAlertWarningText(navIndex) : null
            }
        }),
        setSummaryTimeFrameIndex: (summaryTimeFrameIndex: number) => set({ summaryTimeFrameIndex }),
        setArtistGenre: (artistGenre: string | null) => set({ artistGenre }),
        setArtistViewIndex: (artistViewIndex: number) => set({ artistViewIndex }),
        setArtistTimeFrameIndex: (artistTimeFrameIndex: number) => set({ artistTimeFrameIndex }),
        setTrackViewIndex: (trackViewIndex: number) => set({ trackViewIndex }),
        setTrackTimeFrameIndex: (trackTimeFrameIndex: number) => set({ trackTimeFrameIndex }),
        setRecentViewIndex: (recentViewIndex: number) => set({ recentViewIndex }),
        setAlertText: (alertText: string | null) => set({ alertText })
    }
});

function getNavIndexAlertWarningText(navIndex: number) {
    if (navIndex === Config.NAV_INDEX.SCOPE || navIndex === Config.NAV_INDEX.TUNER) {
        return Config.STATUS_MESSAGE.SIGN_IN;
    }
}