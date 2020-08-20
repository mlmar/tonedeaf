import React from 'react';

import './css/main.css';
import './css/mobile.css';

import FrontPage from './js/nav/FrontPage';
import Nav from './js/nav/Nav.js';
import Info from './js/nav/Info.js';

import Profile from './js/user/Profile.js';
import NowPlaying from './js/user/NowPlaying.js';

import TopArtists from './js/artist/TopArtists.js';
import TopTracks from './js/track/TopTracks.js';
import Recent from './js/track/Recent.js';

import Tuner from './js/rec/Tuner.js';
import Scope from './js/rec/Scope.js';
// import GenreOptions from './js/rec/GenreOptions.js';

import Options from './js/helper/Options.js'



// Spotify Web API JS by Jose Perez on github
// https://github.com/JMPerez/spotify-web-api-js
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyWebApi = new SpotifyWebApi();


/*  MAIN COMPONENT
 *    - sets access tokens for api calls
 *    - conditional rendering of the page based on login and navigation
 *    - handles pseudo caches (local copies to reduce api calls)
 */
class App extends React.Component {
  
  // v1
  constructor() {
    super();
    /********* FOR DEVELOPMENT ONLY *********/
    const local = false; // set to false before deployment
    const local_site = "http://localhost:8888/login";

    /********* TONEDEAF-AUTH SHOULD BE THE REDIRECT PAGE BY DEFAULT *********/
    const deployed_site = "https://tonedeaf-auth.vercel.app/login";
    const show_site = local ? local_site : deployed_site;
    const show_logout = "https://accounts.spotify.com/en/status";
    
    const params = this.getHashParams(); // use hahing function to get tokens
    const token = params.access_token; // set token in js api wrapper
    if(token) {
      spotifyWebApi.setAccessToken(token);
    }

    /********* COMPONENT STATES *********/
    this.state = {
      loggedIn      : token ? true : false, // true  a token is retrieved
      returnPage    : token ? show_logout : show_site, // log button url
      loginButton   : token ? "Log Out" : "Log In", // log button text

      nav           : [ // nav elements
                        "Now Playing", 
                        "Artists", 
                        "Tracks", 
                        "Recent",
                        "Tuner",
                        "Scope",
                        "Info"
                      ],
      selectedIndex : 0 // selected nav element
    }

    this.userid = 0; // passed to components that use PlaylistCreator

    /********* REFERENCES *********/
    this.topArtists = React.createRef();  // call createPlaylist(), change index
    this.topTracks = React.createRef();   // call createPlaylist(), change index
    this.recent = React.createRef();      // call createPlaylist()
    this.tuner = React.createRef();       // call createPlaylist(), change index
    this.scope = React.createRef();       // call createPlaylist()
    this.options = React.createRef();     // reset options index

    /********* TEXTS *********/
    this.timeRanges = ["Long Term", "6 Months", "4 Weeks"]; // time ranges for options
    this.likeText = "Like these tracks?"; // playlist option text
    this.saveText = ["Save as Spotify Playlist"]; // only one option

    
    /********* CACHE *********/
    // pseudo cache : local copies of lists that cannot change within one session
    // cache whereever possible to reduce api calls
    this.CACHED_ARTISTS = [[],[],[]];
    this.CACHED_TRACKS = [[],[],[]];
    this.CACHED_GENRES = []

    
    /********* BINDINGS *********/
    this.navClick = this.navClick.bind(this);
    this.createOptions = this.createOptions.bind(this);
  }

  /*  From Spotify's index.html in their authentication examples
   *    - used to get access token to send api requests
   */
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  
  /*  Called as callback from the Nav component
   *    - loops through all childnode buttons of the navbar
   *    - remove selected css if possible
   *    - assign selectedIndex and selected css to clicked button
   */
  navClick(event) {
    // since onClick is called from, confirm a button was clicked
    if(event.target.tagName === "BUTTON") {
      var index = 0;
      for (var i = 0; i < event.currentTarget.childNodes.length; i++) {
        var li = event.currentTarget.childNodes[i];
        li.classList.remove("selected");

        // select the child that matches the button that was pressed
        if (event.target === li) {
            index = i;
            event.target.classList.add("selected");
        }
      }

      this.setState({selectedIndex : index});
      console.log("Selected Index: " + this.state.selectedIndex);
    }
  }

  /*  function to create options in sidebar
   *    - called to navigate within displayed components save playlist
   *    - params : 
   *        text      : title of options component
   *        options   : options to be shown as buttons
   *        callback  : callback function that returns pressed index
   */
  createOptions(text, options, callback, i) {
    return (
      <Options 
        text={text}
        options={options}
        callback={callback}
        ref={this.options}
        key={i}
      />
    );
  }

  /*  render components based on selectedIndex
   *    - each cae represents a selectedIndex
   *    
   *    - 2 areas change upon logging in
   *        - top       : only render navbar if logged in
   *        - frontPage : show sidebar and display if logged in, 
   *                      show sign in page otherwise
   *
   *    - 4 areas can change upon navigation:
   *        - focus           : top of sidebar -- profile/options
   *        - secondaryFocus  : middle of sidebar -- boolean save
   *        - showNowPlaying  : bottom of sidebar -- boolean
   *        - display         : the main component area for navigaiton
   */
  render() {
    var portrait = window.matchMedia("only screen and (orientation: portrait)").matches;

    var top; // only assign if logged in
    var frontpage; // shows front page if not logged in
    
    if(this.state.loggedIn) {

      var focus = ( // focus on profile by default
        <Profile callback={(id) => {
            this.userid = id; // get user id from current profile
            console.log("succesfllly found user id on mount @ " + id);
          }}
        /> 
      );

      var secondaryFocus; // show save option for playlists
      var display; // right side content panels
      var showNowPlaying = portrait ? "" : <NowPlaying full="false"/>; // in sidebar


      /*************** REDNDER COMPONENTS BASED ON SELECTED INDEX ***************/
      switch(this.state.selectedIndex) {

        case 0: /*** 0 is the the default page upon logging in ***/
          display = <NowPlaying full="true"/>; // in right panel
          showNowPlaying = ""; // set to nothing
          break;

        case 1: /*** Top Artists, time ranges ***/
          focus = this.createOptions("Your Top Artists", this.timeRanges, 
            (index) => {
              this.topArtists.current.getTopArtists(index);
              this.optionsChanged = true;
            }, 1);

          display = (
            <TopArtists ref={this.topArtists} cache={this.CACHED_ARTISTS}
              callback={(index, list) => {
                this.CACHED_ARTISTS[index] = list;
              }}
            />
          );

          break;

        case 2: /*** Top Tracks, time ranges, playlist creator ***/
          focus = this.createOptions("Your Top Tracks", this.timeRanges, 
            (index) => {
              this.topTracks.current.getTopTracks(index);
              this.optionChanged = true;
            }, 2);
          
          secondaryFocus = this.createOptions(this.likeText, this.saveText, 
            (index) => {
              this.topTracks.current.createPlaylist();
            });
          
          display = 
            <TopTracks userid={this.userid} ref={this.topTracks} cache={this.CACHED_TRACKS}
              callback={(index, list) => {
                this.CACHED_TRACKS[index] = list;
              }}
            />
          break;

        case 3: /*** Recent Tracks, time ranges, playlist creator ***/
          secondaryFocus = this.createOptions(this.likeText, this.saveText, 
            (index) => {
              this.recent.current.createPlaylist();
            });

          display = <Recent userid={this.userid} ref={this.recent}/>
          break;
        
        case 4: /*** Tuner, Genres/Attributes options, playlist creator ***/
          focus = this.createOptions("Tuner", ["Genres","Attributes"], 
            (index) => {
                this.tuner.current.setState({index: index})
            }, 3);

          secondaryFocus = this.createOptions(this.likeText, this.saveText, 
            (index) => {
              this.tuner.current.createPlaylist();
            });

          display =
            <Tuner userid={this.userid} ref={this.tuner} cache={this.CACHED_GENRES}
              callback={(list) => {
                this.CACHED_GENRES = list;
              }}
            />
          break;

        case 5: /*** Scope, playlist creator ***/
          focus = this.createOptions("Scope", ["Artists","Tracks"], 
            (index) => {
                this.scope.current.setSearchType(index);
            }, 4);
            
          secondaryFocus = this.createOptions(this.likeText, this.saveText, 
            (index) => {
              this.scope.current.createPlaylist();
            });

          display = <Scope userid={this.userid} ref={this.scope}/>
          break;

        default: /*** show info page if the page breaks ***/
          display = <Info/>
          break;
      }


      /*************** CONSTRUCT THE PAGE BASED ON PREVIOUS CONDITIONS ***************/

      // constructor sidebar
      var sidebar = (<React.Fragment> {focus}{secondaryFocus}{showNowPlaying} </React.Fragment>);

      // construct naavbar
      top =
        <Nav
          callback={this.navClick}
          nav={this.state.nav}
          returnPage={this.state.returnPage}
          loginButton={this.state.loginButton}
        />

      // contruct the front page
      frontpage =
        <React.Fragment>
          <div className="div-sidebar"> {sidebar} </div>
          <div className="div-panels"> {display} </div>
        </React.Fragment>
  

    /*  If not logged in, just show the sign in page
     *    - one button that leads to spotify permissions page
     */
    } else {
      frontpage = <FrontPage return={this.state.returnPage}/>
    }

    /******* MAIN RETURN FOR THE APP.JS RENDER METHOD *******/
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
