import ArtistSummary from './ArtistsSummary';
import TracksSummary from './TracksSummary';

const Summary = ({ setNavIndex }) => {
  const handledownloadClick = () => {

  }

  return (
    <div className="page summary flex-col flex-fill">
      <label className="large bold flex"> In the last month... </label>
      <ArtistSummary onClick={() => setNavIndex(1)}/>
      <TracksSummary onClick={() => setNavIndex(2)}/>
    </div>
  )
}

export default Summary;