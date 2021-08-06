

/*
  - Handles all errors that occur when interacting with 'spotify-web-api-js' library
  - Trims all server responses to fit the apps needs
  - Helper functions for trimming responses such as getDate, getIDS, etc.
*/

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyWebApi = new SpotifyWebApi();

const DEV = process.env.REACT_APP_DEV;

const RANGES = ["long_term", "medium_term", "short_term"];

export const setAccessToken = (token) => {
  spotifyWebApi.setAccessToken(token);
}

export const getProfile = async () => {
  try {
    const response = await spotifyWebApi.getMe();
    return response;
  } catch(error) {
    console.error(error);
    return null;
  }
}

/*
  Retrieves last played track if user is not currently playing a song
*/
export const getNowPlaying = async () => {
  const track = {
    title: null,
    artists: null,
    image: null,
    duration: null,
    progress: null,
    url: null,
    playing: null,
    artistID: null,
    trackID: null
  }

  try {
    const response = await spotifyWebApi.getMyCurrentPlaybackState();
    
    if(response?.item) {
      track["title"] = response.item?.name;
      track["artists"] = response.item?.artists.map((artist) => artist.name);
      track["image"] = response.item?.album?.images?.[0]?.url;
      track["duration"] = response.item?.duration_ms / 1000; // convert to seconds
      track["progress"] = response.progress_ms / 1000; // convert to seconds;
      track["url"] = response.item?.uri;
      track["playing"] = response.is_playing;
      track["artistID"] = response.item?.artists?.[0]?.id;
      track["trackID"] = response.item?.id

      if(DEV) console.log(track);

      return track;
      
    } else {
      const recentTrack = (await getRecentTracks())?.[0]?.track // get the most recently played track
      track["title"] = recentTrack?.name;
      track["artists"] = recentTrack?.artists.map((artist) => artist.name);
      track["image"] = recentTrack?.album?.images?.[0]?.url;
      track["url"] = recentTrack?.album?.uri;
      
      if(DEV) console.log(track);

      return track;
    }  
  } catch(error) {
    console.error(error);
    return track;
  }
}

export const getTopArtists = async (rangeIndex) => {
  try {
    const params = {time_range : RANGES[rangeIndex], limit : 50};
    const artists = await spotifyWebApi.getMyTopArtists(params);

    if(DEV) console.log(artists?.items);

    return artists?.items;
  } catch(error) {
    console.error(error);
    return null;
  }
}

export const getTopTracks = async (rangeIndex) => {
  try {
    const params = {time_range : RANGES[rangeIndex], limit : 50};
    const tracks = await spotifyWebApi.getMyTopTracks(params);

    if(DEV) console.log(tracks?.items);
  
    return tracks?.items;
  } catch(error) {
    console.error(error);
    return null;
  }
}

export const getRecentTracks = async () => {
  try {
    const params = { limit : 50 };
    const tracks = await spotifyWebApi.getMyRecentlyPlayedTracks(params);

    if(DEV) console.log(tracks?.items);
  
    return tracks?.items;
  } catch(error) {
    console.error(error);
    return null;
  }
}

const getIDS = (tracks) => {
  const ids = tracks.map((track) => track.id).join(",");
  return ids;
}

const getAverages = (tracks, features) => {
  let length = features.length;

  let averages = {
    acousticness      : { name : "Acousticness", total: 0 },
    danceability      : { name : "Danceability", total: 0},
    duration          : { name : "Duration (S)", total : 0},
    energy            : { name : "Energy", total : 0},
    instrumentalness  : { name : "Instrumentalness", total : 0},
    liveness          : { name : "Liveness", total : 0},
    loudness          : { name : "Loudness", total : 0},
    mode              : { name : "Mode", total : 0},
    speechiness       : { name : "Speechiness", total : 0},
    tempo             : { name : "Tempo", total : 0},
    time_signature    : { name : "Time Signature", total : 0},
    valence           : { name : "Valence", total : 0},
    popularity        : { name : "Popularity", total : 0} // only stat that isn't retrieved by audio features call
  }
  
  for(var i = 0; i < length; i++) {
    averages.acousticness.total      += features[i]?.acousticness;
    averages.danceability.total      += features[i]?.danceability
    averages.duration.total          += features[i]?.duration_ms / 1000;
    averages.energy.total            += features[i]?.energy;
    averages.instrumentalness.total  += features[i]?.instrumentalness;
    averages.liveness.total          += features[i]?.liveness;
    averages.loudness.total          += features[i]?.loudness;
    averages.mode.total              += features[i]?.mode;
    averages.speechiness.total       += features[i]?.speechiness;
    averages.tempo.total             += features[i]?.tempo;
    averages.time_signature.total    += features[i]?.time_signature;
    averages.valence.total           += features[i]?.valence;
    averages.popularity.total        += tracks[i]?.popularity;
  }

  for(const attribute in averages) {
    averages[attribute].total = Math.round(averages[attribute].total / length * 100) / 100;
  }

  if(DEV) console.log(averages);

  return averages;
}

export const getFeatures = async (tracks) => {
  try {
    const features = await spotifyWebApi.getAudioFeaturesForTracks(getIDS(tracks));
    
    if(DEV) console.log(features?.audio_features)

    return features?.audio_features;
  } catch(error) {
    console.error(error);
    return null;
  }
}

export const getTracksAndFeatures = async (rangeIndex) => {
  try {
    const tracks = await getTopTracks(rangeIndex);
    const features = await getFeatures(tracks);
    const averages = getAverages(tracks, features);
    return { tracks, features, averages }
  } catch(error) {
    console.error(error);
    return null;
  }
}

const countGenres = (artists) => {
  const counts = { all : 0 };
  artists?.forEach((artist) => {
    artist?.genres?.forEach((genre) => {
      counts[genre] = (counts[genre] || 0) + 1;
      counts["all"]++;
    })
  });

  let finalCounts = [];
  for(const genre in counts) {
    finalCounts.push({ genre, total : counts[genre] });
  };

  finalCounts = finalCounts.sort((a,b) => b.total - a.total)

  if(DEV) console.log(finalCounts);

  return finalCounts;
}

export const getTopArtistsAndGenres = async (rangeIndex) => {
  try {
    const artists = await getTopArtists(rangeIndex);
    const genres = countGenres(artists);
    return { artists, genres };
  } catch(error) {
    console.error(error);
    return null;
  }
}

export const getUris = (tracks, recent) => {
  let uris = tracks.map((track) => {
    if(recent) {
      return track?.track?.uri;
    } else {
      return track?.uri;
    }
  });
  return uris;
}

const getDate = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;
  return today;
}

export const createPlaylist = async (id, text, tracks, recent) => {
  let params = {
    name : text,
    public : true,
    collaborative : false,
    description : "tonedeaf.vercel.app @ " + getDate()
  }

  if(!id) return { status : "demo" };

  try {
    const playlist = await spotifyWebApi.createPlaylist(id, params);
    let uris = getUris(tracks, recent);
  
    console.log("Creating playlist for", text)
    const response = await spotifyWebApi.addTracksToPlaylist(playlist.id, uris);
    
    if(DEV) console.log(response);

    return response;
  } catch(error) {
    console.error(error);
    return null;
  }
}

const attributesArray = [
  ["Acousticness",      "acousticness",     0, 1, .1,   0, 1],
  ["Danceabilitiy",     "danceabilitiy",    0, 1, .1,   0, 1],
  ["Energy",            "energy",           0, 1, .1,   0, 1],
  ["Instrumentalness",  "instrumentalness", 0, 1, .1,   0, .5],
  ["Key",               "key",              0, 10, 1,   0, 10],
  ["Liveness",          "liveness",         0, 1, .1,   0, .5],
  ["Loudness",          "loudness",       -80, 80, 1, -60, 30],
  ["Minor/Major",       "mode",             0, 1, 1,    1,  1],
  ["Popularity",        "popularity",       0, 100, 1,  0,  100],
  ["Speechiness",       "speechiness",      0, 1, .1,   0,  .3],
  ["Tempo",             "tempo",            0, 200, 1,  0,  150],
  ["Time signature",    "time_signature",   0, 10, 1,   0,  8],
  ["Valence",           "valence",          0, 1, .1,   0,  1]
];

export const getDefaultAttributes = () => {
  // [ attribute, id, min, max, step, defaultMin, defaultMax ]

  const attributes = [];
  attributesArray.forEach((attribute) => {
    const attributesObj = {
      name: attribute[0],
      id: attribute[1],
      min: attribute[2],
      max: attribute[3],
      step: attribute[4],
      defaultMin: attribute[5],
      defaultMax: attribute[6],
    };

    attributes.push(attributesObj);
  });

  return attributes;
}

export const getParamAttributes = () => {
  const params = {};
  getDefaultAttributes().forEach((attribute) => {
    params["min_" + attribute.id] = attribute.defaultMin;
    params["max_" + attribute.id] = attribute.defaultMax;
  });
  return params;
}

export const getGenreSeeds = async () => {
  try {
    let genres = await spotifyWebApi.getAvailableGenreSeeds();

    if(DEV) console.log(genres?.genres);

    return genres?.genres;
  } catch(error) {
    console.error(error);
    return null;
  }
}

export const getAttributeRecs = async (genres, attributes) => {
  try {
    const params = { limit: 50, seed_genres : genres.join(), ...attributes }
    const response = await spotifyWebApi.getRecommendations(params);

    if(DEV) console.log(response?.tracks);

    return response?.tracks;
  } catch(error) {
    console.error(error);
    return null;
  }
}

const SEARCH_TYPES = [["artist"],["track"]];

export const search = async (value, searchIndex) => {
  const query = value.replace(" ", "+");
  const types = SEARCH_TYPES[searchIndex];
  const params = { limit : 50 };

  try {
    const response = await spotifyWebApi.search(query, types, params);
    const items = (searchIndex === 0) ? response?.artists?.items : response?.tracks?.items;

    if(DEV) console.log(items);

    return items;
  } catch(error) {
    console.error(error);
    return null;
  }
}

export const getSearchRecs = async (artistIDS, trackIDS) => {
  try {
    const params = { seed_artists : artistIDS, seed_tracks : trackIDS, limit : 50 };
    const response = await spotifyWebApi.getRecommendations(params);

    if(DEV) console.log(response?.tracks);

    return response?.tracks;
  } catch(error) {
    console.error(error);
    return null;
  }
}