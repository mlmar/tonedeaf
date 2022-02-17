import { useState  } from 'react';
import { cache } from '../../util/Session.js';
import { useRecent } from '../../hooks/SpotifyHooks.js'
import { createPlaylist } from '../../util/SpotifyUtil.js';
import { useAlert } from '../../hooks/AlertHooks.js';

import Options from "../ui/Options.js";
import ImageWrapper from '../ui/ImageWrapper.js';
import TrackCard from './TrackCard.js';

import Load from '../ui/Load.js';

import DEFAULTS from '../../util/Defaults.js';

/*
  Display users most recent 50 tracks
*/
const RecentPage = () => {
  const [viewIndex, setViewIndex] = useState(DEFAULTS.VIEW_INDEX); // 0 = grid, 1 = list
  const tracks = useRecent();

  const { setAlertText, setAlertVisible, alertElement } = useAlert("Playlist Created");

  const handleCreatePlaylist = async () => {
    const id = cache["userInfo"]?.id;
    const response = await createPlaylist(id, "tonedeaf recent tracks", tracks, true);
    if(response?.status === "demo") setAlertText("Sign in to use this feature")
    if(response) setAlertVisible(true);
  }

  // if an tracks's image is pressed in the grid view, display location of track in list view
  const handleTrackClick = () => {
    setViewIndex(1);
  }

  return (
    <div className="page">
      {alertElement}
      <div className="flex mobile-flex">
        <Options title="View" options={DEFAULTS.VIEW_OPTIONS} onClick={setViewIndex} index={viewIndex}/>
        <Options title="Like These Tracks?" options={["Create Playlist"]} onClick={handleCreatePlaylist}/>
      </div>
      { tracks ? (
          viewIndex === 0 ? (
            <div className="images">
              { tracks?.map((track,i) => 
                <ImageWrapper 
                  src={track?.track?.album?.images?.[0]?.url} 
                  title={i+1 + ". " + track?.track?.name} 
                  url={"#" + track?.track?.name + (i+1)} 
                  onClick={handleTrackClick}
                  key={track?.track?.name + i}
                /> 
              )}
            </div>
          ) : (
            <div className="cards">
              { tracks?.map((track,i) => 
                <TrackCard {...track?.track} rank={i+1} key={track?.track?.name + i} norank>
                  <label className="medium inactive"> Played on {new Date(track?.played_at).toDateString()} </label>
                </TrackCard>
              )}
            </div>
          )
        ) : (
          <Load/>
        )
      }
    </div>
  )
}

export default RecentPage;