import React from 'react';

import SpotifyWebApi from 'spotify-web-api-js';

class NowPlaying extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playing : {
        artist : [],
        title : "",
        image : "",
        url : "",
        duration : "",
        progress : "",
      },
      full : this.props.full,
      device : ""
    };

    this.timer = "";

    this.spotifyWebApi = new SpotifyWebApi();
    this.getNowPlaying = this.getNowPlaying.bind(this);
    this.pause = this.pause.bind(this);
    this.getDevices = this.getDevices.bind(this);
    this.compute = this.compute.bind(this);
  }

  getNowPlaying(interval = false) {
    this.spotifyWebApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          playing: {
            artist : response.item.artists,
            title: response.item.name,
            image: response.item.album.images[0].url,
            url: response.item.external_urls.spotify,
            duration: response.item.duration_ms,
            progress : response.progress_ms
          }
        });

        if(!interval) { // only show responses if not called from an interval
          console.log("Succesfully retrieved now playing info @");
          console.log(response);
        }
      })
      .catch((error) => {
        console.error("Could not retrieve artist info @");
        console.error(error);
      });

    
  }

  artistsToString(artists) {
    var result = "";
    for(var i = 0; i < artists.length; i++) {
      result += (i < artists.length - 1) ? artists[i].name + ", " : artists[i].name;
    }
    return result;
  }


  pause() {
    this.spotifyWebApi.pause()
      .then((response) => {
        console.log("Succesfully paused @");
        console.log(response);
      })
      .catch((error) => {
        console.error("Could not pause @")
        console.error(error);
      });
    this.getDevices();
  }

  getDevices() {
    this.spotifyWebApi.getMyDevices()
      .then((response) => {
        console.log("Successfully retrieved device @");
        console.log(response);
      })
      .catch((error) => {
        console.error("Could not retrieve device @");
        console.error(error);
      });
  }

  compute() {
    return (this.state.playing.progress / this.state.playing.duration * 100).toString();
  }

  componentDidMount() {
    this.getNowPlaying();

    // update now playing every 10 seconds
    this.timer = setInterval(() => {
      this.getNowPlaying(true);
    }, 5000)
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    console.log("Umounting now playing")
    console.log(this.timer);
  }
  
  render() {
    if(this.state.full === "true") {
      return (
        <div className="panel animate-drop">
          <label className="label-subtitle"> now playing </label>
          <div className="nowplaying-full">

            <a href={this.state.playing.url}>
              <img className="img" src={this.state.playing.image} width="70" alt="Album art not found"/>
            </a>

            <div className="div-nowplaying--info-full">
              <label className="label-large"> {this.state.playing.title} </label>
              <label className="label-sublarge"> {this.artistsToString(this.state.playing.artist)} </label>
            </div>

          </div>

          <div className="div-nowplaying-controls">
              <progress className="progressbar" max="100" value={this.compute()}></progress>
          </div>

        </div>
      )
    } else {
      return (
        <div className="panel animate-drop">
          <label className="label-subtitle"> now playing </label>
          <a href={this.state.playing.url}>
            <img className="img" src={this.state.playing.image} width="70" alt="Album art not found"/>
            <div className="div-nowplaying--info">
              <label className="label-medium"> {this.state.playing.title} </label>
              <label className="label-small"> {this.artistsToString(this.state.playing.artist)} </label>
            </div>
          </a>
        </div>
      )
    }
  }
}

export default NowPlaying;