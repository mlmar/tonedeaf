import React from 'react';
import Track from './Track.js';

/*  TRACK LIST COMPONENT
 *    implements Track component to display individual artists
 *    {this.props.data} : tracklist
 *    {this.props.features} : track features -- optional
 *    {this.props.recent} : indicate if tracks are recent tracks since they are read differently
 */
class TrackList extends React.Component {
  constructor(props) {
    super(props);
    this.artistsToString = this.artistsToString.bind(this);
  }
  
  // convert artist array into comma string
  artistsToString(artists) {
    var result = "";
    for(var i = 0; i < artists.length; i++) {
      result += (i < artists.length - 1) ? artists[i].name + ", " : artists[i].name;
    }
    return result;
  }
  
  render() {
    
    if(this.props.data) {
      return (
        <div className="div-top-tracks">
          {
            this.props.data.map((t, i) => {
              var track = this.props.recent ? t.track : t; // recent tracks are stored in another json object
              return (
                <Track
                  image={track.album.images[0].url}
                  title={track.name}
                  artist={this.artistsToString(track.artists)}
                  url={track.external_urls.spotify}
                  year={track.album.release_date.split("-")[0]}
                  type={track.album.type}
                  album={track.album.name}
                  rank={i+1}
                  popularity={track.popularity}
                  features={this.props.features ? this.props.features[i] : null}
                  key={i + track.name + track.album.release_date.split("-")[0]}
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

export default TrackList;