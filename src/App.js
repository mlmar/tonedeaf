import React from 'react';

import './App.css';
import './css/main.css';
import './css/mobile.css';

import { session } from './js/util/Session.js'

import FrontPage from './js/nav/FrontPage';
import Nav from './js/nav/Nav.js';
import Info from './js/nav/Info.js';

import Profile from './js/user/Profile.js';
import NowPlaying from './js/user/NowPlaying.js';

import ArtistsPage from './js/artist/ArtistsPage.js';
import TracksPage from './js/track/TracksPage.js';
import RecentPage from './js/track/RecentPage.js';
import TunerPage from './js/tuner/TunerPage.js';
import ScopePage from './js/scope/ScopePage.js';
import UserSearchPage from './js/social/UserSearchPage.js';

// Spotify Web API JS by Jose Perez on github
// https://github.com/JMPerez/spotify-web-api-js
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyWebApi = new SpotifyWebApi();

// system constants for links and development
const SYSTEM = require('./js/util/System.js');

/*  MAIN COMPONENT
 *    - sets access tokens for api calls
 *    - conditional rendering of the page based on login and navigation
 */
class App extends React.Component {
  
  constructor() {
    super();

    const params = this.getHashParams(); // use hashing function to get tokens
    const token = params.access_token; // set token in js api wrapper
    if(token) {
      spotifyWebApi.setAccessToken(token);
      session.token = token;
    }

    /********* COMPONENT STATES *********/
    this.state = {
      loggedIn      : token ? true : false, // true if a token is retrieved

      nav           : [ // nav elements
                        "Now Playing", 
                        "Artists", 
                        "Tracks", 
                        "Recent",
                        "Tuner",
                        "Scope",
                        "Users"
                      ],

      selectedIndex : 0, // selected nav element
    }

    this.userID = 0; // passed to components that use PlaylistCreator
    
    /********* BINDINGS *********/
    this.navClick = this.navClick.bind(this);
    this.logout = this.logout.bind(this);
    this.saveUser = this.saveUser.bind(this);
    this.renderControl = this.renderControl.bind(this);
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
   *    - assign selectedIndex
   */
  navClick(index) {
    this.setState({selectedIndex : index});
  }

  logout() {
    spotifyWebApi.setAccessToken(null);
    this.setState({ loggedIn : false });
    window.location.replace(SYSTEM.HOME);
  }

  /*  Callback from the profile component to cache user data
   *
   */
  saveUser(id, display) {
    session.setCache("user", "id", id);
    session.setCache("user", "display_name", display);
  }

  /*  callback function to search for recommendations based on the current song
   *    - called from the nowplaying component when on the Scope page
   *    - params :
   *        artistArray : array of artists from spotify response object
   *        trackId     : id of currently playing track
   */
  searchCurrent(artistArray, trackId) {
    // this.scope.current.externalSearch(artistArray,trackId);
  }

  /*  render components based on selectedIndex
   *    - each case represents a selectedIndex
   *    
   *    - 2 areas change upon logging in
   *        - top       : only render navbar if logged in
   *        - frontPage : show sidebar and display if logged in, 
   *                      show sign in page otherwise
   * 
   */
  renderControl() {
    var portrait = window.matchMedia("only screen and (max-width: 768px)").matches;

    var top; // only assign if logged in
    var frontpage; // shows front page if not logged in
    
    if(this.state.loggedIn) {

      var content; // right side content panels
      var profile = <Profile callback={this.saveUser}/>
      var showNowPlaying = portrait ? "" : <NowPlaying/>; // in sidebar

      /*************** REDNDER COMPONENTS BASED ON SELECTED INDEX ***************/
      switch(this.state.selectedIndex) {

        case 0: /*** 0 is the the default page upon logging in ***/
          content = 
            <>
              <div className="div-sidebar"> {profile} </div>
              <div className="div-panels">
                <NowPlaying full/>
              </div>
            </>
          break;

        case 1: /*** Top Artists, time ranges ***/
          content = <ArtistsPage> {showNowPlaying} </ArtistsPage>
          break;

        case 2: /*** Top Tracks, time ranges, playlist creator ***/
          content =  <TracksPage> {showNowPlaying} </TracksPage>  
          break;

        case 3: /*** Recent Tracks, time ranges, playlist creator ***/
          content =  <RecentPage> {showNowPlaying} </RecentPage>;
          break;
        
        case 4: /*** Tuner, Genres/Attributes options, playlist creator ***/
          content = <TunerPage> {showNowPlaying} </TunerPage>
          break;

        case 5: /*** Scope, playlist creator ***/
          content = <ScopePage></ScopePage>
          break;
        
        case 6: /*** Social, time ranges, type, playlist creator ***/
          content = <UserSearchPage> {showNowPlaying} </UserSearchPage>
          break;

        default: /*** show info page if the page breaks ***/
          content = <Info> {showNowPlaying} </Info>
          break;
      }

      // construct navbar
      top = <Nav onClick={this.navClick} nav={this.state.nav} selectedIndex={this.state.selectedIndex} logout={this.logout}/>

      // contruct the front page
      frontpage = <div className="div-content"> {content} </div>

    } else {
      frontpage = <FrontPage return={SYSTEM.LOGIN}/> // show sign in page if nto logged in
    }
    
    return <> {top} {frontpage} </>
  }

  /*  Main render
   *    constructs scurrent page based on render control
   */
  render() {
    return (
      <div className="App">
        <div className="page">
          {/* states are passed to this method but are only needed to cause a rerender, not as parameters */}
          {this.renderControl(this.state.selectedIndex, this.state.loggedIn)}
        </div>
      </div>
    );
  }
}

export default App;