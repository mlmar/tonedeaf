import React from 'react';

import Create from '../helper/Create.js';

import Scope from './components/Scope.js';
import NowPlaying from '../user/NowPlaying.js';

import SpotifyWebApi from 'spotify-web-api-js';
import Options from '../helper/Options.js';
import TrackList from '../track/components/TrackList.js';
const spotifyWebApi = new SpotifyWebApi();

class ScopePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index : 0, // artist or track
      tracks : null, // recommendations
      results : null, // search reults
      selectedResults : [], // user selected searches
      fetching: false
    }

    this.description = <label className="label-small"> Get recommendations based on 3-5 selected artists and tracks. </label>

    this.searchType = [["artist"],["track"]];

    this.setIndex = this.setIndex.bind(this);
    this.searchCurrent = this.searchCurrent.bind(this);
    this.getRecommendations = this.getRecommendations.bind(this);
    this.getRecParams = this.getRecParams.bind(this);
    this.search = this.search.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
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
      
      this.setState({ fetching : true });

      var params = ids ? { seed_artists : ids, limit : 50 } : this.getRecParams();

      spotifyWebApi.getRecommendations(params)
        .then((response) => {
          this.setState({ tracks : response.tracks, results : null, fetching: false })
          console.log("API SUCCESS: retrieved scope recommendations");
          console.log(response);
        })
        .catch((error) => {
          console.error("API ERROR: could not retrieve scope recommendations");
          console.error(error)
          this.setState({ fetching : false });
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
    if(event.target.tagName === "BUTTON" && this.state.selectedResults.length < 5) {
      var index = event.target.id;
      var tempArray = this.state.selectedResults;
      var duplicate = false;
      for(var i = 0; i < tempArray.length; i++) {
        duplicate = tempArray[i].id === this.state.results[index].id;
        if(duplicate) break; // if the array contains an artist with the same id, break
      }
      if(!duplicate) {
        tempArray.push(this.state.results[index]);
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

  renderOptions() {
    return (
      <>
        <Options
          text="Scope"
          suboptions={["Edit Search"]}
          subcallback={() => { this.setState({ index: 0, tracks : null })}} > 
          {this.description}
          <br/>
        </Options>

        <Create text="tonedeaf scope tracks" tracks={this.state.tracks}/>
      </>
    )
  }

  render() {
    var portrait = window.matchMedia("only screen and (max-width: 768px)").matches;

    return (
      <>
        <div className="div-sidebar">
          {portrait && <NowPlaying searchCurrent={this.searchCurrent} full/>}
          { !this.state.tracks &&
            <Options 
              horizontal
              text="Scope"
              suboptions={["Artists","Tracks"]}
              subcallback={this.setIndex}
            >
              {this.description}
            </Options>
          }
          {this.state.tracks && this.renderOptions()}
          {!portrait && <NowPlaying searchCurrent={this.searchCurrent}/>}
          {this.props.children}
        </div>

        <div className="div-panels">
          { !this.state.tracks && !this.state.fetching &&
            <Scope 
              results={this.state.results}
              selectedResults={this.state.selectedResults}
              searchType={this.searchType[this.state.index][0]}
              get={this.getRecommendations}
              search={this.search}
              add={this.add}
              remove={this.remove}
            />
          }
          {(this.state.fetching || this.state.tracks) && <TrackList data={this.state.tracks} loadText={"Getting recommendations from Spotify..."}/>}
        </div>
      </>
    )
  }

}

export default ScopePage;