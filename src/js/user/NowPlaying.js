import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

import glassIcon from "../../icon/glass.svg";

/*  now playing component 
 *
 */
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
        is_playing : false,
        device : [],
        item : null,
      },

      labelText : "Last Played",
      deviceText : "Current Device: ",
    };

    this.pauseBtn = React.createRef();
    this.pauseText = <React.Fragment> &#124; &#124; </React.Fragment>;
    this.playText = "*"

    this.progress = React.createRef();
    this.timer = null; // interval clock for retrieving song every 10 seconds
    this.artificialTimer = null; // increment song every 1 second

    this.spotifyWebApi = new SpotifyWebApi();
    this.getLastPlayed = this.getLastPlayed.bind(this);
    this.getNowPlaying = this.getNowPlaying.bind(this);
    this.previous = this.previous.bind(this);
    this.pause = this.pause.bind(this);
    this.play = this.play.bind(this);
    this.skip = this.skip.bind(this);

    this.setUpArtificialTimer = this.setUpArtificialTimer.bind(this);
    this.renderDisplay = this.renderDisplay.bind(this);
  }

  // if no track is currently playing, show the lat played track
  getLastPlayed(interval = false) {
    this.spotifyWebApi.getMyRecentlyPlayedTracks()
      .then((response) => {
        var track = response?.items[0].track;

        this.setState({
          playing: {
            artist : track?.album?.artists,
            title: track?.name,
            image: track?.album?.images[0]?.url,
            url: track?.external_urls?.spotify,
            duration: track?.duration_ms,
            progress : track?.progress_ms,
            is_playing : false,
            device : "",
            item: null,
          },

          labelText : "Last Played",
          deviceText  : ""
        });
        
        if(!interval) {
          console.log("API SUCCESS: retrieved last played track");
          console.log(track);
        }
      })
      .catch((error) => {
        console.error("API ERROR: Could not retrieve last played track")
        console.error(error)
      });
  }

  // show the currently playing track
  getNowPlaying(interval = false) {
    this.spotifyWebApi.getMyCurrentPlaybackState()
      .then((response) => {
        if(typeof response.item === "undefined") {
          this.getLastPlayed(true); // get last played song if no song currently playing

          if(!interval) { // only show responses if not called from an interval
            console.log("No track currently playing, retrieving last played.");
            console.log(response);
          }
        } else {

          this.setState({
            playing: {
              artist : response?.item?.artists,
              title: response?.item?.name,
              image: response?.item?.album.images[0].url,
              url: response?.item?.external_urls.spotify,
              duration: response?.item?.duration_ms / 1000, // convert to seconds
              progress : response?.progress_ms / 1000,
              is_playing : response?.is_playing,
              device : response?.device,
              item : response?.item,
            },

            labelText : "Now Playing",
            deviceText : "Current Device: "
          }, this.setUpArtificialTimer );

          if(!interval) { // only show responses if not called from an interval
            console.log("API SUCCESS: retrieved now playing info");
            console.log(response);
          }
        }
      })
      .catch((error) => {
        console.error("API ERROR: could not retrieve nowplaying info");
        console.error(error.message);

        /*** not really a good solutions but will workout later ***/
        // if access token is no longer valid log the user out
        // if rate limiting has been applied log user out
        if(error.status === 429 && this.props.logout) { 
          this.props.logout();
        }
      });
  }

  artistsToString(artists) {
    if(!artists) {
      return "";
    }

    var result = "";
    for(var i = 0; i < artists.length; i++) {
      result += (i < artists.length - 1) ? artists[i].name + ", " : artists[i].name;
    }
    return result;
  }

  /************** playback functions **************/

  previous() {
    // check if something is already playing
    this.spotifyWebApi.skipToPrevious()
      .then((response) => {
        console.log("Successfully skipped to previous device @");
        console.log(response);
      })
      .catch((error) => {
        console.log("Could not skip to previous device @");
        console.log(error);
      });
  }

  pause() {
    // check if something is already playing
    this.spotifyWebApi.pause()
      .then((response) => {
        this.pauseBtn.current.innerHTML = this.playText;
        console.log("Successfully paused device @");
      })
      .catch((error) => {
        this.play(); // if could not puase, try playing
        console.log("Could not pause device @");
      });
  }

  play() {
    this.spotifyWebApi.play()
      .then((response) => {
        this.pauseBtn.current.innerHTML = this.pauseText;
        console.log("Successfully played device @");
      })
      .catch((error) => {
        console.log("Could not play device @");
      });
  }

  skip() {
    // check if something is already playing
    this.spotifyWebApi.skipToNext()
      .then((response) => {
        this.pauseBtn.current.innerHTML = this.pauseText;
        console.log("Successfully skipped device @");
        console.log(response);
      })
      .catch((error) => {
        this.play(); // if could not puase, try playing
        console.log("Could not skip device @");
        console.log(error);
      });
  }

  renderPlayerControls() {
    if(this.state.playing.is_playing);
      return (
        <div className="controls animate-drop">
          <progress className="progressbar" max={this.state.playing.duration || this.state.playing.progress} value={this.state.playing.progress} ref={this.progress}/>
        </div>
      )
  }

  // increments the progress bar every second to reduce api calls
  setUpArtificialTimer() {
    // only increment if progress bar even exists and no timer has been set up yet
    if(this.props.full && !this.artificialTimer) {
      this.artificialTimer = setInterval(() => {
        if(this.progress.current) {
          this.progress.current.value++;
        } else {
          clearInterval(this.artificialTimer);
        }
      }, 1000);
    }
  }

  componentDidMount() {
    this.getNowPlaying();

    // update now playing every 10 seconds
    this.timer = setInterval(() => {
      this.getNowPlaying(true);
    }, 10000)
  }

  componentWillUnmount() {
    if(this.timer) clearInterval(this.timer);
    if(this.artificialTimer) clearInterval(this.artificialTimer);
  }

  renderDisplay() {
    var display = "";

    if(this.props.full) {
      // only show controls if playing
      var controls = this.renderPlayerControls();

      display = (
        <React.Fragment>
          <div className="nowplaying-full">

            <a href={this.state.playing.url}>
              <img className="img" src={this.state.playing.image} width="70" alt="Album art not found"/>
            </a>

            <div className="nowplaying-info">
              <label className="label-large song-title label-bold"> {this.state.playing.title} </label>
              <label className="label-sublarge label-bold"> {this.artistsToString(this.state.playing.artist)} </label>
            </div>
          </div>
          {controls}
        </React.Fragment>
      )
    } else {
      display = (
        <React.Fragment>
          <a href={this.state.playing.url}>
            <img className="img" src={this.state.playing.image} width="70" alt="Album art not found"/>
          </a>
          <div className="nowplaying-info">
            <label className="label-medium label-bold"> {this.state.playing.title} </label>
            <label className="label-small"> {this.artistsToString(this.state.playing.artist)} </label>
          </div>
          <span ref={this.controls}/>
        </React.Fragment>
      )
    }

    return display;
  }
  
  render() {
    
    var searchButton = this.props.searchCurrent && this.state.playing.is_playing ? 
      <button className="gray-btn glass-btn" title="Scope current artist and track" onClick={() => this.props.searchCurrent(this.state.playing.item)}> 
        <img src={glassIcon} className="glass-icon" alt="glass-icon"/> 
      </button> : null;
      
    var fade = this.props.full ? "animate-fade" : null;

    return (
      <div className={"panel " + fade}>
        <span className={"nowplaying-search"}>
          <label className="label-subtitle label-bold"> {this.state.labelText} </label>
          {searchButton}
        </span>
        {this.renderDisplay()}
      </div>
    )
  }
}

export default NowPlaying;