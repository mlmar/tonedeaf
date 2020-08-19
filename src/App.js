import React from 'react';

import './css/main.css';
import './css/mobile.css';

import FrontPage from './js/FrontPage';
import Nav from './js/Nav.js'


import Profile from './js/Profile.js';
import NowPlaying from './js/NowPlaying.js';
import TopArtists from './js/artist/TopArtists.js';
import TopTracks from './js/track/TopTracks.js';
import Recent from './js/track/Recent.js';
import Tuner from './js/recommendations/Tuner.js';
import Scope from './js/recommendations/Scope.js';

import Options from './js/Options.js'
import GenreOptions from './js/recommendations/GenreOptions.js';


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
      loginButton   : token ? "Log Out" : "Log In",
      nav           : [ 
        "Now Playing", 
        "Artists", 
        "Tracks", 
        "Recent",
        "Tuner",
        "Scope"
      ],
      selectedIndex : 0
    }

    this.userid = 0;

    this.topArtists = React.createRef();
    this.topTracks = React.createRef();
    this.recent = React.createRef();
    this.rec = React.createRef();
    this.scope = React.createRef();
    this.options = React.createRef();

    this.optionsArray = ["Long Term", "6 Months", "4 Weeks"];
    this.optionsArrayIndex = 0; // generic tracker to reset index upon component change
    
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
      
      // reset options component if window changes
      if(this.options.current !== null) {
        if(this.optionsArrayIndex >= 0 && this.state.selectedIndex !== index) {
          this.options.current.setState({index: 0});
        }
      }

      this.setState({selectedIndex : index});
      console.log("Selected Index: " + this.state.selectedIndex);
    }
  }

  // display based on selectedIndex
  render() {
    var portrait = window.matchMedia("only screen and (orientation: portrait)").matches;

    var top;
    var frontpage;
    if(this.state.loggedIn) {

      // focus on profile by default
      var focus = (
        <Profile callback={(id) => {
            this.userid = id;
            console.log("succesfllly found user id on mount @ " + id);
          }}
        /> 
      );

      var secondaryFocus;
      var display; // right side content panels
      var showNowPlaying = portrait ? "" : <NowPlaying full="false"/>; // in sidebar

      switch(this.state.selectedIndex) {
        case 0:
          display = <NowPlaying full="true"/>; // in right panel
          showNowPlaying = <span className="empty"/>; // replace with an empty span
          break;

        case 1:
          var text1 = "Your Top Artists"

          focus = ( // for time range selection
            <Options 
              text={text1} 
              options={this.optionsArray}
              callback={(index) => {
                this.topArtists.current.getTopArtists(index);
                this.optionsArrayIndex = index;
              }}
              ref={this.options}
            /> 
          )
          display = <TopArtists ref={this.topArtists}/>
          break;

        case 2:
          var text2 = "Your Top Tracks"
          focus = ( // for time range selection
            <Options 
              text={text2} 
              options={this.optionsArray}
              callback={(index) => {
                this.topTracks.current.getTopTracks(index);
                this.optionsArrayIndex = index;
              }}
              ref={this.options}
            />
          )
          
          secondaryFocus = ( // save tracks to playlist option
            <Options 
              text="Like these tracks? (let me know if this works)"
              options={["Save as spotify playlist"]}
              callback={(index) => {
                this.topTracks.current.createPlaylist();
              }}
            />
          )
          
          display = <TopTracks userid={this.userid} ref={this.topTracks}/>
          break;

        case 3:
          secondaryFocus = ( // save tracks to playlist option
            <Options 
              text="Like these tracks? (let me know if this works)"
              options={["Save as spotify playlist"]}
              callback={(index) => {
                this.recent.current.createPlaylist();
              }}
            />
          )

          display = <Recent userid={this.userid} ref={this.recent}/>
          break;
        
        case 4:
          focus = (
            <GenreOptions
              callback={(index) => {
                this.rec.current.setState({index: index})
              }}
            />
          )

          secondaryFocus = ( // save tracks to playlist option
            <Options 
              text="Like these tracks? (let me know if this works)" 
              options={["Save as spotify playlist"]}
              callback={(index) => {
                this.rec.current.createPlaylist();
              }}
            />
          )

          display = <Tuner userid={this.userid} ref={this.rec}/>
          break;

        case 5:
          focus = "";
          secondaryFocus = ( // save tracks to playlist option
            <Options 
              text="Like these tracks? (let me know if this works)" 
              options={["Save as spotify playlist"]}
              callback={(index) => {
                this.scope.current.createPlaylist();
              }}
            />
          )
          display = <Scope userid={this.userid} ref={this.scope}/>
          break;

        default:
          break;
      }

      var sidebar = (
        <React.Fragment>
          {focus}
          {secondaryFocus}
          {showNowPlaying}
        </React.Fragment>
      )

      top = (
        <Nav
          callback={this.navClick}
          nav={this.state.nav}
          returnPage={this.state.returnPage}
          loginButton={this.state.loginButton}
        />
      )

      frontpage = (
        <React.Fragment>
          <div className="div-sidebar div--outline">
            {sidebar}
          </div>
          <div className="div-panels div--outline">
            {display}
          </div>
        </React.Fragment>
      )
    } else {
      frontpage = <FrontPage return={this.state.returnPage}/>
    }

    return (
      <div className="App">
        <div className="page">
          {top}
          <div className="div-content">
            {frontpage}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
