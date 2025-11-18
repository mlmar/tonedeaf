type HashParams = {
  [prop: string]: string
}

/*  From Spotify's index.html in their authentication examples
  *    - used to get access token to send api requests
  */
export const getHashParams = (): HashParams => {
  const hashParams: HashParams = {};
  const r = /([^&;=]+)=?([^&;]*)/g;
  const q = window.location.hash.substring(1);
  let e = null;

  /* eslint-disable no-cond-assign */
  while (e = r.exec(q)) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}