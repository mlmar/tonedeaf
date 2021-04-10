import React from 'react';

import { session } from '../util/Session.js';

import Options from '../helper/Options.js';
import ButtonBar from '../helper/ButtonBar.js';
import List from '../helper/List.js';
import ArtistList from './components/ArtistList.js';

import saveImage from '../util/ImageSaver.js'
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyWebApi = new SpotifyWebApi();


class ArtistsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRange : "long_term",
      artists : { long_term : null, medium_term : null, short_term : null },
      genreCounts : { long_term : null, medium_term : null, short_term : null },
      compact : true,
      selected : null
    }

    this.ranges = ["long_term", "medium_term", "short_term"];

    this.setSelectedRange = this.setSelectedRange.bind(this);
    this.setView = this.setView.bind(this);
    this.getTopArtists = this.getTopArtists.bind(this);
    this.countGenres = this.countGenres.bind(this);
    this.filterByGenre = this.filterByGenre.bind(this);
    
    this.save = this.save.bind(this);
    this.listRef = React.createRef();
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

    this.setState({ selectedRange : range, selected : this.state.artists[range] });
  }

  setView(index) {
    this.setState({ compact : index === 0});
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
        this.setState({ artists : artists, selected : artists[this.state.selectedRange] });
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

    var tempGenres = [] // get al lgenres
    for(var i = 0; i < artists.length; i++) {
      tempGenres = tempGenres.concat(artists[i].genres);
    }
    
    // get genre count
    tempGenres.forEach(function(x) { 
      counts[x] = (counts[x] || 0) + 1; 
    });

    // convert json object to individual json objects for each genre count
    var countsArray = [];
    var names = Object.keys(counts);
    var values = Object.values(counts);

    // make first entry the sum of different genres
    var sum = values.reduce((a,b) => a + b);
    countsArray.push({ name : "all", value : sum })

    for(var j = 0; j < names.length; j++) {
      var body = { name : names[j], value : values[j] }
      countsArray.push(body)
    }
    
    // sort from greatest to least
    countsArray.sort((a,b) => b.value - a.value);
    
    // cache and set state
    var genreCounts = JSON.parse(JSON.stringify(this.state.genreCounts)); // make a deep copy of the state
    genreCounts[range] = countsArray;

    this.setState({ genreCounts : genreCounts });
    if(session) session.setCache("genreCounts", range, countsArray);
    console.log(countsArray);
  }

  /*  Call back from clickable list component
   *    {genre} : genre name
   */
  filterByGenre(genre) {
    if(genre === "all") {
      this.setState({ selected : this.state.artists[this.state.selectedRange] })
    } else {
      var filtered = [...this.state.artists[this.state.selectedRange]].filter((i) => i.genres.includes(genre));
      this.setState({ selected : filtered });
      console.log(filtered);
    }
  }

  save() {
    saveImage(this.listRef, "tonedeaf-artists");
  }

  componentDidMount() {
    var artistsCache = null, genreCountsCache = null;
    if(session) {
      artistsCache = session.getCache("artists");
      genreCountsCache = session.getCache("genreCounts");
      this.setState({ artists : artistsCache, genreCounts : genreCountsCache, selected : artistsCache[this.state.selectedRange] });
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
            compact
            onClick={this.filterByGenre}
            text="Genre Counts" 
            items={this.state.genreCounts[this.state.selectedRange]}
          >
            <label className="label-small"> Select to filter artists by genre. </label> 
          </List>

          {this.props.children}
        </div>

        <div className="div-panels"> 
          <ButtonBar
            highlight
            buttons={["compact", "list"]}
            callback={this.setView}
            rightButtons={this.listRef && this.state.compact ? ["Save As Image"] : null}
            rightCallback={this.save}
          />
          <ArtistList 
            compact={this.state.compact} 
            ranked 
            data={this.state.selected} 
            loadText="Getting your top artists from Spotify..." 
            divRef={this.listRef}
          />
        </div>
      </>

    )
  }
}

export default ArtistsPage;