import ImageWrapper from '../ui/ImageWrapper.js';

import ICON from "../../../icons/SpotifyGreen.png";

const ArtistCard = (artist) => {
  const handleClick = (event) => {
    const isSpotify = event.target.id === "spotify";
    if(artist?.onClick && !isSpotify) artist?.onClick({ images : artist?.images, name : artist?.name, id : artist?.id, type : "artist"});
  }

  let name = artist?.norank ? artist?.name : artist?.rank + ". " + artist?.name;
  return (
    <div className={"artist-card flex " + artist?.className} id={artist?.name + artist?.rank} onClick={handleClick} >
      <ImageWrapper src={artist?.images?.[0]?.url} title={name} nohover={!artist?.imageClick}/>
      <div className="description flex-col">
        <label className="large bold"> {name} </label>
        {/* <label className="medium"> {artist?.followers?.total?.toLocaleString()} followers </label> */}
        <label className="medium inactive"> {artist?.genres?.join(", ")} </label>
        <div className="flex-col flex-fill flex-reverse">
          <ImageWrapper className="icon" src={ICON} title={`Open ${artist?.name} in Spotify`} url={artist?.uri} id="spotify" nohover/>
        </div>
      </div>
    </div>
  )
}

export default ArtistCard;