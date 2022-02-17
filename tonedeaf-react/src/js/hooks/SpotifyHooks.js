import { useState, useEffect } from 'react';
import { fetchArtistsAndGenres, fetchTracksAndFeatures, fetchRecent } from "../util/DataUtil";

export const useArtistsAndGenres = (timeFrameIndex) => {
  const [info, setInfo] = useState(null);

  // get top tracks
  useEffect(() => {
    const fetch = async () => {
      const response = await fetchArtistsAndGenres(timeFrameIndex);
      setInfo(response);
    }
    fetch();
  },[timeFrameIndex])

  return info;
}

export const useTracksAndFeatures = (timeFrameIndex) => {
  const [info, setInfo] = useState(null);

  // get top tracks
  useEffect(() => {
    const fetch = async () => {
      const response = await fetchTracksAndFeatures(timeFrameIndex);
      setInfo(response);
    }
    fetch();
  },[timeFrameIndex])

  return info;
}

export const useRecent = () => {
  const [tracks, setTracks] = useState(null);

  // get recent tracks
  useEffect(() => {
    const fetch = async () => {
      const recent = await fetchRecent();
      setTracks(recent);
    }
    fetch();
  },[]);

  return tracks;
}