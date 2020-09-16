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

}

export default TonedeafService;