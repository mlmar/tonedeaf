import React from 'react';

import './css/main.css';
import Profile from './js/Profile.js';
import NowPlaying from './js/NowPlaying.js';
import TopArtists from './js/artist/TopArtists.js';
import TopTracks from './js/track/TopTracks.js';
import Recent from './js/track/Recent.js';


// Spotify Web API JS by Jose Perez on github
// https://github.com/JMPerez/spotify-web-api-js
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyWebApi = new SpotifyWebApi();

class App extends React.Component {

  constructor() {
    super();
    const params = this.getHashParams();
    const token = params.access_token;

    const show_site_local = "http://localhost:8888/login";
    const show_site = "https://tonedeaf-auth.vercel.app/login"
    const show_logout = "https://accounts.spotify.com/en/status"
    
    if(token) {
      spotifyWebApi.setAccessToken(token);
    }

    this.state = {
      loggedIn      : token ? true : false,
      returnPage    : token ? show_logout : show_site,
      loginButton   : token ? "log out" : "log in",
      nav             : [ "now playing", "top artists", "top songs", "recent"],
      selectedIndex : 0
    }

    this.navClick = this.navClick.bind(this);
  }


  // change selectedIndex to index of selected nav element
  navClick(event) {
    if(event.target.tagName === "BUTTON") {
      var index = 0;
      for (var i = 0; i < event.currentTarget.childNodes.length; i++) {
        var li = event.currentTarget.childNodes[i];
        li.classList.remove("selected");

        // select the child that matches the button that was pressed
        if (event.target === li) {
            index = i;
            event.target.classList.add("selected");
            console.log(event.target + " " + index);
        }
      }

      this.setState({selectedIndex : index});
      console.log("Selected Index: " + this.state.selectedIndex);
    }
  }
  
  // From Spotify's index.html in their authentication examples
  //  used to get access token to send api requests
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }
  
  // display based on selectedIndex
  render() {
    if(this.state.loggedIn) {
      var display;
      var showNowPlaying = <NowPlaying full="false"/>;
      switch(this.state.selectedIndex) {
        case 0:
          display = <NowPlaying full="true"/>;
          showNowPlaying = "";
          break;
        case 1:
          display = <TopArtists/>
          break;
        case 2:
          display = <TopTracks/>
          break;
        case 3:
          display = <Recent/>
          break;
      }

      var sidebar = (
        <React.Fragment>
          <Profile/>
          {showNowPlaying}
        </React.Fragment>
      )
    }

    return (
      <div className="App">
        <div className="page">

          <div className="top">
            <label className="label-title text-white"> tonedeaf </label>
            <div className="nav">
              <div className="nav-buttons" onClick={(event) => this.navClick(event)}>
                {
                  this.state.nav.map(function(item, i) {
                      if (i === 0) {
                          return <button className="nav-btn selected" key={i}>{item}</button>
                      } else {
                          return <button className="nav-btn" key={i}>{item}</button>
                      }
                  })
                }
              </div>
              <div className="div-log-btn">
                <a href={this.state.returnPage}>
                  <button className="nav-btn log-btn"> {this.state.loginButton} </button>
                </a>
              </div>
            </div>
          </div>
          <div className="div-content">
            <div className="div-sidebar div--outline">
              <div>
                {sidebar}
              </div>
            </div>
            <div className="div-panels div--outline">
              {display}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
