import { useArtistsAndGenres } from '../../hooks/SpotifyHooks';
import ImageWrapper from '../ui/ImageWrapper';
import DEFAULTS from '../../util/Defaults';
import Load from '../ui/Load';

const ArtistSummary = (props) => {
  const { onClick } = props;
  const artistsInfo = useArtistsAndGenres(2);

  const topGenres = () => {
    let genres = [];
    let first = artistsInfo?.genres?.[0];

    if(first) {
      for(let i = 0; i < DEFAULTS.TOP_GENRES_LIMIT; i++) {
        let item = artistsInfo.genres?.[i + 1];
        genres.push(
          <label className="flex-col big bold" key={i }> 
            {item.genre}
            <span className="flex bold"> {(item.total / first.total * 100).toFixed(1)}% </span>
          </label>
        );
      }

      return (
        <div className="flex-col panel">
          <p className="large bold inactive"> you listened to artists from <span className="white"> { artistsInfo?.genres?.length - 1} </span> genres &mdash; these were your favorites </p>
          <div className="stats flex-wrap"> {genres} </div>
        </div>
      );
    }
  }

  const topArtists = () => {
    let artists = [];
    let style = { flexBasis: 1 / DEFAULTS.TOP_IMAGES_LIMIT * 100 + '%' };

    if(artistsInfo) {
      for(let i = 1; i < DEFAULTS.TOP_IMAGES_LIMIT; i++) {
        let artist = artistsInfo?.artists?.[i];
        artists.push(<ImageWrapper src={artist?.images?.[0]?.url} style={style} nohover key={i}/>)
      }
    }
    artists.push(<div className="plus-btn medium" style={style} key={DEFAULTS.TOP_IMAGES_LIMIT}></div>);
    return artists;
  }
 
  const topArtist = () => {
    const artist = artistsInfo?.artists?.[0];

    return (
      <div className="flex">
        <ImageWrapper src={artist?.images?.[0].url} nohover/>
        <p className="large bold inactive flex-fill panel"> <span className="white"> {artist?.name} </span> was your number one artist </p>
      </div>
    )
  }

  return artistsInfo ? (
    <div className="flex-col">
      {topArtist()}
      {topGenres()}
      <div className="flex-wrap float-images" onClick={onClick}> {topArtists()} </div>
    </div>
  ) : (
    <Load/>
  )
}

export default ArtistSummary;