import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import Options from '../Options.js'

// Wrapper component for Options component specific to the Genre Recommendaitons component
//  TODO: rewrite options components in the future becauses it shouldnt be like this
class GenreOptions extends React.Component {
  constructor(props) {
    super(props);

    this.spotifyWebApi = new SpotifyWebApi();
  }
  
  render() {
    return (
      <Options 
        text="recommendations"
        options={["genres","attributes"]}
        callback={(index) => {
          this.props.callback(index);
        }}
        />
    )
  }
}

export default GenreOptions;