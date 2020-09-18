import React from 'react';

/*  List component
 *  {this.props.text} : list title
 *  {this.props.items} : array of json objects with name and value
 *  {this.props.onClick} : will make list items clickable, returning name as an argument
 *  {this.props.cutoff} : will truncate list and add show button if true
 */
class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cutoff : false,
      cutoffButton : "More",
      selected : "all"
    }
    
    this.list = React.createRef();

    this.handleClick = this.handleClick.bind(this);
    this.show = this.show.bind(this);
  }

  handleClick(e) {
    var id = e.target.id;
    this.setState({ selected : id});
    if(this.props.onClick) this.props.onClick(id);
  }

  show() {
    this.setState({ 
      cutoff : !this.state.cutoff,
      cutoffButton : this.state.cutoffButton === "More" ? "Less" : "More"
    });
  }

  render() {
    if(this.props.items) {

      var dropdownButton = null;
      var cutoffClass = "";
      if(this.props.compact) {
        dropdownButton = <button onClick={this.show} className="info-btn"> Show {this.state.cutoffButton} </button>
        cutoffClass = " cutoff " + this.state.cutoff;
      }

      return (
        <div className="panel">
          <label className="label-medium label-bold"> {this.props.text} </label>
          { this.props.children &&
            <> {this.props.children} <br/> </>
          }
          <div className={"div-list" + cutoffClass}>
            {
              this.props.items.map((item, i) => {
                var hoverable = this.props.onClick ? " hoverable" : "";
                hoverable += (item.name === this.state.selected) ? " selected" : "";
                return (
                  <label className={"label-small grid-60-40" + hoverable} key={i} id={item.name} onClick={this.handleClick}> 
                    <label id={item.name}> {item.name} </label> 
                    <label id={item.name}> {item.value} </label> 
                  </label>
                )
              })
            }
          </div>
          {dropdownButton} 
        </div>
      )


    } else {
      return null;
    }
  }
}

export default List;