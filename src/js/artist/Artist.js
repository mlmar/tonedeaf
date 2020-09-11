import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

/*  artist component
 *  displays artists name, image, genres
 *  can be displayed in a compact mode with props.compact
 */
class Artist extends React.Component {
  constructor(props) {
    super(props);

    // track is pased on through a prop as an object
    this.state = {
      id : this.props.id
    };
    
    this.spotifyWebApi = new SpotifyWebApi();
  }
  
  render() {
    // if rank is provided, prepend it to the name
    var rank = this.props.rank ? this.props.rank + ". " : ""
    
    return (
      <div className="panel animate-drop">
        <div className="div-track">
          <a href={this.props.url} className="link-center">
            <img className="img--medium" src={this.props.image} width="100" height="100" alt="track art"/>
          </a>
          <div className="info noclick">
            <label className="label-medium"> {rank} {this.props.name} </label>
            <div className="item">
              <label className="label-small label-bold"> genres </label>
              <label className="label-small"> {this.props.genre} </label>
            </div>
            <div className="item">
              <label className="label-small label-bold"> popularity index </label>
              <label className="label-small"> {this.props.popularity} </label>
            </div>
            <div className="item">
              <label className="label-small label-bold"> followers </label>
              <label className="label-small"> {this.props.followers} </label>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Artist;