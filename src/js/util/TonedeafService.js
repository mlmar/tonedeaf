import HTTPService from './HTTPService.js';
import { session } from './Session.js';

class TonedeafService extends HTTPService {
  
  addArtist(data) {
    var body = {  token : session.token, data : data }
    this.post('addArtist', console.log, body);
  }

  getAllArtists(callback) {
    var body = { token : session.token }
    this.post('getAllArtists', callback, body);
  }

  addTrack(data) {
    var body = { token : session.token, data : data }
    this.post('addTrack', console.log, body);
  }

  getAllTracks(callback) {
    var body = { token : session.token }
    this.post('getAllTracks', callback, body);
  }

  refresh(callback) {
    var url = "https://tonedeaf-auth.vercel.app/refresh_token";
    var query = { refresh_token : session.getCache("token")["refreshToken"] };
    this.getWithQuery(url, callback, query);
  }

}

export default TonedeafService;