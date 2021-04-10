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
  
  /*  Returns the actual key for features key number
   *
   */
  getKey(number) {
    var keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    return keys[number];
  }
  
  render() {
    // if rank is provided, prepend it the title
    var rank = this.props.rank ? this.props.rank + ". " : "";

    if(this.props.compact) {
      return (
        <div className="panel noshadow compact">
          <a href={this.props.url} className="link-center">
            <img className="img--medium" src={this.props.image} alt="track art" title={rank + this.props.title}/>
          </a>
        </div>
      )
    }
    
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
          <div className="features animate-drop" ref={this.dropDown}>
            <label  className="label-medium"> Track Attributes </label>
            <span/>
            <label className="label-small grid-50-50"> <span className="label-bold"> Acousticness      </span> {this.props.features.acousticness} </label>
            <label className="label-small grid-50-50"> <span className="label-bold"> Danceability      </span> {this.props.features.danceability} </label>
            <label className="label-small grid-50-50"> <span className="label-bold"> Duration (S)      </span> {this.props.features.duration_ms / 1000} </label>
            <label className="label-small grid-50-50"> <span className="label-bold"> Energy            </span> {this.props.features.energy} </label>
            <label className="label-small grid-50-50"> <span className="label-bold"> Instrumentalness  </span> {this.props.features.instrumentalness} </label>
            <label className="label-small grid-50-50"> <span className="label-bold"> Key               </span> {this.getKey(this.props.features.key)} </label>
            <label className="label-small grid-50-50"> <span className="label-bold"> Liveness          </span> {this.props.features.liveness} </label>
            <label className="label-small grid-50-50"> <span className="label-bold"> Loudness          </span> {this.props.features.loudness} </label>
            <label className="label-small grid-50-50"> <span className="label-bold"> Mode              </span> {this.props.features.mode} </label>
            <label className="label-small grid-50-50"> <span className="label-bold"> Popularity        </span> {this.props.popularity} </label>
            <label className="label-small grid-50-50"> <span className="label-bold"> Speechiness       </span> {this.props.features.speechiness} </label>
            <label className="label-small grid-50-50"> <span className="label-bold"> Tempo             </span> {this.props.features.tempo} </label>
            <label className="label-small grid-50-50"> <span className="label-bold"> Time Signature    </span> {this.props.features.time_signature} </label>
            <label className="label-small grid-50-50"> <span className="label-bold"> Valence           </span> {this.props.features.valence} </label>
          </div>
        )
      }
    }

    return (
      <div className="panel">
        <div className="div-track">
          <a href={this.props.url} className="link-center">
            <img className="img--medium" src={this.props.image} alt="track art"/>
          </a>
          <div className="info">
            <label className="label-medium label-bold"> {rank} {this.props.title} </label>
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

export default Track;