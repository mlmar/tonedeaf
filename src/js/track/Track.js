import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

class Track extends React.Component {
  constructor(props) {
    super(props);
    this.spotifyWebApi = new SpotifyWebApi();
  }
  
  render() {
    // if rank is provided, prepend it the title
    var check_undefined = void(0)
    var rank = (this.props.rank !== check_undefined) ?
      ( <React.Fragment> {this.props.rank}. </React.Fragment> ) : ""

    return (
      <div className="panel">
        <div className="div-track">
          <a href={this.props.url}>
            <img className="div-track--img" src={this.props.image} width="100" height="100" alt="track art"/>
          </a>
          <div className="div-track--info">
            <label className="label-medium"> {rank} {this.props.title} </label>
            <label className="label-small"> {this.props.artist} </label>
            <br/>
            <label className="label-small"> {this.props.album} | {this.props.year} </label>
          </div>
        </div>
      </div>
    )
  }
}

export default Track;