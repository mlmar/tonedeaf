import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

/*  ATTRIBUTE COMPONENT
 *  just displays min/max sliders for a specific song attribute
 */
class Attributes extends React.Component {
  constructor(props) {
    super(props);
    this.spotifyWebApi = new SpotifyWebApi();
  }

  render() {
    var classes = "panel animate-drop panel-attribute";
    return (
      <div className={classes}>
        <a href="https://developer.spotify.com/documentation/web-api/reference/browse/get-recommendations/" className="cursor-help">
          <label className="label-medium label-bold label-nopadding noclick"> 
            {this.props.attribute} ({this.props.min} to {this.props.max})
          </label>
        </a>
        <label className="label-small label-bold"> {this.props.desc} </label>
        
        <div className="panel-attribute--slider">
          <div className="side-label">
            <label className="label-small"> minimum </label>
            <input className="input-item min" 
              type="range" 
              name={this.props.attribute} 
              min={this.props.min} 
              max={this.props.max} 
              step={this.props.step}
              defaultValue={this.props.defaultMin}
              id={this.props.id}
            />
          </div>
          
          <div className="side-label">
            <label className="label-small"> maximum </label>
            <input className="input-item max" 
              type="range" 
              name={this.props.attribute} 
              min={this.props.min} 
              max={this.props.max} 
              step={this.props.step}
              defaultValue={this.props.defaultMax}
              id={this.props.id}
            />
          </div>
          
        </div>
      </div>
    )
  }
}

export default Attributes;