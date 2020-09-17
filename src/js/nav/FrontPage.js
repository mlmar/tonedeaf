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
      if(this.front.current) {
        this.front.current.classList.toggle("show");
        this.front.current.classList.toggle("shadow-on")
      }
    }, 300)
  }
  
  render() {
    return (
      <div ref={this.front} className="div-frontpage hide shadow-off">
        <label className="label-super"> tonedeaf </label>
        <br/>
        <a href={this.props.return} className="sign-background">
          <label className="sign label-large cursor-pointer"> sign in with Spotify </label>
        </a>
        <div className="bottom label-center">
          <label className="label-tiny"> This application is not developed by or affiliated with Spotify AB. </label>
          <label className="label-tiny">  Developed using Spotify Web API.  </label>
        </div>
      </div>
    )
  }
}

export default FrontPage;