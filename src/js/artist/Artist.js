import React from 'react';

import SpotifyWebApi from 'spotify-web-api-js';

class Artist extends React.Component {
  constructor(props) {
    super(props);

    // track is pased on through a prop as an object

    this.state = {
      artist : {
        image : this.props.image,
        name : this.props.name,
        url : this.props.url,
        genre : this.props.genre
      }
    };
    
    this.spotifyWebApi = new SpotifyWebApi();
  }
  
  render() {
    return (
      <div className="panel">
        
          <a href={this.state.artist.url}>
            <div className="div-track">
              <img className="div-track--img" src={this.state.artist.image} width="100" height="100" alt="track art"/>
              <div className="div-track--info">
                <label className="label-medium"> {this.state.artist.name} </label>
                <label className="label-small"> {this.state.artist.genre} </label>
              </div>
            </div>
          </a>
        
      </div>
    )
  }
}

export default Artist;