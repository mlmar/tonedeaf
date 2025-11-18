import { cache } from '~/util/Cache.js';
import { useTracksAndFeatures } from '~/hooks/SpotifyHooks.ts';
import { createPlaylist } from '~/util/SpotifyUtil.js';

import { Options } from '~/components/Options.jsx';
import { ImageWrapper } from '~/components/ImageWrapper.jsx';
import { TrackCard } from './TrackCard.jsx';

import { Load } from '~/components/Load.jsx';

import { Config } from '~/util/Config.js';
import { useIsDemo } from '~/hooks/useIsDemo.ts';
import { useTrackViewState } from '~/hooks/useTrackViewState.js';
import { useTonedeafStore } from '~/hooks/useTonedeafStore.js';

/*
  Display user's top tracks from a selected time range
*/
export const TrackPage = ({ onDownloadClick, exportRef }) => {
    const { isDemo } = useIsDemo();
    const setAlertText = useTonedeafStore((state) => state.setAlertText);

    const {
        trackTimeFrameIndex: timeFrameIndex,
        trackViewIndex: viewIndex,
        setTrackTimeFrameIndex: setTimeFrameIndex,
        setTrackViewIndex: setViewIndex,
    } = useTrackViewState();
    const info = useTracksAndFeatures(timeFrameIndex);

    const handleCreatePlaylist = async () => {
        if (isDemo) {
            setAlertText(Config.STATUS_MESSAGE.SIGN_IN);
            return;
        }

        const id = cache['userInfo']?.id;
        const response = await createPlaylist(id, 'tonedeaf top tracks', info?.tracks);
        if (response) {
            setAlertText(Config.STATUS_MESSAGE.PLAYLIST_CREATED);
        }
    };

    // if an tracks's image is pressed in the grid view, display location of track in list view
    const handleTrackClick = () => {
        setViewIndex(1);
    };

    const getView = () => {
        let view = null;
        switch (viewIndex) {
            default: // display grid view by default
                view = (
                    <div className='images' ref={exportRef}>
                        {info?.tracks?.map((track, i) => (
                            <ImageWrapper
                                src={track?.album?.images?.[0]?.url}
                                title={i + 1 + '. ' + track?.name}
                                url={'#' + track?.name + (i + 1)}
                                onClick={handleTrackClick}
                                key={track?.name + i}
                            />
                        ))}
                    </div>
                );
                break;
            case 1: // display list view
                view = (
                    <div className='cards' ref={exportRef}>
                        {info?.tracks?.map((track, i) => (
                            <TrackCard {...track} features={info.features?.[i]} rank={i + 1} key={track?.name + i} />
                        ))}
                    </div>
                );
                break;
            case 2: // display stats
                view = <></>;
                break;
        }

        return view;
    };

    return (
        <div className='page'>
            <header className='flex flex-wrap mobile-flex'>
                <Options
                    title='Your Top Tracks'
                    options={Config.TIME_OPTIONS}
                    onClick={setTimeFrameIndex}
                    index={timeFrameIndex}
                />
                <Options title='View' options={Config.VIEW_OPTIONS} onClick={setViewIndex} index={viewIndex} />
                {viewIndex === 0 && (
                    <Options
                        title='Share'
                        className='mobile-share-options'
                        options={Config.DOWNLOAD_OPTIONS}
                        onClick={onDownloadClick}
                    />
                )}
                {(viewIndex === 0 || viewIndex === 1) && (
                    <Options title='Like These Tracks?' options={['Create Playlist']} onClick={handleCreatePlaylist} />
                )}
            </header>
            {info ? getView() : <Load />}
        </div>
    );
};
