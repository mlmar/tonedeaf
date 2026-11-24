import { useState } from 'react';

import { ImageWrapper } from '~/components/ImageWrapper';
import type { TrackDetails } from '~/util/SpotifyUtil';

import ICON from '~/icons/SpotifyGreen.png';

type TrackCardProps = {
    track: TrackDetails & { rank?: number };
    features?: {
        danceability: number;
        energy: number;
        key: number;
        loudness: number;
        mode: number;
        speechiness: number;
        acousticness: number;
        instrumentalness: number;
        liveness: number;
        valence: number;
        tempo: number;
        type: string;
        id: string;
        uri: string;
        track_href: string;
        analysis_url: string;
        duration_ms: number;
        time_signature: number;
    };
    className?: string;
    imageClick?: boolean;
    onClick?: (props: TrackCardProps['track'] & { type: string }) => void;
    children?: React.ReactNode;
};

export const TrackCard = ({
    className = '',
    children,
    track,
    features,
    onClick,
    imageClick = false,
}: TrackCardProps) => {
    const [visible, setVisibile] = useState(false);

    const handleVisibile = () => {
        setVisibile(!visible);
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        const isSpotify = (event.target as HTMLElement).id === 'spotify';
        if (onClick && !isSpotify) onClick({ ...track, type: 'track' });
    };

    const name = track.rank ? track.rank + '. ' + track.name : track.name;

    return (
        <div className={'track-card flex-col ' + className} id={track.name + track.rank} onClick={handleClick}>
            <div className='flex'>
                <ImageWrapper src={track.album?.images?.[0]?.url} title={name} nohover={!imageClick} />
                <div className='description flex-col'>
                    <div className='flex-col labels'>
                        <label className='large bold'> {name} </label>
                        <label className='medium'>{track.artists?.map((artist) => artist.name).join(', ')}</label>
                        <label className='medium inactive'>{track.album?.release_date?.split('-')[0]}</label>
                        {children}
                        <div className='flex-col flex-fill flex-reverse'>
                            <ImageWrapper
                                className='icon'
                                src={ICON}
                                title={`Open ${track.name} in Spotify`}
                                url={track.album?.uri}
                                id='spotify'
                                nohover
                            />
                        </div>
                    </div>
                    {features && <button onClick={handleVisibile}>{visible ? 'Hide' : 'Show'} Attributes</button>}
                </div>
            </div>
            {visible && (
                <div className='grid'>
                    {features &&
                        FEATURES_LIST.map(([key, name]) => {
                            return (
                                <label className='flex-split small' data-testid={key} key={key}>
                                    <span className='bold'> {name} </span>
                                    <> {features[key]} </>
                                </label>
                            );
                        })}
                    <label className='flex-split small'>
                        <span className='bold'> Popularity </span>
                        {track.popularity}
                    </label>
                </div>
            )}
        </div>
    );
};

const FEATURES_LIST = [
    ['acousticness', 'Acousticness'],
    ['danceability', 'Danceability'],
    ['duration_ms', 'Duration'],
    ['energy', 'Energy'],
    ['instrumentalness', 'Instrumentalness'],
    ['liveness', 'Liveness'],
    ['loudness', 'Loudness'],
    ['mode', 'Mode'],
    ['speechiness', 'Speechiness'],
    ['tempo', 'Tempo'],
    ['time_signature', 'Time Signature'],
    ['valence', 'Valence'],
] as const;

TrackCard.FEATURES_LIST = FEATURES_LIST;
