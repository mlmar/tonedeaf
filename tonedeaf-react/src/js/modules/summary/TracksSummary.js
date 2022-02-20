import { useTracksAndFeatures } from '../../hooks/SpotifyHooks';
import ImageWrapper from '../ui/ImageWrapper';
import DEFAULTS from '../../util/Defaults';
import Chart from './Chart';
import Load from '../ui/Load';

const TracksSummary = (props) => {
  const { onClick } = props;
  const tracksInfo = useTracksAndFeatures(2);

  const topTracks = () => {
    let tracks = [];
    let style = { flexBasis: 1 / DEFAULTS.TOP_IMAGES_LIMIT * 100 + '%' };
    if(tracksInfo) {
      for(let i = 1; i < DEFAULTS.TOP_IMAGES_LIMIT; i++) {
        let track = tracksInfo?.tracks?.[i];
        tracks.push(<ImageWrapper src={track?.album?.images?.[0]?.url} style={style} nohover key={i}/>)
      }
    }
    tracks.push(<div className="plus-btn medium" style={style} key={DEFAULTS.TOP_IMAGES_LIMIT}></div>);
    return tracks;
  }

  const topTrack = () => {
    let track = tracksInfo?.tracks?.[0];
    return (
      <div className="flex">
        <ImageWrapper src={track?.album.images?.[0].url} nohover/>
        <p className="large bold inactive panel flex-fill"> <span className="white"> {track?.name} </span> was your number one track </p>
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
    <div className="flex-col">
      {topTrack()}
      {trackStats()}
      <div className="flex-wrap float-images" onClick={onClick}> {topTracks()} </div>
    </div>
  ) : (
    <Load/>
  )
}

export default TracksSummary;