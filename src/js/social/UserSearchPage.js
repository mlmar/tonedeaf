import React from 'react';

import { session } from '../util/Session.js';

import Options from '../helper/Options.js';
import Load from '../helper/Load.js';

import ArtistList from '../artist/components/ArtistList.js';
import TrackList from '../track/components/TrackList.js';

import TonedeafService from '../util/TonedeafService.js';
import PlaylistCreator from '../util/PlaylistCreator.js'

class UserSearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index : 0,
      artists : null,
      tracks : null,
      user : null,
      fetching : true
    }

    this.playlistCreator = new PlaylistCreator(session.getCache("user").id);

    this.tonedeafService = new TonedeafService();

    this.createPlaylist = this.createPlaylist.bind(this);
    this.renderControl = this.renderControl.bind(this);
  }

  // use PlaylistCreator to create playlist if tracks are visible
  createPlaylist() {
    this.playlistCreator.setTracks(this.state.tracks);
    this.playlistCreator.createPlaylist("tonedeaf popular tracks");
  }

  // https://stackoverflow.com/a/12646864
  shuffleArray(array) {
    var copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  componentDidMount() {
    this.tonedeafService.getAll((response) => {
      if(response.data) {
        console.log(response.data);
        var shuffledArtists = response.data.artists ? this.shuffleArray(response.data.artists) : null;
        var shuffledTracks = response.data.tracks ? this.shuffleArray(response.data.tracks) : null;
        this.setState({ artists : shuffledArtists , tracks : shuffledTracks, fetching : false })
      }
    })
  }

  /*  Render based on state index
   */
  renderControl() {
    switch(this.state.index) {
      case 0:
        return <ArtistList data={this.state.artists} loadText="Getting artists..."/>
      case 1:
        return <TrackList data={this.state.tracks} loadText="Getting tracks..."/>
      default:
        return <Load text="Why are you here?"/>
    }
  }

  render() {
    return (
      <>
        <div className="div-sidebar">
          <Options
            horizontal
            text="User Favorties"
            suboptions={["Artists","Tracks"]}
            subcallback={i => this.setState({ index : i})}
          >
            <label className="label-small"> View number one artists and tracks from other tonedeaf users. </label>
            <br/>
            <label className="label-small label-italic"> Only artist and track information is saved &mdash; all user data is excluded and remains solely with Spotify. </label>
          </Options>
          { this.state.index === 1 && this.state.tracks &&
            <Options
              text="Like these tracks?"
              suboptions={["Create Spotify Playlist"]}
              subcallback={this.createPlaylist}
            />
          }
          {this.props.children}
        </div>

        <div className="div-panels">
          {this.renderControl()}
        </div>
        
      </>
    )
  }
}

export default UserSearchPage;