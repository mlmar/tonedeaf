import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import Artist from '../artist/Artist.js';
import Track from '../track/Track.js';


/*  FEATURES COMPONENT
 *    - stats not completely implemented yet
 *    - will only retrieve track features based on long term, medium term and short term tracks
 */
class Features extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tracks : [],
      feature : [],
      fetching : true
    };

    this.range = ["long_term", "medium_term", "short_term"];
    
    this.spotifyWebApi = new SpotifyWebApi();

    this.getFeatures = this.getFeatures.bind(this);
    this.getTopTracks = this.getTopTracks.bind(this);
    this.getIds = this.getIds.bind(this);
    this.artistsToString = this.artistsToString.bind(this);

  }

  /*  Gets audio features for tracks
   *    1) Check for track cache -- if empty generate tracks
   *    2) Check for features cache -- if empty generate features
   */

  getFeatures(index) {
    this.getTopTracks(index);
    console.log("yeah");
    console.log(this.state.tracks);
//     var features;
//     if(this.props.cacheFeatures[index].length === 0) {

//       this.spotifyWebApi.getAudioFeaturesForTracks(this.getIds(tracks))
//         .then((response) => {

//           console.log("Successfully retrieved audio features");
//           console.log(response);
//         })
//         .catch((error) => {
//           console.error("Could not retrieve top tracks @");
//           console.error(error);
//         }); 
//     } else {
//       features = this.props.cacheFeatures;
//     }

//     console.log(features);

  }

  /*  Retrives track ids from existing track list
   *  pushes to id array then converts to a comma separated list
   */
  getIds(tracks) {
    var ids = [];
    for(var i = 0; i < tracks.length; i++) {
      ids.push(tracks[i].id);
    }
    return ids.join(",");
  }

    /*  Retrieves top tracks based on index of range
   *    if cache is empty, use api to retrieve tracks then cache,
   *    otherwise setState from cache
   */
  getTopTracks(index) {
    var tracks = [];

    if(this.props.cacheTracks[index].length === 0) {
      var selected_range = {
        time_range : this.range[index],
        limit : 50
      }

      return this.spotifyWebApi.getMyTopTracks(selected_range)
        .then((response) => {

          // cache using setState callback to ensure the most recent variables are being cached
          this.setState({ tracks : response.items},
          () => { this.props.callbackTracks(index, response.items) });
          
          console.log("Succesfully retrieved top tracks @ " + index);
          console.log("CACHING @ " + index);
          console.log("Each track list should only retrieved remotely once per session");
        })
        .catch((error) => {
          console.error("Could not retrieve top tracks @");
          console.error(error);
        });
    } else {
      this.setState({ tracks : this.props.cache[index]});
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

  // get logn term tracks by default
  componentDidMount() {
    this.getFeatures(0);
  }



  render() {
    if(!this.state.fetching) {
      return (
        <div>
        </div>
      )
    }

   return <div className="animate-load"> </div>;
  }

}

export default Features;