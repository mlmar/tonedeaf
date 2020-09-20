import React from 'react';

class ButtonBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index : 0
    }

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    var id = parseInt(e.target.id);
    this.setState({ index : id });
    if(this.props.callback) this.props.callback(id);
  }

  render() {
    var panelClass = this.props.nopanel ? "" : "panel";
    return (
      <div className={`${panelClass} button-bar`}>
        {
          this.props.buttons?.map((button, i) => {
            var b = button.toLowerCase();
            var selectedClass = (i === this.state.index) && this.props.highlight ? "selected" : null;
            var compact = (b === "compact") ? "compact-btn" : null;
            var list = (b === "list") ? "list-btn" : null;
            var text = !(b === "list" || b === "compact") ? button : null;
            return <button className={`${selectedClass} ${compact} ${list}`} id={i} key={i} onClick={this.handleClick} title={button}> {text} </button>
          })
        }
      </div>
    )
  }
}

export default ButtonBar;