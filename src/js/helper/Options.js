import React from 'react';

/*  provides a simple options panel with buttons that return an index in a callback
 *    {this.props.text} : title text
 *    {this.props.description} : description text
 *    {this.props.options} : array of option text for buttons
 *    {this.props.callback} : onClick with button id as an arg
 *    {this.props.callback} : onClick with subbutton id as an arg
 *
 */
class Options extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index : 0,
      subindex : 0
    };

    this.optionClick = this.optionClick.bind(this);
    this.subOptionClick = this.subOptionClick.bind(this);
  }

  // detect which button was clicked and pass index to callback prop function
  optionClick(event) {
    var id = parseFloat(event.target.id);
    this.setState({ index : id })
    if(this.props.callback) this.props.callback(id);
  }

  subOptionClick(event) {
    var id = parseFloat(event.target.id);
    this.setState({ subindex : id })
    if(this.props.subcallback) this.props.subcallback(id);
  }
  
  render() {
    var horizontal = this.props.horizontal ? "horizontal" : null;
    var classes = this.props.nopanel ? null : "panel";

    return (
      <div className={classes}>

        <span className="options-bar">
          <label className="label-medium label-bold"> 
            {this.props.text} 
          </label>
          { this.props.suboptions &&
            <span className="sub-options">
              { 
                this.props.suboptions?.map((option, j) => {
                  var subclasses = (j === this.state.subindex) && (this.props.suboptions.length > 1) ? "selected" : null;
                  return <button className={subclasses} id={j} key={j} onClick={this.subOptionClick}> {option} </button>
                })
              }
            </span>
          }
        </span>
        <div className={"main-options " + horizontal}>
          {
            this.props.options?.map((option, i) => {
              var classes = (i === this.state.index) && (this.props.options.length > 1) ? "selected" : null;
              return <button className={classes} id={i} key={i} onClick={this.optionClick}> {option} </button>
            })
          }
        </div>
        {this.props.children && <br/>}
        {this.props.children}
      </div>
    )
  }
}

export default Options;