import React from 'react';
import Track from './Track.js';
import SpotifyWebApi from 'spotify-web-api-js';
import PlaylistCreator from '../helper/PlaylistCreator.js';

class Recent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks : []
    };

    this.spotifyWebApi = new SpotifyWebApi();
    this.playlistCreator = new PlaylistCreator(this.props.userid);

    this.getRecent = this.getRecent.bind(this);
    this.artistsToString = this.artistsToString.bind(this);
    this.createPlaylist = this.createPlaylist.bind(this);
  }

  createPlaylist() {
    if(this.state.tracks.length > 0) {
      this.playlistCreator.setTracks(this.state.tracks, true);
      this.playlistCreator.createPlaylist("tonedeaf recent");
    }
  }

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
                  type={track.track.album.type}
                  album={track.track.album.name}
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