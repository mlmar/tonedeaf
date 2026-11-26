import { useRecent, useUserInfo } from '~/hooks/SpotifyHooks.ts';
import { createPlaylist } from '~/util/SpotifyUtil.js';

import { Options } from '~/components/Options';
import { ImageWrapper } from '~/components/ImageWrapper';
import { TrackCard } from './TrackCard';

import { Load } from '~/components/Load';
import { SpotifyReadRetry } from '~/components/SpotifyReadRetry';

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
    const { data: tracks, error, isFetching, refetch } = useRecent();

    const handleCreatePlaylist = async () => {
        if (isDemo) {
            setAlertText(Config.STATUS_MESSAGE.SIGN_IN);
            return;
        }

        if (!userInfo || !tracks) {
            return;
        }

        const response = await createPlaylist(userInfo.id, 'tonedeaf recent tracks', tracks, true);
        if (response) {
            setAlertText(Config.STATUS_MESSAGE.PLAYLIST_CREATED);
        }
    };

    // if an tracks's image is pressed in the grid view, display location of track in list view
    const handleTrackClick = () => {
        setViewIndex(1);
    };

    const renderTracks = () => {
        if (!tracks) {
            return null;
        }

        if (viewIndex === 0) {
            return (
                <div className='images'>
                    {tracks.map(({ track }, i) => (
                        <ImageWrapper
                            src={track.album?.images?.[0]?.url}
                            title={i + 1 + '. ' + track.name}
                            url={'#' + track.name + (i + 1)}
                            onClick={handleTrackClick}
                            key={track.name + i}
                        />
                    ))}
                </div>
            );
        }

        return (
            <div className='cards'>
                {tracks.map(({ track, played_at }, i) => (
                    <TrackCard track={{ ...track, rank: i + 1 }} key={track.name + i}>
                        <label className='medium inactive'>
                            Played on
                            {new Date(played_at).toDateString()}
                        </label>
                    </TrackCard>
                ))}
            </div>
        );
    };

    return (
        <div className='page'>
            <header className='flex flex-wrap mobile-flex'>
                <Options title='View' options={Config.VIEW_OPTIONS} onClick={setViewIndex} index={viewIndex} />
                <Options title='Like These Tracks?' options={['Create Playlist']} onClick={handleCreatePlaylist} />
            </header>
            {renderTracks()}
            <SpotifyReadRetry error={error} isFetching={isFetching} onRetry={refetch} fallback={!tracks && <Load />} />
        </div>
    );
};
