import { useState, useEffect, useRef } from "react";

import { fetchNowPlaying } from "~/util/DataUtil.js";
import ImageWrapper from "~/components/ImageWrapper.jsx";
import Load from "~/components/Load.jsx";
import ICON from "~/icons/SpotifyGreen.png";

const TIME = 10000;

/*
  Displays currently playing track or last played track

  widget    :   compact widget for scope page
  onChange  :   on track change, the track is passed as argument
*/
const NowPlaying = ({ widget, onChange, children }) => {
    const [track, setTrack] = useState(null);
    const fetchInterval = useRef(null);

    // since promise may resolve after component is unmounted, toggle a flag upon mounting
    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;

        const fetch = async () => {
            const response = await fetchNowPlaying();
            if (mounted.current) setTrack(response);
        };

        fetch(); // initial fetch
        fetchInterval.current = setInterval(fetch, TIME); // fetch track every interval
        return () => {
            mounted.current = false;
            clearInterval(fetchInterval.current);
        };
    }, []);

    useEffect(() => {
        if (onChange && track) onChange(track);
    }, [onChange, track]);

    if (!widget) {
        return track ? (
            <div className="now-playing">
                <ImageWrapper
                    src={track?.image}
                    alt={track?.title}
                    title={track?.title}
                    nohover
                />
                <div className="description flex-col">
                    <label className="large bold"> {track?.title} </label>
                    <label className="big bold">
                        {" "}
                        {track?.artists?.join(", ")}{" "}
                    </label>
                    <div className="flex-col flex-fill flex-reverse">
                        {" "}
                        <ImageWrapper
                            className="icon"
                            src={ICON}
                            title={`Open ${track?.name} in Spotify`}
                            url={track?.url}
                            nohover
                        />{" "}
                    </div>
                </div>
            </div>
        ) : (
            <Load />
        );
    } else {
        return track?.playing === true ? (
            <div className="now-playing-widget flex-col">
                <label className="bold medium title"> Now Playing </label>
                <span>{children}</span>
                <div className="flex">
                    <ImageWrapper
                        src={track?.image}
                        alt={track?.title}
                        title={track?.title}
                        nohover
                    />
                    <div className="description flex-col">
                        <label className="big bold"> {track?.title} </label>
                        <label className="medium">
                            {" "}
                            {track?.artists?.join(", ")}{" "}
                        </label>
                        <div className="flex-col flex-fill flex-reverse">
                            {" "}
                            <ImageWrapper
                                className="icon"
                                src={ICON}
                                title={`Open ${track?.name} in Spotify`}
                                url={track?.url}
                                nohover
                            />{" "}
                        </div>
                    </div>
                </div>
            </div>
        ) : null;
    }
};

export default NowPlaying;
