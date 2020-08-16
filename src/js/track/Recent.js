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
  }

  getRecent(event) {
    this.spotifyWebApi.getMyRecentlyPlayedTracks()
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