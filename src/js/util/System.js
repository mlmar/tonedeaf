/********* FOR DEVELOPMENT ONLY *********/
const local = true; // set to false before deployment
const local_site = "http://localhost:8888/";
const deployed_site = "https://tonedeaf-auth.vercel.app/";

export const HOME = local ? "http://localhost:3000" : "https://tonedeaf.vercel.app";
export const LOGIN = local ? local_site + "login" : deployed_site + "login";
export const LOGOUT = "https://accounts.spotify.com/logout";