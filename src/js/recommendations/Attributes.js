import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

class Attributes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      attribute   : this.props.attribute,
      min         : this.props.min,
      max         : this.props.max,
      step        : this.props.step,
      defaultMin  : this.props.defaultMin,
      defaultMax  : this.props.defaultMax
    };
    
    this.spotifyWebApi = new SpotifyWebApi();
  }

  render() {
    var classes = "panel animate-drop panel-attribute";
    return (
      <div className={classes}>
        <a href="https://developer.spotify.com/documentation/web-api/reference/browse/get-recommendations/" className="cursor-help">
          <label className="label-medium label-bold label-nopadding noclick"> 
            {this.state.attribute} ({this.state.min} to {this.state.max})
          </label>
        </a>
        <div className="panel-attribute--slider">
          <div className="side-label">
            <label className="label-small"> minimum </label>
            <input className="input-item min" 
              type="range" 
              name={this.state.attribute} 
              min={this.state.min} 
              max={this.state.max} 
              step={this.state.step}
              defaultValue={this.state.defaultMin}
              id={this.props.id}
            />
          </div>
          <div className="side-label">
            <label className="label-small"> maximum </label>
            <input className="input-item max" 
              type="range" 
              name={this.state.attribute} 
              min={this.state.min} 
              max={this.state.max} 
              step={this.state.step}
              defaultValue={this.state.defaultMax}
              id={this.props.id}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Attributes;