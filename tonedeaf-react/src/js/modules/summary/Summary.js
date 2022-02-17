import { useState, useMemo  } from 'react';
import { useArtistsAndGenres, useTracksAndFeatures } from '../../hooks/SpotifyHooks';
import ImageWrapper from '../ui/ImageWrapper';
import Chart from './Chart';
import Load from '../ui/Load';

import DEFAULTS from '../../util/Defaults';

const Summary = ({ setNavIndex }) => {
  const [timeFrameIndex, setTimeFrameIndex] = useState(2);
  const artistsInfo = useArtistsAndGenres(timeFrameIndex);
  const tracksInfo = useTracksAndFeatures(timeFrameIndex);

  const topArtists = useMemo(() => {
    let artists = [];
    if(artistsInfo) {
      for(let i = 0; i < DEFAULTS.LIMIT; i++) {
        let artist = artistsInfo?.artists?.[i];
        artists.push(<ImageWrapper src={artist?.images?.[0]?.url} nohover key={i}/>)
      }
    }
    return artists;
  }, [artistsInfo]);

  const topTracks = useMemo(() => {
    let tracks = [];
    if(tracksInfo) {
      for(let i = 0; i < DEFAULTS.LIMIT; i++) {
        let track = tracksInfo?.tracks?.[i];
        tracks.push(<ImageWrapper src={track?.album?.images?.[0]?.url} nohover key={i}/>)
      }
    }
    return tracks;
  }, [tracksInfo]);

  const topGenres = useMemo(() => {
    let genres = [];
    let first = artistsInfo?.genres?.[0];
    if(first) {
      genres.push(
        <span className="flex" key={0}> 
          <label className="flex large bold"> You listened to {first.total} genres </label>
        </span>
      );

      for(let i = 0; i < 5; i++) {
        let item = artistsInfo.genres?.[i + 1];
        genres.push(
          <label className="flex big bold" key={i + 1}> 
            {item.genre}
            <span className="flex bold"> {(item.total / first.total * 100).toFixed(1)}% </span>
          </label>
        );
      }
    }
    return genres;
  }, [artistsInfo]);

  return (
    (artistsInfo && tracksInfo) ? (
      <div className="page summary flex-col flex-fill">
        <label className="large bold"> Your Last 4 Weeks </label>
        <div className="flex-split">
          <div className="blocks flex-col">
            <div className="block-4" onClick={() => setNavIndex(1)}>
              {topArtists}
            </div>
            <div className="block-4"  onClick={() => setNavIndex(2)}>
              {topTracks}
            </div>
          </div>
          <div className="flex-col flex-fill stats">
            <div className="flex-col genre-percents">
              {topGenres}
              <button className="text-btn medium" onClick={() => setNavIndex(1)}> see more </button>
            </div>
            <div className="flex-col">
              <label className="flex big bold">
                Beats Per Minute
                <span className="flex bold"> {tracksInfo.averages.tempo.total} </span>
              </label>
              <label className="flex big bold">
                Song Length
                <span className="flex bold"> {tracksInfo.averages.duration.total}s </span>
              </label>
            </div>
            <Chart averages={tracksInfo.averages} display={DEFAULTS.CHART_COLS}/>
          </div>
        </div>
      </div>
    ) : (
      <Load/>
    )
  )
}

export default Summary;