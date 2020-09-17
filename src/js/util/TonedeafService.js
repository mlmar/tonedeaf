import HTTPService from './HTTPService.js';
import { session } from './Session.js';

class TonedeafService extends HTTPService {
  save(data) { 
    var body = {
      token : session.token,
      data : data
    }
    this.post('save', console.log, body);
  }

  load(callback, id) {
    var body = {
      token : session.token,
      id : id
    }
    this.post('load', callback, body)
  }

  search(callback, query) {
    var body = {
      token : session.token,
      query : query
    }
    this.post('search', callback, body);
  }

  refresh(callbackFunc) {
    fetch("https://tonedeaf-auth.vercel.app/refresh_token?" +
      new URLSearchParams({ refresh_token : session.getCache("token")["refreshToken"] }), {
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
      if (response.ok) {
        return response.json()
      }
    })
    .then(data => {
      if(callbackFunc) callbackFunc(data);
    })
    .catch(error => {
      if(callbackFunc) callbackFunc(error);
    }); 
  }

}

export default TonedeafService;