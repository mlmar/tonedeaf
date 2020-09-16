import React from 'react';

import { session } from '../util/Session.js';

import Options from '../helper/Options.js';
import TrackList from './components/TrackList.js';

import SpotifyWebApi from 'spotify-web-api-js';
import PlaylistCreator from '../util/PlaylistCreator.js';

const spotifyWebApi = new SpotifyWebApi();


class RecentPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRange : "long_term",
      tracks : { long_term : null, medium_term : null, short_term : null }
    }

    this.ranges = ["long_term", "medium_term", "short_term"];

    this.playlistCreator = new PlaylistCreator(session.getCache("user")._id);
    
    this.createPlaylist = this.createPlaylist.bind(this);
    this.setSelectedRange = this.setSelectedRange.bind(this);
    this.getRecentTracks = this.getRecentTracks.bind(this);
  }

  // use PlaylistCreator to create playlist from current selected tracklist
  createPlaylist() {
    if(this.state.tracks[this.state.selectedRange]) {
      this.playlistCreator.setTracks(this.state.tracks[this.state.selectedRange], true);
      this.playlistCreator.createPlaylist("tonedeaf recent tracks");
    }
  }
  

  /*  Set the selected time range for recent artists list
    *    {index} : retrieves range through this.ranges[index]
    */
  setSelectedRange(index) {
    var range = this.ranges[index];
    if(!this.state.tracks[range]) { // if the artists have already been loaded, don't call API
      this.getRecentTracks(range);
    } else {
      console.log("SUCCESS: Retrieved artists from previous state");
    }

    this.setState({ selectedRange : range });
  }

  /*  Retrieves recent tracks based on selectedIndex of range
    */
  getRecentTracks(range, callback) {
    var params = { limit : 50 };
    var tracks = JSON.parse(JSON.stringify(this.state.tracks)); // make a deep copy of the state

    spotifyWebApi.getMyRecentlyPlayedTracks(params)
      .then((response) => {
        tracks[range] = response.items;
        this.setState({ tracks : tracks });

        if(callback) callback(range, response.items);
        console.log("API SUCCESS: retrieved recent tracks")
        console.log(response.items);
      })
      .catch((error) => {
        console.error("API ERROR: could not retrieve recent tracks");
        console.error(error)
      });
  }

  componentDidMount() {
    this.getRecentTracks("long_term");
  }

  render() {
    return (
      <>
        <div className="div-sidebar"> 

          <Options
            text="Like these tracks?"
            options={["Create Spotify Playlist"]}
            callback={this.createPlaylist}
          />

          {this.props.children}
        </div>

        <div className="div-panels"> 
          <TrackList 
            data={this.state.tracks[this.state.selectedRange]}
            recent="true"
          />
        </div>
      </>

    )
  }
}

export default RecentPage;