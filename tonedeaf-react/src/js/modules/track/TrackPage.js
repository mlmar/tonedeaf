import { cache } from '../../util/Session.js';
import { useTracksAndFeatures } from '../../hooks/SpotifyHooks.js';
import { createPlaylist } from '../../util/SpotifyUtil.js';
import { useAlert } from '../../hooks/AlertHooks.js';
import { useDownload, dataToTextList } from '../../util/DownloadUtil.js';

import Options from '../ui/Options.js';
import ImageWrapper from '../ui/ImageWrapper.js';
import TrackCard from './TrackCard.js';

import Load from '../ui/Load.js';

import DEFAULTS from '../../util/Defaults.js';

/*
  Display user's top tracks from a selected time range
*/
const TrackPage = ({ viewIndex, setViewIndex, timeFrameIndex, setTimeFrameIndex }) => {
  const { setAlertText, setAlertVisible, alertElement } = useAlert("Playlist Created");
  const info = useTracksAndFeatures(timeFrameIndex);

  const { exportRef, shareImage, downloadImage, shareText } = useDownload();
  const handledownloadClick = (index) => {
    if(index === 0) {
      shareImage(DEFAULTS.SHARE_TEXT_TRACKS[timeFrameIndex]);
    } else if(index === 1) {
      downloadImage();
    } else {
      shareText(dataToTextList(info.tracks), () => {
        setAlertText("Copied to clipboard");
        setAlertVisible(true);
      });
    }
  }
  
  const handleCreatePlaylist = async () => {
    const id = cache["userInfo"]?.id;
    const response = await createPlaylist(id, "tonedeaf top tracks", info?.tracks);
    if(response?.status === "demo") setAlertText("Sign in to use this feature");
    if(response) setAlertVisible(true);
  }

  // if an tracks's image is pressed in the grid view, display location of track in list view
  const handleTrackClick = () => {
    setViewIndex(1);
  }

  const getView = () => {
    let view = null;
    switch(viewIndex) {
      default: // display grid view by default
        view = (
          <div className="images" ref={exportRef}>
            { info?.tracks?.map((track,i) => 
              <ImageWrapper 
                src={track?.album?.images?.[0]?.url} 
                title={i+1 + ". " + track?.name} 
                url={"#" + track?.name + (i+1)} 
                onClick={handleTrackClick}
                key={track?.name + i} 
              /> 
            )}
          </div>
        )
        break;
      case 1: // display list view
        view = (
          <div className="cards" ref={exportRef}>
            { info?.tracks?.map((track, i) => <TrackCard {...track} features={info.features?.[i]} rank={i+1} key={track?.name + i}/>)}
          </div>
        )
        break;
      case 2: // display stats
        view = <></>
        break;
    }

    return view
  }

  return (
    <div className="page">
      {alertElement}
      <header className="flex flex-wrap mobile-flex">
        <Options title="Your Top Tracks" options={DEFAULTS.TIME_OPTIONS} onClick={setTimeFrameIndex} index={timeFrameIndex}/>
        <Options title="View" options={DEFAULTS.VIEW_OPTIONS} onClick={setViewIndex} index={viewIndex}/>
        <Options title="Share" className="mobile-share-options" options={DEFAULTS.DOWNLOAD_OPTIONS} onClick={handledownloadClick}/>
        { (viewIndex === 0 || viewIndex === 1) &&
          <Options title="Like These Tracks?" options={["Create Playlist"]} onClick={handleCreatePlaylist}/>
        }
      </header>
      { info ? (
          getView()
        ) : (
          <Load/>
        )
      }
    </div>
  )

}

export default TrackPage;