import React from 'react';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.dropDownBtn = React.createRef();
  }

  render() {
    return (
      <div className="panel animate-drop">
        <label className="label-medium"> {this.props.text} </label>
        {
          this.props.items.map((item, i) => {
            return <label className="label-small div-item-60-40" key={i}> <span className="label-bold"> {item} </span> {this.props.descriptions[i]} </label>
          })
        }
      </div>
    )
  }
}

export default List;