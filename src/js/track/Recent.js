import React from 'react';
import Track from './Track.js';

import SpotifyWebApi from 'spotify-web-api-js';

class Recent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks : []
    };

    this.spotifyWebApi = new SpotifyWebApi();
    this.getRecent = this.getRecent.bind(this);
    this.artistsToString = this.artistsToString.bind(this);
    this.createPlaylist = this.createPlaylist.bind(this);
    this.addTopTracksToPlaylist = this.addTopTracksToPlaylist.bind(this);
    this.getUris = this.getUris.bind(this);
    this.getDate = this.getDate.bind(this);
  }

    getDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    return today;
  }
  
  /**************************** playlists ****************************/

  // create a playlist
  createPlaylist() {
    var id = this.props.userid;
    var params = {
      name : "tonedeaf recent",
      public : true,
      collaborative : false,
      description : "tonedeaf.vercel.app @ " + this.getDate()
    }

    this.spotifyWebApi.createPlaylist(id, params)
      .then((response) => {

        this.addTopTracksToPlaylist(response);
        window.open(response.uri);

        console.log("Succesfully created playlist @ ")
        console.log(response);
      })
      .catch((error) => {
        console.error("Could not create playlist @")
        console.error(error)
      });
  }

  // add top tracks to a playlist
  addTopTracksToPlaylist(playlist) {
    var pid = playlist.id;
    var params = this.getUris();

    this.spotifyWebApi.addTracksToPlaylist(pid, params)
      .then((response) => {
        console.log("Succesfully added top tracks to playlist @ ")
        console.log(response);
      })
      .catch((error) => {
        console.error("Could not add top tracks to playlist @")
        console.error(error)
      });
  }

  /**************************** end playlist ****************************/
  
  // get the uris of top tracks
  getUris() {
    var uris = [];
    for(var i = 0; i < this.state.tracks.length; i++) {
      uris.push(this.state.tracks[i].track.uri);
    }
    console.log(uris);
    return uris;
  }

  // gets more recent songs
  getRecent(event) {
    var selected_range = {
      limit : 50
    }

    this.spotifyWebApi.getMyRecentlyPlayedTracks(selected_range)
      .then((response) => {
        this.setState({
          tracks : response.items
        })
        console.log("Succesfully retrieved recently played tracks @");
        console.log(response.items);
      })
      .catch((error) => {
        console.error("Could not retrieve recently played tracks @")
        console.error(error)
      });
  }
  

  artistsToString(artists) {
    var result = "";
    for(var i = 0; i < artists.length; i++) {
      result += (i < artists.length - 1) ? artists[i].name + ", " : artists[i].name;
    }
    return result;
  }

  componentDidMount() {
    this.getRecent();
  }
  
  render() {
    return (
      <div>
        {
          this.state.tracks.map((track, i) => {
            return (
              <div className="animate-drop" key={i}>
                <Track
                  image={track.track.album.images[0].url}
                  title={track.track.name}
                  artist={this.artistsToString(track.track.artists)}
                  url={track.track.external_urls.spotify}
                  year={track.track.album.release_date.split("-")[0]}
                />
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default Recent;