import { useIsDemo } from '~/hooks/useIsDemo.ts';
import { CHANGE_USER_URL, LOGIN_URL } from '~/util/System';

type LoginProps = {
    authError: boolean;
    sessionUnavailable: boolean;
    logoutFailed: boolean;
    onRetry: () => void;
};

export const Login = ({ authError, sessionUnavailable, logoutFailed, onRetry }: LoginProps) => {
    const { setIsDemo } = useIsDemo();

    if (logoutFailed) {
        return (
            <div className='login'>
                <div className='primary flex-col'>
                    <p role='alert'>Tonedeaf couldn’t end your session.</p>
                    <button className='demo-btn medium' onClick={onRetry}>Retry logout</button>
                </div>
            </div>
        );
    }

    return (
        <div className='login'>
            <div className='primary flex-col'>
                <label className='super'> tonedeaf </label>
                {sessionUnavailable ? (
                    <>
                        <p role='alert'>Tonedeaf couldn’t check your Spotify session.</p>
                        <button className='demo-btn medium' onClick={onRetry}>Try again</button>
                    </>
                ) : (
                    <>
                        {authError && <p role='alert'>Spotify sign-in couldn’t be completed. Try signing in again.</p>}
                        <a href={LOGIN_URL} className='login-btn large'>sign in with Spotify</a>
                    </>
                )}
                <div className='flex flex-middle'>
                    {!sessionUnavailable && (
                        <>
                            <a href={CHANGE_USER_URL} className='demo-btn medium'>change account</a>
                            <span className='spacer'> or </span>
                        </>
                    )}
                    <button className='demo-btn medium' onClick={() => setIsDemo(true)}>
                        try a demo
                    </button>
                </div>
            </div>
            <div className='info flex-col'>
                <label className='tiny'>This application is not developed by or affiliated with Spotify AB.</label>
                <label className='tiny'>Developed using Spotify Web API.</label>
            </div>
        </div>
    );
};
