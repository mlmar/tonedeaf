import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import Artist from '../artist/Artist.js';
import Track from '../track/Track.js';
import PlaylistCreator from '../helper/PlaylistCreator.js';

// Recommendations based on genre
class Scope extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks : [],
      results : [],
      selectedResults : [],
      selectedIndex : 0, // 0 = search page, 1 = recommednations
      searchType : 0, // 0 = artists, 1 = track
    };

    this.searchTimeout = 0; // only search when user stops typing

    this.spotifyWebApi = new SpotifyWebApi();
    this.playlistCreator = new PlaylistCreator(this.props.userid);

    this.selectedAmount = 0;
    this.searchTerm = "";

    this.searchBar = React.createRef();
  
    // method bindings

    this.externalSearch = this.externalSearch.bind(this);
    this.setSearchType = this.setSearchType.bind(this);
    this.createPlaylist = this.createPlaylist.bind(this);

    this.parameters = this.parameters.bind(this);
    this.artistAdd = this.artistAdd.bind(this);
    this.artistRemove = this.artistRemove.bind(this);
    this.search = this.search.bind(this);
    this.getRecs = this.getRecs.bind(this);

    this.artistsToString = this.artistsToString.bind(this);


    this.renderArtist = this.renderArtist.bind(this);
    this.renderTrack = this.renderTrack.bind(this);
    this.renderSelected = this.renderSelected.bind(this);
  }

  
  // call PlaylistCreator object and pass in current tracks
  //  this function should be called from an options component
  createPlaylist() {
    if(this.state.tracks.length > 0) {
      this.playlistCreator.setTracks(this.state.tracks);
      this.playlistCreator.createPlaylist("tonedeaf scope");
    }
  }
  
  /* called from a callback in the NowPlaying component to search recommendations based on current artist and song
   *  sets the state of the externalQuery to parameter ids then calls getRecs()
   */
  externalSearch(artistArray, trackId) {
    var length = artistArray.length > 4 ? 4 : artistArray.length;
    
    var ids = [trackId];
    for(var i = 0; i < length; i++) {
      ids.push(artistArray[i].id);
    }
    
    // tell getRecs that an external query is being used
    this.getRecs(ids);
  }

  // called when option seelction changes
  setSearchType(index) {
    this.setState({searchType: index, results: []});
    this.searchBar.current.value = "";
  }

  // recommendation button
  //  gets parameters for recommendations
  getRecs(externalQuery) {
    // only search if there are selected artists or an external query is being used
    if(this.state.selectedResults.length > 0 || externalQuery) {
      var params = externalQuery ? { limit : 50, seed_artists : externalQuery} : this.parameters();

      this.spotifyWebApi.getRecommendations(params)
        .then((response) => {
          this.setState({ tracks : response.tracks, selectedIndex : 1 })
          console.log("Succesfully retrieved recommendations  @");
          console.log(response);
        })
        .catch((error) => {
          console.error("Could not retrieve recommendations @");
          console.error(error)
          if(error.status === 429) {
            alert("TOO MANY REQUESTS");
          }
        });

    } else {
      console.log("No artists selected");
    }
  }

  /* get spotify ids for selected artists
   */
  parameters() {
    var ids = [];
    for(var i = 0; i < this.state.selectedResults.length; i++) {
      ids.push(this.state.selectedResults[i].id)
    }
    
    return { limit : 50, seed_artists : ids };
  }

  // detect which button was clicked for ADDING an artist
  artistAdd(event) {
    if(this.selectedAmount < 5) {
      var tempArray = this.state.selectedResults;
      var duplicate = tempArray.includes(this.state.results[event.target.id]);
      if(event.target.tagName === "BUTTON" && !duplicate) {
        tempArray.push(this.state.results[event.target.id]);
        this.selectedAmount++;
        this.setState({ selectedResults : tempArray});
      }
    }
  }

  // detect which button was clicked for REMOVING an artist
  artistRemove(event) {
    var tempArray = [];
    if(event.target.tagName === "BUTTON") {
      for(var i = 0; i < this.state.selectedResults.length; i++) {
        if(i !== parseFloat(event.target.id)) {
          tempArray.push(this.state.selectedResults[i]);
        }
      }
      this.selectedAmount--;
      this.setState({ selectedResults : tempArray });
    }
  }

  // use spotify api to search for artists as a person types
  search(e) {
    if(this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    var query = e.target.value.replace(" ", "+"); // search queries cannot have white space
    var params = { limit : 50 } // number of items to return (max is 50)

    /*  Once this times out after 300ms the search will start
     *    - reduces api calls by only searching once the user stops typing
     */
    this.searchTimeout = setTimeout(() => {

      var searchArtists = this.state.searchType === 0; // if not 0, search for tracks
      var types = searchArtists ? ["artist"] : ["track"];

      if(query.length > 0) {
        this.spotifyWebApi.search(query, types, params)
          .then((response) => {

            if(searchArtists) {
              this.setState({results: response.artists.items, tracks: [], selectedIndex: 0});
            } else {
              this.setState({results: response.tracks.items, tracks: [], selectedIndex: 0});
            }
            console.log("Searching @ " + query);
          })
          .catch((error) => {
            console.error("could not retrieve search query @")
            console.error(error);
          });
      } else {
        this.setState({ results : [],  tracks: [], selectedIndex: 0});
      }

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

  renderArtist(result, i) {
    return (
      <Artist
        image={result.images.length ? result.images[0].url : ""}
        name={result.name}
        genre={result.genres.join(", ")}
        url={result.external_urls.spotify}
        popularity={result.popularity}
        followers={result.followers.total}
        artistid={result.id}
      />
    )
  }

  renderTrack(result, i) {
    return (
      <Track
        image={result.album.images ? result.album.images[0].url : ""}
        title={result.name}
        artist={this.artistsToString(result.artists)}
        url={result.external_urls.spotify}
        year={result.album.release_date.split("-")[0]}
        type={result.album.type}
        album={result.album.name}
        trackid={result.id}
      />
    )
  }

  renderSelected() {
    var hasSelected = this.state.selectedResults.length > 0;

    if(hasSelected) {
      return (
        <React.Fragment>
          <div className="selected" onClick={this.artistRemove}>
            <label className="label-small label-bold"> Currently seleced artists and tracks: </label>
            {
              this.state.selectedResults.map((result, i) => {
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
            <button className="option-btn scope-btn animate-drop" onClick={() => this.getRecs(false)}> Get Recommendations </button>
          </div>
        </React.Fragment>
      )
    }
  }
  
  render() {

    var display;
    if(this.state.selectedIndex === 0) {
      display = (

        <React.Fragment>
          {this.renderSelected()}

          <div onClick={this.artistAdd}>
            {
              this.state.results.map((result, i) => {
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
                  return "";
                }
              })
            }
          </div>
        </React.Fragment>
      )

    } else {
      if(this.state.tracks.length === 0) {
        display = <label className="label-medium"> No recommendations were found. Try adding more artists and tracks. </label>
      } else {
        display = (
          <React.Fragment>
            {
              this.state.tracks.map((track, i) => {
                return this.renderTrack(track, i)
              })
            }
          </React.Fragment>
        )
      }
    }
    
    var placeholder = "Search for " + ["Artist","Track"][this.state.searchType];

    return (
      <div className="div-scope">
        <div className="panel animate-drop">
          <label className="label-medium"> Get recommendations based on artists and tracks </label>
          <label className="label-subtext"> * Search and add a combination of up to 5 artists or tracks. </label>
          <input type="text" className="input input-search" onChange={(e) => this.search(e)} ref={this.searchBar} placeholder={placeholder}/>
        </div>
        {display}
      </div>
    )
  }
}

export default Scope;