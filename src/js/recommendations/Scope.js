import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import Artist from '../artist/Artist.js';
import Track from '../track/Track.js';
import PlaylistCreator from '../PlaylistCreator.js';

// Recommendations based on genre
class Scope extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks : [],
      artists : [],
      selectedArtists : [],
      selectedIndex : 0
    };

    this.spotifyWebApi = new SpotifyWebApi();
    this.playlistCreator = new PlaylistCreator(this.props.userid);

    this.selectedAmount = 0;


    // method bindings
    this.artistAdd = this.artistAdd.bind(this);
    this.artistRemove = this.artistRemove.bind(this);
    this.getRecs = this.getRecs.bind(this);
    this.search = this.search.bind(this);
    this.parameters = this.parameters.bind(this);
    this.genresToString = this.genresToString.bind(this);
    this.artistsToString = this.artistsToString.bind(this);
    this.createPlaylist = this.createPlaylist.bind(this);
  }

  
  // call PlaylistCreator object and pass in current tracks
  //  this function should be called from an options component
  createPlaylist() {
    if(this.state.tracks.length > 0) {
      this.playlistCreator.setTracks(this.state.tracks);
      this.playlistCreator.createPlaylist("tonedeaf scope");
    }
  }

  // recommendation button
  //  gets parameters for recommendations
  getRecs() {
    if(this.state.selectedArtists.length > 0) {
      this.spotifyWebApi.getRecommendations(this.parameters())
        .then((response) => {
          this.setState({ tracks : response.tracks, selectedIndex : 1 })
          console.log("Succesfully retrieved recommendations  @");
          console.log(response);
        })
        .catch((error) => {
          console.error("Could not retrieve recommendations @");
          console.error(error)
        });

    } else {
      console.log("No artists selected");
    }
  }

  // get spotify ids for selected artists
  parameters() {
    var ids = [];
    for(var i = 0; i < this.state.selectedArtists.length; i++) {
      ids.push(this.state.selectedArtists[i].id)
    }
    return { limit : 50, seed_artists : ids };
  }

  // detect which button was clicked for ADDING an artist
  artistAdd(event) {
    if(this.selectedAmount < 5) {
      var tempArray = this.state.selectedArtists;
      var duplicate = tempArray.includes(this.state.artists[event.target.id]);
      if(event.target.tagName === "BUTTON" && !duplicate) {
        tempArray.push(this.state.artists[event.target.id]);
        this.selectedAmount++;
        this.setState({ selectedArtists : tempArray});
      }
    }
  }

  // detect which button was clicked for REMOVING an artist
  artistRemove(event) {
    var tempArray = [];
    if(event.target.tagName === "BUTTON") {
      for(var i = 0; i < this.state.selectedArtists.length; i++) {
        if(i !== parseFloat(event.target.id)) {
          tempArray.push(this.state.selectedArtists[i]);
        }
      }
      this.selectedAmount--;
      this.setState({ selectedArtists : tempArray });
    }
  }

  // use spotify api to search for artists as a person types
  search(e) {
    var query = e.target.value.replace(" ", "+");

    var params = { limit : 50 }
    var types = ['artist'];

    
    if(query.length > 0) {
      this.spotifyWebApi.search(query, types, params)
        .then((response) => {
          this.setState({artists: response.artists.items});
        })
        .catch((error) => {
          console.error("could not retrieve search query @")
          console.error(error);
        });
    } else {
      this.setState({artists: []});
    }
  }

  // generes to comma separated string
  genresToString(genres) {
    var result = "";
    for(var i = 0; i < genres.length; i++) {
      result += (i < genres.length - 1) ? genres[i] + ", " : genres[i];
    }
    return result;
  }

  // convert artist array into comma string
  artistsToString(artists) {
    var result = "";
    for(var i = 0; i < artists.length; i++) {
      result += (i < artists.length - 1) ? artists[i].name + ", " : artists[i].name;
    }
    return result;
  }
  
  render() {
    var display;
    if(this.state.selectedIndex === 0) {
      display = (

        <React.Fragment>
          <div className="div-selected-artists" onClick={this.artistRemove}>
            {
              this.state.selectedArtists.map((artist, i) => {
                return (
                  <div className="div-artist--compact animate-drop min-width" key={i} >
                    <button className="sub-btn" id={i}> - </button>
                    <Artist
                      image={artist.images[0].url}
                      name={artist.name}
                      genre={this.genresToString(artist.genres)}
                      url={artist.external_urls.spotify}
                      popularity={artist.popularity}
                      followers={artist.followers.total}
                      artistid={artist.id}
                      compact="true"
                    />
                  </div>
                )
              })
            }
          </div>

          <div onClick={this.artistAdd}>
            {
              this.state.artists.map((artist, i) => {
                if(artist.images.length > 0) {
                  return (
                    <div className="animate-drop" key={i}>
                      <button className="add-btn" id={i}> + </button>
                      <Artist
                        image={artist.images[0].url}
                        name={artist.name}
                        genre={this.genresToString(artist.genres)}
                        url={artist.external_urls.spotify}
                        popularity={artist.popularity}
                        followers={artist.followers.total}
                        artistid={artist.id}
                      />
                    </div>
                  )
                } else {
                  return <span key={i}/>;
                }
              })
            }
          </div>
        </React.Fragment>
      )

    } else {
      display = (
        <div>
          {
            this.state.tracks.map((track, i) => {
              return (
                <div className="animate-drop" key={i}>
                  <Track
                    image={track.album.images[0].url}
                    title={track.name}
                    artist={this.artistsToString(track.artists)}
                    url={track.external_urls.spotify}
                    year={track.album.release_date.split("-")[0]}
                    type={track.album.type}
                    album={track.album.name}
                  />
                </div>
              )
            })
          }
        </div>
      )
    }

    return (
      <div>
        <div className="panel animate-drop">
          <div>
            <label className="label-large"> Scope </label>
            <label className="label-medium"> — Get recommendations based on artists </label>
          </div>
          <br/>
          <label className="label-subtext label-bold"> * Search and add up to 5 artists then press 'Get Recommendations' </label>
          <label className="label-subtext label-bold label-italic"> * Sometimes searches will glitch, just press backspace </label>
          <input type="text" className="input-item input-search" onChange={(e) => this.search(e)} />
          <button className="option-btn" onClick={this.getRecs}> Get Recommendations </button>
        </div>
        {display}
      </div>
    )
  }
}

export default Scope;