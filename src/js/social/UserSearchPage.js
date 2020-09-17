import React from 'react';

import { session } from '../util/Session.js';

import Options from '../helper/Options.js';
import Load from '../helper/Load.js';

import UserSearch from './components/UserSearch.js';
import ArtistList from '../artist/components/ArtistList.js';
import TrackList from '../track/components/TrackList.js';

import TonedeafService from '../util/TonedeafService.js';

import PlaylistCreator from '../util/PlaylistCreator.js'

class UserSearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data : null,
      allResults : null,
      searchResults : null,
      user : null,
      fetching : false
    }

    this.currentUser = session.getCache("user").display_name;
    this.playlistCreator = new PlaylistCreator(session.getCache("user").id);

    this.category = "artists"
    this.timeRange = "long_term";

    this.tonedeafService = new TonedeafService();

    this.createPlaylist = this.createPlaylist.bind(this);
    this.setCategory = this.setCategory.bind(this);
    this.setTimeRange = this.setTimeRange.bind(this);
    this.search = this.search.bind(this);
    this.userSelect = this.userSelect.bind(this);
    this.renderUserFilter = this.renderUserFilter.bind(this);
    this.renderData = this.renderData.bind(this);
  }

  // use PlaylistCreator to create playlist from current selected tracklist
  createPlaylist() {
    if(this.state.data && this.category === "tracks") {
      this.playlistCreator.setTracks(this.state.data);
      this.playlistCreator.createPlaylist("tonedeaf recent tracks");
    }
  }
    

  setCategory(index) {
    var categories = ["artists", "tracks"];
    this.category = categories[index];
    var entry = this.category + "_" + this.timeRange;
    this.setState({ data : this.state.user[entry]})
  }

  setTimeRange(index) {
    var ranges = ["long_term", "medium_term", "short_term"];
    this.timeRange = ranges[index];
    var entry = this.category + "_" + this.timeRange;
    this.setState({ data : this.state.user[entry]})
  }

  // callback for user search component
  //    filters through loaded data
  search(query) {
    if(query.length) {
      var cleanQuery = this.clean(query);
      var filtered = [];
      this.state.allResults.forEach((r) => {
        var cleanResult = this.clean(r.display_name);
        if(cleanResult.includes(cleanQuery)) {
          filtered.push(r);
        }
      });
      this.setState({ searchResults : filtered, data : null });
    } else {
      this.setState({ searchResults : this.state.allResults, data : null });
    }
  }

  // removes some punctation and lowers the text for filtering
  clean(text) {
    return text.replace(".","").replace("_","").replace("-","").toLowerCase();
  }

  /*  Search for selected user based on selected user's id
   */
  userSelect(e) {
    this.setState({ fetching : true });
    this.tonedeafService.load((response) => {
      this.setState({ user : response.data, searchResults : null, fetching : false }, () => this.setCategory(0));
    }, e.target.id)

    this.tonedeafService.refresh(console.log);
  }

  componentDidMount() {
    this.tonedeafService.search((response) => { // load all data on mount
      var removeCurrentUser = response.data.filter(data => data.display_name !== this.currentUser)
      this.setState({ allResults : removeCurrentUser, searchResults : removeCurrentUser });
    }, "");
  }

  /*  Artist/Top Track buttons
   */
  renderUserFilter() {
    var categories = ["Artists", "Tracks"], ranges = ["Long Term", "6 Months", "4 Weeks"];
    return (
      <div className="panel">
        <label className="label-subtitle"> Viewing {this.state.user.display_name}'s top listens </label>

        <Options horizontal nopanel text="" options={categories} callback={this.setCategory} key={this.state.user.id}> </Options>
        <Options horizontal nopanel text="" options={ranges} callback={this.setTimeRange} key={this.state.user.id + "1"}> </Options>
        <br/>
        <Options horizontal nopanel text="" options={["Reset"]} key={this.state.user.id + "2"} 
          callback={() => { this.setState({ user : null, searchResults : this.state.allResults, data : null })}} > </Options>
      </div>
    )
  }

  /*  Render selected user's data
   *
   */
  renderData() {
    if(this.state.user) {
      if(this.state.data) {
        if(this.category === "artists") {
          return <ArtistList data={this.state.data}/>
        } else {
          return <TrackList data={this.state.data}/>
        }
      } else if(!this.state.searchResults) {
        return <label className="label-medium label-bold animate-fade nolist"> This user hasn't loaded this list yet. Try a different one. </label>
      }
    } 
  }

  render() {
    return (
      <>
        <div className="div-sidebar">
          { !this.state.user &&
            <div className="panel"> 
              <label className="label-subtitle"> tonedeaf users </label>
              <label className="label-small"> Users that have viewed their lists through this site will show up here. </label>
              <label className="label-small"> Select any name to view their top listens. </label>
              <br/>
              <label className="label-small label-italic"> If a user has not viewed their list, it will not be shown. </label>
              <label className="label-small label-italic"> This feature may be removed in the future. </label>
            </div>
          }
          { this.state.user && this.renderUserFilter() }
          { this.state.data &&
            <Options
              text="Like these tracks?"
              options={["Create Spotify Playlist"]}
              callback={this.createPlaylist}
            />
          }
          {this.props.children}
        </div>

        <div className="div-panels">
          { !this.state.data && this.state.allResults && !this.state.fetching &&
            <UserSearch
              results={this.state.searchResults}
              search={this.search}
              userSelect={this.userSelect}
            />
          }
          { !this.state.allResults && <Load text="Connecting..."/> }
          { this.state.fetching && <Load text="Loading..."/> }
          {this.renderData()}
        </div>
        
      </>
    )
  }
}

export default UserSearchPage;