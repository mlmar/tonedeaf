import { useRecent, useUserInfo } from '~/hooks/SpotifyHooks.ts';
import { createPlaylist } from '~/util/SpotifyUtil.js';

import { Options } from '~/components/Options.jsx';
import { ImageWrapper } from '~/components/ImageWrapper.jsx';
import { TrackCard } from './TrackCard.jsx';

import { Load } from '~/components/Load.jsx';

import { Config } from '~/util/Config.js';
import { useIsDemo } from '~/hooks/useIsDemo.ts';
import { useTonedeafStore } from '~/hooks/useTonedeafStore.js';
import { useRecentViewState } from '~/hooks/useRecentViewState.js';

/*
  Display users most recent 50 tracks
*/
export const RecentPage = () => {
    const { isDemo } = useIsDemo();
    const userInfo = useUserInfo();
    const setAlertText = useTonedeafStore((state) => state.setAlertText);

    const { recentViewIndex: viewIndex, setRecentViewIndex: setViewIndex } = useRecentViewState();
    const tracks = useRecent();

    const handleCreatePlaylist = async () => {
        if (isDemo) {
            setAlertText(Config.STATUS_MESSAGE.SIGN_IN);
            return;
        }

        const id = userInfo.id;
        const response = await createPlaylist(id, 'tonedeaf recent tracks', tracks, true);
        if (response) {
            setAlertText(Config.STATUS_MESSAGE.PLAYLIST_CREATED);
        }
    };

    // if an tracks's image is pressed in the grid view, display location of track in list view
    const handleTrackClick = () => {
        setViewIndex(1);
    };

    return (
        <div className='page'>
            <header className='flex flex-wrap mobile-flex'>
                <Options title='View' options={Config.VIEW_OPTIONS} onClick={setViewIndex} index={viewIndex} />
                <Options title='Like These Tracks?' options={['Create Playlist']} onClick={handleCreatePlaylist} />
            </header>
            {tracks ? (
                viewIndex === 0 ? (
                    <div className='images'>
                        {tracks.map((track, i) => (
                            <ImageWrapper
                                src={track?.track?.album?.images?.[0]?.url}
                                title={i + 1 + '. ' + track?.track?.name}
                                url={'#' + track?.track?.name + (i + 1)}
                                onClick={handleTrackClick}
                                key={track?.track?.name + i}
                            />
                        ))}
                    </div>
                ) : (
                    <div className='cards'>
                        {tracks.map((track, i) => (
                            <TrackCard {...track?.track} rank={i + 1} key={track?.track?.name + i} norank>
                                <label className='medium inactive'>
                                    Played on
                                    {new Date(track?.played_at).toDateString()}
                                </label>
                            </TrackCard>
                        ))}
                    </div>
                )
            ) : (
                <Load />
            )}
        </div>
    );
};
