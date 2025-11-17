import { useState } from "react";
import { cache } from "~/util/Cache.js";
import { useRecent } from "~/hooks/SpotifyHooks.js";
import { createPlaylist } from "~/util/SpotifyUtil.js";

import Options from "~/components/Options.jsx";
import ImageWrapper from "~/components/ImageWrapper.jsx";
import TrackCard from "./TrackCard.jsx";

import Load from "~/components/Load.jsx";

import DEFAULTS from "~/util/Defaults.js";

/*
  Display users most recent 50 tracks
*/
const RecentPage = ({ setAlertText }) => {
    const [viewIndex, setViewIndex] = useState(DEFAULTS.VIEW_INDEX); // 0 = grid, 1 = list
    const tracks = useRecent();

    const handleCreatePlaylist = async () => {
        const id = cache["userInfo"]?.id;
        const response = await createPlaylist(
            id,
            "tonedeaf recent tracks",
            tracks,
            true
        );
        if (response) {
            if (response?.status === "demo") {
                setAlertText("Sign in to use this feature");
            } else {
                setAlertText(DEFAULTS.STATUS_MESSAGE.PLAYLIST_CREATED);
            }
        }
    };

    // if an tracks's image is pressed in the grid view, display location of track in list view
    const handleTrackClick = () => {
        setViewIndex(1);
    };

    return (
        <div className="page">
            <header className="flex flex-wrap mobile-flex">
                <Options
                    title="View"
                    options={DEFAULTS.VIEW_OPTIONS}
                    onClick={setViewIndex}
                    index={viewIndex}
                />
                <Options
                    title="Like These Tracks?"
                    options={["Create Playlist"]}
                    onClick={handleCreatePlaylist}
                />
            </header>
            {tracks ? (
                viewIndex === 0 ? (
                    <div className="images">
                        {tracks?.map((track, i) => (
                            <ImageWrapper
                                src={track?.track?.album?.images?.[0]?.url}
                                title={i + 1 + ". " + track?.track?.name}
                                url={"#" + track?.track?.name + (i + 1)}
                                onClick={handleTrackClick}
                                key={track?.track?.name + i}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="cards">
                        {tracks?.map((track, i) => (
                            <TrackCard
                                {...track?.track}
                                rank={i + 1}
                                key={track?.track?.name + i}
                                norank
                            >
                                <label className="medium inactive">
                                    {" "}
                                    Played on{" "}
                                    {new Date(
                                        track?.played_at
                                    ).toDateString()}{" "}
                                </label>
                            </TrackCard>
                        ))}
                    </div>
                )
            ) : (
                <Load />
            )}
        </div>
    );
};

export default RecentPage;
