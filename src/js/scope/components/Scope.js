import React from 'react';
import Artist from '../../artist/components/Artist.js';
import Track from '../../track/components/Track.js';

// Recommendations based on genre
class Scope extends React.Component {
  constructor(props) {
    super(props);

    this.searchTimeout = 0; // only search when user stops typing
    this.searchTerm = "";

    this.searchBar = React.createRef();
  
    this.search = this.search.bind(this);
    this.artistsToString = this.artistsToString.bind(this);

    this.renderArtist = this.renderArtist.bind(this);
    this.renderTrack = this.renderTrack.bind(this);
    this.renderSelected = this.renderSelected.bind(this);
  }

  get() {
    this.searchBar.current.value = "";
    this.props.get();
  }

  // use spotify api to search for artists as a person types
  search(e) {
    if(this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    var query = e.target.value.replace(" ", "+"); // search queries cannot have white space

    /*  Once this times out after 300ms the search will start
     *    - reduces api calls by only searching once the user stops typing
     */
    this.searchTimeout = setTimeout(() => {
      this.props.search(query)
    }, 500);
  }

  // convert artist array into comma string
  artistsToString(artists) {
    var result = "";
    for(var i = 0; i < artists.length; i++) {
      result += (i < artists.length - 1) ? artists[i].name + ", " : artists[i].name;
    }
    return result;
  }

  // instead of using ArtistList and TrackList components, just render components
  // directly because we are adding buttons
  renderArtist(result, i) {
    return (
      <Artist
        image={result.images && result.images.length ? result.images[0].url : ""}
        name={result.name}
        genre={result.genres.join(", ")}
        url={result.external_urls.spotify}
        popularity={result.popularity}
        followers={result.followers.total}
        artistid={result.id}
        key={i}
      />
    )
  }

  renderTrack(result, i) {
    return (
      <Track
        image={result.album.images && result.album.images.length ? result.album.images[0].url : ""}
        title={result.name}
        artist={this.artistsToString(result.artists)}
        url={result.external_urls.spotify}
        year={result.album.release_date.split("-")[0]}
        type={result.album.type}
        album={result.album.name}
        trackid={result.id}
        key={i}
      />
    )
  }

  renderSelected() {
    return (
      <>
        <div className="selected" onClick={this.props.remove}>
          <label className="label-small label-bold"> Currently seleced artists and tracks: </label>
          {
            this.props.selectedResults.map((result, i) => {
              if(result.type === "artist") {
                return (
                  <div className="scope-wrapper" key={i} >
                    <button className="sub-btn" id={i}> - </button>
                    {this.renderArtist(result, i)}
                  </div>
                )
              } else if(result.type === "track") {
                return (
                  <div className="scope-wrapper" key={i} >
                    <button className="sub-btn" id={i}> - </button>
                    {this.renderTrack(result, i)}
                  </div>
                )
              } else {
                return <span/>
              }
            })
          }
        </div>

        <div className="bottom-outline divider">
          <button className="gray-btn scope-btn animate-drop" onClick={() => this.get()}> Get Recommendations </button>
        </div>
      </>
    )
  }
  
  render() {

    var display;
    if(this.props.results) {
      display = (
        <div onClick={this.props.add}>
          { this.props.results.length > 0 &&
            this.props.results.map((result, i) => {
              if(result.type === "artist") {
                return (
                  <div className="scope-wrapper" key={i}>
                    <button className="add-btn" id={i}> + </button>
                    {this.renderArtist(result, i)}
                  </div>
                )
              } else if(result.type === "track") {
                return (
                  <div className="scope-wrapper" key={i}>
                    <button className="add-btn" id={i}> + </button>
                    {this.renderTrack(result, i)}
                  </div>
                )
              } else {
                return null;
              }
            })
          }
        </div>
      )
    } 
    
    var placeholder = "Search for " + this.props.searchType + "s";

    return (
      <div className="div-scope">
        <div className="panel animate-fade">
          <input type="text" className="input input-search" onChange={this.search} placeholder={placeholder} ref={this.searchBar}/>
        </div>
        {this.props.selectedResults.length > 0 && this.renderSelected()}
        {display}
      </div>
    )
  }

}

export default Scope;