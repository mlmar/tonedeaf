import { ImageWrapper } from '~/components/ImageWrapper';
import { Load } from '~/components/Load.jsx';
import { useNowPlaying } from '~/hooks/SpotifyHooks';
import ICON from '~/icons/SpotifyGreen.png';

/*
  Displays currently playing track or last played track

  widget    :   compact widget for scope page
  onChange  :   on track change, the track is passed as argument
*/
export const NowPlaying = ({ widget, children }) => {
    const track = useNowPlaying();

    if (!widget) {
        return track ? (
            <div className='now-playing'>
                <ImageWrapper src={track?.image} alt={track?.title} title={track?.title} nohover />
                <div className='description flex-col'>
                    <label className='large bold'> {track?.title} </label>
                    <label className='big bold'>{track?.artists?.join(', ')}</label>
                    <div className='flex-col flex-fill flex-reverse'>
                        <ImageWrapper
                            className='icon'
                            src={ICON}
                            title={`Open ${track?.name} in Spotify`}
                            url={track?.url}
                            nohover
                        />
                    </div>
                </div>
            </div>
        ) : (
            <Load />
        );
    } else {
        return track?.playing === true ? (
            <div className='now-playing-widget flex-col'>
                <label className='bold medium title'> Now Playing </label>
                <span>{children}</span>
                <div className='flex'>
                    <ImageWrapper src={track?.image} alt={track?.title} title={track?.title} nohover />
                    <div className='description flex-col'>
                        <label className='big bold'> {track?.title} </label>
                        <label className='medium'>{track?.artists?.join(', ')}</label>
                        <div className='flex-col flex-fill flex-reverse'>
                            <ImageWrapper
                                className='icon'
                                src={ICON}
                                title={`Open ${track?.name} in Spotify`}
                                url={track?.url}
                                nohover
                            />
                        </div>
                    </div>
                </div>
            </div>
        ) : null;
    }
};
