import React from 'react';

import Create from '../helper/Create.js';

import TrackList from './components/TrackList.js';

import SpotifyWebApi from 'spotify-web-api-js';

const spotifyWebApi = new SpotifyWebApi();


class RecentPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tracks : null
    }

    this.setSelectedRange = this.setSelectedRange.bind(this);
    this.getRecentTracks = this.getRecentTracks.bind(this);
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
  getRecentTracks(callback) {
    var params = { limit : 50 };
    var tracks = JSON.parse(JSON.stringify(this.state.tracks)); // make a deep copy of the state

    spotifyWebApi.getMyRecentlyPlayedTracks(params)
      .then((response) => {
        tracks = response.items;
        this.setState({ tracks : tracks });

        if(callback) callback(response.items);
        console.log("API SUCCESS: retrieved recent tracks")
        console.log(response.items);
      })
      .catch((error) => {
        console.error("API ERROR: could not retrieve recent tracks");
        console.error(error)
      });
  }

  componentDidMount() {
    this.getRecentTracks();
  }

  render() {
    return (
      <>
        <div className="div-sidebar"> 

          <Create text="tonedeaf recent tracks" tracks={this.state.tracks}/>

          {this.props.children}
        </div>

        <div className="div-panels"> 
          <TrackList 
            data={this.state.tracks}
            recent="true"
            loadText="Getting your most recent tracks from Spotify..."
          />
        </div>
      </>

    )
  }
}

export default RecentPage;