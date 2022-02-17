import { useState, useEffect, useRef } from 'react';
import { cache } from '../../util/Session.js';
import { search, getSearchRecs, createPlaylist } from '../../util/SpotifyUtil.js';
import { useAlert } from '../../hooks/AlertHooks.js';

import Options from '../ui/Options.js';
import ImageWrapper from '../ui/ImageWrapper.js';
import ArtistCard from '../artist/ArtistCard.js';
import TrackCard from '../track/TrackCard.js';
import NowPlaying from '../user/NowPlaying.js';

import Load from '../ui/Load.js';

const VIEW_OPTIONS = ["Search", "Recommendations"];
const VIEW_OPTIONS_TEMP = ["Search"];
const SEARCH_OPTIONS = ["Artists", "Tracks"]

const PLAYLIST_OPTIONS = ["Create Playlist", "Reroll"];
const PLAYLIST_OPTIONS_TEMP = ["Create Playlist"];

const SEARCH_TIMEOUT = 500;

/*
Find song recommendations by choosing a combination of >5 artists/tracks
*/
const Scope = () => {
  const [viewIndex, setViewIndex] = useState(0);
  const [searchIndex, setSearchIndex] = useState(0);
  const [searchResults, setSearchResults] = useState(null);
  const [selected, setSelected] = useState([]);
  const [prevSeleected, setPrevSelected] = useState(null);
  const [tracks, setTracks] = useState(null);
  
  const [searchInput, setSearchInput] = useState("");
  const searchTimer = useRef(null);
  const nowPlayingTrack = useRef(null); // store currently playing track
  
  const { setAlertText, setAlertVisible, alertElement } = useAlert("Playlist Created");
  useEffect(() => {
    if(cache["demo"]) {
      setAlertText("Sign in to use this feature");
      setAlertVisible(true);
      setSearchResults([]);
      return;
    }
  }, [setAlertText, setAlertVisible]);
  
  // When a search option is pressed, set the appropriate search type
  const handleSearchClick = (index) => {
    setSearchIndex(index);
  }
  
  const handleViewClick = (index) => {
    setViewIndex(index);
    if(index === 1 && selected !== prevSeleected) {
      setPrevSelected(selected);
      getRecommendations();
    }
  }
  
  const handlePlaylistOptions = async (index) => {
    if(index === 0) {
      const id = cache["userInfo"]?.id;
      const response = await createPlaylist(id, "tonedeaf scope tracks", tracks);
      if(response) setAlertVisible(true);
    } else {
      getRecommendations();
    }
  }

  const handleNowPlaying = (track) => {
    nowPlayingTrack.current = { ...track, type: "track"};
  }

  const handleFindMore = async () => {
    if(cache["demo"]) return;

    const artistIDS = [nowPlayingTrack.current?.artistID];
    const trackIDS = [nowPlayingTrack.current?.trackID];

    const _tracks = await getSearchRecs(artistIDS, trackIDS);
    setTracks(_tracks);
    setViewIndex(1);
    setSelected([]);
  }

  /*
  Upon getting recomendations
    - set an invalid search index to disable highlighting on the option panel
    - set the rec view index
    - set the tracks
  */
  const getRecommendations = async () => {
    setViewIndex(1);

    let artistIDS = [];
    let trackIDS = [];

    selected.forEach((sel) => {
      if(sel?.type === "artist") artistIDS.push(sel?.id);
      if(sel?.type === "track") trackIDS.push(sel?.id);
    });

    const _tracks = await getSearchRecs(artistIDS, trackIDS);
    setTracks(_tracks);
  }

  // let the input bar be controlled so we can save the value
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchInput(value);
  }

  // handle artist/track selection
  const handleSelect = (info) => {
    if(selected.length < 5) { // only 5 unique selections are allowed
      if(!selected.find((s) => s.id === info?.id)) {
        setSelected((prev) => [...prev, info]);
      }
    }
  }

  // handle artist/track deselection
  const handleDeselect = (info) => {
    setSelected((prev) => prev.filter((fil) => fil.id !== info?.id));
  }


  // every time user input changes or search type is changed, perform the search
  useEffect(() => {
    const getSearchResults = (value) => {
      if(cache["demo"]) return;

      if(searchTimer.current) clearTimeout(searchTimer.current);
  
      // abort empty searches
      if(value?.length === 0) {
        setSearchResults([]);
        return;
      }
  
      const searchCache = cache["search"][value + searchIndex];
  
      if(searchCache) {
        console.log("Returning cached search")
        setSearchResults(searchCache);
      } else {
        searchTimer.current = setTimeout(async () => {
          const _searchResults = await search(value, searchIndex);
          cache["search"][value + searchIndex] = _searchResults;
          setSearchResults(_searchResults);
          console.log("Cacheing search")
        }, SEARCH_TIMEOUT);
      }
    }

    setSearchResults(null);
    if(searchIndex < 2) getSearchResults(searchInput);
  }, [searchIndex, searchInput])

    // show Images of user selections
  const getSelected = () => {
    if(selected.length === 0) return;
    
    return (
      <div className="flex-col">
        { selected.length > 0 && <p className="medium bold directions"> Current selection &mdash; Deselect artists and tracks by pressing on their album art. </p> }
        <div className="selected images">
          { selected.map((info, i) => {
              if(info?.type === "artist") {
                return <ImageWrapper className="hover-deselect" src={info?.images?.[0]?.url} title={info?.name} onClick={() => { handleDeselect(info)}} key={info?.name + i}/>
              } else if(info?.type === "track") {
                return <ImageWrapper className="hover-deselect" src={info?.album?.images?.[0]?.url} title={info?.name} onClick={() => { handleDeselect(info)}} key={info?.name + i}/>
              } else {
                return null;
              }
            })
          }
        </div>
      </div>
    );
  }

  // show search results
  const getSearchCards = () => {
    if(!searchResults) return <div className="cards"> <Load/> </div>
    if(searchResults.length === 0 && searchInput.length) return <label className="medium bold"> No results found </label>

    let res = null;
    if(searchIndex === 0) {
      res = searchResults?.map((artist, i) => 
        selected.find((item) => item.id === artist.id) ? 
          null : <ArtistCard {...artist} className="hover-select" onClick={handleSelect} rank={i+1} key={artist?.name + i} norank/>)
    } else if(searchIndex === 1) { 
      res = searchResults?.map((track, i) => selected.find((item) => 
        item.id === track.id) ? 
          null : <TrackCard {...track} className="hover-select" onClick={handleSelect} rank={i+1} key={track?.name + i} norank/>)
    }

    return (
      <div className="cards">
        { (searchResults.length > 0) && <p className="medium bold directions"> Search Results &mdash; Select {SEARCH_OPTIONS[searchIndex].toLocaleLowerCase()} by pressing on their card. </p> }
        {res}
      </div>
    )
  }

  // show appropriate windows based on view index
  const getView = () => {
    let view = null;
    switch(viewIndex) {
      default: // display now playing widget and search bar
        view = (
          <>
            <NowPlaying onChange={handleNowPlaying} widget>
              <button className="gray-btn bold round" onClick={handleFindMore}> Find More Like This </button>
            </NowPlaying>
            <hr/>
            <label className="medium bold"> Find song recommendations based on a combination of up to 5 artists and tracks. </label>
            <input className="search medium" type="text" placeholder={"Search for " + SEARCH_OPTIONS[searchIndex]} value={searchInput} onChange={handleSearchChange} autoFocus/>
            {getSelected()}
            {getSearchCards()}
          </>
        )
        break;
      case 1: // display recommendations
        if(tracks?.length > 0) { // recs found
          view = (
            <div className="cards">
              { tracks?.map((track, i) => <TrackCard {...track} rank={i+1} key={track?.name + i} norank imageClick={null}/>) }
            </div>
          )
        } else if(tracks?.length === 0) { // no recs found
            view = <label className="medium bold"> No results found &mdash; Try changing up your selection. </label>
        } else { // still searching
          view = <Load/>
        }
        break;
    }
    
    return view
  }

  return (
    <div className="page">
      {alertElement}
      <div className="flex mobile-flex">
        <Options title="View" options={selected.length ? VIEW_OPTIONS : VIEW_OPTIONS_TEMP} onClick={handleViewClick} index={viewIndex}/>
        { (viewIndex === 0) && <Options title="Search For" options={SEARCH_OPTIONS} onClick={handleSearchClick} index={searchIndex}/> }
        { (tracks && viewIndex === 1) && <Options title="Like These Tracks?" options={selected.length ? PLAYLIST_OPTIONS : PLAYLIST_OPTIONS_TEMP} onClick={handlePlaylistOptions}/> }
      </div>
      {getView()}
    </div>
  )
}

export default Scope;