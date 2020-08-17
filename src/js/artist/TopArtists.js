import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

import Artist from './Artist.js'

class TopArtists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artists : []
    };

    this.range = ["long_term", "medium_term", "short_term"];

    this.spotifyWebApi = new SpotifyWebApi();
    this.getTopArtists = this.getTopArtists.bind(this);
    this.genresToString = this.genresToString.bind(this);
  }

  getTopArtists(index) {
    this.setState({artists : []});

    var selected_range = {
      time_range : this.range[index],
      limit : 50
    }

    this.spotifyWebApi.getMyTopArtists(selected_range)
      .then((response) => {
        this.setState({
          artists : response.items
        })
        console.log("Succesfully retrieved top artists @ " + index);
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
    this.getTopArtists(0);
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
                  popularity={artist.popularity}
                  followers={artist.followers.total}
                  rank={i+1}
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