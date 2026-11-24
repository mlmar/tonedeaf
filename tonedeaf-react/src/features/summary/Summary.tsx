import { useTonedeafStore } from '~/hooks/useTonedeafStore.js';
import { ArtistSummary } from './ArtistsSummary';
import { TracksSummary } from './TracksSummary';

import { Options } from '~/components/Options';

import { Config } from '~/util/Config.js';
import { useSummaryViewState } from '~/hooks/useSummaryViewState.js';
import { useArtistViewState } from '~/hooks/useArtistViewState.js';
import { useTrackViewState } from '~/hooks/useTrackViewState.js';
import { useArtistGenre } from '~/hooks/useArtistGenre.js';
import type { ImageExportProps } from '~/hooks/useDownload';

export const Summary = ({ onDownloadClick, exportRef }: ImageExportProps) => {
    const setNavIndex = useTonedeafStore((state) => state.setNavIndex);
    const { setArtistGenre } = useArtistGenre();
    const { summaryTimeFrameIndex, setSummaryTimeFrameIndex } = useSummaryViewState();
    const { setArtistTimeFrameIndex } = useArtistViewState();
    const { setTrackTimeFrameIndex } = useTrackViewState();

    const handleArtistClick = () => {
        setNavIndex(1);
        setArtistTimeFrameIndex(summaryTimeFrameIndex);
    };

    const handleArtistGenreClick = (genre: string) => {
        setNavIndex(1);
        setArtistGenre(genre);
        setArtistTimeFrameIndex(summaryTimeFrameIndex);
    };

    const handleTrackClick = () => {
        setNavIndex(2);
        setTrackTimeFrameIndex(summaryTimeFrameIndex);
    };

    return (
        <div className='page summary flex-fill'>
            <header className='flex flex-wrap mobile-flex' data-html2canvas-ignore>
                <Options
                    title='Your Summary'
                    options={Config.TIME_OPTIONS}
                    onClick={setSummaryTimeFrameIndex}
                    index={summaryTimeFrameIndex}
                />
                <Options
                    title='Share'
                    className='mobile-share-options'
                    options={Config.DOWNLOAD_OPTIONS}
                    onClick={onDownloadClick}
                />
            </header>
            <div className='flex-col' ref={exportRef}>
                <header className='flex flex-middle flex-space-between'>
                    <label className='large bold'>In the {Config.SUMMARY_TEXT[summaryTimeFrameIndex]}...</label>
                </header>
                <ArtistSummary
                    index={summaryTimeFrameIndex}
                    onArtistClick={handleArtistClick}
                    onGenreClick={handleArtistGenreClick}
                />
                <TracksSummary index={summaryTimeFrameIndex} onClick={handleTrackClick} />
            </div>
        </div>
    );
};
