const DEV = import.meta.env.REACT_APP_DEV;

const local_site = "http://localhost:8888/";
const deployed_site = "https://tonedeaf-auth.vercel.app/";

export const HOME_URL = DEV ? "http://localhost:3000" : "https://tonedeaf.vercel.app";
export const SERVICE_URL = DEV ? local_site : deployed_site
export const LOGIN_URL = DEV ? local_site + "login" : deployed_site + "login";
export const CHANGE_USER_URL = DEV ? local_site + "change_user" : deployed_site + "change_user";
export const LOGOUT_url = "https://accounts.spotify.com/logout";