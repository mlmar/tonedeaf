import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import Track from './Track.js';
import PlaylistCreator from '../helper/PlaylistCreator.js';

/*  TOP TRACKS COMPONENT
 *    - Required props: userid, cache
 *        userid            : needed for PlaylistCreator
 *        cache             : needed to retrieve top artists to reduce api calls
 *        callback          : callback used to cache tracks in parent component
 *        cacheAverages     : needed to retrieve average track attributes
 *        callbackAverages  : used to cache averages in parent component
 *        
 *
 *    - implements Track component to display individual artists
 *    - uses SpotifyWebApi to retrieve top artist and create playlists based on user's id
 */
class TopTracks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks : [],
      features : [],
      fetching : true
    };

    this.playlistCreator = new PlaylistCreator(this.props.userid);

    this.cleanRange = ["last few years", "6 months", "4 weeks"]
    this.range = ["long_term", "medium_term", "short_term"];

    this.spotifyWebApi = new SpotifyWebApi();
    this.playlistCreator = new PlaylistCreator(this.props.userid);


    this.createPlaylist = this.createPlaylist.bind(this);
    this.getTopTracks = this.getTopTracks.bind(this);
    this.artistsToString = this.artistsToString.bind(this);
    this.getFeatures = this.getFeatures.bind(this);
    this.getIds = this.getIds.bind(this);
    this.average = this.average.bind(this);
    this.getKey = this.getKey.bind(this);
  }
  

  createPlaylist() {
    if(this.state.tracks.length > 0) {
      this.playlistCreator.setTracks(this.state.tracks);
      this.playlistCreator.createPlaylist("tonedeaf top tracks");
    }
  }
 
  /*  Retrieves top tracks based on index of range
   *    if cache is empty, use api to retrieve tracks then cache,
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
            { tracks : response.items }, 
            () => {
              this.props.callback(index, this.state.tracks);
              this.getFeatures(index, this.state.tracks);
            } 
          );
          
          console.log("Succesfully retrieved top tracks @ " + index);
          console.log("CACHING TRACKS @ CACHE.TRACKS " + index);
          console.log(response.items);
          console.log("Each track list should only retrieved remotely once per session");
        })
        .catch((error) => {
          console.error("Could not retrieve top tracks @");
          console.error(error);
        });
    } else {
      this.setState({ tracks : this.props.cache[index] },
        () => { this.getFeatures(index, this.props.cache[index]) });
      console.log("Successfully retrieved top tracks FROM CACHE @ CACHE.TRACKS " + index);
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

  /*  Get audio features for the current track list -- should be called and set by getTopTracks
   *    - if cache is emtpy, generate features, otherwise pull from cache
   */
  getFeatures(index, tracks) {
    if(this.props.cacheFeatures[index].length === 0) {
      this.spotifyWebApi.getAudioFeaturesForTracks(this.getIds(tracks))
        .then((response) => {
          this.setState(
            { features : response.audio_features, fetching : false }, 
            () => {
              this.props.callbackFeatures(index, this.state.features);
              this.average(index, this.state.features);
            });

          console.log("Succesfully retrieved audio features @ " + index);
          console.log("CACHING FEATURES @ CACHE.FEATURES " + index);
          console.log(response.audio_features);
          console.log("Each feature list should only retrieved remotely once per session");
        })
        .catch((error) => {
          console.error("Could not retrieve top tracks @");
          console.error(error);
        }); 
    } else {
      console.log("Successfully retrieved features from cache @ CACHE.FEATURES " + index);
      this.setState({ features : this.props.cacheFeatures[index], fetching : false },
        () => { this.average(index, this.state.features) })
    }
  }

  /*  Get all track id's of current track list and convert to comma separated list
   *
   */
  getIds(tracks) {
    var ids = [];
    for(var i = 0; i < tracks.length; i++) {
      ids.push(tracks[i].id);
    }
    return ids.join(",");
  }

  /*  Acousticness       Loudness         
   *  Danceability       Mode             
   *  Duration (S)       Speechiness      
   *  Energy             Tempo            
   *  Instrumentalness   Time Signature   
   *  Key                Valence    
   *  Liveness        
   */

  /*  Calcualtes averages for track attributes
   *    - if cache is empty, calculate, otherwise retrieve from cache
   *    - pass back to callback function to show avearges in a list component
   */
  average(index, features) {
    var items = [
      "Acousticness", "Danceability", "Duration (S)",
      "Energy", "Instrumentalness", "Key",
      "Liveness", "Loudness", "Mode", 
      "Popularity", "Speechinesss", "Tempo", 
      "Time Signature", "Valence"];

    var descriptions = [];

    if(this.props.cacheAverages[index].length === 0) {
      var length = features.length;

      var acousticness = 0;
      var danceability = 0;
      var duration = 0;
      var energy = 0;
      var instrumentalness = 0;
      var key = 0;
      var liveness = 0;
      var loudness = 0;
      var mode = 0;
      var popularity = 0; // only stat that isn't retrieved by audio features call
      var speechiness = 0;
      var tempo = 0;
      var time_signature = 0;
      var valence = 0;

      for(var i = 0; i < length; i++) {
        acousticness      += features[i].acousticness;
        danceability      += features[i].danceability
        duration          += features[i].duration_ms / 1000;
        energy            += features[i].energy;
        instrumentalness  += features[i].instrumentalness;
        key               += features[i].key;
        liveness          += features[i].liveness;
        loudness          += features[i].loudness;
        mode              += features[i].mode;
        popularity        += this.state.tracks[i].popularity;
        speechiness       += features[i].speechiness;
        tempo             += features[i].tempo;
        time_signature    += features[i].time_signature;
        valence           += features[i].valence;
      }

      var averages = [
        acousticness, danceability, duration,
        energy, instrumentalness, key,
        liveness, loudness, mode, 
        popularity, speechiness, tempo, 
        time_signature, valence
      ];

      for(var j = 0; j < averages.length; j++) {
        averages[j] = Math.round(averages[j] / length * 100) / 100;
      }

      averages[5] = this.getKey(Math.round(averages[5]));
      
      this.props.callbackAverages(index, averages)
      console.log("Calculating averages @");
      console.log("CACHING AVERAGES @ CACHE.AVERAGES " + index)
      console.log(averages);

      descriptions = averages;
    } else {
      console.log("Successfully retrieved averages from cache @ CACHE.AVERAGES " + index);
      descriptions = this.props.cacheAverages[index];
    }
    
    // show averages using callback function to setstate of a list component
    this.props.showAverages(items, descriptions);
  }

    /*  Returns the actual key for features key number
   *
   */
  getKey(number) {
    switch(number) {
      case 0:   return "C";
      case 1:   return "C#";
      case 2:   return "D";
      case 3:   return "D#";
      case 4:   return "E";
      case 5:   return "F";
      case 6:   return "F#";
      case 7:   return "G";
      case 8:   return "G#";
      case 9:   return "A";
      case 10:  return "A#";
      case 11:  return "B";
      default:  return "?";
    }
  }

  componentDidMount() {
    this.getTopTracks(0);
  }
  
  render() {
    //console.log("fetching @ " + this.state.fetching + 
    //  ", with length of " + this.state.tracks.length);
    
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
                    popularity={track.popularity}
                    features={this.state.features[i]}
                    key={track.name + track.album.release_date.split("-")[0]}
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