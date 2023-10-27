import { useState } from 'react';
import { useDownload } from '../../util/DownloadUtil.js';
import ArtistSummary from './ArtistsSummary.js';
import TracksSummary from './TracksSummary.js';

import Options from '../ui/Options.js';

import DEFAULTS from '../../util/Defaults.js';

const Summary = ({ setNavIndex }) => {
  const [timeFrameIndex, setTimeFrameIndex] = useState(DEFAULTS.TIME_FRAME_INDEX); // long term by default

  const { exportRef, shareImage, downloadImage } = useDownload();
  const handledownloadClick = (index) => {
    if(index === 0) {
      shareImage(true);
    } else {
      downloadImage()
    }
  }


  return (
    <div className="page summary flex-fill" >
      <div className="flex mobile-flex" data-html2canvas-ignore>
        <Options title="Your Summary" options={DEFAULTS.TIME_OPTIONS} onClick={setTimeFrameIndex} index={timeFrameIndex}/>
        <Options title="Share" className="mobile-share-options" options={DEFAULTS.DOWNLOAD_OPTIONS.slice(0,2)} onClick={handledownloadClick}/>
      </div>
      <div className="flex-col" ref={exportRef}>
        <header className="flex flex-middle flex-space-between">
          <label className="large bold"> In the last {DEFAULTS.SUMMARY_TEXT[timeFrameIndex]}... </label>
        </header>
        <ArtistSummary index={timeFrameIndex} onClick={() => setNavIndex(1)}/>
        <TracksSummary index={timeFrameIndex} onClick={() => setNavIndex(2)}/>
      </div>
    </div>
  )
}

export default Summary;