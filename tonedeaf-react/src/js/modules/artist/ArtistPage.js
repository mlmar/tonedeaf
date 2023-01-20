import { useState, useMemo } from 'react';
import { useArtistsAndGenres } from '../../hooks/SpotifyHooks.js';
import { useDownload, dataToTextList } from '../../util/DownloadUtil.js';

import Options from "../ui/Options.js";
import ImageWrapper from '../ui/ImageWrapper.js';
import ArtistCard from './ArtistCard.js';

import Load from '../ui/Load.js';
import { CHECK } from '../../util/IconUtil.js';

import DEFAULTS from '../../util/Defaults.js';

/*
  Displays list of users top artists from a selected time range
*/
const ArtistPage = () => {
  const [timeFrameIndex, setTimeFrameIndex] = useState(DEFAULTS.TIME_FRAME_INDEX); // long term by default
  const [viewIndex, setViewIndex] = useState(DEFAULTS.VIEW_INDEX); // 0 = grid, 1 = list, 2 = stats

  const info = useArtistsAndGenres(timeFrameIndex);
  const [genre, setGenre] = useState("all");
  const filteredArtists = useMemo(() => {
    return info?.artists.filter((artist) => genre === "all" || artist.genres.find((g) => (genre === g)));
  }, [info, genre])

  const [overflowVisible, setOverflowVisible] = useState(false);

  const [exportRef, shareImage, shareText] = useDownload();
  const handledownloadClick = (index) => {
    let text = '';
    if(index === 0) {
      text = 'My top artists ';
      switch(timeFrameIndex) {
        case 1: text += 'in the last 6 months'; break;
        case 2: text += 'in the last month'; break;
      }
      shareImage(text);
    } else {
      text = dataToTextList(filteredArtists);
      shareText(text);
    }
  }

  // filter artists by user selected genre
  const handleGenreClick = (event) => {
    setGenre(event.currentTarget.id);
  }

  // if an artist's image is pressed in the grid view, display location of artist in list view
  const handleArtistClick = () => {
    setViewIndex(1);
  }

  const getGenreButton = (option, i) => {
    const equal = (option.genre === genre);
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
          <div className="images" ref={exportRef}>
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
          <div className="cards" ref={exportRef}>
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
        <Options title="Your Top Artists" options={DEFAULTS.TIME_OPTIONS} onClick={setTimeFrameIndex} index={timeFrameIndex}/>
        <Options title="View" options={DEFAULTS.VIEW_OPTIONS} onClick={setViewIndex} index={viewIndex}/>
        { viewIndex === 0 &&
          <Options title="Share" options={DEFAULTS.DOWNLOAD_OPTIONS} onClick={handledownloadClick}/>
        }
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