import React from 'react';

import { session } from '../util/Session.js';

import Options from '../helper/Options.js';
import Load from '../helper/Load.js';
import Create from '../helper/Create.js';

import GenreSelect from './components/GenreSelect.js';
import AttributeSelect from './components/AttributeSelect.js';
import TrackList from '../track/components/TrackList.js';

import SpotifyWebApi from 'spotify-web-api-js';

const spotifyWebApi = new SpotifyWebApi();
  
  
class TunerPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index : 0,
      selectedGenres : [],
      genres : [],
      tracks : null,
      fetching : false,

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
    }
    
    this.description = <label className="label-small"> Get recommendations based on 3-5 generes and any preferred attributes. </label>
  
    this.setIndex = this.setIndex.bind(this);
    this.getGenreSeeds = this.getGenreSeeds.bind(this);
    this.genreAdd = this.genreAdd.bind(this);
    this.genreRemove = this.genreRemove.bind(this);
    this.attributeClick = this.attributeClick.bind(this);
    this.getRecommendations = this.getRecommendations.bind(this);
    this.getRecParams = this.getRecParams.bind(this);
  }
  

  /*  Set the selected time range for recent artists list
    *    {index} : retrieves range through this.ranges[index]
    */
  setIndex(index) {
    this.setState({ index : index });
  }

  /*  Retrieves genre seeds to pass to genre selection component
  *    save genre seeds to cache
  *    ideally should only be called once per session
  */
  getGenreSeeds(callback) {
    spotifyWebApi.getAvailableGenreSeeds()
      .then((response) => {

        this.setState({ genres : response.genres });
        if(session) session.setCache("genres", "genres", response.genres);

        if(callback) callback(response.genres);
        console.log("API SUCCESS: retrieved genre seeds")
        console.log(response.genres);
      })
      .catch((error) => {
        console.error("API ERROR: could not retrieve genre seeds");
        console.error(error);
      });
  }


  // detect which button was clicked for ADDING a genre
  genreAdd(event) {
    if(this.state.selectedGenres.length < 5) {
      var tempArray = [...this.state.selectedGenres];
      var innerText = event.target.innerText;
      var duplicate = tempArray.includes(event.target.innerText);
      if(event.target.tagName === "BUTTON" && !duplicate) {
        tempArray.push(innerText)
        this.selectedAmount++;
        this.setState({ selectedGenres : tempArray});
      }
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
      this.setState({ selectedGenres : tempArray });
    }
  }

  /*  Check which attribute slider was affected
  *     - get index of pressed item and match to correct attrbiute min/max
  *     - called from AttributeSelect component
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
        this.setState({ attributes : newState })
      } else {
        newState = this.state.attributes;
        newState[index][5] = value;
        this.setState({ attributes : newState })
      }
    }
  }

  // Onclick for get recommendations button
  //  called from GenreSelect component
  getRecommendations() {
    if(this.state.selectedGenres.length > 0) {
      this.setState({ fetching : true });
      spotifyWebApi.getRecommendations(this.getRecParams())
        .then((response) => {
          this.setState({tracks: response.tracks, index: 2, fetching : false })
          console.log("Succesfully retrieved recommendations  @");
          console.log(response);
        })
        .catch((error) => {
          this.setState({ fetching : false });
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
  getRecParams() {
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

  componentDidMount() {
    var genresCache = session ? session.getCache("genres").genres : null;

    if(!genresCache) {
      this.getGenreSeeds();
    } else {
      this.setState({ genres : genresCache });
      console.log("CACHE: Retrieved genres from previous state");
    }
  }
  
  renderOptions() {
    return (
      <>
        <Options
          text="Tuner" 
          suboptions={["Edit Preferences"]}
          subcallback={() => { this.setState({ index: 0, tracks : null, selectedGenres : [] })}} > 
          {this.description}
        </Options>
        <Create text="tonedeaf tuner tracks" tracks={this.state.tracks}/>

      </>
    )
  }

  renderControl() {
    if(this.state.fetching) {
      return <Load text="Getting recommendations from Spotify..."/>
    }

    switch(this.state.index) {
      case 0:
      case 1:
        return (
          <>
            <GenreSelect
              data={this.state.genres}
              selected={this.state.selectedGenres}
              add={this.genreAdd}
              remove={this.genreRemove}
              get={this.getRecommendations}
              show={this.state.index === 0}
            />
        
            { this.state.index === 1 &&
              <AttributeSelect
                data={this.state.attributes}
                onClick={this.attributeClick}
              />
            }
          </>
        )
      case 2:
        if(this.state.tracks.length === 0) {
          return <Load text="If this doesn't work, the Spotify servers might not be working correctly right now."/>
        }

        return (
          <TrackList
            data={this.state.tracks}
          />
        )
      default:
        break;
    }
  }

  render() {
    return (
      <>
        <div className="div-sidebar"> 
          
          { !this.state.tracks &&
            <Options
              horizontal
              text="Tuner"
              suboptions={["Genres", "Attributes"]}
              subcallback={this.setIndex}
            >
              {this.description}
            </Options>
          }

          { this.state.tracks && this.renderOptions()}
          {this.props.children}
        </div>

        <div className="div-panels"> 
          {this.renderControl()}
        </div>
      </>

    )
  }
}

export default TunerPage;