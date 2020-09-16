import React from 'react';

/*  provides a simple options panel with buttons that return an index in a callback
 *    {this.props.text} : title text
 *    {this.props.description} : description text
 *    {this.props.options} : array of option text for buttons
 *    {this.props.callback} : onClick with button id as an arg
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
      if(this.props.callback) this.props.callback(tempIndex);
    }
  }
  
  render() {
    var horizontal = this.props.horizontal ? "horizontal" : null;
    var classes = this.props.nopanel ? "" : "panel";

    return (
      <div className={classes}>
        { this.props.text &&
          <label className="label-subtitle"> {this.props.text} </label>
        }
        {this.props.children}
        <div className={"div-options " + horizontal} onClick={this.optionClick}>
          {
            this.props.options.map((option, i) => {
              var classes = (i === this.state.index) && this.props.options.length > 1 ? "option-btn option-btn--selected" : "option-btn" ;
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