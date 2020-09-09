import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

const glassIcon = require("../../icon/glass.svg");

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
        trackId : ""
      },

      labelText : "Last Played",
      deviceText : "Current Device: ",
      full : this.props.full
    };

    this.pauseBtn = React.createRef();
    this.pauseText = "| |";
    this.playText = "&#8883;"

    this.timer = ""; // interval clock for retrieving song every 5 seconds

    this.spotifyWebApi = new SpotifyWebApi();
    this.getLastPlayed = this.getLastPlayed.bind(this);
    this.getNowPlaying = this.getNowPlaying.bind(this);
    this.previous = this.previous.bind(this);
    this.pause = this.pause.bind(this);
    this.play = this.play.bind(this);
    this.skip = this.skip.bind(this);
    this.compute = this.compute.bind(this);
  }

  // if no track is currently playing, show the lat played track
  getLastPlayed(interval = false) {
    this.spotifyWebApi.getMyRecentlyPlayedTracks()
      .then((response) => {
        var track = response.items[0].track;

        this.setState({
          playing: {
            artist : track.album.artists,
            title: track.name,
            image: track.album.images[0].url,
            url: track.external_urls.spotify,
            duration: track.duration_ms,
            progress : track.progress_ms,
            is_playing : false,
            device : "",
            trackId: track.id
          },

          labelText : "Last Played",
          deviceText  : ""
        });
        
        if(!interval) {
          console.log("Succesfully retrieved last played track @");
          console.log(track);
        }
      })
      .catch((error) => {
        console.error("Could not retrieve recently played tracks @")
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
            console.log("Retrieved last played intead @");
            console.log(response);
          }
        } else {

          this.setState({
            playing: {
              artist : response.item.artists,
              title: response.item.name,
              image: response.item.album.images[0].url,
              url: response.item.external_urls.spotify,
              duration: response.item.duration_ms,
              progress : response.progress_ms,
              is_playing : response.is_playing,
              device : response.device,
              trackId : response.item.id
            },

            labelText : "Now Playing",
            deviceText : "Current Device: "
          });

          if(!interval) { // only show responses if not called from an interval
            console.log("Succesfully retrieved now playing info @");
            console.log(response);
          }
        }
      })
      .catch((error) => {
        console.error("Could not retrieve artist info @");
        console.error(error.message);

        /*** not really a good solutions but will workout later ***/
        // if access token is no longer valid log the user out
        // if rate limiting has been applied log user out
        if(error.status === 429) { 
          //window.location.replace(this.props.logout);
          console.warn("Rate limiting has been applied");
        }
      });
  }

  artistsToString(artists) {
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

  renderPlayerControls(playing) {
    if(!playing.is_playing) {
      return "";
    } else {
      return (
        <div className="div-nowplaying-controls animate-drop">
          <div className="div-control-buttons">
            <span className="control-btn-previous--container">
              <button className="control-btn-previous" onClick={this.previous}> &lt; </button>
            </span>
            <span className="control-btn-pause--container">
              <button className="control-btn-pause" onClick={this.pause} ref={this.pauseBtn}> {this.pauseText} </button>
            </span>
            <span className="control-btn-skip--container">
              <button className="control-btn-skip" onClick={this.skip}> &gt; </button>
            </span>
          </div>
          <progress className="progressbar" max="100" value={this.compute()}/>
          <label className="label-subtext"> {this.state.deviceText} {this.state.playing.device.name} </label>
        </div>
      );
    }
  }

  // computers current song time for progress bar
  compute() {
    return (this.state.playing.progress / this.state.playing.duration * 100).toString();
  }

  componentDidMount() {
    this.getNowPlaying();

    // update now playing every 10 seconds
    this.timer = setInterval(() => {
      this.getNowPlaying(true);
    }, 5000)
    console.log("Mounting now playing @ " + this.timer);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    console.log("Umounting now playing @ " + this.timer);
  }
  
  render() {
    var display = "";

    if(this.state.full === "true") {
      // only show controls if playing
      var controls = this.renderPlayerControls(this.state.playing);

      display = (
        <React.Fragment>
          <div className="nowplaying-full">

            <a href={this.state.playing.url}>
              <img className="img" src={this.state.playing.image} width="70" alt="Album art not found"/>
            </a>

            <div className="div-nowplaying--info-full">
              <label className="label-large song-title"> {this.state.playing.title} </label>
              <label className="label-sublarge"> {this.artistsToString(this.state.playing.artist)} </label>
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
          <div className="div-nowplaying--info">
            <label className="label-medium"> {this.state.playing.title} </label>
            <label className="label-small"> {this.artistsToString(this.state.playing.artist)} </label>
          </div>
          <span ref={this.controls}/>
        </React.Fragment>
      )
    }
    
    var searchButton = !this.props.searchCurrent ? "" :
      <button className="option-btn glass-btn" onClick={() => this.props.searchCurrent(this.state.playing.artist, this.state.playing.trackId)}> <img src={glassIcon} className="glass-icon" alt="glass-icon"/> </button>;
      
    return (
      <div className="panel animate-drop">
        <span className="nowplaying-search-container">
          <label className="label-subtitle"> {this.state.labelText} </label>
          {searchButton}
        </span>
        {display}
      </div>
    )
  }
}

export default NowPlaying;