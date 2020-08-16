import React from 'react';

import SpotifyWebApi from 'spotify-web-api-js';

import Artist from './Artist.js'

class TopArtists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artists : []
    };

    this.spotifyWebApi = new SpotifyWebApi();
    this.getTopArtists = this.getTopArtists.bind(this);
    this.genresToString = this.genresToString.bind(this);
  }

  getTopArtists(event) {
    this.spotifyWebApi.getMyTopArtists()
      .then((response) => {
        this.setState({
          artists : response.items
        })
        console.log("Succesfully retrieved top artists @");
        console.log(response.items);
      })
      .catch((error) => {
        console.error("Could not retrieve top artists @")
        console.error(error)
      });
  }

  genresToString(genres) {
    var result = "";
    for(var i = 0; i < genres.length; i++) {
      result += (i < genres.length - 1) ? genres[i] + ", " : genres[i];
    }
    return result;
  }

  componentDidMount() {
    this.getTopArtists();
  }
  
  render() {
    return (
      <div>
        {
          this.state.artists.map((artist, i) => {
            return (
              <div className="animate-drop" key={i}>
                <Artist
                  image={artist.images[0].url}
                  name={artist.name}
                  url={artist.external_urls.spotify}
                  genre={this.genresToString(artist.genres)}
                />
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default TopArtists;