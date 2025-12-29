const DEV = import.meta.env.DEV;

const local_site = 'http://127.0.0.1:8888/api';
const deployed_site = 'https://tonedeaf.vercel.app/api';

export const HOME_URL = DEV ? 'http://127.0.0.1:3000' : 'https://tonedeaf.vercel.app';
export const SERVICE_URL = DEV ? local_site : deployed_site;
export const LOGIN_URL = DEV ? local_site + '/auth/login' : deployed_site + '/auth/login';
export const DEMO_URL = DEV ? local_site + '/demo' : deployed_site + '/demo';
export const CHANGE_USER_URL = DEV ? local_site + '/change_user' : deployed_site + '/change_user';
export const LOGOUT_url = 'https://accounts.spotify.com/logout';
