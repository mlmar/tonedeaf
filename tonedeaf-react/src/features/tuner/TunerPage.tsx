import { useState, type MouseEvent, type ReactElement } from 'react';
import { getDefaultAttributes, getParamAttributes, getAttributeRecs, createPlaylist } from '~/util/SpotifyUtil.js';
import { isEqual } from '~/util/ObjectUtil.js';

import { Options } from '~/components/Options';
import { AttributeInput } from './AttributeInput';
import { TrackCard } from '~/features/track/TrackCard';

import { Load } from '~/components/Load';
import { CHECK } from '~/util/IconUtil';

import { Config } from '~/util/Config.js';
import { useIsDemo } from '~/hooks/useIsDemo.ts';
import { useTonedeafStore } from '~/hooks/useTonedeafStore.js';
import { useGenreSeeds, useUserInfo } from '~/hooks/SpotifyHooks.js';

const VIEW_OPTIONS = ['Attributes', 'Recommendations'];
const VIEW_OPTIONS_TEMP = ['Attributes'];
const PLAYLIST_OPTIONS = ['Create Playlist', 'Reroll'];

const DEFAULT_ATTRIBUTES = getDefaultAttributes();

/*
  Users can select up to 5 genres and edit preferred track attributes to get song recommendations
*/
export const TunerPage = () => {
    const { isDemo } = useIsDemo();
    const userInfo = useUserInfo();
    const setAlertText = useTonedeafStore((state) => state.setAlertText);

    const [viewIndex, setViewIndex] = useState(0);
    const genreSeeds = useGenreSeeds();

    const [attributes, setAttributes] = useState(getParamAttributes());
    const [prevAttributes, setPrevAttributes] = useState<typeof attributes | null>(null);

    const [selected, setSelected] = useState(() => new Set<string>());
    const [prevSelected, setPrevSelected] = useState<Set<string> | null>(null);

    const [tracks, setTracks] = useState<SpotifyApi.TrackObjectSimplified[] | null>(null);

    // if user tries to view results, fetch them from Spotify
    const handleViewClick = (index: number) => {
        if (index === 1 && isDemo) {
            setAlertText(Config.STATUS_MESSAGE.PLAYLIST_CREATED);
            return;
        }

        setViewIndex(index);

        const equalSets = prevSelected?.size === selected.size
            && [...selected].every((genre) => prevSelected.has(genre));
        const equalAttributes = isEqual(attributes, prevAttributes);
        if (index === 1 && (!equalSets || !equalAttributes)) {
            setPrevSelected(selected);
            setPrevAttributes(attributes);
            getRecommendations();
        }
    };

    const handlePlaylistOptions = async (index: number) => {
        if (index === 0) {
            if (!userInfo || !tracks) {
                return;
            }

            const response = await createPlaylist(userInfo.id, 'tonedeaf tuner tracks', tracks);

            if (response) setAlertText(Config.STATUS_MESSAGE.PLAYLIST_CREATED);
        } else {
            getRecommendations();
        }
    };

    const getRecommendations = async () => {
        const recs = await getAttributeRecs([...selected], attributes);
        setTracks(recs);
    };

    const handleGenreClick = (event: MouseEvent<HTMLSpanElement>) => {
        const genre = event.currentTarget.id;

        setSelected((previous) => {
            if (previous.has(genre)) {
                // Keep the selection used by the last request intact for comparison.
                const next = new Set(previous);
                next.delete(genre);
                return next;
            }

            return previous.size < 5 ? new Set(previous).add(genre) : previous;
        });
    };

    // Adjust the lower bound when the range sliders cross.
    const handleAttributeChange = (id: string, value: number, type: 'min' | 'max') => {
        setAttributes((prev) => {
            const temp = { ...prev };
            if (type === 'max') {
                temp['max_' + id] = value;
            }
            if (type === 'min' || temp['max_' + id] < temp['min_' + id]) {
                temp['min_' + id] = value;
            }
            return temp;
        });
    };

    const getGenreButton = (genre: string) => {
        const exists = selected.has(genre);
        const selectedClass = exists ? 'selected' : '';
        const text = exists ? CHECK : null;
        return (
            <span onClick={handleGenreClick} id={genre} key={genre}>
                <button className={'text-btn bold ' + selectedClass}>
                    {genre} {text}
                </button>
            </span>
        );
    };

    const getView = () => {
        let view: ReactElement | null = null;
        switch (viewIndex) {
            default: // always show genres and attributes page by default
                view = (
                    <>
                        <Options
                            title='Choose up to 5 Genres'
                            className='genres-panel'
                            subtitle={<div className='buttons'>{genreSeeds?.map(getGenreButton)}</div>}
                        />
                        <hr />
                        <Options
                            title='Edit your preferred song attributes'
                            description='Choose the minimum and maximum ranges for specific attributes'
                            subtitle={DEFAULT_ATTRIBUTES?.map((attr) => (
                                <AttributeInput
                                    {...attr}
                                    userMin={attributes['min_' + attr.id]}
                                    userMax={attributes['max_' + attr.id]}
                                    onChange={handleAttributeChange}
                                    key={attr.id}
                                />
                            ))}
                        />
                    </>
                );
                break;
            case 1: // show tracks result or no results message
                view = tracks?.length ? (
                    <div className='cards'>
                        {tracks?.map((track, i) => (
                            <TrackCard track={{ ...track, rank: i + 1 }} key={track.name + i} />
                        ))}
                    </div>
                ) : (
                    <label className='medium bold'> No results found </label>
                );
                break;
        }

        return view;
    };

    return (
        <div className='page'>
            <div className='flex mobile-flex'>
                <Options
                    title='View'
                    options={selected.size ? VIEW_OPTIONS : VIEW_OPTIONS_TEMP}
                    onClick={handleViewClick}
                    index={viewIndex}
                />
                {tracks && viewIndex === 1 && (
                    <Options title='Like These Tracks?' options={PLAYLIST_OPTIONS} onClick={handlePlaylistOptions} />
                )}
            </div>
            {viewIndex === 0 && (
                <>
                    <hr />
                    <label className='medium bold'>
                        Find song recommendations based on your preferred genres and song attributes.
                    </label>
                </>
            )}
            {(viewIndex === 0 && genreSeeds) || (viewIndex === 1 && tracks) ? getView() : <Load />}
        </div>
    );
};
