import { useArtistsAndGenres } from '../../hooks/SpotifyHooks';
import ImageWrapper from '../ui/ImageWrapper';
import DEFAULTS from '../../util/Defaults';
import Load from '../ui/Load';

const ArtistSummary = (props) => {
  const { index, onClick } = props;
  const artistsInfo = useArtistsAndGenres(index);

  const topGenres = () => {
    let genres = [];
    let first = artistsInfo?.genres?.[0];

    if(first) {
      for(let i = 0; i < DEFAULTS.TOP_GENRES_LIMIT; i++) {
        let item = artistsInfo.genres?.[i + 1];
        genres.push(
          <label className="flex-col big bold" key={i }> 
            <span> {item.genre} </span>
            <span className="bold"> {(item.total / first.total * 100).toFixed(1)}% </span>
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
    let style = { flexBasis: (DEFAULTS.TOP_IMAGES_ROWS / DEFAULTS.TOP_IMAGES_LIMIT * 100) + '%'};

    if(artistsInfo) {
      for(let i = 1; i < DEFAULTS.TOP_IMAGES_LIMIT+1; i++) {
        let artist = artistsInfo?.artists?.[i];
        artists.push(<ImageWrapper src={artist?.images?.[0]?.url} style={style} key={i}/>)
      }
    }
    return artists;
  }
 
  const topArtist = () => {
    const artist = artistsInfo?.artists?.[0];

    return (
      <>
        <p className="panel large bold inactive"> <span className="white"> {artist?.name} </span> was your number one artist </p>
        <div className="flex-col float-images" onClick={onClick}>
          <div className="flex">
            <ImageWrapper src={artist?.images?.[0].url}/>
            <div className="flex-wrap flex-fill"> {topArtists()} </div>
          </div>
        </div>
      </>
    )
  }

  return artistsInfo ? (
    <>
      {topArtist()}
      {topGenres()}
    </>
  ) : (
    <Load/>
  )
}

export default ArtistSummary;