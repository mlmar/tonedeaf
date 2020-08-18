import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import Track from './Track.js';

class TopTracks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks : [],
    };

    this.selectedIndex = 0;

    this.cleanRange = ["last few years", "6 months", "4 weeks"]
    this.range = ["long_term", "medium_term", "short_term"];

    this.spotifyWebApi = new SpotifyWebApi();
    this.getTopTracks = this.getTopTracks.bind(this);
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
      name : "tonedeaf top tracks",
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
  
  // get the uris of top tracks
  getUris() {
    var uris = [];
    for(var i = 0; i < this.state.tracks.length; i++) {
      uris.push(this.state.tracks[i].uri);
    }
    console.log(uris);
    return uris;
  }

  /**************************** end playlists ****************************/

  // get top tracks
  getTopTracks(index) {
    this.selectedIndex = 0;

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