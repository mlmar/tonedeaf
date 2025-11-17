/*  From Spotify's index.html in their authentication examples
  *    - used to get access token to send api requests
  */
export const getHashParams = () => {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);

  /* eslint-disable no-cond-assign */
  while ( e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}