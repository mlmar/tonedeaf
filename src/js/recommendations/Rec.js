import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

// Recommendations based on genre
class Rec extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks : []
    };

    this.spotifyWebApi = new SpotifyWebApi();
    this.getRecs = this.getRecs.bind(this);
  }

  getRecs() {
    this.spotifyWebApi.getRecommendations()
      .then((response) => {
        console.log("Succesfully retrieved recommendations  @");
        console.log(response);
      })
      .catch((error) => {
        console.error("Could not retrieve recommendations @");
        console.error(error)
      });
  }

  componentDidMount() {
    this.getRecs();
  }
  
  render() {
    return (
      <div>
        test
      </div>
    )
  }
}

export default Rec;