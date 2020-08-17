import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import Track from './Track.js';

class TopTracks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks : []
    };

    this.range = ["long_term", "medium_term", "short_term"];

    this.spotifyWebApi = new SpotifyWebApi();
    this.getTopTracks = this.getTopTracks.bind(this);
    this.artistsToString = this.artistsToString.bind(this);
  }

  getTopTracks(index) {
    this.setState({tracks : []});
    
    var selected_range = {
      time_range : this.range[index],
      limit : 50
    }
    
    this.spotifyWebApi.getMyTopTracks(selected_range)
      .then((response) => {
        this.setState({
          tracks : response.items
        });
        console.log("Succesfully retrieved top tracks @ " + index);
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
    this.getTopTracks(this.props.selected);
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
                  year={track.album.release_date.split("-")[0]}
                  rank={i+1}
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