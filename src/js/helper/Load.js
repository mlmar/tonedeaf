import React from 'react';

/*  Loading animation
 *    {this.props.text} : loading text
 */
class Load extends React.Component {
  render() {
    return (
      <div className="div-load">
        <label className="label-medium label-bold animate-fade"> {this.props.text} </label>
        <div className="animate-load"></div>
      </div>
    )
  }
}

export default Load;