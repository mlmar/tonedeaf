import React from 'react';

import './css/main.css';
import Profile from './js/Profile.js';
import NowPlaying from './js/NowPlaying.js';
import TopArtists from './js/artist/TopArtists.js';
import TopTracks from './js/track/TopTracks.js';
import Recent from './js/track/Recent.js';
import Options from './js/Options.js'
import Rec from './js/recommendations/Rec.js';
import GenreOptions from './js/recommendations/GenreOptions.js';
import Scope from './js/recommendations/Scope.js';
import FrontPage from './js/FrontPage';

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
        "Top Artists", 
        "Top Tracks", 
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
      
      // reset options component if window changes from one top to the other top list
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
      var showNowPlaying = <NowPlaying full="false"/>; // in sidebar

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
              text="Like these tracks?" 
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
              text="Like these tracks?" 
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
              text="Like these tracks?" 
              options={["Save as spotify playlist"]}
              callback={(index) => {
                this.rec.current.createPlaylist();
              }}
            />
          )

          display = <Rec userid={this.userid} ref={this.rec}/>
          break;

        case 5:
          secondaryFocus = ( // save tracks to playlist option
            <Options 
              text="Like these tracks?" 
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
