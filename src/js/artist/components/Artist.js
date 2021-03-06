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
    
    if(this.props.compact) {
      return (
        <div className="panel noshadow compact">
          <a href={this.props.url} className="link-center" title={rank + this.props.name}>
            <img className="img--medium" src={this.props.image} alt="track art"/>
          </a>
        </div>
      )
    }

    return (
      <div className="panel">
        <div className="div-track">
          <a href={this.props.url} className="link-center">
            <img className="img--medium" src={this.props.image} alt="track art"/>
          </a>
          <div className="info noclick">
            <label className="label-medium label-bold"> {rank} {this.props.name} </label>
            <div className="item">
              <label className="label-small"> Genres </label>
              <label className="label-small"> {this.props.genre} </label>
            </div>
            <div className="item">
              <label className="label-small"> Popularity </label>
              <label className="label-small"> {this.props.popularity} </label>
            </div>
            <div className="item">
              <label className="label-small"> Followers </label>
              <label className="label-small"> {this.props.followers} </label>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Artist;