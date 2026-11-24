import { useState, type ChangeEvent, type ReactElement } from 'react';
import { getSearchRecs, createPlaylist } from '~/util/SpotifyUtil';

import { Options } from '~/components/Options';
import { ImageWrapper } from '~/components/ImageWrapper';
import { ArtistCard } from '~/features/artist/ArtistCard';
import { TrackCard } from '~/features/track/TrackCard';
import { NowPlaying } from '~/features/user/NowPlaying';

import { Load } from '~/components/Load';

import { Config } from '~/util/Config';
import { useIsDemo } from '~/hooks/useIsDemo.ts';
import { useNowPlaying, useUserInfo } from '~/hooks/SpotifyHooks';
import { useSearch } from '~/hooks/useSearch';
import { useTonedeafStore } from '~/hooks/useTonedeafStore';

const VIEW_OPTIONS = ['Search', 'Recommendations'];
const VIEW_OPTIONS_TEMP = ['Search'];
const SEARCH_OPTIONS = ['Artists', 'Tracks'];

const PLAYLIST_OPTIONS = ['Create Playlist', 'Reroll'];
const PLAYLIST_OPTIONS_TEMP = ['Create Playlist'];

type SearchResult = SpotifyApi.ArtistObjectFull | SpotifyApi.TrackObjectFull;

// Find recommendations from up to five selected artists and tracks.
export const ScopePage = () => {
    const { isDemo } = useIsDemo();
    const userInfo = useUserInfo();
    const setAlertText = useTonedeafStore((state) => state.setAlertText);
    const [viewIndex, setViewIndex] = useState(0);
    const [searchIndex, setSearchIndex] = useState(0);
    const [searchInput, setSearchInput] = useState('');

    const [selected, setSelected] = useState<SearchResult[]>([]);
    const [prevSelected, setPrevSelected] = useState<SearchResult[] | null>(null);
    const [tracks, setTracks] = useState<SpotifyApi.TrackObjectSimplified[] | null>(null);

    const { data: searchResults, isLoading } = useSearch(searchInput, searchIndex);
    const nowPlayingTrack = useNowPlaying();

    const handleViewClick = (index: number) => {
        setViewIndex(index);

        if (index === 1 && selected !== prevSelected) {
            setPrevSelected(selected);
            getRecommendations();
        }
    };

    const handlePlaylistOptions = async (index: number) => {
        if (index === 0) {
            if (!userInfo || !tracks) {
                return;
            }

            const response = await createPlaylist(userInfo.id, 'tonedeaf scope tracks', tracks);

            if (response) setAlertText(Config.STATUS_MESSAGE.PLAYLIST_CREATED);
        } else {
            getRecommendations();
        }
    };

    const handleFindMore = async () => {
        if (isDemo || !nowPlayingTrack) {
            return;
        }

        const { artistID, trackID } = nowPlayingTrack;
        if (!artistID && !trackID) {
            return;
        }

        const artistIds = artistID ? [artistID] : [];
        const trackIds = trackID ? [trackID] : [];
        const recommendations = await getSearchRecs(artistIds, trackIds);

        setTracks(recommendations);
        setViewIndex(1);
        setSelected([]);
    };

    const getRecommendations = async () => {
        setViewIndex(1);

        const artistIds: string[] = [];
        const trackIds: string[] = [];

        selected.forEach((item) => {
            if (item.type === 'artist') {
                artistIds.push(item.id);
            } else {
                trackIds.push(item.id);
            }
        });

        const recommendations = await getSearchRecs(artistIds, trackIds);
        setTracks(recommendations);
    };

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.currentTarget.value);
    };

    const handleSelect = (result: SearchResult) => {
        setSelected((previous) => {
            if (previous.length >= 5 || previous.some((item) => item.id === result.id)) {
                return previous;
            }

            return [...previous, result];
        });
    };

    const handleDeselect = (result: SearchResult) => {
        setSelected((previous) => previous.filter((item) => item.id !== result.id));
    };

    // show Images of user selections
    const getSelected = () => {
        if (selected.length === 0) return;

        return (
            <div className='flex-col'>
                {selected.length > 0 && (
                    <p className='medium bold directions'>
                        Current selection &mdash; Deselect artists and tracks by pressing on their album art.
                    </p>
                )}
                <div className='selected images'>
                    {selected.map((result) => {
                        const images = result.type === 'artist' ? result.images : result.album?.images;

                        return (
                            <ImageWrapper
                                className='hover-deselect'
                                src={images?.[0]?.url}
                                title={result.name}
                                onClick={() => handleDeselect(result)}
                                key={result.id}
                            />
                        );
                    })}
                </div>
            </div>
        );
    };

    // show search results
    const getSearchCards = () => {
        if (isLoading) {
            return (
                <div className='cards'>
                    <Load />
                </div>
            );
        }

        if (searchResults?.length === 0 && searchInput.length) {
            return <label className='medium bold'> No results found </label>;
        }

        const cards = searchResults?.map((result, i) => {
            if (selected.some((item) => item.id === result.id)) {
                return null;
            }

            if (searchIndex === 0 && result.type === 'artist') {
                return (
                    <ArtistCard
                        artist={result}
                        className='hover-select'
                        onClick={() => handleSelect(result)}
                        key={result.id}
                    />
                );
            }

            if (searchIndex === 1 && result.type === 'track') {
                return (
                    <TrackCard
                        track={{ ...result, rank: i + 1 }}
                        className='hover-select'
                        onClick={() => handleSelect(result)}
                        key={result.id}
                    />
                );
            }

            return null;
        });

        return (
            <div className='cards'>
                {Boolean(searchResults?.length) && (
                    <p className='medium bold directions'>
                        Search Results &mdash; Select
                        {SEARCH_OPTIONS[searchIndex].toLocaleLowerCase()} by pressing on their card.
                    </p>
                )}
                {cards}
            </div>
        );
    };

    // show appropriate windows based on view index
    const getView = () => {
        let view: ReactElement | null = null;
        switch (viewIndex) {
            default: // display now playing widget and search bar
                view = (
                    <>
                        <NowPlaying widget>
                            <button className='gray-btn bold round' onClick={handleFindMore}>
                                Find More Like This
                            </button>
                        </NowPlaying>
                        <label className='medium bold'>
                            Find song recommendations based on a combination of up to 5 artists and tracks.
                        </label>
                        <hr />
                        <div className='flex'>
                            <input
                                className='search medium flex-fill'
                                type='text'
                                placeholder={'Search for ' + SEARCH_OPTIONS[searchIndex]}
                                value={searchInput}
                                onChange={handleSearchChange}
                                autoFocus
                            />
                        </div>
                        {getSelected()}
                        {getSearchCards()}
                    </>
                );
                break;
            case 1: // display recommendations
                if (tracks && tracks.length > 0) {
                    // recs found
                    view = (
                        <div className='cards'>
                            {tracks.map((track, i) => (
                                <TrackCard track={{ ...track, rank: i + 1 }} key={track.name + i} />
                            ))}
                        </div>
                    );
                } else if (tracks?.length === 0) {
                    // no recs found
                    view = (
                        <label className='medium bold'>No results found &mdash; Try changing up your selection.</label>
                    );
                } else {
                    // still searching
                    view = <Load />;
                }
                break;
        }

        return view;
    };

    return (
        <div className='page'>
            <div className='flex mobile-flex'>
                <Options
                    title='View'
                    options={selected.length ? VIEW_OPTIONS : VIEW_OPTIONS_TEMP}
                    onClick={handleViewClick}
                    index={viewIndex}
                />
                {viewIndex === 0 && (
                    <Options title='Search For' options={SEARCH_OPTIONS} onClick={setSearchIndex} index={searchIndex} />
                )}
                {tracks && viewIndex === 1 && (
                    <Options
                        title='Like These Tracks?'
                        options={selected.length ? PLAYLIST_OPTIONS : PLAYLIST_OPTIONS_TEMP}
                        onClick={handlePlaylistOptions}
                    />
                )}
            </div>
            {getView()}
        </div>
    );
};
