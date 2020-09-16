import React from 'react';

import { session } from '../util/Session.js';

import Options from '../helper/Options.js';
import List from '../helper/List.js';
import ArtistList from './components/ArtistList.js';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyWebApi = new SpotifyWebApi();


class ArtistsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRange : "long_term",
      artists : { long_term : null, medium_term : null, short_term : null },
      genreCounts : { long_term : null, medium_term : null, short_term : null }
    }

    this.ranges = ["long_term", "medium_term", "short_term"];

    this.setSelectedRange = this.setSelectedRange.bind(this);
    this.getTopArtists = this.getTopArtists.bind(this);
    this.countGenres = this.countGenres.bind(this);
  }

  
  /*  Set the selected time range for top artists list
   *    {index} : retrieves range through this.ranges[index]
   */
  setSelectedRange(index) {
    var range = this.ranges[index];
    if(!this.state.artists[range]) { // if the artists have already been loaded, don't call API
      this.getTopArtists(range, this.countGenres);
    } else {
      console.log("SUCCESS: Retrieved artists from previous state");
    }

    this.setState({ selectedRange : range });
  }

  /*  Retrieves top artists based on selectedIndex of range
   *    save top artists to cache
   *    ideally should only be called once per session
   */
  getTopArtists(range, callback) {
    var params = { time_range : range, limit : 50 }
    var artists = JSON.parse(JSON.stringify(this.state.artists)); // make a deep copy of the state

    spotifyWebApi.getMyTopArtists(params)
      .then((response) => {
        artists[range] = response.items;
        this.setState({ artists : artists });
        if(session) session.setCache("artists", range, response.items);

        if(callback) callback(range, response.items);
        console.log("API SUCCESS: retrieved top artists")
        console.log(response.items);
      })
      .catch((error) => {
        console.error("API ERROR: could not retrieve top artists");
        console.error(error);
      });
  }

  /*  Counts total number of each genre on a list of artists
   *    {artists} : list of artists
   */
  countGenres(range, artists) {
    var counts = {};

    var tempGenres = []
    for(var i = 0; i < artists.length; i++) {
      tempGenres = tempGenres.concat(artists[i].genres);
    }
    
    tempGenres.forEach(function(x) { 
      counts[x] = (counts[x] || 0) + 1; 
    });

    
    var genreCounts = JSON.parse(JSON.stringify(this.state.genreCounts)); // make a deep copy of the state
    genreCounts[range] = counts;

    this.setState({ genreCounts : genreCounts });
    if(session) session.setCache("genreCounts", range, counts);

    console.log("calculated genre counts");
    console.log(counts);
  }

  componentDidMount() {
    var artistsCache = null, genreCountsCache = null;
    if(session) {
      artistsCache = session.getCache("artists");
      genreCountsCache = session.getCache("genreCounts");
      this.setState({ artists : artistsCache, genreCounts : genreCountsCache });
    }

    // check if long_term key already exists in the cache since it should be the first thing the user sees
    if(!session || !(artistsCache["long_term"] && genreCountsCache["long_term"])) {
      this.getTopArtists("long_term", this.countGenres);
    } else {
      console.log("CACHE: Retrieved artists from previous state");
    }
  }

  render() {
    return (
      <>
        <div className="div-sidebar"> 
          <Options
            horizontal
            text="Your Top Artists"
            options={["Long Term", "6 Months", "4 Weeks"]}
            callback={this.setSelectedRange}
          />

          <List 
            text="Genre Counts" 
            items={this.state.genreCounts[this.state.selectedRange]}
          />

          {this.props.children}
        </div>

        <div className="div-panels"> 
          <ArtistList data={this.state.artists[this.state.selectedRange]}/>
        </div>
      </>

    )
  }
}

export default ArtistsPage;