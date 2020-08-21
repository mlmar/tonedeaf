import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

class Track extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropped : false
    }

    this.spotifyWebApi = new SpotifyWebApi();

    this.dropDownBtn = React.createRef();
    this.getKey = this.getKey.bind(this);
  }

  getKey(number) {
    switch(number) {
      case 0:   return "C";
      case 1:   return "C#";
      case 2:   return "D";
      case 3:   return "D#";
      case 4:   return "E";
      case 5:   return "F";
      case 6:   return "F#";
      case 7:   return "G";
      case 8:   return "G#";
      case 9:   return "A";
      case 10:  return "A#";
      case 11:  return "B";
      default:  return "?";
    }
  }
  
  render() {
    // if rank is provided, prepend it the title
    var check_undefined = void(0)
    var rank = (this.props.rank !== check_undefined) ?
      ( <React.Fragment> {this.props.rank}. </React.Fragment> ) : "";
    
    var button = "";
    var features = "";
    // if features is passed in as a 
    if(this.props.features) {
      button = (
        <button className="info-btn" ref={this.dropDownBtn} onClick={() => {
          var text = this.dropDownBtn.current.innerText;
          this.dropDownBtn.current.innerText = 
            (text === "Show Attributes") ? "Hide Attributes" : "Show Attributes";
          this.setState({ dropped : !this.state.dropped });
        }}> Show Attributes </button>
      )
      
      if(this.state.dropped) {
        features = (
          <div className="div-track--features animate-drop" ref={this.dropDown}>
            <label  className="label-medium"> Track Attributes </label>
            <span/>
            <label className="label-small div-item"> <span className="label-bold"> Acousticness      </span> {this.props.features.acousticness} </label>
            <label className="label-small div-item"> <span className="label-bold"> Danceability      </span> {this.props.features.danceability} </label>
            <label className="label-small div-item"> <span className="label-bold"> Duration (S)      </span> {this.props.features.duration_ms / 1000} </label>
            <label className="label-small div-item"> <span className="label-bold"> Energy            </span> {this.props.features.energy} </label>
            <label className="label-small div-item"> <span className="label-bold"> Instrumentalness  </span> {this.props.features.instrumentalness} </label>
            <label className="label-small div-item"> <span className="label-bold"> Key               </span> {this.getKey(this.props.features.key)} </label>
            <label className="label-small div-item"> <span className="label-bold"> Liveness          </span> {this.props.features.liveness} </label>
            <label className="label-small div-item"> <span className="label-bold"> Loudness          </span> {this.props.features.loudness} </label>
            <label className="label-small div-item"> <span className="label-bold"> Mode              </span> {this.props.features.mode} </label>
            <label className="label-small div-item"> <span className="label-bold"> Speechiness       </span> {this.props.features.speechiness} </label>
            <label className="label-small div-item"> <span className="label-bold"> Tempo             </span> {this.props.features.tempo} </label>
            <label className="label-small div-item"> <span className="label-bold"> Time Signature    </span> {this.props.features.time_signature} </label>
            <label className="label-small div-item"> <span className="label-bold"> Valence           </span> {this.props.features.valence} </label>
          </div>
        )
      }
    }

    if(this.props.compact) {
      return (
        <div className="panel-compact animate-drop">
          <img className="img--small " src={this.props.image} width="100" height="100" alt="track art"/>
          <label className="label-small label-bold label-center"> {rank} {this.props.title} </label>
          <label className="label-small label-center nopadding"> {this.props.artist} </label>
        </div>
      )
    } else {
      return (
        <div className="panel animate-drop">
          <div className="div-track">
            <a href={this.props.url} className="link-center">
              <img className="img--medium" src={this.props.image} width="100" height="100" alt="track art"/>
            </a>
            <div className="div-track--info">
              <label className="label-medium"> {rank} {this.props.title} </label>
              <label className="label-small"> {this.props.artist} </label>
              <br/>
              <label className="label-small"> {this.props.album} &#124; {this.props.year} </label>
            </div>
          </div>
          {button}
          {features}
        </div>
      )
    }
  }
}

export default Track;