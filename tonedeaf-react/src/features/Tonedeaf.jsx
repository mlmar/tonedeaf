import { useDownload } from '~/hooks/useDownload';

import { Boundary } from '~/components/Boundary.jsx';
import { Alert } from '~/components/Alert';

import { Login } from '~/features/login/Login.jsx';
import { Nav } from '~/components/Nav.jsx';

import { Summary } from '~/features/summary/Summary.jsx';
import { ArtistPage } from '~/features/artist/ArtistPage.jsx';
import { TrackPage } from '~/features/track/TrackPage.jsx';
import { RecentPage } from '~/features/track/RecentPage.jsx';
import { ScopePage } from '~/features/scope/ScopePage.jsx';
import { TunerPage } from '~/features/tuner/TunerPage.jsx';

import { Load } from '~/components/Load.jsx';

import { HOME_URL } from '~/util/System.js';

import { Config } from '~/util/Config.ts';
import { useLogin } from '~/hooks/useLogin';
import { useTonedeafStore } from '~/hooks/useTonedeafStore';
import { useIsDemo } from '~/hooks/useIsDemo';

export const Tonedeaf = () => {
    const { setIsDemo } = useIsDemo();
    const loggedIn = useLogin();

    const navIndex = useTonedeafStore((state) => state.navIndex);
    const setNavIndex = useTonedeafStore((state) => state.setNavIndex);

    const setAlertText = useTonedeafStore((state) => state.setAlertText);

    const { exportRef, shareImage, copyImage } = useDownload();
    const handledownloadClick = (index) => {
        if (index === 0) {
            shareImage();
        } else {
            copyImage();
            setAlertText(Config.STATUS_MESSAGE.CLIPBOARD);
        }
    };

    const getContent = () => {
        switch (navIndex) {
            case Config.NAV_INDEX.SUMMARY:
                return <Summary exportRef={exportRef} onDownloadClick={handledownloadClick} />;
            case Config.NAV_INDEX.ARTISTS:
                return <ArtistPage exportRef={exportRef} onDownloadClick={handledownloadClick} />;
            case Config.NAV_INDEX.TRACKS:
                return <TrackPage exportRef={exportRef} onDownloadClick={handledownloadClick} />;
            case Config.NAV_INDEX.RECENT:
                return <RecentPage />;
            case Config.NAV_INDEX.SCOPE:
                return <ScopePage />;
            case Config.NAV_INDEX.TUNER:
                return <TunerPage />;
            default:
                return <Load />;
        }
    };

    return (
        <div className='app'>
            <TonedeafAlert />
            {!loggedIn ? (
                <Login />
            ) : (
                <main className='main'>
                    <Nav
                        text='tonedeaf'
                        index={navIndex}
                        onChange={setNavIndex}
                        options={Config.NAV_OPTIONS}
                        onLogout={() => {
                            window.location.replace(HOME_URL);
                            setIsDemo(false);
                        }}
                    />
                    <Boundary fallback={<label className='large bold'>Something went wrong!</label>}>
                        {getContent()}
                    </Boundary>
                </main>
            )}
        </div>
    );
};

function TonedeafAlert() {
    const alertText = useTonedeafStore((state) => state.alertText);
    const setAlertText = useTonedeafStore((state) => state.setAlertText);

    return (
        <Alert visible={Boolean(alertText)} onClick={() => setAlertText(null)}>
            {alertText}
        </Alert>
    );
}
