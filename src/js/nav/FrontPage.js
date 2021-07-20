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
      show : ""
    };
     
    this.handleDemoClick = this.handleDemoClick.bind(this);
  }

  handleDemoClick() {
    this.props.handleDemoClick();
  }

  // after half a second, fade in the text
  componentDidMount() {
    setTimeout(() => {
        this.setState({ show: "show"});
    }, 300)
  }
  
  render() {
    return (
      <div ref={this.front} className={`div-frontpage hide shadow-off ${this.state.show}`}>
        <label className="label-super"> tonedeaf </label>
        <a href={this.props.return} className="sign-background">
          <label className="sign label-large cursor-pointer"> sign in with Spotify </label>
        </a>
        <label className="text label-bold"> or </label>
        <label className="text demo label-underline cursor-pointer" onClick={this.handleDemoClick}> try a demo </label>
        <div className="bottom label-center">
          <label className="label-tiny"> This application is not developed by or affiliated with Spotify AB. </label>
          <label className="label-tiny">  Developed using Spotify Web API.  </label>
        </div>
      </div>
    )
  }
}

export default FrontPage;