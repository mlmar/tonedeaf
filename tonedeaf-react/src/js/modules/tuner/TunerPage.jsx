import { useState, useEffect } from 'react';
import { cache } from '../../util/Session.js';
import { fetchSeeds } from '../../util/DataUtil.js';
import { getDefaultAttributes, getParamAttributes, getAttributeRecs, createPlaylist } from "../../util/SpotifyUtil.js";
import { isEqual } from '../../util/ObjectUtil.js';

import Options from '../ui/Options.jsx';
import AttributeInput from './AttributeInput.jsx';
import TrackCard from '../track/TrackCard.jsx';

import Load from '../ui/Load.jsx';
import { CHECK } from '../../util/IconUtil.jsx';

import DEFAULTS from '../../util/Defaults.jsx';

const VIEW_OPTIONS = ["Attributes", "Recommendations"];
const VIEW_OPTIONS_TEMP = ["Attributes"];
const PLAYLIST_OPTIONS = ["Create Playlist", "Reroll"]

const DEFAULT_ATTRIBUTES = getDefaultAttributes();

/*
  Users can select up to 5 genres and edit preferred track attributes to get song recommendations
*/
const TunerPage = ({ setAlertText }) => {
  const [viewIndex, setViewIndex] = useState(0);
  const [genreSeeds, setGenreSeeds] = useState(null);

  const [attributes, setAttributes] = useState(getParamAttributes());
  const [prevAttributes, setPrevAttributes] = useState(null);

  const [selected, setSelected] = useState(new Set());
  const [prevSelected, setPrevSelected] = useState(null);
  
  const [tracks, setTracks] = useState(null);

  // display demo message
  useEffect(() => {
    if(cache["demo"]) {
      setAlertText("Sign in to use this feature");
      return;
    }
  }, [setAlertText]);
  
  // get list of genres
  useEffect(() => {
    const fetch = async () => {
      const seeds = await fetchSeeds();
      setGenreSeeds(seeds);
    }
    
    fetch();
  }, []);
  
  // if user tries to view results, fetch them from Spotify
  const handleViewClick = (index) => {
    if(index === 1 && cache["demo"]) {
      setAlertText(DEFAULTS.STATUS_MESSAGE.PLAYLIST_CREATED);
      return;
    }
    
    setViewIndex(index);
    
    const equalSets = (selected?.size === prevSelected?.size) && ([...selected].every((elem) => prevSelected?.has(elem)));
    const equalAttributes = isEqual(attributes, prevAttributes);
    if(index === 1 && (!equalSets || !equalAttributes)) {
      setPrevSelected(selected);
      setPrevAttributes(attributes);
      getRecommendations();
    }
  }

  const handlePlaylistOptions = async (index) => {
    if(index === 0) {
      const id = cache["userInfo"]?.id;
      const response = await createPlaylist(id, "tonedeaf tuner tracks", tracks);
      if(response) setAlertText(DEFAULTS.STATUS_MESSAGE.PLAYLIST_CREATED);
    } else {
      getRecommendations();
    }
  }
  
  const getRecommendations = async () => {
    let _selected = [];
    selected?.forEach((genre) => {
      _selected.push(genre);
    });
    const recs = await getAttributeRecs(_selected, attributes);
    setTracks(recs);
  }

  /*
    - if genre is not part of the selected set, add it, otherwise delete it
    - only allow 5 genres to be selected
  */
  const handleGenreClick = (event) => {
    const genre = event.currentTarget.id;
    if(selected.has(genre)) {
      setSelected((s) => {
        s.delete(genre);
        return new Set(s);
      });
    } else if(selected.size < 5) {
      setSelected((s) => new Set(s).add(genre));
    }
  }

  /*
    - callback function to be passed to AttributeInput component 
    - if user changes any of the input ranges for the attributes, save both min and max
    - prevent the max from ever being lower than the min
  */
  const handleAttributeChange = (id, value, type) => {
    setAttributes((prev) => {
      const temp = {...prev};
      if(type === "max") {temp["max_" + id] = value;}
      if(type === "min" || temp["max_" + id] < temp["min_" + id]) temp["min_" + id] = value;
      return temp;
    })
  }

  const getGenreButton = (genre) => {
    const exists = selected?.has(genre);
    let selectedClass = exists ? "selected" : "";
    let text = exists ? CHECK : null;
    return <span onClick={handleGenreClick} id={genre} key={genre}> <button className={"text-btn bold " + selectedClass}> {genre} {text} </button> </span>
  }

  const getView = () => {
    let view = null;
    switch(viewIndex) {
      default: // always show genres and attributes page by default
        view = (
          <>
            <Options title="Choose up to 5 Genres" className="genres-panel" subtitle={
                <div className="buttons">
                  { genreSeeds?.map(getGenreButton)}
                </div>
            }/>
            <hr/>
            <Options title="Edit your preferred song attributes" description="Choose the minimum and maximum ranges for specific attributes" subtitle={
              DEFAULT_ATTRIBUTES?.map((attr) => 
              <AttributeInput {...attr} 
                userMin={attributes["min_" + attr.id]} 
                userMax={attributes["max_" + attr.id]} 
                onChange={handleAttributeChange} 
                key={attr.id}/>
              )
            }/>
          </>
        )
        break;
      case 1: // show tracks result or no results message
        view = tracks?.length ? (
          <div className="cards">
            { tracks?.map((track, i) => <TrackCard {...track} rank={i+1} key={track?.name + i} norank nohover/>)}
          </div>
        ) : (
          <label className="medium bold"> No results found </label>
        )
        break;
    }

    return view;
  }

  return (
    <div className="page">
      <div className="flex mobile-flex">
        <Options title="View" options={selected.size ? VIEW_OPTIONS : VIEW_OPTIONS_TEMP} onClick={handleViewClick} index={viewIndex}/>
        { (tracks && viewIndex === 1) &&
          <Options title="Like These Tracks?" options={PLAYLIST_OPTIONS} onClick={handlePlaylistOptions}/>
        }
      </div>
      { (viewIndex === 0) &&
        <>
          <hr/>
          <label className="medium bold"> Find song recommendations based on your preferred genres and song attributes. </label>
        </>
      }
      { (viewIndex === 0 && genreSeeds) || (viewIndex === 1 && tracks) ? (
          getView()
        ) : (
          <Load/>
        )
      }
    </div>
  )
}

export default TunerPage;
