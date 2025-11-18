import type { AudioFeatureAverages, GenreCount, getNowPlaying } from "~/util/SpotifyUtil"

type Cache = {
    // user
    userInfo: SpotifyApi.CurrentUsersProfileResponse | null,

    // top artists
    artists: [SpotifyApi.ArtistObjectFull[] | null, SpotifyApi.ArtistObjectFull[] | null, SpotifyApi.ArtistObjectFull[] | null],
    genres: [GenreCount | null, GenreCount | null, GenreCount | null],

    // top tracks
    tracks: [SpotifyApi.TrackObjectFull[] | null, SpotifyApi.TrackObjectFull[] | null, SpotifyApi.TrackObjectFull[] | null],
    features: [SpotifyApi.AudioFeaturesObject[] | null, SpotifyApi.AudioFeaturesObject[] | null, SpotifyApi.AudioFeaturesObject[] | null],
    averages: [AudioFeatureAverages | null, AudioFeatureAverages | null, AudioFeatureAverages | null],

    genreSeeds: string[] | null,

    search: {
        [key: string]: SpotifyApi.ArtistObjectFull[] | SpotifyApi.TrackObjectFull[] | null
    },

    nowPlaying: Awaited<ReturnType<typeof getNowPlaying>>,
    recent: SpotifyApi.PlayHistoryObject[] | null,

    demo: boolean,
}

export const cache: Cache = {
    // user
    userInfo: null,

    // top artists
    artists: [null, null, null],
    genres: [null, null, null],

    // top tracks
    tracks: [null, null, null],
    features: [null, null, null],
    averages: [null, null, null],

    genreSeeds: null,

    search: {},

    nowPlaying: null,
    recent: null,

    demo: false,
}