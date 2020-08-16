import React from 'react';

import SpotifyWebApi from 'spotify-web-api-js';

class Track extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      track : {
        image : this.props.image,
        title : this.props.title,
        artist : this.props.artist,
        url : this.props.url
      }
    };
    
    this.spotifyWebApi = new SpotifyWebApi();
  }
  
  render() {
    return (
      <div className="panel">
        
          <a href={this.state.track.url}>
            <div className="div-track">
              <img className="div-track--img" src={this.state.track.image} width="100" height="100" alt="track art"/>
              <div className="div-track--info">
                <label className="label-medium"> {this.state.track.title} </label>
                <label className="label-small"> {this.state.track.artist} </label>
              </div>
            </div>
          </a>
        
      </div>
    )
  }
}

export default Track;