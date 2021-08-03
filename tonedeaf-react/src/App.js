import './css/main.css';
import './css/mobile.css';

import { useState, useEffect } from 'react';
import { getProfile } from './js/util/SpotifyUtil.js';
import { cache } from './js/util/Session.js';

import Boundary from './js/modules/Boundary';

import Login from './js/modules/login/Login.js';
import Nav from './js/modules/ui/Nav.js';

// import Profile from './js/modules/user/Profile.js';
import NowPlaying from './js/modules/user/NowPlaying.js';
import ArtistPage from './js/modules/artist/ArtistPage.js';
import TrackPage from './js/modules/track/TrackPage.js';
import RecentPage from './js/modules/track/RecentPage.js';
import ScopePage from './js/modules/scope/ScopePage.js';
import TunerPage from './js/modules/tuner/TunerPage.js';

import Load from './js/modules/ui/Load.js';

import { HOME_URL, LOGIN_URL } from './js/util/System.js';
import { getHashParams } from './js/util/HashUtil.js';

import { setAccessToken } from './js/util/SpotifyUtil.js';

const NAV_OPTIONS = ["Now Playing", "Artists", "Tracks", "Recent", "Scope", "Tuner"];

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const [navIndex, setNavIndex] = useState(0); // current navigation index for Nav bar

  /*
    - Get access token provided by spotify
    - Display logged in app
    - Clean the page URL
  */
  const login = async () => {
    let params = getHashParams();
    let token = params.access_token;
    setAccessToken(token);
    setLoggedIn(token);

    if(token) {
      const info = await getProfile();
      cache["userInfo"] = info;
      window.history.replaceState(null, "tonedeaf", HOME_URL)
    }
  }
  
  const logout = () => {
    window.location.replace(HOME_URL);
  }

  // attempt to login with access token parameter upon loading page
  useEffect(() => {
    login();
  }, []);

  const handleDemo = () => {
    setLoggedIn(true);
    cache["demo"] = true;
  }

  const Fallback = () => {
    return <label className="large bold"> Something went wrong! </label>
  }

  const getContent = () => {
    switch(navIndex) {
      case 0:
        return <NowPlaying onLogout={logout}/>
      case 1:
        return <ArtistPage/>
      case 2:
        return <TrackPage/>
      case 3:
        return <RecentPage/>
      case 4:
        return <ScopePage/>
      case 5:
        return <TunerPage/>
      default:
        return <Load/>
    }
  }

  return (
    <div className="app">
        { !loggedIn ? (
          <Login>
              <a href={LOGIN_URL} className="login-btn large"> sign in with Spotify </a>
              <button className="demo-btn medium" onClick={handleDemo}> or try a demo </button>
            </Login>
          ) : (
            <main className="main">
              <Nav text="tonedeaf" index={navIndex} setIndex={setNavIndex} options={NAV_OPTIONS} onLogout={logout}/>
              <Boundary fallback={<Fallback/>}>
                {getContent()}
              </Boundary>
            </main>
          )
        }
    </div>
  )
}

export default App;
