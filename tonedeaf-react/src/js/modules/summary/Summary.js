import { useDownload } from '../../util/DownloadUtil.js';
import ArtistSummary from './ArtistsSummary.js';
import TracksSummary from './TracksSummary.js';

import Options from '../ui/Options.js';

import DEFAULTS from '../../util/Defaults.js';

const Summary = ({ setNavIndex }) => {
  const [exportRef, shareImage] = useDownload();
  const handledownloadClick = () => {
    shareImage();
  }

  return (
    <div className="page summary flex-fill" >
      <div className="flex-col" ref={exportRef}>
        <header className="flex flex-middle flex-space-between">
          <label className="large bold flex"> In&nbsp;the&nbsp;last&nbsp;month... </label>
          <Options options={DEFAULTS.DOWNLOAD_OPTIONS.slice(0,1)} onClick={handledownloadClick} data-html2canvas-ignore/>
        </header>
        <ArtistSummary onClick={() => setNavIndex(1)}/>
        <br></br>
        <TracksSummary onClick={() => setNavIndex(2)}/>
      </div>
    </div>
  )
}

export default Summary;