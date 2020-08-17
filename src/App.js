import React from 'react';

import './css/main.css';
import Profile from './js/Profile.js';
import NowPlaying from './js/NowPlaying.js';
import TopArtists from './js/artist/TopArtists.js';
import TopTracks from './js/track/TopTracks.js';
import Recent from './js/track/Recent.js';
import Options from './js/Options.js'
// import Rec from './js/recommendations/Rec.js';

// Spotify Web API JS by Jose Perez on github
// https://github.com/JMPerez/spotify-web-api-js
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyWebApi = new SpotifyWebApi();

class App extends React.Component {

  constructor() {
    super();
    const params = this.getHashParams();
    const token = params.access_token;

//     const show_site = "http://localhost:8888/login";
    const show_site = "https://tonedeaf-auth.vercel.app/login"
    const show_logout = "https://accounts.spotify.com/en/status"
    
    if(token) {
      spotifyWebApi.setAccessToken(token);
    }

    this.state = {
      loggedIn      : token ? true : false,
      returnPage    : token ? show_logout : show_site,
      loginButton   : token ? "log out" : "log in",
      nav             : [ "now playing", "top artists", "top tracks", "recent", "recommend"],
      selectedIndex : 0
    }

    this.optionsArray = ["long term","6 months","4 weeks"];
    this.topArtists = React.createRef();
    this.topTracks = React.createRef();
    
    this.navClick = this.navClick.bind(this);
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
  
  // display based on selectedIndex
  render() {
    var frontpage; // TODO: landing screen
    if(this.state.loggedIn) {
      var focus = <Profile/>; // focus on profile by default
      var display; // right side content panels
      var showNowPlaying = <NowPlaying full="false"/>; // in sidebar

      switch(this.state.selectedIndex) {
        case 0:
          display = <NowPlaying full="true"/>; // in right panel
          showNowPlaying = <span className="empty"/>; // replace with an empty span
          break;

        case 1:
          var text = "top artists"
          focus = (
            <Options 
              text={text} 
              options={this.optionsArray}
              callback={(index) => {
                this.topArtists.current.getTopArtists(index);
              }}
              /> 
            )
          display = <TopArtists ref={this.topArtists}/>
          break;

        case 2:
          var text = "top tracks"
          focus = (
            <Options 
              text={text} 
              options={this.optionsArray}
              callback={(index) => {
                this.topTracks.current.getTopTracks(index);
              }}
              />
            )          
          display = <TopTracks ref={this.topTracks}/>
          break;

        case 3:
          focus = <Profile/>
          display = <Recent/>
          break;

        default:
          break;
      }

      var sidebar = (
        <React.Fragment>
          {focus}
          {showNowPlaying}
        </React.Fragment>
      )

      frontpage = (
        <React.Fragment>
          <div className="div-sidebar div--outline">
            <div>
              {sidebar}
            </div>
          </div>
          <div className="div-panels div--outline">
            {display}
          </div>
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
            {frontpage}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
