import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import Track from './Track.js';
import PlaylistCreator from '../PlaylistCreator.js';

class TopTracks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks : [],
    };


    this.playlistCreator = new PlaylistCreator(this.props.userid);
    this.selectedIndex = 0;

    this.cleanRange = ["last few years", "6 months", "4 weeks"]
    this.range = ["long_term", "medium_term", "short_term"];

    this.spotifyWebApi = new SpotifyWebApi();
    this.playlistCreator = new PlaylistCreator(this.props.userid);

    this.getTopTracks = this.getTopTracks.bind(this);
    this.artistsToString = this.artistsToString.bind(this);
    this.createPlaylist = this.createPlaylist.bind(this);
  }
  

  createPlaylist() {
    if(this.state.tracks.length > 0) {
      this.playlistCreator.setTracks(this.state.tracks);
      this.playlistCreator.createPlaylist("tonedeaf top tracks");
    }
  }
 
  // get top tracks
  getTopTracks(index) {
    this.selectedIndex = 0;
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

  // convert artist array into comma string
  artistsToString(artists) {
    var result = "";
    for(var i = 0; i < artists.length; i++) {
      result += (i < artists.length - 1) ? artists[i].name + ", " : artists[i].name;
    }
    return result;
  }

  componentDidMount() {
    this.getTopTracks(0);
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
                  type={track.album.type}
                  album={track.album.name}
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