import React from 'react';
import Artist from './Artist.js'
import Load from '../../helper/Load.js';


/*  TOP ARTISTS COMPONENT
 *    {this.props.data} : array of artist json objects from Spotify
 */
class ArtistList extends React.Component {

  /*  Iterate through artists array
   *  Pass each artist's attributes to an Artist component
   */
  render() {
    var compact = this.props.compact ? "compact" : null;

    if(this.props.data) {
      return (
        <div className={"div-top-artists " + compact} ref={this.props.divRef}>
          {
            this.props.data.map((artist, i) => {
              return (
                <Artist
                  compact={this.props.compact}
                  image={artist.images && artist.images.length && artist.images[0].url}
                  name={artist.name}
                  url={artist.external_urls.spotify}
                  genre={artist.genres.join(", ")}
                  popularity={artist.popularity}
                  followers={artist.followers.total}
                  rank={this.props.ranked && i+1}
                  key={i+artist.name + artist.popularity}
                />
              )
            })
          }
        </div>
      )
    }

    return <Load text={this.props.loadText}/>
  }
}

export default ArtistList;