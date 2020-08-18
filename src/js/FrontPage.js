import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

class FrontPage extends React.Component {
  constructor(props) {
    super(props);

    // track is pased on through a prop as an object
    this.state = {
      classes : "div-frontpage hide"
    };
    
    this.front = React.createRef();
    this.spotifyWebApi = new SpotifyWebApi();
  }

  componentDidMount() {
    setTimeout(() => {
      this.front.current.classList.toggle("show");
      this.front.current.classList.toggle("shadow-on")
    }, 800)
  }
  
  render() {
    return (
      <div ref={this.front} className="div-frontpage hide shadow-off">
        <label className="label-super"> tonedeaf </label>
        <br/>
        <a href={this.props.return}>
          <label className="sign label-large label-underline cursor-pointer"> sign in with spotify </label>
        </a>
        <div className="bottom label-center">
          <label className="label-subtext"> marcus martinez </label>
          <br/>
          <label className="label-subtext"> 2020 </label>
        </div>
      </div>
    )
  }
}

export default FrontPage;