import React from 'react';

import SpotifyWebApi from 'spotify-web-api-js';

// Recommendations based on genre
class RecGenre extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks : []
    };

    this.spotifyWebApi = new SpotifyWebApi();
    this.getGenreSeeds = this.getGenreSeeds.bind(this);
    this.getRecGenre = this.getRecGenre.bind(this);
  }

  getGenreSeeds() {
    this.spotifyWebApi.getAvailableGenreSeeds()
      .then((response) => {
        console.log("Succesfully retrieved genre seeds @");
        console.log(response);
      })
      .catch((error) => {
        console.error("Could not retrieve genre seeds @")
        console.error(error)
      });
  }

  getRecGenre(event) {
    this.getGenreSeeds();
//     this.spotifyWebApi.getMyTopTracks()
//       .then((response) => {
//         console.log("Succesfully retrieved top tracks @");
//         console.log(this.state.tracks);
//       })
//       .catch((error) => {
//         console.error("Could not retrieve top tracks @")
//         console.error(error)
//       });
  }

  componentDidMount() {
    this.getRecGenre();
  }
  
  render() {
    return (
      <div>
        test
      </div>
    )
  }
}

export default RecGenre;