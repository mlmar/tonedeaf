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
    let style = { flexBasis: (3 / DEFAULTS.TOP_IMAGES_LIMIT * 100) + '%'};

    if(artistsInfo) {
      for(let i = 0; i < DEFAULTS.TOP_IMAGES_LIMIT; i++) {
        let artist = artistsInfo?.artists?.[i];
        artists.push(<ImageWrapper src={artist?.images?.[0]?.url} style={style} nohover key={i}/>)
      }
    }
    return artists;
  }
 
  const topArtist = () => {
    const artist = artistsInfo?.artists?.[0];

    return (
      <div className="flex-col panel float-images">
        <p className="large bold inactive flex-fill"> <span className="white"> {artist?.name} </span> was your number one artist </p>
        <div className="flex">
          <ImageWrapper src={artist?.images?.[0].url} nohover/>
          <div className="flex-wrap flex-fill" onClick={onClick}> {topArtists()} </div>
        </div>
      </div>
    )
  }

  return artistsInfo ? (
    <>
      <div className="flex-col">
        {topArtist()}
      </div>
      <div className="flex-col">
        {topGenres()}
      </div>
    </>
  ) : (
    <Load/>
  )
}

export default ArtistSummary;