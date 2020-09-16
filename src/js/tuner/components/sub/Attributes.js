import React from 'react';

/*  ATTRIBUTE COMPONENT
 *  just displays min/max sliders for a specific song attribute
 */
class Attributes extends React.Component {
  render() {
    return (
      <div className="panel attribute animate-fade">
        <a href="https://developer.spotify.com/documentation/web-api/reference/browse/get-recommendations/" className="cursor-help">
          <label className="label-medium label-bold label-nopadding noclick"> 
            {this.props.attribute} ({this.props.min} to {this.props.max})
          </label>
        </a>
        <label className="label-small label-bold"> {this.props.desc} </label>
        
        <div>
          <div className="label side">
            <label className="label-small grid-60-40"> minimum <span className="label-bold"> {this.props.defaultMin} </span> </label>
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
          
          <div className="label side">
            <label className="label-small grid-60-40"> maximum <span className="label-bold"> {this.props.defaultMax} </span> </label>
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