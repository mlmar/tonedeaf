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
        genre : this.props.genre,
        popularity : this.props.popularity,
        followers: this.props.followers
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
                <div className="div-track--info-item">
                  <label className="label-small label-bold"> genres </label>
                  <label className="label-small"> {this.state.artist.genre} </label>
                </div>
                <div className="div-track--info-item">
                  <label className="label-small label-bold"> popularity index </label>
                  <label className="label-small"> {this.state.artist.popularity} </label>
                </div>
                <div className="div-track--info-item">
                  <label className="label-small label-bold"> followers </label>
                  <label className="label-small"> {this.state.artist.followers} </label>
                </div>
              </div>
            </div>
          </a>
        
      </div>
    )
  }
}

export default Artist;