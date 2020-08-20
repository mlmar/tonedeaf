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
      ( <React.Fragment> {this.props.rank}. </React.Fragment> ) : "";

    if(this.props.compact) {
      return (
        <div className="panel animate-drop">
          <img className="img--medium" src={this.props.image} width="100" height="100" alt="track art"/>
          <label className="label-small label-bold label-center"> {rank} {this.props.title} </label>
          <label className="label-small label-center nopadding"> {this.props.artist} </label>
        </div>
      )
    } else {
      return (
        <div className="panel animate-drop">
          <div className="div-track">
            <a href={this.props.url}>
              <img className="img--medium" src={this.props.image} width="100" height="100" alt="track art"/>
            </a>
            <div className="div-track--info">
              <label className="label-medium"> {rank} {this.props.title} </label>
              <label className="label-small"> {this.props.artist} </label>
              <br/>
              <label className="label-small"> {this.props.album} &#124; {this.props.year} </label>
            </div>
          </div>
        </div>
      )
    }
  }
}

export default Track;