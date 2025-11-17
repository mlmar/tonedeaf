import './styles/main.less';
import './styles/mobile.less';

import { useState, useEffect } from 'react';
import { useSelections } from '~/hooks/SelectionHooks.js';
import { getProfile } from '~/util/SpotifyUtil';
import { cache } from '~/util/Cache.js';

import { useDownload } from '~/hooks/useDownload';

import Boundary from '~/components/Boundary.jsx';
import Alert from '~/components/Alert';

import Login from '~/features/login/Login.jsx';
import Nav from '~/components/Nav.jsx';

import Summary from '~/features/summary/Summary.jsx';
import ArtistPage from '~/features/artist/ArtistPage.jsx';
import TrackPage from '~/features/track/TrackPage.jsx';
import RecentPage from '~/features/track/RecentPage.jsx';
import ScopePage from '~/features/scope/ScopePage.jsx';
import TunerPage from '~/features/tuner/TunerPage.jsx';

import Load from '~/components/Load.jsx';

import { HOME_URL, LOGIN_URL, CHANGE_USER_URL } from '~/util/System.js';
import { getHashParams } from '~/util/HashUtil.js';

import { setAccessToken } from '~/util/SpotifyUtil';
import DEFAULTS from '~/util/Defaults';
import { fetchDemo } from '~/util/DataUtil.js';

const App = () => {
    const [alertText, setAlertText] = Alert.useAlert(null);

    const [loggedIn, setLoggedIn] = useState(false);
    const [navIndex, setNavIndex] = useState(0); // current navigation index for Nav bar
    function handleNavChange(index) {
        if (index === 4 || index === 5) {
            setAlertText('Sign in to use this feature');
        }
        setNavIndex(index);
    }

    const { exportRef, shareImage, copyImage } = useDownload();
    const handledownloadClick = (index) => {
        if (index === 0) {
            shareImage();
        } else {
            copyImage();
            setAlertText(DEFAULTS.STATUS_MESSAGE.CLIPBOARD);
        }
    };

    const summaryPageProps = useSelections({
        viewIndex: DEFAULTS.VIEW_INDEX,
        timeFrameIndex: DEFAULTS.TIME_FRAME_INDEX,
    });

    const artistPageProps = useSelections({
        viewIndex: DEFAULTS.VIEW_INDEX,
        timeFrameIndex: DEFAULTS.TIME_FRAME_INDEX,
    });
    const [artistGenre, setArtistGenre] = useState(DEFAULTS.GENRE);

    const trackPageProps = useSelections({
        viewIndex: DEFAULTS.VIEW_INDEX,
        timeFrameIndex: DEFAULTS.TIME_FRAME_INDEX,
    });

    const logout = () => {
        window.location.replace(HOME_URL);
    };

    // attempt to login with access token parameter upon loading page
    useEffect(() => {
        const login = async () => {
            const params = getHashParams();
            const token = params.access_token;
            setAccessToken(token);
            setLoggedIn(token);

            if (token) {
                const info = await getProfile();
                cache['userInfo'] = info;

                try {
                    window.history.replaceState(null, 'tonedeaf', HOME_URL);
                } catch (error) {
                    console.error('Unable to replace history state');
                    console.error(error);
                }
            }
        };
        login();
    }, []);

    const handleDemo = async () => {
        await fetchDemo();
        setLoggedIn(true);
    };

    const getContent = () => {
        switch (navIndex) {
            case 0:
                return (
                    <Summary
                        setNavIndex={setNavIndex}
                        {...summaryPageProps}
                        setArtistTimeFrameIndex={
                            artistPageProps.setTimeFrameIndex
                        }
                        setArtistGenre={setArtistGenre}
                        setTrackTimeFrameIndex={
                            trackPageProps.setTimeFrameIndex
                        }
                        exportRef={exportRef}
                        onDownloadClick={handledownloadClick}
                        setAlertText={setAlertText}
                    />
                );
            case 1:
                return (
                    <ArtistPage
                        {...artistPageProps}
                        genre={artistGenre}
                        setGenre={setArtistGenre}
                        exportRef={exportRef}
                        onDownloadClick={handledownloadClick}
                        setAlertText={setAlertText}
                    />
                );
            case 2:
                return (
                    <TrackPage
                        {...trackPageProps}
                        exportRef={exportRef}
                        onDownloadClick={handledownloadClick}
                        setAlertText={setAlertText}
                    />
                );
            case 3:
                return <RecentPage setAlertText={setAlertText} />;
            case 4:
                return <ScopePage setAlertText={setAlertText} />;
            case 5:
                return <TunerPage setAlertText={setAlertText} />;
            default:
                return <Load />;
        }
    };

    return (
        <div className='app'>
            <Alert
                visible={Boolean(alertText)}
                onClick={() => setAlertText(null)}
            >
                {' '}
                {alertText}{' '}
            </Alert>
            {!loggedIn ? (
                <Login>
                    <a href={LOGIN_URL} className='login-btn large'>
                        {' '}
                        sign in with Spotify{' '}
                    </a>
                    <div className='flex flex-middle'>
                        <a href={CHANGE_USER_URL} className='demo-btn medium'>
                            {' '}
                            change user{' '}
                        </a>
                        <span className='spacer'> or </span>
                        <button
                            className='demo-btn medium'
                            onClick={handleDemo}
                        >
                            {' '}
                            try a demo{' '}
                        </button>
                    </div>
                </Login>
            ) : (
                <main className='main'>
                    <Nav
                        text='tonedeaf'
                        index={navIndex}
                        setIndex={handleNavChange}
                        options={DEFAULTS.NAV_OPTIONS}
                        onLogout={logout}
                    />
                    <Boundary
                        fallback={
                            <label className='large bold'>
                                {' '}
                                Something went wrong!{' '}
                            </label>
                        }
                    >
                        {getContent()}
                    </Boundary>
                </main>
            )}
        </div>
    );
};

export default App;
