import { get } from "./HTTPService.js";

const DEMO = './demo/';

export const getDemoNowPlaying = async () => {
  try {
    const response = await get(DEMO + 'nowplaying');
    return response;
  } catch(error) {
    console.warn("Error getting nowplaying demo");
    console.error(error);
    return null;
  }
}

export const getDemoArtists = async () => {
  try {
    const response = await get(DEMO + 'artists');
    return response;
  } catch(error) {
    console.warn("Error getting artists demo");
    console.error(error);
    return null;
  }
}

export const getDemoGenres = async () => {
  try {
    const response = await get(DEMO + 'genres');
    return response;
  } catch(error) {
    console.warn("Error getting genres demo");
    console.error(error); 
    return null;
  }
}

export const getDemoTracks = async () => {
  try {
    const response = await get(DEMO + 'tracks');
    return response;
  } catch(error) {
    console.warn("Error getting tracks demo");
    console.error(error);
    return null;
  }
}

export const getDemoFeatures = async () => {
  try {
    const response = await get(DEMO + 'features');
    return response;
  } catch(error) {
    console.warn("Error getting features demo");
    console.error(error);
    return null;
  }
}

export const getDemoAverages = async () => {
  try {
    const response = await get(DEMO + 'averages');
    return response;
  } catch(error) {
    console.warn("Error getting averages demo");
    console.error(error);
    return null;
  }
}

export const getDemoRecent = async () => {
  try {
    const response = await get(DEMO + 'recent');
    return response;
  } catch(error) {
    console.warn("Error getting recent demo");
    console.error(error);
    return null;
  }
}

export const getDemoSeeds = async () => {
  try {
    const response = await get(DEMO + 'seeds');
    return response;
  } catch(error) {
    console.warn("Error getting seeds demo");
    console.error(error);
    return null;
  }
}