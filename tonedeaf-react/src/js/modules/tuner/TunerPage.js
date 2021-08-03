import { useState, useEffect, useRef } from 'react';
import { cache } from '../../util/Session.js';
import { fetchSeeds } from '../../util/DataUtil.js';
import { getAttributes, getAttributeRecs, createPlaylist } from "../../util/SpotifyUtil.js";

import Options from '../ui/Options.js';
import Alert from '../ui/Alert.js';
import AttributeInput from './AttributeInput.js';
import TrackCard from '../track/TrackCard.js';

import Load from '../ui/Load.js';

const VIEW_OPTIONS = ["Attributes", "Recommendations"];
const VIEW_OPTIONS_TEMP = ["Attributes"];
const CHECK = <> &#10003; </>;

/*
  Users can select up to 5 genres and edit preferred track attributes to get song recommendations
*/
const TunerPage = () => {
  const [viewIndex, setViewIndex] = useState(0);
  const [genreSeeds, setGenreSeeds] = useState(null);
  const [attributes, setAttributes] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [tracks, setTracks] = useState(null);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertText, setAlertText] = useState("Playlist Created");

  const attributeParams = useRef({});
  
  // get list of genres
  useEffect(() => {
    const fetch = async () => {
      const seeds = await fetchSeeds();
      setGenreSeeds(seeds);
    }

    fetch();
    setAttributes(getAttributes());
  }, [])

  useEffect(() => {
    if(cache["demo"]) {
      setAlertText("Sign in to use this feature");
      setAlertVisible(true);
      return;
    }
  }, []);

  // if user tries to view results, fetch them from Spotify
  const handleViewClick = (index) => {
    if(index === 1 && cache["demo"]) {
      setAlertVisible(true);
      return;
    }

    setViewIndex(index);

    if(index === 1) {
      const fetchResults = async () => {
        let _selected = [];
        selected?.forEach((genre) => {
          _selected.push(genre);
        });
        const recs = await getAttributeRecs(_selected, attributeParams.current);
        setTracks(recs);
      }
      fetchResults();
    }
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
    * this is also called upon initialization of the AttributeInput component so attributeParams.current is filled by default
  */
  const handleAttributeChange = (id, min, max) => {
    attributeParams.current["min_" + id] = min;
    attributeParams.current["max_" + id] = max;
  }

  const handleCreatePlaylist = async () => {
    const id = cache["userInfo"]?.id;
    const response = await createPlaylist(id, "tonedeaf tuner tracks", tracks);
    if(response) setAlertVisible(true);
  }

  const handleAlertClick = () => {
    setAlertVisible(false);
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
            <Options title="Choose up to 5 Genres" className="genres-panel">
              <div className="buttons">
                { genreSeeds?.map(getGenreButton)}
              </div>
            </Options>
            <hr/>
            <Options title="Edit your preferred song attributes" description="Choose the minimum and maximum ranges for specific attributes">
              { attributes?.map((attribute) => <AttributeInput {...attribute} onChange={handleAttributeChange} key={attribute.id}/>)}
            </Options>
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
      <Alert visible={alertVisible} onClick={handleAlertClick}> {alertText} </Alert>
      <div className="flex mobile-flex">
        <Options title="View" options={selected.size ? VIEW_OPTIONS : VIEW_OPTIONS_TEMP} onClick={handleViewClick} index={viewIndex}/>
        { (tracks && viewIndex === 1) &&
          <Options title="Like These Tracks?" options={["Create Playlist"]} onClick={handleCreatePlaylist}/>
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