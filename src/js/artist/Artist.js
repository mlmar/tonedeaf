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
    var check_undefined = void(0)
    var rank = (this.props.rank !== check_undefined) ? 
      ( <React.Fragment> {this.props.rank}. </React.Fragment> ) : ""
    
    if(this.props.compact) {
      return (
        <div className="panel-compact animate-drop">
          <img className="img--small" src={this.props.image} width="90" height="90" alt="track art"/>
          <label className="label-small label-bold label-center"> {rank} {this.props.name} </label>
        </div>
      )

    } else {
      return (
        <div className="panel animate-drop">
          <div className="div-track">
            <a href={this.props.url} className="link-center">
              <img className="img--medium" src={this.props.image} width="100" height="100" alt="track art"/>
            </a>
            <div className="div-track--info noclick">
              <label className="label-medium"> {rank} {this.props.name} </label>
              <div className="div-track--info-item">
                <label className="label-small label-bold"> genres </label>
                <label className="label-small"> {this.props.genre} </label>
              </div>
              <div className="div-track--info-item">
                <label className="label-small label-bold"> popularity index </label>
                <label className="label-small"> {this.props.popularity} </label>
              </div>
              <div className="div-track--info-item">
                <label className="label-small label-bold"> followers </label>
                <label className="label-small"> {this.props.followers} </label>
              </div>
            </div>
          </div>
        </div>
      )
    } 
  }
}

export default Artist;