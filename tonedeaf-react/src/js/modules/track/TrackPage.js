import { useState, useEffect } from 'react';
import { cache } from '../../util/Session.js';
import { fetchTracksAndFeatures } from '../../util/DataUtil.js';
import { createPlaylist } from '../../util/SpotifyUtil.js';

import Options from '../ui/Options.js';
import Alert from '../ui/Alert.js';
import ImageWrapper from '../ui/ImageWrapper.js';
import TrackCard from './TrackCard.js';

import Load from '../ui/Load.js';

const TIME_OPTIONS = ["Long Term", "6 Months", "1 Month"];
const VIEW_OPTIONS = ["Grid", "List"]

/*
  Display user's top tracks from a selected time range
*/
const TrackPage = () => {
  const [timeFrameIndex, setTimeFrameIndex] = useState(0); // long term by default
  const [viewIndex, setViewIndex] = useState(0); // 0 = grid, 1 = list, 2 = stats

  const [info, setInfo] = useState(null);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertText, setAlertText] = useState("Playlist Created");

  // get top tracks
  useEffect(() => {
    const fetch = async () => {
      const response = await fetchTracksAndFeatures(timeFrameIndex);
      setInfo(response);
    }
    fetch();
  },[timeFrameIndex])

  const handleCreatePlaylist = async () => {
    const id = cache["userInfo"]?.id;
    const response = await createPlaylist(id, "tonedeaf top tracks", info?.tracks);
    if(response?.status === "demo") setAlertText("Sign in to use this feature")
    if(response) setAlertVisible(true);
  }

  const handleAlertClick = () => {
    setAlertVisible(false);
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
          <div className="images">
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
          <div className="cards">
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
      <Alert visible={alertVisible} onClick={handleAlertClick}> {alertText} </Alert>
      <div className="flex mobile-flex">
        <Options title="Your Top Tracks" options={TIME_OPTIONS} onClick={setTimeFrameIndex} index={timeFrameIndex}/>
        <Options title="View" options={VIEW_OPTIONS} onClick={setViewIndex} index={viewIndex}/>
        { (viewIndex === 0 || viewIndex === 1) &&
          <Options title="Like These Tracks?" options={["Create Playlist"]} onClick={handleCreatePlaylist}/>
        }
      </div>
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