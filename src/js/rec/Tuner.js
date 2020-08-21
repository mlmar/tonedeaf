import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import Genre from './Genre.js'
import Attributes from './Attributes.js'
import Track from '../track/Track.js';
import PlaylistCreator from '../helper/PlaylistCreator.js';

// Recommendations based on genre
class Tuner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index : 0,
      selectedGenres : [],
      genres : [],
      tracks : [],

      // attribute, min, max, step, defaultMin, defaultMax
      // only defaults will be changed by the user
      attributes : [
        ["acousticness",      0, 1, .1,   0, 1],
        ["danceabilitiy",     0, 1, .1,   0, 1],
        ["energy",            0, 1, .1,   0, 1],
        ["instrumentalness",  0, 1, .1,   0, .5],
        ["key",               0, 10, 1,   0, 10],
        ["liveness",          0, 1, .1,   0, .5],
        ["loudness",          -80, 80, 1, -60, 30],
        ["minor/major",       0, 1, 1,    1,  1],
        ["popularity",        0, 100, 1,  0,  100],
        ["speechiness",       0, 1, .1,   0,  .3],
        ["tempo",             0, 200, 1,  0,  150],
        ["time signature",    0, 10, 1,   0,  8],
        ["valence",           0, 1, .1,   0,  1]
      ]
    };
    
    // attribute descriptions
    this.descriptions = [
      '1 = high chance to acoustic',
      'Based on "tempo, rhythm stability, beat strength, and overall regularity"',
      '0 is a "Bach prelude" and 1 is "death metal"',
      'Values above .5 are more likely to be instrumental',
      '0 = C, 1 = C#, etc.',
      'Values above .8 are more likely to be live',
      'Loudness in decibels, typically between -60 and 0',
      'Major = 1, Minor = 0',
      'Based on total number of plays and recency',
      'Values between .33-.66 may contain both speech and music',
      'Beats per minute',
      'Beats per bar',
      '0 = Sad, 1 = Happy'
    ]

    this.spotifyWebApi = new SpotifyWebApi();
    this.playlistCreator = new PlaylistCreator(this.props.userid);

    this.selectedAmount = 0;

    /********* BINDINGS *********/
    this.genreAdd = this.genreAdd.bind(this);
    this.genreRemove = this.genreRemove.bind(this);
    this.attributeClick = this.attributeClick.bind(this);
    this.parameters = this.parameters.bind(this);
    this.getRecs = this.getRecs.bind(this);
    this.getGenreSeeds = this.getGenreSeeds.bind(this);
    this.artistsToString = this.artistsToString.bind(this);
    this.createPlaylist = this.createPlaylist.bind(this);
  }


  createPlaylist() {
    if(this.state.tracks.length > 0) {
      this.playlistCreator.setTracks(this.state.tracks);
      this.playlistCreator.createPlaylist("tonedeaf tuner");
    }
  }

  // recommendation button
  //  gets parameters for recommendations
  getRecs() {
    if(this.state.selectedGenres.length > 0) {
      this.spotifyWebApi.getRecommendations(this.parameters())
        .then((response) => {
          this.setState({tracks: response.tracks, index: 2})
          console.log("Succesfully retrieved recommendations  @");
          console.log(response);
        })
        .catch((error) => {
          console.error("Could not retrieve recommendations @");
          console.error(error)
        });

    } else {
      console.log("No genres selected");
    }
  }

  /* creates a json object of parameters specified by the user or defaults
   *  seed_genres come from the selectedGenres list created by the user
   *  if not attribute sliders are changed then default values will be used anyway
   */
  parameters() {
    var params = {
      limit : 50, // number of items to return, 50 is max
      seed_genres : this.state.selectedGenres.join(),

      // attributes
      min_acousticness      : this.state.attributes[0][4],
      max_acousticness      : this.state.attributes[0][5],

      min_danceabilitiy     : this.state.attributes[1][4],
      max_danceabilitiy     : this.state.attributes[1][5],
      
      min_energy            : this.state.attributes[2][4],
      max_energy            : this.state.attributes[2][5],

      min_instrumentalness  : this.state.attributes[3][4],
      max_instrumentalness  : this.state.attributes[3][5],

      min_key               : this.state.attributes[4][4],
      max_key               : this.state.attributes[4][5],

      min_liveness          : this.state.attributes[5][4],
      max_liveness          : this.state.attributes[5][5],
      
      min_loudness          : this.state.attributes[6][4],
      max_loudness          : this.state.attributes[6][5],

      min_mode              : this.state.attributes[7][4],
      max_mode              : this.state.attributes[7][5],
      
      min_popularity        : this.state.attributes[8][4], 
      max_popularity        : this.state.attributes[8][5],

      min_speechiness       : this.state.attributes[9][4],
      max_speechiness       : this.state.attributes[9][5],

      min_tempo             : this.state.attributes[10][4],
      max_tempo             : this.state.attributes[10][5],

      min_time_signature    : this.state.attributes[11][4],
      max_time_signature    : this.state.attributes[11][5],

      min_valence           : this.state.attributes[12][4],
      max_valence           : this.state.attributes[12][5]
    }

    return(params);
  }

  /*  Check which attribute slider was affected
   *    - get index of pressed item and match to correct attrbiute min/max
   */
  attributeClick(event) {
    // since onClick is on the div, confirm tagName
    if(event.target.tagName === "INPUT") {
      var min = event.target.classList.contains("min");
      var index = event.target.id;
      var value = parseFloat(event.target.value);
      var newState;

      if(min) {
        newState = this.state.attributes;
        newState[index][4] = value;
        this.setState({attributes: newState})
      } else {
        newState = this.state.attributes;
        newState[index][5] = value;
        this.setState({attributes: newState})
      }
    }
  }

  // get list of generes
  getGenreSeeds() {
    if(this.props.cache.length === 0) {
      this.spotifyWebApi.getAvailableGenreSeeds()
        .then((response) => {

          // cache using setState callback to ensure the most recent variables are being cached
          this.setState({genres: response.genres},
          () => { this.props.callback(this.state.genres) });
          
          console.log("Succesfully retrieved genre seeds @");
          console.log("CACHING @ ");
          console.log(response);
          console.log("Genre seeds should only retrieved remotely once per session");
        })
        .catch((error) => {
          console.error("Could not retrieve genre seeds @");
          console.error(error)
        });
    } else {
      this.setState({ genres : this.props.cache })
      console.log("Successfully retrieved genre seeds FROM CACHE @ ");
      console.log(this.props.cache);
    }
  }

  // detect which button was clicked for REMOVING a genre
  genreRemove(event) {
    var tempArray = [];
    if(event.target.tagName === "BUTTON") {
      for(var i = 0; i < this.state.selectedGenres.length; i++) {
        if(i !== parseFloat(event.target.id)) {
          tempArray.push(this.state.selectedGenres[i]);
        }
      }
      this.selectedAmount--;
      this.setState({ selectedGenres : tempArray });
      console.log(tempArray);
    }
  }

  // detect which button was clicked for ADDING a genre
  genreAdd(event) {
    if(this.selectedAmount < 5) {
      var tempArray = this.state.selectedGenres;
      var innerText = event.target.innerText;
      var duplicate = tempArray.includes(event.target.innerText);
      if(event.target.tagName === "BUTTON" && !duplicate) {
        tempArray.push(innerText)
        this.selectedAmount++;
        this.setState({ selectedGenres : tempArray});
        console.log(tempArray);
      }
    }
  }

  artistsToString(artists) {
    var result = "";
    for(var i = 0; i < artists.length; i++) {
      result += (i < artists.length - 1) ? artists[i].name + ", " : artists[i].name;
    }
    return result;
  }

  componentDidMount() {
    this.getGenreSeeds();
  }
  
  render() {
    var display;
    var recButton = (
      <div className="panel animate-drop">
         <label className="label-medium"> Get recommendations based on song attribute and genres </label>
         <label className="label-subtext label-bold"> * Select up to 5 genres </label>
         <label className="label-subtext label-bold"> * Modify your song attribute preferences </label>
        <button className="option-btn" onClick={this.getRecs}> Get Recommendations </button>
      </div>
    )

    var board;
    if(this.state.index === 0) {
      board = (
        <div className="div-genres" onClick={this.genreAdd}>
          {
            this.state.genres.map((genre, i) => {
              return (
                <Genre genre={genre} key={i} id={i} type="+"/>
              )
            })
          }
        </div>
      )
      
      display = (
        <React.Fragment>
          {recButton}
          <div className="panel"> 
            <label className="label-small label-bold"> Selected genres will show up here. Press to them to remove. </label>
            <div className="div-selected-genres" onClick={this.genreRemove}>
              {
                this.state.selectedGenres.map((genre, i) => {
                  return (
                    <Genre genre={genre} key={i} id={i} type="-"/>
                  )
                })
              }
            </div>
          </div>
          {board}
        </React.Fragment>
      )

    } else if(this.state.index === 1) {
      board = (
        <div className="div-attributes" onClick={this.attributeClick}>
          {
            this.state.attributes.map((attribute, i) => {
              return (
                <Attributes
                  attribute={attribute[0]}
                  min={attribute[1]}
                  max={attribute[2]}
                  step={attribute[3]}
                  defaultMin={attribute[4]}
                  defaultMax={attribute[5]}
                  desc={this.descriptions[i]}
                  key={i}
                  id={i}
                />
              )
            })
          }
        </div>
      )

      display = (
        <React.Fragment>
          {recButton}
          {board}
        </React.Fragment>
      )
    } else {
      display = (
        <React.Fragment>
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
                  />
                </div>
              )
            })
          }
        </React.Fragment>
      )
    }

    return (
      <div>
        {display}
      </div>
    )
  }
}

export default Tuner;