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
        url : this.props.url,
        year : this.props.year,
        rank : this.props.rank
      }
    };
    
    this.spotifyWebApi = new SpotifyWebApi();
  }
  
  render() {
    // if rank is provided, prepend it the title
    var check_undefined = void(0)
    var rank = (this.state.track.rank !== check_undefined) ?
      ( <React.Fragment> {this.state.track.rank}. </React.Fragment> ) : ""

    return (
      <div className="panel">
        <div className="div-track">
          <a href={this.state.track.url}>
            <img className="div-track--img" src={this.state.track.image} width="100" height="100" alt="track art"/>
          </a>
          <div className="div-track--info">
            <label className="label-medium"> {rank} {this.state.track.title} </label>
            <label className="label-small"> {this.state.track.artist} </label>
            <label className="label-small label-italic"> {this.state.track.year} </label>
          </div>
        </div>
      </div>
    )
  }
}

export default Track;