/* Class wrapper for user rest api */
const SYSTEM = require('./System.js');
const SERVICE_URL = SYSTEM.SERVICE_URL;

class HTTPService {
  get(serviceMethod, callbackFunc) {
    fetch(SERVICE_URL + "/" + serviceMethod, {
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

  post(serviceMethod, callbackFunc, param) {
    fetch(SERVICE_URL + "/" + serviceMethod, {
      method: 'post',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify(param)
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

export default HTTPService;