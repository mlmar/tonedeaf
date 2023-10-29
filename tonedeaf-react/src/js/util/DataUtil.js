import { cache } from './Session.js';
import { getDemo } from '../service/DemoService.js';
import { getNowPlaying, getTopArtistsAndGenres, getTracksAndFeatures, getRecentTracks, getGenreSeeds } from './SpotifyUtil.js';
import { createLookup } from './StatsUtil.js';

export const fetchDemo = async () => {
  const demoCache = await getDemo();
  for(let prop in demoCache) {
    cache[prop] = demoCache[prop];
  }
  return true;
}

/*
  - Caches all responses
  - If session is a demo, then redirect all requests to the demo server
*/

export const preFetch = async () => {
  await fetchNowPlaying();
  await fetchArtistsAndGenres(0);
  await fetchArtistsAndGenres(1);
  await fetchArtistsAndGenres(2);

  await fetchTracksAndFeatures(0);
  await fetchTracksAndFeatures(1);
  await fetchTracksAndFeatures(2);
  await fetchSeeds();
  await fetchRecent();
  createLookup();

  return true;
}

window.preFetch = preFetch;

export const fetchNowPlaying = async () => {
  if(cache["demo"]) {
    return cache["nowPlaying"];
  } else {
    const response = await getNowPlaying();
    cache["nowPlaying"] = response;
    return response;
  }
}

export const fetchArtistsAndGenres = async (timeFrameIndex) => {
  const artistsCache = cache["artists"][timeFrameIndex];
  const genresCache = cache["genres"][timeFrameIndex];
  if(artistsCache) { // search cache first
    console.log("Retrieving from cache");
    return { artists: artistsCache, genres: genresCache };
  } else { // signed in
    const { artists, genres } = await getTopArtistsAndGenres(timeFrameIndex);

    console.log("Cacheing artists")
    cache["artists"][timeFrameIndex] = artists;
    cache["genres"][timeFrameIndex] = genres;

    return { artists, genres };
  }
}

export const fetchTracksAndFeatures = async (timeFrameIndex) => {
  const tracksCache = cache["tracks"][timeFrameIndex];
  const featuresCache = cache["features"][timeFrameIndex];
  const averagesCache = cache["averages"][timeFrameIndex];
  if(tracksCache) { // search cache first
    console.log("Retrieving from cache");
    return { tracks : tracksCache, features: featuresCache, averages: averagesCache };
  } else { // signed in
    const { tracks, features, averages } = await getTracksAndFeatures(timeFrameIndex);
    
    console.log("Cacheing tracks and features");
    cache["tracks"][timeFrameIndex] = tracks;
    cache["features"][timeFrameIndex] = features;
    cache["averages"][timeFrameIndex] = averages;

    return { tracks, features, averages };
  }
}

export const fetchRecent = async () => {
  const recentCache = cache["recent"];
  if(recentCache) {
    console.log("Fetching demo recent tracks");
    return recentCache;
  } else {
    cache["recent"] = null;
    const tracks = await getRecentTracks();

    console.log("Cacheing recent");
    cache["recent"] = tracks;

    return tracks;
  }
}

export const fetchSeeds = async () => {
  const seedsCache = cache["genreSeeds"];
  if(seedsCache) {
    return seedsCache;
  } else {
    const seeds = await getGenreSeeds();
    console.log("Cacheing seeds");
    cache["genreSeeds"] = seeds;
    return seeds;
  }
}