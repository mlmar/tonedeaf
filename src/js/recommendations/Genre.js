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
    var classes = "genre-btn animate-drop label-bold";
    classes += this.props.type === "-" ? " dark-btn" : "";

    return (
      <button className={classes} id={this.props.id}> {this.props.genre} </button>
    )
  }
}

export default Genre;