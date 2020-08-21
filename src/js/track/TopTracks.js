import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import Track from './Track.js';
import PlaylistCreator from '../helper/PlaylistCreator.js';

/*  TOP TRACKS COMPONENT
 *    - Required props: userid, cache
 *        userid  : needed to for PlaylistCreator
 *        cache   : needed to cache top artists to reduce api calls
 *
 *    - implements Track component to display individual artists
 *    - uses SpotifyWebApi to retrieve top artist and create playlists based on user's id
 */
class TopTracks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks : [],
      fetching : true
    };

    this.playlistCreator = new PlaylistCreator(this.props.userid);

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
 
  /*  Retrieves top tracks based on index of range
   *    if no cache is found, use api to retrieve tracks then cache,
   *    otherwise setState from cache
   */
  getTopTracks(index) {
    if(this.props.cache[index].length === 0) {
      var selected_range = {
        time_range : this.range[index],
        limit : 50
      }

      this.spotifyWebApi.getMyTopTracks(selected_range)
        .then((response) => {

          // cache using setState callback to ensure the most recent variables are being cached
          this.setState(
            { tracks : response.items, fetching : false }, 
            () => {this.props.callback(index, this.state.tracks)} );
          
          console.log("Succesfully retrieved top tracks @ " + index);
          console.log("CACHING @ " + index);
          console.log(this.state.tracks);
          console.log("Each track list should only retrieved remotely once per session");
        })
        .catch((error) => {
          console.error("Could not retrieve top tracks @")
          console.error(error)
        });
    } else {
      this.setState({ tracks : this.props.cache[index], fetching : false })
      console.log("Successfully retrieved top tracks FROM CACHE @ CACHED_TRACKS " + index);
      console.log(this.props.cache);
    }
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
    
    setTimeout(() => {
      if(this.state.fetching) {
        this.getTopTracks(0);
      } else {
        console.log("timeout was not needed");
      }
    }, 2000);
  }
  
  render() {
    console.log("fetching @ " + this.state.fetching + 
      ", with length of " + this.state.tracks.length);
    
    if(!this.state.fetching) {
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
    return <div className="animate-load"> </div>;
  }
}

export default TopTracks;