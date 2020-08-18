import SpotifyWebApi from 'spotify-web-api-js';

/*
  Custom class to create a playlist and import songs into a user's account
    params: user spotify id
            setTracks() for track uris
*/
class PlaylistCreator {
  constructor(userid) {
    this.userid = userid;
    this.spotifyWebApi = new SpotifyWebApi();
    this.tracks = [];
    this.recent = false;
  }

  setTracks(tracks, recent = false) {
    this.tracks = tracks;
    this.recent = recent;
  }

  getDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    return today;
  }

  /**************************** playlists ****************************/

  // create a playlist
  createPlaylist(text) {
    var params = {
      name : text,
      public : true,
      collaborative : false,
      description : "tonedeaf.vercel.app @ " + this.getDate()
    }

    this.spotifyWebApi.createPlaylist(this.userid, params)
      .then((response) => {

        this.addTopTracksToPlaylist(response);
        
        if(window.confirm("do you want to open this playlist in spotify?")) {
          window.oepn(response.url);
        }

        console.log("Succesfully created playlist @ ")
        console.log(response);
      })
      .catch((error) => {
        console.error("Could not create playlist @")
        console.error(error)
      });
  }

  // add top tracks to a playlist
  addTopTracksToPlaylist(playlist) {
    var pid = playlist.id;
    var params = this.getUris();

    this.spotifyWebApi.addTracksToPlaylist(pid, params)
      .then((response) => {
        console.log("Succesfully added top tracks to playlist @ ")
        console.log(response);
      })
      .catch((error) => {
        console.error("Could not add top tracks to playlist @")
        console.error(error)
      });
  }

  // get the uris of top tracks
  getUris() {
    var uris = [];
    for(var i = 0; i < this.tracks.length; i++) {
      if(!this.recent) {
        uris.push(this.tracks[i].uri);
      } else {
        uris.push(this.tracks[i].track.uri);
      }
    }
    console.log(uris);
    return uris;
  }

}

export default PlaylistCreator;