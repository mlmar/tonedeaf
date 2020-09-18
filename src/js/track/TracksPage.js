import React from 'react';

import { session } from '../util/Session.js';

import Options from '../helper/Options.js';
import List from '../helper/List.js';
import TrackList from './components/TrackList.js';


import SpotifyWebApi from 'spotify-web-api-js';
import PlaylistCreator from '../util/PlaylistCreator.js';


const spotifyWebApi = new SpotifyWebApi();


class TracksPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRange : "long_term",
      tracks : { long_term : null, medium_term : null, short_term : null },
      features : { long_term : null, medium_term : null, short_term : null },
      averageFeatures : { long_term : null, medium_term : null, short_term : null },
      compact : true
    }

    this.ranges = ["long_term", "medium_term", "short_term"];

    this.playlistCreator = new PlaylistCreator(session.getCache("user").id);
    
    this.createPlaylist = this.createPlaylist.bind(this);
    this.setSelectedRange = this.setSelectedRange.bind(this);
    this.setView = this.setView.bind(this);
    this.getTopTracks = this.getTopTracks.bind(this);
    this.getFeatures = this.getFeatures.bind(this);
    this.getIds = this.getIds.bind(this);
    this.averageFeatures = this.averageFeatures.bind(this);
  }

  // use PlaylistCreator to create playlist from current selected tracklist
  createPlaylist() {
    if(this.state.tracks[this.state.selectedRange]) {
      this.playlistCreator.setTracks(this.state.tracks[this.state.selectedRange]);
      this.playlistCreator.createPlaylist("tonedeaf top tracks");
    }
  }
  /*  Set the selected time range for top tracks list
   *    {index} : retrieves range through this.ranges[index]
   */
  setSelectedRange(index) {
    var range = this.ranges[index];
    if(!this.state.tracks[range]) { // if the tracks have already been loaded, don't call API
      this.getTopTracks(range, this.getFeatures);
    } else {
      console.log("CACHE: Retrieved tracks from previous state");
    }

    this.setState({ selectedRange : range });
  }

  setView(index) {
    this.setState({ compact : index === 0 })
  }
 
  /*  Retrieves top tracks based on selectedIndex of range
   *    save top tracks to cache
   *    ideally should only be called once per session
   */
  getTopTracks(range, callback) {
    var params = { time_range : range, limit : 50 }
    var tracks = JSON.parse(JSON.stringify(this.state.tracks)); // make a deep copy of the state

    spotifyWebApi.getMyTopTracks(params)
      .then((response) => {
        tracks[range] = response.items;
        this.setState({ tracks : tracks });
        if(session) session.setCache("tracks", range, response.items);

        if(callback) callback(range, response.items);
        console.log("API SUCCESS: retrieved top tracks")
        console.log(response.items);
      })
      .catch((error) => {
        console.error("API ERROR: could not retrieve top tracks");
        console.error(error);
      });
  }

  /*  Get audio features for the current track list -- should be called and set by getTopTracks
   */
  getFeatures(range, tracks) {
    var features = JSON.parse(JSON.stringify(this.state.features)); // make a deep copy of the state

    spotifyWebApi.getAudioFeaturesForTracks(this.getIds(tracks))
      .then((response) => {
        features[range] = response.audio_features;
        this.setState({ features : features });
        if(session) session.setCache("features", range, response.audio_features);

        this.averageFeatures(range, response.audio_features);

        console.log("API SUCCESS: retrieved track features")
        console.log(response.audio_features);
      })
      .catch((error) => {
        console.error("API ERROR: could not retrieve track features");
        console.error(error);
      }); 
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
   */
  averageFeatures(range, features) {
    var items = [
      "Acousticness", "Danceability", "Duration (S)",
      "Energy", "Instrumentalness", "Key",
      "Liveness", "Loudness", "Mode", 
      "Popularity", "Speechinesss", "Tempo", 
      "Time Signature", "Valence"];

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
      popularity        += this.state.tracks[range][i].popularity;
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

    var averagesJSON = {};
    for(var k = 0; k < averages.length; k++) {
      var objKey = items[k], value = averages[k];
      averagesJSON[objKey] = value;
    }

    var averageFeatures = JSON.parse(JSON.stringify(this.state.averageFeatures)); // make a deep copy of the state
    averageFeatures[range] = averagesJSON;
    if(session) session.setCache("averageFeatures", range, averagesJSON);
    
    this.setState({ averageFeatures : averageFeatures });
  }

  /*  Returns the actual key for features key number
   *
   */
  getKey(number) {
    var keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    return keys[number];
  }

  componentDidMount() {
    var tracksCache = null, featuresCache = null, averageFeaturesCache = null;
    if(session) {
      tracksCache = session.getCache("tracks");
      featuresCache = session.getCache("features");
      averageFeaturesCache = session.getCache("averageFeatures");
      this.setState({ tracks : tracksCache, features : featuresCache, averageFeatures : averageFeaturesCache });
    }

    // check if long_term key already exists in the cache since it should be the first thing the user sees
    if(!session || !(tracksCache["long_term"] && featuresCache["long_term"] && averageFeaturesCache["long_term"])) {
      this.getTopTracks("long_term", this.getFeatures);
    } else {
      console.log("CACHE: Retrieved tracks from previous state");
    }
  }

  render() {
    return (
      <>
        <div className="div-sidebar"> 
          <Options 
            horizontal
            text="Your Top Tracks"
            options={["Long Term", "6 Months", "4 Weeks"]}
            callback={this.setSelectedRange}
            suboptions={["compact","list"]}
            subcallback={this.setView}
          />

          <Options
            text="Like these tracks?"
            suboptions={["Create Spotify Playlist"]}
            subcallback={this.createPlaylist}
          />
          
          <List 
            text="Attribute Averages" 
            items={this.state.averageFeatures[this.state.selectedRange]} 
          />

          {this.props.children}
        </div>

        <div className="div-panels"> 
          <TrackList
            compact={this.state.compact}
            ranked
            data={this.state.tracks[this.state.selectedRange]}
            features={this.state.features[this.state.selectedRange]}
            loadText="Getting your top tracks from Spotify..."
          />
        </div>
      </>

    )
  }
}

export default TracksPage;