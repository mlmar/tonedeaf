import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import Genre from './Genre.js'
import Attributes from './Attributes.js'
import Track from '../track/Track.js';
import PlaylistCreator from '../PlaylistCreator.js';

// Recommendations based on genre
class Rec extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index : 0,
      genres : [],
      tracks : [],

      // attribute, min, max, step, default
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

    this.spotifyWebApi = new SpotifyWebApi();
    this.playlistCreator = new PlaylistCreator(this.props.userid);

    this.selectedAmount = 0;
    this.selectedGenres = "";

    this.genreClick = this.genreClick.bind(this);
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
      this.playlistCreator.createPlaylist("tonedeaf top tracks");
    }
  }

  // recommendation button
  //  gets parameters for recommendations
  getRecs() {
    if(this.selectedGenres.length > 0) {
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

  // creates a json object of parameters specified by the user or defaults
  parameters() {
    var params = {
      seed_genres : this.selectedGenres,
      limit : 50,

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

  // check when the attribute div was pressed
  attributeClick(event) {
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
    this.spotifyWebApi.getAvailableGenreSeeds()
      .then((response) => {
        this.setState({genres: response.genres});
        console.log("Succesfully retrieved genre seeds @");
        console.log(response);
      })
      .catch((error) => {
        console.error("Could not retrieve genre seeds @");
        console.error(error)
      });
  }

  // detect which button was clicked and pass index to callback prop function
  genreClick(event) {
    var tempArray = "";
    if(event.target.classList.contains("panel-genre")) {
      for (var i = 0; i < event.currentTarget.childNodes.length; i++) {
        var li = event.currentTarget.childNodes[i];

        // select the child that matches the button that was pressed
        if (event.target === li) {
          // select up to 5 genres
          if(!event.target.classList.contains("panel-selected") && this.selectedAmount < 5) {
            event.target.classList.add("panel-selected");
            this.selectedAmount++;
          } else if(event.target.classList.contains("panel-selected")){
            event.target.classList.remove("panel-selected");
            this.selectedAmount--;
          }
        }

        if(li.classList.contains("panel-selected")) {
          var innerText = li.childNodes[0].innerText;
          tempArray += tempArray.length > 0 ? "," +  innerText : innerText;
        }
      }
      
      console.log("setting selected genre indices to " + tempArray)
      this.selectedGenres = tempArray;
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
         <label className="label-medium"> 1 — Select up to 5 genres </label>
         <label className="label-subtext"> * Will add function to select artists later </label>
         <label className="label-medium"> 2 — Modify the minimum/maximum of any song attribute </label>
         <label className="label-medium"> 3 — Press 'get recommendations' </label>
        <button className="option-btn" onClick={this.getRecs}> Get Recommendations </button>
      </div>
    )

    var board;
    if(this.state.index === 0) {
      board = (
        <div className="div-genres" onClick={this.genreClick}>
          {
            this.state.genres.map((genre, i) => {
              var sel = "null";
              if(this.selectedGenres.includes({genre}.genre)) {
                sel = "true";
              }
              return (
                <Genre genre={genre} selected={sel} key={i}/>
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

export default Rec;