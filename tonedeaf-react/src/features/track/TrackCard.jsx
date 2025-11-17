import { useState } from "react";

import ImageWrapper from "~/components/ImageWrapper.jsx";

import ICON from "~/icons/SpotifyGreen.png";

const TrackCard = (track) => {
    const [visible, setVisibile] = useState(false);

    const handleVisibile = () => {
        setVisibile(!visible);
    };

    const handleClick = (event) => {
        const isSpotify = event.target.id === "spotify";
        if (track?.onClick && !isSpotify)
            track?.onClick({ ...track, type: "track" });
    };

    let name = track?.norank ? track?.name : track?.rank + ". " + track?.name;

    const attrClass = "flex-split small";

    return (
        <div
            className={"track-card flex-col " + track?.className}
            id={track?.name + track?.rank}
            onClick={handleClick}
        >
            <div className="flex">
                <ImageWrapper
                    src={track?.album?.images?.[0]?.url}
                    title={name}
                    nohover={!track?.imageClick}
                />
                <div className="description flex-col">
                    <div className="flex-col labels">
                        <label className="large bold"> {name} </label>
                        <label className="medium">
                            {" "}
                            {track?.artists
                                ?.map((artist) => artist.name)
                                .join(", ")}{" "}
                        </label>
                        <label className="medium inactive">
                            {" "}
                            {track?.album?.release_date?.split("-")[0]}{" "}
                        </label>
                        {track.children}
                        <div className="flex-col flex-fill flex-reverse">
                            <ImageWrapper
                                className="icon"
                                src={ICON}
                                title={`Open ${track?.name} in Spotify`}
                                url={track?.album?.uri}
                                id="spotify"
                                nohover
                            />
                        </div>
                    </div>
                    {track?.features && (
                        <button onClick={handleVisibile}>
                            {" "}
                            {visible ? "Hide" : "Show"} Attributes{" "}
                        </button>
                    )}
                </div>
            </div>
            {visible && (
                <div className="grid">
                    <label className={attrClass}>
                        {" "}
                        <span className="bold"> Acousticness </span>{" "}
                        {track?.features?.acousticness}{" "}
                    </label>
                    <label className={attrClass}>
                        {" "}
                        <span className="bold"> Danceability </span>{" "}
                        {track?.features?.danceability}{" "}
                    </label>
                    <label className={attrClass}>
                        {" "}
                        <span className="bold"> Duration (S) </span>{" "}
                        {track?.features?.duration_ms / 1000}{" "}
                    </label>
                    <label className={attrClass}>
                        {" "}
                        <span className="bold"> Energy </span>{" "}
                        {track?.features?.energy}{" "}
                    </label>
                    <label className={attrClass}>
                        {" "}
                        <span className="bold"> Instrumentalness </span>{" "}
                        {track?.features?.instrumentalness}{" "}
                    </label>
                    <label className={attrClass}>
                        {" "}
                        <span className="bold"> Liveness </span>{" "}
                        {track?.features?.liveness}{" "}
                    </label>
                    <label className={attrClass}>
                        {" "}
                        <span className="bold"> Loudness </span>{" "}
                        {track?.features?.loudness}{" "}
                    </label>
                    <label className={attrClass}>
                        {" "}
                        <span className="bold"> Mode </span>{" "}
                        {track?.features?.mode}{" "}
                    </label>
                    <label className={attrClass}>
                        {" "}
                        <span className="bold"> Speechiness </span>{" "}
                        {track?.features?.speechiness}{" "}
                    </label>
                    <label className={attrClass}>
                        {" "}
                        <span className="bold"> Tempo </span>{" "}
                        {track?.features?.tempo}{" "}
                    </label>
                    <label className={attrClass}>
                        {" "}
                        <span className="bold"> Time Signature </span>{" "}
                        {track?.features?.time_signature}{" "}
                    </label>
                    <label className={attrClass}>
                        {" "}
                        <span className="bold"> Valence </span>{" "}
                        {track?.features?.valence}{" "}
                    </label>
                    <label className={attrClass}>
                        {" "}
                        <span className="bold"> Popularity </span>{" "}
                        {track?.popularity}{" "}
                    </label>
                </div>
            )}
        </div>
    );
};

export default TrackCard;
