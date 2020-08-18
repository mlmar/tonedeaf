import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

class Options extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text :  this.props.text,
      options : this.props.options,
      index : 0
    };

    this.spotifyWebApi = new SpotifyWebApi();
    this.optionClick = this.optionClick.bind(this);
  }

  // detect which button was clicked and pass index to callback prop function
  optionClick(event) {
    var tempIndex;
    if(event.target.tagName === "BUTTON") {
      for (var i = 0; i < event.currentTarget.childNodes.length; i++) {
        var li = event.currentTarget.childNodes[i];

        // select the child that matches the button that was pressed
        if (event.target === li) {
          tempIndex = i;
        }
      }
      
      this.setState({index : tempIndex})
      console.log("callback with " + tempIndex + " from " + this.state.text)
      this.props.callback(tempIndex);
    }
  }
  
  render() {
    return (
      <div className="panel animate-drop">
        <label className="label-subtitle"> {this.state.text} </label>
        <div className="div-options" onClick={this.optionClick}>
          {
            this.state.options.map((option, i) => {
              var classes = (i !== this.state.index) ? "option-btn" : "option-btn option-btn--selected";
              return (
                <button className={classes} key={i}> {option} </button>
              )
            })
          }
        </div>
      </div>
    )
  }
}

export default Options;