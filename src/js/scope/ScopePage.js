import React from 'react';

import { session } from '../util/Session.js';

import Scope from './components/Scope.js';
import NowPlaying from '../user/NowPlaying.js';

import PlaylistCreator from '../util/PlaylistCreator.js'
import SpotifyWebApi from 'spotify-web-api-js';
import Options from '../helper/Options.js';
const spotifyWebApi = new SpotifyWebApi();

class ScopePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index : 0, // artist or track
      tracks : null, // recommendations
      results : null, // search reults
      selectedResults : [], // user selected searches
    }

    this.searchType = [["artist"],["track"]];

    this.playlistCreator = new PlaylistCreator(session.getCache("user").id);

    this.createPlaylist = this.createPlaylist.bind(this);
    this.setIndex = this.setIndex.bind(this);
    this.searchCurrent = this.searchCurrent.bind(this);
    this.getRecommendations = this.getRecommendations.bind(this);
    this.getRecParams = this.getRecParams.bind(this);
    this.search = this.search.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
  }

  // use PlaylistCreator to create playlist from current selected tracklist
  createPlaylist() {
    if(this.state.tracks) {
      this.playlistCreator.setTracks(this.state.tracks);
      this.playlistCreator.createPlaylist("tonedeaf scope tracks");
    }
  }

  /*  Set the selected search type for scope
    *    {index} : retrieves range through this.searchtypes[index]
    */
  setIndex(index) {
    this.setState({ index : index, results : null });
  }
 
  /* called from a callback in the NowPlaying component to search recommendations based on current artist and song
   *  sets the state of the externalQuery to parameter ids then calls getRecs()
   */
  searchCurrent(item) {
    var ids = [item.id];
    var length = item.artists.length > 4 ? 4 : item.artists.length;
    for(var i = 0; i < length; i++) {
      ids.push(item.artists[i].id);
    }
    
    // // tell getRecs that an external query is being used
    this.getRecommendations(ids);
  }

  // recommendation button
  //  gets parameters for recommendations
  getRecommendations(ids) {

    // only search if there are selected artists or an external query is being used
    if(this.state.selectedResults.length > 0 || ids) {
      var params = ids ? { seed_artists : ids, limit : 50 } : this.getRecParams();

      spotifyWebApi.getRecommendations(params)
        .then((response) => {
          this.setState({ tracks : response.tracks, results : null })
          console.log("API SUCCESS: retrieved scope recommendations");
          console.log(response);
        })
        .catch((error) => {
          console.error("API ERROR: could not retrieve scope recommendations");
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
  getRecParams() {
    var ids = [];
    for(var i = 0; i < this.state.selectedResults.length; i++) {
      ids.push(this.state.selectedResults[i].id)
    }
    
    return { limit : 50, seed_artists : ids };
  }

  search(query) {
    var types = this.searchType[this.state.index];
    var params = { limit : 50 } // number of items to return (max is 50)

    if(query.length > 0) {
      spotifyWebApi.search(query, types, params)
        .then((response) => {
          if(types[0] === "artist") {
            this.setState({results: response.artists.items, tracks : null, index: 0});
          } else {
            this.setState({results: response.tracks.items, tracks : null, index: 0});
          }
          console.log("API SUCCESS: searched for " + query)
        })
        .catch((error) => {
          console.error("API ERROR: could not search for " + query);
          console.error(error);
        });
    } else {
      this.setState({ results : null, tracks : null });
    }
  }

  /* detect which button was clicked for ADDING an artist/track
   *    callback from Scope component
   */
  add(event) {
    if(this.state.selectedResults.length < 5) {
      var tempArray = this.state.selectedResults;
      var duplicate = tempArray.includes(this.state.results[event.target.id]);
      if(event.target.tagName === "BUTTON" && !duplicate) {
        tempArray.push(this.state.results[event.target.id]);
        this.setState({ selectedResults : tempArray});
      }
    }
  }

  /* detect which button was clicked for REMOVING an artist/track
   *    callback from Scope component
   */
  remove(event) {
    var tempArray = [];
    if(event.target.tagName === "BUTTON") {
      for(var i = 0; i < this.state.selectedResults.length; i++) {
        if(i !== parseFloat(event.target.id)) {
          tempArray.push(this.state.selectedResults[i]);
        }
      }
      this.setState({ selectedResults : tempArray });
    }
  }

  render() {
    var portrait = window.matchMedia("only screen and (max-width: 768px)").matches;

    return (
      <>
        <div className="div-sidebar">

          { portrait &&
            <NowPlaying searchCurrent={this.searchCurrent} full/>
          }

          <Options 
            horizontal
            text="Scope"
            options={["Artists","Tracks"]}
            callback={this.setIndex}
          >
            <label className="label-small"> Search for recommendations based on 3-5 artists and tracks. </label>
            <br/>
            <label className="label-small label-bold"> Search Type: </label>
          </Options>
          
          { this.state.tracks &&
            <Options
              text="Like these tracks?"
              options={["Create Spotify Playlist"]}
              callback={this.createPlaylist}
            />
          }

          { !portrait &&
            <NowPlaying searchCurrent={this.searchCurrent}/>
          }

          {this.props.children}
        </div>

        <div className="div-panels">
          <Scope 
            tracks={this.state.tracks} 
            results={this.state.results}
            selectedResults={this.state.selectedResults}
            searchType={this.searchType[this.state.index][0]}
            get={this.getRecommendations}
            search={this.search}
            add={this.add}
            remove={this.remove}
          />
        </div>
      </>
    )
  }

}

export default ScopePage;