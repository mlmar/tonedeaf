import { useState, useEffect, useRef } from 'react';

import { fetchNowPlaying } from '../../util/DataUtil.js';
import ImageWrapper from '../ui/ImageWrapper.js';

import ICON from "../../../icons/SpotifyGreen.png";

const TIME = 10000;

const NowPlaying = ({ onLogout }) => {
  const [track, setTrack] = useState(null);
  const fetchInterval = useRef(null);

  // since promise may resolve after component is unmounted, toggle a flag upon mounting
  const mounted = useRef(false);
  
  useEffect(() => {
    mounted.current = true;

    const fetch = async () => {
      const response = await fetchNowPlaying();
      if(mounted.current) setTrack(response);
    }
    
    fetch();
    
    fetchInterval.current = setInterval(fetchNowPlaying, TIME)
    return () => {
      mounted.current = false;
      clearInterval(fetchInterval.current);
    }
  }, [onLogout])

  return (
    <div className="now-playing">
      { track &&
        <>
            <ImageWrapper className="art" src={track?.image} alt={track?.title}  title={track?.title} nohover/>
            <div className="description flex-col">
              <label className="large bold"> {track?.title} </label>
              <label className="big bold"> {track?.artists?.join(", ")} </label>
              <div className="flex-col flex-fill flex-reverse"> <ImageWrapper className="icon" src={ICON} title={`Open ${track?.name} in Spotify`} url={track?.url} nohover/> </div>
            </div>
        </>
      }
    </div>
  )
}

export default NowPlaying;