/********* FOR DEVELOPMENT ONLY *********/
const local = false; // set to false before deployment
const local_site = "http://localhost:8888/";
const deployed_site = "https://tonedeaf-auth.vercel.app/";

export const HOME = local ? "http://localhost:3000" : "https://tonedeaf.vercel.app";
export const LOGIN = local ? local_site + "login" : deployed_site + "login";
export const LOGOUT = "https://accounts.spotify.com/logout";


const local_server = false;
const local_service = "http://localhost:3300/tonedeaf";
const deployed_service = "https://todoto-auth.vercel.app/tonedeaf";
export const SERVICE_URL = local_server ? local_service : deployed_service;