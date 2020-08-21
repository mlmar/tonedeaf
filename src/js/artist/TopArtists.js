import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import Artist from './Artist.js'


/*  TOP ARTISTS COMPONENT
 *    - Required props: cache
 *        cache : needed to cache top artists to reduce api calls
 *
 *    - implements Artist component to display individual artists
 *    - uses SpotifyWebApi to retrieve top artist based on user's id
 */
class TopArtists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artists : [], // store current list of artists here
      fetching : true
    };

    this.range = ["long_term", "medium_term", "short_term"];

    this.spotifyWebApi = new SpotifyWebApi();
    this.getTopArtists = this.getTopArtists.bind(this);
  }

  /*  Retrieves top artists based on selectedIndex of range
   *    if no cache is found, use api to retrieve artists then cache,
   *    otherwise setState from cache
   */
  getTopArtists(index) {
    if(this.props.cache[index].length === 0) {
      var params = { // options to pass to api caller
        time_range : this.range[index],
        limit : 50
      }

      this.spotifyWebApi.getMyTopArtists(params)
        .then((response) => {
          this.setState({ artists : response.items, fetching : false });
          this.props.callback(index, response.items); // cache artist lsits
          
          console.log("Succesfully retrieved top artists @ " + index);
          console.log("CACHING @ " + index);
          console.log(response.items);
          console.log("Each artist list should only retrieved remotely once per session");
        })
        .catch((error) => {
          console.error("Could not retrieve top artists @")
          console.error(error)
        });

    } else {
      this.setState({ artists : this.props.cache[index], fetching : false })
      console.log("Successfully retrieved top artists FROM CACHE @ " + index);
      console.log(this.props.cache);
    }
  }

  /*  get top artists for long term upon mounting
   */
  componentDidMount() {
    this.getTopArtists(0);
  }
  
  /*  Iterate through artists array
   *  Pass each artist's attributes to an Artist component
   */
  render() {
    console.log("fetching @ " + this.state.fetching);
    console.log("length @ " + this.state.artists.length);

    if(!this.state.fetching) {
      return (
        <div>
          {
            this.state.artists.map((artist, i) => {
              return (
                <Artist
                  image={artist.images[0].url}
                  name={artist.name}
                  url={artist.external_urls.spotify}
                  genre={artist.genres.join(", ")}
                  popularity={artist.popularity}
                  followers={artist.followers.total}
                  rank={i+1}
                  key={i}
                />
              )
            })
          }
        </div>
      )
    }

    return <div className="animate-load"> </div>;
  }
}

export default TopArtists;