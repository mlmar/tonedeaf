import React from 'react';
import Artist from './Artist.js'


/*  TOP ARTISTS COMPONENT
 *    {this.props.data} : array of artist json objects from Spotify
 */
class ArtistList extends React.Component {
  /*  Iterate through artists array
   *  Pass each artist's attributes to an Artist component
   */
  render() {

    if(this.props.data) {
      return (
        <div className="div-top-artists">
          {
            this.props.data.map((artist, i) => {
              return (
                <Artist
                  image={artist.images[0].url}
                  name={artist.name}
                  url={artist.external_urls.spotify}
                  genre={artist.genres.join(", ")}
                  popularity={artist.popularity}
                  followers={artist.followers.total}
                  rank={i+1}
                  key={i+artist.name + artist.popularity}
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

export default ArtistList;