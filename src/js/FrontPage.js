import React from 'react';

/*  FrontPage.js
 *  
 *  shows a blank sign in page with text that fades in
 */
class FrontPage extends React.Component {
  constructor(props) {
    super(props);

    // hide text by default to fade it in
    this.state = {
      classes : "div-frontpage hide"
    };
     
    this.front = React.createRef();
  }

  // after half a second, fade in the text
  componentDidMount() {
    setTimeout(() => {
      this.front.current.classList.toggle("show");
      this.front.current.classList.toggle("shadow-on")
    }, 300)
  }
  
  render() {
    return (
      <div ref={this.front} className="div-frontpage hide shadow-off">
        <label className="label-super"> tonedeaf </label>
        <br/>
        <a href={this.props.return} className="sign-background">
          <label className="sign label-large cursor-pointer"> sign in with spotify </label>
        </a>
        <div className="bottom label-center">
          <label className="label-tiny"> Marcus Martinez </label>
          <br/>
          <label className="label-tiny"> Spotify&copy; is a trademark of Spotify AB </label>
          <br/>
          <label className="label-tiny"> 2020 </label>
        </div>
      </div>
    )
  }
}

export default FrontPage;