import React from 'react';

import SpotifyWebApi from 'spotify-web-api-js';

class FrontPage extends React.Component {
  constructor(props) {
    super(props);

    // track is pased on through a prop as an object
    this.state = {
      artist : {
      }
    };
    
    this.spotifyWebApi = new SpotifyWebApi();
  }
  
  render() {
    return (
      <div className="div-frontpage">
        <label className="label-super"> log in </label>
      </div>
    )
  }
}

export default FrontPage;