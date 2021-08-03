import { SERVICE_URL } from '../util/System.js';

/*  HTTPService class
 *
 */
export const post = async (endpoint, data) =>{
  try {
    const response = await fetch(SERVICE_URL + endpoint, {
      method: 'post',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify(data)
    });
    
    return await response.json();

  } catch(error) {
    console.error(error);
    return null;
  }
}

export const get = async (endpoint) => {
  try {
    const response = await fetch(SERVICE_URL + endpoint, {
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    });

    return await response.json();

  } catch(error) {
    console.error(error)
    return null;
  }
}