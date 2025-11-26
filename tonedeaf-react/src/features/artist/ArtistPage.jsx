import { useState } from 'react';
import { useArtistsAndGenres } from '~/hooks/SpotifyHooks.ts';

import { Options } from '~/components/Options.jsx';
import { ImageWrapper } from '~/components/ImageWrapper';
import { ArtistCard } from './ArtistCard';

import { Load } from '~/components/Load.jsx';
import { CHECK } from '~/util/IconUtil.jsx';

import { Config } from '~/util/Config.js';
import { useArtistViewState } from '~/hooks/useArtistViewState.js';
import { useArtistGenre } from '~/hooks/useArtistGenre.js';

/*
  Displays list of users top artists from a selected time range
*/
export const ArtistPage = ({ onDownloadClick = null, exportRef = null }) => {
    const { artistGenre, setArtistGenre } = useArtistGenre();
    const {
        artistTimeFrameIndex: timeFrameIndex,
        artistViewIndex: viewIndex,
        setArtistTimeFrameIndex: setTimeFrameIndex,
        setArtistViewIndex: setViewIndex,
    } = useArtistViewState();
    const info = useArtistsAndGenres(timeFrameIndex, artistGenre);
    const [overflowVisible, setOverflowVisible] = useState(false);

    // filter artists by user selected genre
    const handleGenreClick = (event) => {
        setArtistGenre(event.currentTarget.id);
    };

    // if an artist's image is pressed in the grid view, display location of artist in list view
    const handleArtistClick = () => {
        setViewIndex(1);
    };

    const getGenreButton = (option, i) => {
        const equal = option.genre === artistGenre;
        const overflow = i >= 20 ? 'overflow' : '';
        const selected = equal ? 'selected' : '';
        const total = option.total > 1 ? `(${option.total})` : '';
        const text = equal ? CHECK : null;
        return (
            <span className={overflow} onClick={handleGenreClick} id={option.genre} key={option.genre}>
                <button className={'text-btn bold ' + selected}>
                    {option.genre} {total} {text}
                </button>
            </span>
        );
    };

    const getOverflowButton = () => {
        const handleOverflowClick = () => {
            setOverflowVisible(!overflowVisible);
        };

        const elipses = overflowVisible ? null : <label className='mobile'> ... </label>;
        const text = overflowVisible ? 'Hide' : 'Show';
        return (
            <>
                {elipses}
                <button className='overflow-btn text-btn bold mobile' onClick={handleOverflowClick}>
                    {text} More Genres
                </button>
            </>
        );
    };

    const getView = () => {
        switch (viewIndex) {
            default: // display grid view by default
                return (
                    <div className='images' ref={exportRef} data-testid={`grid-${timeFrameIndex}`}>
                        {info?.artists?.map((artist, i) => (
                            <ImageWrapper
                                src={artist?.images?.[0]?.url}
                                title={i + 1 + '. ' + artist?.name}
                                url={'#' + artist?.name + (i + 1)}
                                onClick={handleArtistClick}
                                key={artist?.name + i}
                            />
                        ))}
                    </div>
                );
            case 1: // display list view
                return (
                    <div className='cards' ref={exportRef} data-testid={`list-${timeFrameIndex}`}>
                        {info?.artists?.map((artist, i) => (
                            <ArtistCard artist={artist} key={artist?.name + i} />
                        ))}
                    </div>
                );
            case 2: // display stats
                return <></>;
        }
    };

    const genreButtons = (
        <>
            <div className={'buttons overflow-' + overflowVisible} data-testid={`genres-${timeFrameIndex}`}>
                {info?.genres?.map(getGenreButton)}
            </div>
            {getOverflowButton()}
        </>
    );

    return (
        <div className='page'>
            <header className='flex flex-wrap mobile-flex'>
                <Options
                    title='Your Top Artists'
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
            </header>
            {(viewIndex === 0 || viewIndex === 1) && (
                <Options
                    title='Genres'
                    className='genres-panel'
                    description='Select any genre to filter artists:'
                    subtitle={genreButtons}
                />
            )}
            {info?.artists ? getView() : <Load />}
        </div>
    );
};
