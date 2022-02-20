import ArtistSummary from './ArtistsSummary';
import TracksSummary from './TracksSummary';

const Summary = ({ setNavIndex }) => {
  return (
    <div className="page summary flex-col flex-fill restrict">
      <label className="large bold flex flex-fill"> In the last month... </label>
      <ArtistSummary onClick={() => setNavIndex(1)}/>
      <TracksSummary onClick={() => setNavIndex(2)}/>
    </div>
  )
}

export default Summary;