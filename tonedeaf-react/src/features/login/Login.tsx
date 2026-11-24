import { useIsDemo } from '~/hooks/useIsDemo.ts';
import { CHANGE_USER_URL, LOGIN_URL } from '~/util/System';

export const Login = () => {
    const { setIsDemo } = useIsDemo();

    return (
        <div className='login'>
            <div className='primary flex-col'>
                <label className='super'> tonedeaf </label>
                <a href={LOGIN_URL} className='login-btn large'>
                    sign in with Spotify
                </a>
                <div className='flex flex-middle'>
                    <a href={CHANGE_USER_URL} className='demo-btn medium'>
                        change user
                    </a>
                    <span className='spacer'> or </span>
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
