import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

class Genre extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      genre : this.props.genre
    };
    
    this.spotifyWebApi = new SpotifyWebApi();
  }
  
  render() {
    var classes = "panel panel-genre animate-drop";
    if(this.props.selected === "true") {
      classes += " panel-selected";
    }
    return (
      <div className={classes}>
        <label className="label-small label-bold label-nopadding noclick"> {this.state.genre} </label>
      </div>
    )
  }
}

export default Genre;