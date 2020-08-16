import React from 'react';
import Track from './Track.js';

import SpotifyWebApi from 'spotify-web-api-js';

class TopTracks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks : []
    };

    this.spotifyWebApi = new SpotifyWebApi();
    this.getTopTracks = this.getTopTracks.bind(this);
    this.artistsToString = this.artistsToString.bind(this);
  }

  getTopTracks(event) {
    this.spotifyWebApi.getMyTopTracks()
      .then((response) => {
        this.setState({
          tracks : response.items
        })
        console.log("Succesfully retrieved top tracks @");
        console.log(this.state.tracks);
      })
      .catch((error) => {
        console.error("Could not retrieve top tracks @")
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
    this.getTopTracks();
  }
  
  render() {
    return (
      <div>
        {
          this.state.tracks.map((track, i) => {
            return (
              <div className="animate-drop" key={i}>
                <Track
                  image={track.album.images[0].url}
                  title={track.name}
                  artist={this.artistsToString(track.artists)}
                  url={track.external_urls.spotify}
                />
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default TopTracks;