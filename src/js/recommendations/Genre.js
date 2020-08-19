import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

/*  genre component, soley to show the name of a genre and become selected upon click
 */
class Genre extends React.Component {
  constructor(props) {
    super(props);
    this.spotifyWebApi = new SpotifyWebApi();
  }
  
  render() {
    var classes = "panel panel-genre animate-drop";
    if(this.props.selected === "true") {
      classes += " panel-selected";
    }

    return (
      <div className={classes}>
        <label className="label-small label-bold label-nopadding noclick"> {this.props.genre} </label>
      </div>
    )
  }
}

export default Genre;