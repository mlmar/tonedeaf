import { useTracksAndFeatures } from '../../hooks/SpotifyHooks';
import ImageWrapper from '../ui/ImageWrapper';
import DEFAULTS from '../../util/Defaults';
import Chart from './Chart';

const TracksSummary = (props) => {
  const { onClick } = props;
  const tracksInfo = useTracksAndFeatures(2);

  const topTracks = () => {
    let tracks = [];
    let style = { flexBasis: (3 / DEFAULTS.TOP_IMAGES_LIMIT * 100) + '%' };
    if(tracksInfo) {
      for(let i = 0; i < DEFAULTS.TOP_IMAGES_LIMIT; i++) {
        let track = tracksInfo?.tracks?.[i];
        tracks.push(<ImageWrapper src={track?.album?.images?.[0]?.url} style={style} nohover key={i}/>)
      }
    }
    return tracks;
  }

  const topTrack = () => {
    let track = tracksInfo?.tracks?.[0];
    return (
      <div className="flex-col panel float-images">
        <p className="large bold inactive flex-fill"> <span className="white"> {track?.name} </span> was your number one track </p>
        <div className="flex">
          <ImageWrapper src={track?.album.images?.[0].url} nohover/>
          <div className="flex-wrap flex-fill" onClick={onClick}> {topTracks()} </div>
        </div>
      </div>
    )
  }

  const trackStats = () => {
    let averages = tracksInfo?.averages;
    if(averages) {
      return (
        <div className="flex-col panel">
          <p className="large bold inactive"> your top 50 tracks made for unique stats </p>
          <div className="flex-wrap  stats">
              <label className="flex-col big bold">
                beats per minute
                <span className="flex bold"> {averages.tempo.total} bpm </span>
              </label>
              <label className="flex-col big bold">
                song length
                <span className="flex bold"> {averages.duration.total} s </span>
              </label>
              <label className="flex-col big bold">
                popularity
                <span className="flex bold"> {averages.popularity.total} / 100 </span>
              </label>
          </div>
          <Chart className="flex-fill" averages={averages} display={DEFAULTS.CHART_COLS}/>
        </div>
      );
    }
  }


  return tracksInfo ? (
    <>
      <div className="flex-col">
        {topTrack()}
      </div>
      <div className="flex-col">
        {trackStats()}
      </div>
    </>

  ) : null
}

export default TracksSummary;