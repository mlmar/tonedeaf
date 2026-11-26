const DEV = import.meta.env.DEV;

const localApi = 'http://127.0.0.1:8888/api';
const productionHome = 'https://tonedeaf.vercel.app';
// Spotify redirects to the production host, which also needs the login state cookie.
const authApi = DEV ? localApi : `${productionHome}/api`;

export const HOME_URL = '/';
export const SERVICE_URL = DEV ? localApi : '/api';
export const LOGIN_URL = `${authApi}/auth/login`;
export const DEMO_URL = `${SERVICE_URL}/demo`;
export const CHANGE_USER_URL = `${authApi}/auth/change_user`;
export const LOGOUT_url = 'https://accounts.spotify.com/logout';
