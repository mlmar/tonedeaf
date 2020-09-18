import React from 'react';

import { session } from '../util/Session.js';
import PlaylistCreator from '../util/PlaylistCreator.js';

import Options from './Options.js'

/*  Wrapper for options components to display a create playlist option
 *    {this.props.text} : playlist name
 *    {this.props.tracks} : playlist tracks
 */
class Create extends React.Component {
  constructor(props) {
    super(props);
    this.playlistCreator = new PlaylistCreator(session.getCache("user").id);
    this.createPlaylist = this.createPlaylist.bind(this);
  }

  // use PlaylistCreator to create playlist from current selected tracklist
  createPlaylist() {
    if(this.props.tracks) {
      this.playlistCreator.setTracks(this.props.tracks);
      this.playlistCreator.createPlaylist(this.props.text);
    }
  }

  render() {
    return (
      <Options
        text="Like these tracks?"
        suboptions={["Create Spotify Playlist"]}
        subcallback={this.createPlaylist}
      />
    )
  }
}

export default Create;