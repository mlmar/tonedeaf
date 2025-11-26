import { ImageWrapper } from '~/components/ImageWrapper';

import ICON from '~/icons/SpotifyGreen.png';

type ArtistCardProps = {
    artist: {
        external_urls: {
            spotify: string | null | undefined;
        };
        followers: {
            href: string | null | undefined;
            total: number;
        };
        genres: string[];
        href: string | null | undefined;
        id: string | null | undefined;
        images:
            | {
                  height: number;
                  url: string;
                  width: number;
              }[]
            | null
            | undefined;
        name: string | null | undefined;
        popularity: number;
        type: string | null | undefined;
        uri: string | null | undefined;
        rank?: number;
    };
    className?: string;
    imageClick?: boolean;
    onClick?: (props: {
        images: SpotifyApi.ArtistObjectFull['images'] | null | undefined;
        name: SpotifyApi.ArtistObjectFull['name'] | null | undefined;
        id: SpotifyApi.ArtistObjectFull['id'] | null | undefined;
        type: string;
    }) => void;
};

export const ArtistCard = ({ artist, className = '', onClick, imageClick = false }: ArtistCardProps) => {
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        const isSpotify = (event.target as HTMLElement).id === 'spotify';
        if (onClick && !isSpotify)
            onClick({
                images: artist.images,
                name: artist.name,
                id: artist.id,
                type: 'artist',
            });
    };

    const name = artist.rank ? artist.rank + '. ' + artist.name : artist.name;
    const id = artist.name ? artist.name + artist.rank : undefined;
    return (
        <div className={'artist-card flex ' + className} id={id} onClick={handleClick}>
            <ImageWrapper src={artist.images?.[0]?.url} title={name ?? ''} nohover={!imageClick} />
            <div className='description flex-col'>
                <label className='large bold'> {name} </label>
                {/* <label className="medium"> {artist.followers?.total?.toLocaleString()} followers </label> */}
                <label className='medium inactive'>{artist.genres?.join(', ')}</label>
                <div className='flex-col flex-fill flex-reverse'>
                    <ImageWrapper
                        className='icon'
                        src={ICON}
                        title={`Open ${artist.name} in Spotify`}
                        url={artist.uri}
                        id='spotify'
                        nohover
                    />
                </div>
            </div>
        </div>
    );
};
