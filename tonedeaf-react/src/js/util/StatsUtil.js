import { cache } from "./Session";

export const createLookup = () => {
  const { artists, tracks } = cache;
  if(cache.lookup) return cache.lookup;

  cache.lookup = {};
  for(const index in artists) {
    const _artists = artists[index];
    for(let i = 0; i < _artists.length; i++) {
      const artist = _artists[i];
      const { id } = artist;

      cache.lookup[id] = cache.lookup[id] || {
        ranks: { 0: null, 1: null, 2: null },
        appearances: { 0: 0, 1: 0, 2: 0 },
      };

      cache.lookup[id].ranks[index] = i + 1;
    }
  }

  for(const index in tracks) {
    const _tracks = tracks[index];
    for(let i = 0; i < _tracks.length; i++) {
      const track = _tracks[i];
      const trackArtists = track?.artists;

      trackArtists.forEach(({ id }) => {
        if(cache.lookup[id]) cache.lookup[id].appearances[index]++;
      });

    }
  }

  return cache.lookup;
}

export const lookup = (id) => {
  if(!id) return;
  return cache.lookup[id]
}