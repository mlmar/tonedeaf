import React from 'react';

/*  provides a simple options panel with buttons that return an index in a callback
 *
 */
class Options extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index : 0
    };

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
      console.log("callback with " + tempIndex + " from " + this.props.text)
      this.props.callback(tempIndex);
    }
  }
  
  render() {
    return (
      <div className="panel animate-drop">
        <label className="label-subtitle"> {this.props.text} </label>
        <div className="div-options" onClick={this.optionClick}>
          {
            this.props.options.map((option, i) => {
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