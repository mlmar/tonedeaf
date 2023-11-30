import { useDownload } from '../../util/DownloadUtil.js';
import { useAlert } from '../../hooks/AlertHooks.js';
import ArtistSummary from './ArtistsSummary.js';
import TracksSummary from './TracksSummary.js';

import Options from '../ui/Options.js';

import DEFAULTS from '../../util/Defaults.js';

const Summary = (props) => {
  const { 
    setNavIndex, 
    timeFrameIndex, 
    setTimeFrameIndex, 
    setArtistTimeFrameIndex, 
    setArtistGenre, 
    setTrackTimeFrameIndex 
  } = props;

  const { setAlertText, alertElement } = useAlert(null);

  const { exportRef, shareImage, copyImage } = useDownload();
  const handledownloadClick = (index) => {
    if(index === 0) {
      shareImage();
    } else {
      copyImage();
      setAlertText(DEFAULTS.STATUS_MESSAGE.CLIPBOARD);
    }
  }

  const handleArtistClick = () => {
    setNavIndex(1);
    setArtistTimeFrameIndex(timeFrameIndex);
  }

  const handleArtistGenreClick = (genre) => {
    setNavIndex(1);
    setArtistGenre(genre);
    setArtistTimeFrameIndex(timeFrameIndex);

  }

  const handleTrackClick = () => {
    setNavIndex(2);
    setTrackTimeFrameIndex(timeFrameIndex);
  }

  return (
    <div className="page summary flex-fill" >
      {alertElement}
      <header className="flex flex-wrap mobile-flex" data-html2canvas-ignore>
        <Options title="Your Summary" options={DEFAULTS.TIME_OPTIONS} onClick={setTimeFrameIndex} index={timeFrameIndex}/>
        <Options title="Share" className="mobile-share-options" options={DEFAULTS.DOWNLOAD_OPTIONS} onClick={handledownloadClick}/>
      </header>
      <div className="flex-col" ref={exportRef}>
        <header className="flex flex-middle flex-space-between">
          <label className="large bold"> In the {DEFAULTS.SUMMARY_TEXT[timeFrameIndex]}... </label>
        </header>
        <ArtistSummary index={timeFrameIndex} onArtistClick={handleArtistClick} onGenreClick={handleArtistGenreClick}/>
        <TracksSummary index={timeFrameIndex} onClick={handleTrackClick}/>
      </div>
    </div>
  )
}

export default Summary;