import { useTracksAndFeatures } from '../../hooks/SpotifyHooks';
import ImageWrapper from '../ui/ImageWrapper';
import DEFAULTS from '../../util/Defaults';
import Chart from './Chart';

const TracksSummary = (props) => {
  const { index,onClick } = props;
  const tracksInfo = useTracksAndFeatures(index);

  const topTracks = () => {
    let tracks = [];
    let style = { flexBasis: (DEFAULTS.TOP_IMAGES_ROWS / DEFAULTS.TOP_IMAGES_LIMIT * 100) + '%' };
    if(tracksInfo) {
      for(let i = 1; i < DEFAULTS.TOP_IMAGES_LIMIT+1; i++) {
        let track = tracksInfo?.tracks?.[i];
        tracks.push(<ImageWrapper src={track?.album?.images?.[0]?.url} style={style} key={i}/>)
      }
    }
    return tracks;
  }

  const topTrack = () => {
    let track = tracksInfo?.tracks?.[0];
    return (
      <>
        <p className="panel large bold inactive"> <span className="white"> {track?.name} </span> was your number one track </p>
        <div className="flex-col float-images" onClick={onClick}>
          <div className="flex">
            <ImageWrapper src={track?.album.images?.[0].url} />
            <div className="flex-wrap flex-fill"> {topTracks()} </div>
          </div>
        </div>
      </>
    )
  }

  const trackStats = () => {
    let averages = tracksInfo?.averages;
    if(averages) {
      return (
        <div className="flex-col panel">
          <div className="stats list">
            {
              tracksInfo?.tracks?.slice(0,6).map((track,i) => <label className="flex big bold" onClick={onClick} key={i+track.name}> <span>{i + 1}.</span> {track.name} </label>)
            }
          </div>
          <p className="large bold inactive"> the stats from your top 50 tracks </p>
          <div className="flex-wrap  stats">
              <label className="flex-col big bold">
                <span> beats per minute </span>
                <span className="flex bold"> {averages.tempo.total} bpm </span>
              </label>
              <label className="flex-col big bold">
                <span> song length </span>
                <span className="bold"> {averages.duration.total} s </span>
              </label>
              <label className="flex-col big bold">
                <span> popularity </span>
                <span className="bold"> {averages.popularity.total} / 100 </span>
              </label>
          </div>
          <Chart className="flex-fill" averages={averages} display={DEFAULTS.CHART_COLS}/>
        </div>
      );
    }
  }


  return tracksInfo ? (
    <>
      {topTrack()}
      {trackStats()}
    </>

  ) : null
}

export default TracksSummary;