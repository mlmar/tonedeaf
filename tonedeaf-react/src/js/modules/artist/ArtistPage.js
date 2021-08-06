import { useState, useEffect } from 'react';
import { fetchArtistsAndGenres } from '../../util/DataUtil.js';

import Options from "../ui/Options.js";
import ImageWrapper from '../ui/ImageWrapper.js';
import ArtistCard from './ArtistCard.js';

import Load from '../ui/Load.js';
import { CHECK } from '../../util/IconUtil.js';

const TIME_OPTIONS = ["Long Term", "6 Months", "1 Month"];
const VIEW_OPTIONS = ["Grid", "List"]



/*
  Displays list of users top artists from a selected time range
*/
const ArtistPage = () => {
  const [timeFrameIndex, setTimeFrameIndex] = useState(0); // long term by default
  const [viewIndex, setViewIndex] = useState(0); // 0 = grid, 1 = list, 2 = stats

  const [info, setInfo] = useState(null);
  const [filteredArtists, setFilteredArtists] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState("all");

  const [overflowVisible, setOverflowVisible] = useState(false);

  // get list of top artists
  useEffect(() => {
    const fetch = async() => {
      const { artists, genres } = await fetchArtistsAndGenres(timeFrameIndex);
      setInfo({ artists, genres });
      setSelectedGenre("all");
      setFilteredArtists(artists);
    }
    
    fetch();
  }, [timeFrameIndex])

  // filter artists by user selected genre
  const handleGenreClick = (event) => {
    let genre = event.currentTarget.id;
    
    setSelectedGenre(genre);
    if(genre === "all") { // reset filter if all is pressed
      setFilteredArtists(info?.artists);
    } else {
      let newFilter = info?.artists.filter((artist) => artist.genres.find((g) => (g === genre)));
      setFilteredArtists(newFilter);
    }
  }

  // if an artist's image is pressed in the grid view, display location of artist in list view
  const handleArtistClick = () => {
    setViewIndex(1);
  }

  const getGenreButton = (option, i) => {
    const equal = (option.genre === selectedGenre);
    let overflow = i >= 20 ? "overflow" : "";
    let selected = equal ? "selected" : "";
    let total = option.total > 1 ? `(${option.total})` : "";
    let text = equal ? CHECK : null;
    return <span className={overflow} onClick={handleGenreClick} id={option.genre} key={option.genre}> <button className={"text-btn bold "+ selected}> {option.genre} {total} {text} </button> </span>
  }

  const getOverflowButton = () => {
    const handleOverflowClick = () => {
      setOverflowVisible(!overflowVisible);
    }

    const elipses = overflowVisible ? null : <label className="mobile"> ... </label>
    const text = overflowVisible ? "Hide" : "Show";
    return (
      <>
        {elipses}
        <button className="overflow-btn text-btn bold mobile" onClick={handleOverflowClick}> {text} More Genres </button>
      </>
    )
  }

  const getView = () => {
    let view = null;
    switch(viewIndex) {
      default: // display grid view by default
        view = (
          <div className="images">
            { filteredArtists?.map((artist,i) => 
              <ImageWrapper 
                src={artist?.images?.[0]?.url} 
                title={i+1 + ". " + artist?.name} 
                url={"#" + artist?.name + (i+1)} 
                onClick={handleArtistClick}
                key={artist?.name + i} 
              /> 
            )}
          </div>
        )
        break;
      case 1: // display list view
        view = (
          <div className="cards">
            { filteredArtists?.map((artist,i) => <ArtistCard {...artist} rank={i+1} key={artist?.name + i}/>)}
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
      <div className="flex mobile-flex">
        <Options title="Your Top Artists" options={TIME_OPTIONS} onClick={setTimeFrameIndex} index={timeFrameIndex}/>
        <Options title="View" options={VIEW_OPTIONS} onClick={setViewIndex} index={viewIndex}/>
      </div>
      { (viewIndex === 0 || viewIndex === 1) && 
        <Options title="Genres" className="genres-panel" description="Select any genre to filter artists:">
          <div className={"buttons overflow-" + overflowVisible}>
            { info?.genres?.map(getGenreButton)}
          </div>
          {getOverflowButton()}
        </Options>
      }

      { info ? (
          getView()
        ) : (
          <Load/>
        )
      }
    </div>
  )
}

export default ArtistPage;