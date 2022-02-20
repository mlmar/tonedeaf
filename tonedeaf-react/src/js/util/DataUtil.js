import { cache } from './Session.js';
import { getDemoNowPlaying, getDemoArtists, getDemoGenres, getDemoTracks, getDemoFeatures, getDemoAverages, getDemoRecent, getDemoSeeds } from '../service/DemoService.js';
import { getNowPlaying, getTopArtistsAndGenres, getTracksAndFeatures, getRecentTracks, getGenreSeeds } from './SpotifyUtil.js';
import { createLookup } from './StatsUtil.js';

/*
  - Caches all responses
  - If session is a demo, then redirect all requests to the demo server
*/

export const preFetch = async () => {
  await fetchArtistsAndGenres(0);
  await fetchArtistsAndGenres(1);
  await fetchArtistsAndGenres(2);

  await fetchTracksAndFeatures(0);
  await fetchTracksAndFeatures(1);
  await fetchTracksAndFeatures(2);
  createLookup();

  return true;
}

export const fetchNowPlaying = async () => {
  if(cache["demo"]) {
    const response = await getDemoNowPlaying();
    return response;
  } else {
    const response = await getNowPlaying();
    return response;
  }
}

export const fetchArtistsAndGenres = async (timeFrameIndex) => {
  const artistsCache = cache["artists"][timeFrameIndex];
  const genresCache = cache["genres"][timeFrameIndex];
  if(artistsCache) { // search cache first
    console.log("Retrieving from cache");
    return { artists: artistsCache, genres: genresCache };
  } else if(cache["demo"]) {
    const demoArtists = await getDemoArtists(); // returns artists for all 3 time ranges
    const demoGenres = await getDemoGenres();

    console.log("Cacheing demo artists and genres")
    cache["artists"] = demoArtists;
    cache["genres"] = demoGenres;

    return { 
      artists : cache["artists"][timeFrameIndex], 
      genres : cache["genres"][timeFrameIndex]
    }
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
  } else if(cache["demo"]) {
    const demoTracks = await getDemoTracks();
    const demoFeatures = await getDemoFeatures();
    const demoverages = await getDemoAverages();

    console.log("Cacheing demo tracks and features");
    cache["tracks"] = demoTracks;
    cache["features"] = demoFeatures;
    cache["averages"] = demoverages;

    return {
      tracks: cache["tracks"][timeFrameIndex],
      features: cache["features"][timeFrameIndex],
      averages: cache["averages"][timeFrameIndex]
    }
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
  if(cache["demo"]) {
    console.log("Fetching demo recent tracks");
    const demoRecent = await getDemoRecent();
    return demoRecent;
  } else {
    const tracks = await getRecentTracks();
    return tracks;
  }
}

export const fetchSeeds = async () => {
  const seedsCache = cache["genreSeeds"];
  if(seedsCache) {
    return seedsCache;
  } else if(cache["demo"]) {
    console.log("Cacheing demo seeds");
    const demoSeeds = await getDemoSeeds();
    cache["genreSeeds"] = demoSeeds;
    return demoSeeds;
  } else {
    const seeds = await getGenreSeeds();
    console.log("Cacheing seeds");
    cache["genreSeeds"] = seeds;
    return seeds;
  }
}