import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import Artist from '../artist/Artist.js'

// Recommendations based on genre
class Circle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artists : [],
    };

    this.spotifyWebApi = new SpotifyWebApi();

    this.selectedAmount = 0;

    this.genreClick = this.genreClick.bind(this);
    this.getRecs = this.getRecs.bind(this);
  }

  // recommendation button
  //  gets parameters for recommendations
  getRecs() {
    this.parameters();
    
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

  componentDidMount() {
//     this.getGenreSeeds();
    console.log("mounted")
  }
  
  render() {
    return (
      <div>
        <div className="panel animate-drop">
          <label className="label-medium"> circle </label>
          <input type="text" className="input-item input-search"/>
        </div>
        <div>
          {
            this.state.artists.map((artist, i) => {
              console.log({i});
            })
          }
        </div>
      </div>
    )
  }
}

export default Circle;