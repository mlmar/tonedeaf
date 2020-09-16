import React from 'react';

/*  List component
 *  Converts a JSON object to a side by side list
 */
class List extends React.Component {
  constructor(props) {
    super(props);

    this.dropDownBtn = React.createRef();
  }

  render() {
    if(this.props.items) {
      var keys = Object.keys(this.props.items);
      var values = Object.values(this.props.items);
    }

    if(this.props.items) {
      return (
        <div className="panel">
          <label className="label-medium"> {this.props.text} </label>
          {
            keys.map((item, i) => {
              return <label className="label-small grid-60-40" key={i}> <span className="label-bold"> {keys[i]} </span> {values[i]} </label>
            })
          }
        </div>
      )
    } else {
      return <div className="animate-load"> </div>
    }

  }
}

export default List;