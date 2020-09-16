import TonedeafService from  './TonedeafService';

const INITIAL_CACHE = {
  // user
  user : { display_name : null, id : null },

  // top artists
  artists : { long_term : null, medium_term : null, short_term : null },
  genreCounts : { long_term : null, medium_term : null, short_term : null },

  // top tracks
  tracks : { long_term : null, medium_term : null, short_term : null },
  features : { long_term : null, medium_term : null, short_term : null },
  averageFeatures : { long_term : null, medium_term : null, short_term : null },

  // scope
  genres : { genres : null }
}

/*  Session singleton
 *    import { session } from Session.js
 *    - new entries can be created
 *
 *    - pseudo cache : local copies of lists that cannot change within one session
 *    - cache whereever possible to reduce api calls
 */
class Session {

  constructor() {

    // predetermined some caches because i already know what data is coming in
    //  this step wasn't necessary but i'm just using this for reference
    this._cache = INITIAL_CACHE;
    this._token = null;
    this.tonedeafService = new TonedeafService();
  }

  // set a cache based on it name and key
  //  create a new cache if necessary
  setCache = (cache, key, value) => {
    if(!this._cache[cache]) 
      this._cache[cache] = {};

    this._cache[cache][key] = value
    console.log("SESSION: setting " + cache + "[" + key + "]");

    if(cache === "artists" || cache === "tracks")
      this.tonedeafService.save(this.setupData());
  };

  // get a cache
  //  {cache} : cache name
  //  return empty object if null
  getCache = (cache) => {
    if(cache) {
      var c = this._cache[cache] ? this._cache[cache] : {};
      console.log("SESSION: getting " + cache);
      return c;
    } else {
      return this._cache;      
    }
  }


  /*  Returns the obj passed to the db
   */
  setupData() {
    var c = this._cache;

    const terms = [
      "tracks_long_term", "tracks_medium_term", "tracks_short_term",
      "artists_long_term", "artists_medium_term", "artists_short_term"
    ];
    
    const current = [
      c.tracks.long_term, c.tracks.medium_term, c.tracks.short_term,
      c.artists.long_term, c.artists.medium_term, c.artists.short_term
    ];

    var data = {
      id : c.user.id,
      display_name : c.user.display_name
    }

    for(var i = 0; i < terms.length; i++) {
      var t = terms[i];
      if(!data[t] && current[i]) data[t] = [...current[i]];
    }

    return data;
  }

  set token(token) {
    this._token = token;
  }
  
  get token() {
    return this._token;
  }

} 

export var session = new Session();