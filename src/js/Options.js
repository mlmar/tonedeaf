import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

class Options extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text :  this.props.text,
      options : this.props.options
    };

    this.spotifyWebApi = new SpotifyWebApi();
    this.optionClick = this.optionClick.bind(this);
  }

  // detect which button was clicked and pass index to callback prop function
  optionClick(event) {
    if(event.target.tagName === "BUTTON") {
      var index = 0;
      for (var i = 0; i < event.currentTarget.childNodes.length; i++) {
        var li = event.currentTarget.childNodes[i];
        li.classList.remove("option-btn--selected");

        // select the child that matches the button that was pressed
        if (event.target === li) {
          index = i;
          event.target.classList.add("option-btn--selected");
        }
      }
      
      console.log("callback with " + index)
      this.props.callback(index);
    }
  }
  
  render() {
    return (
      <div className="panel animate-drop">
        <label className="label-subtitle"> {this.state.text} </label>
        <div className="div-options" onClick={this.optionClick}>
          {
            this.state.options.map((option, i) => {
              var classes = i > 0 ? "option-btn" : "option-btn option-btn--selected"
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


// <div className="div-options--item" key={i+1000}>
//   <input className="radio" type="radio" name="options" value={option} key={i}/>
//   <label className="label-small label-bold" key={i+100}> {option} </label>
// </div>