import './css/main.css';
import './css/mobile.css';

import { useState, useEffect } from 'react';
import { useSelections } from './js/hooks/SelectionHooks.js';
import { getProfile } from './js/util/SpotifyUtil.js';
import { cache } from './js/util/Session.js';

import { useAlert } from './js/hooks/AlertHooks.jsx';
import { useDownload } from './js/util/DownloadUtil.js';

import Boundary from './js/modules/Boundary.jsx';

import Login from './js/modules/login/Login.jsx';
import Nav from './js/modules/ui/Nav.jsx';

import Summary from './js/modules/summary/Summary.jsx';
import ArtistPage from './js/modules/artist/ArtistPage.jsx';
import TrackPage from './js/modules/track/TrackPage.jsx';
import RecentPage from './js/modules/track/RecentPage.jsx';
import ScopePage from './js/modules/scope/ScopePage.jsx';
import TunerPage from './js/modules/tuner/TunerPage.jsx';

import Load from './js/modules/ui/Load.jsx';

import { HOME_URL, LOGIN_URL, CHANGE_USER_URL } from './js/util/System.js';
import { getHashParams } from './js/util/HashUtil.js';

import { setAccessToken } from './js/util/SpotifyUtil.js';
import DEFAULTS from './js/util/Defaults.jsx';
import { fetchDemo } from './js/util/DataUtil.js';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [navIndex, setNavIndex] = useState(0); // current navigation index for Nav bar

  const { setAlertText, alertElement } = useAlert(null);

  const { exportRef, shareImage, copyImage } = useDownload();
  const handledownloadClick = (index) => {
    if(index === 0) {
      shareImage();
    } else {
      copyImage();
      setAlertText(DEFAULTS.STATUS_MESSAGE.CLIPBOARD);
    }
  }

  const summaryPageProps = useSelections({
    viewIndex: DEFAULTS.VIEW_INDEX,
    timeFrameIndex: DEFAULTS.TIME_FRAME_INDEX
  });

  const artistPageProps = useSelections({
    viewIndex: DEFAULTS.VIEW_INDEX,
    timeFrameIndex: DEFAULTS.TIME_FRAME_INDEX
  });
  const [artistGenre, setArtistGenre] = useState(DEFAULTS.GENRE);

  const trackPageProps = useSelections({
    viewIndex: DEFAULTS.VIEW_INDEX,
    timeFrameIndex: DEFAULTS.TIME_FRAME_INDEX
  });

  /*
    - Get access token provided by spotify
    - Display logged in app
    - Clean the page URL
  */
  const login = async () => {
    const params = getHashParams();
    const token = params.access_token;
    setAccessToken(token);
    setLoggedIn(token);

    if(token) {
      const info = await getProfile();
      cache["userInfo"] = info;

      try {
        window.history.replaceState(null, "tonedeaf", HOME_URL);
      } catch(error) {
        console.warn("Unable to replace history state");
      }
    }
  }
  
  const logout = () => {
    window.location.replace(HOME_URL);
  }

  // attempt to login with access token parameter upon loading page
  useEffect(() => {
    login();
  }, []);

  const handleDemo = async () => {
    await fetchDemo();
    setLoggedIn(true);
  }

  const Fallback = () => {
    return <label className="large bold"> Something went wrong! </label>
  }

  const getContent = () => {
    switch(navIndex) {
      case 0:  return <Summary setNavIndex={setNavIndex} {...summaryPageProps} setArtistTimeFrameIndex={artistPageProps.setTimeFrameIndex} setArtistGenre={setArtistGenre} setTrackTimeFrameIndex={trackPageProps.setTimeFrameIndex} exportRef={exportRef} onDownloadClick={handledownloadClick} setAlertText={setAlertText}/>
      case 1:  return <ArtistPage {...artistPageProps} genre={artistGenre} setGenre={setArtistGenre} exportRef={exportRef} onDownloadClick={handledownloadClick} setAlertText={setAlertText}/>
      case 2:  return <TrackPage {...trackPageProps} exportRef={exportRef} onDownloadClick={handledownloadClick} setAlertText={setAlertText}/>
      case 3:  return <RecentPage setAlertText={setAlertText}/>
      case 4:  return <ScopePage setAlertText={setAlertText}/>
      case 5:  return <TunerPage setAlertText={setAlertText}/>
      default: return <Load/>
    }
  }

  return (
    <div className="app">
        {alertElement}
        { !loggedIn ? (
            <Login>
              <a href={LOGIN_URL} className="login-btn large"> sign in with Spotify </a>
              <div className="flex flex-middle">
                <a href={CHANGE_USER_URL} className="demo-btn medium"> change user </a>
                <span className="spacer"> or </span>
                <button className="demo-btn medium" onClick={handleDemo}> try a demo </button>
              </div>
            </Login>
          ) : (
            <main className="main">
              <Nav text="tonedeaf" index={navIndex} setIndex={setNavIndex} options={DEFAULTS.NAV_OPTIONS} onLogout={logout}/>
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
