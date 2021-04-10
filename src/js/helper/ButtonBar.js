import React from 'react';

class ButtonBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index : 0
    }

    this.handleClick = this.handleClick.bind(this);
    this.handleRightButtonClick = this.handleRightButtonClick.bind(this);
  }

  handleClick(e) {
    var id = parseInt(e.target.id);
    this.setState({ index : id });
    if(this.props.callback) this.props.callback(id);
  }

  handleRightButtonClick(e) {
    var id = parseInt(e.target.id);
    if(this.props.rightCallback) this.props.rightCallback(id);
  }

  render() {
    var panelClass = this.props.nopanel ? "" : "panel";
    return (
      <div className={`${panelClass} button-bar`}>
        <div className="left">
          {
            this.props.buttons?.map((button, i) => {
              var b = button.toLowerCase();
              var selectedClass = (i === this.state.index) && this.props.highlight ? "selected" : null;
              var compact = (b === "compact") ? "compact-btn" : null;
              var list = (b === "list") ? "list-btn" : null;
              b = (b === "compact") ? "Grid" : b;
              b = (b === "list") ? "Details" : b;
              return <button className={`${selectedClass} ${compact} ${list}`} id={i} key={i} onClick={this.handleClick} title={b}> {b} </button>
            })
          }      
        </div>
        { this.props.rightButtons &&
          <div className="right">
            {
              this.props.rightButtons?.map((button, i) => {
                return <button className="icon-btn" onClick={this.handleRightButtonClick} id={i} key={i}> {button} </button>
              })
            }
          </div>
        }
      </div>
    )
  }
}

export default ButtonBar;