# tonedeaf

- [tonedeaf.vercel.app](https://tonedeaf.vercel.app)
- [**zustand**](https://zustand.docs.pmnd.rs/getting-started/introduction) for global state
- [**TanStack Query**](https://tanstack.com/query/latest) for data retrieval and cacheing

<img src="https://user-images.githubusercontent.com/63682846/127954118-72b282c1-1ef1-42c6-814f-c39a5c35d8f3.png" width=550/> <img src="https://user-images.githubusercontent.com/63682846/127954200-9799b310-3892-49fd-b5ff-bac5f48c6719.png" width=143/>

## Features

- **Requires a Spotify account to sign in but a demo is provided.**
- Display a summary of your top artists and tracks within a time range (long term, 6 months, 1 month)
- Display your top 50 Artists/Tracks from a time range
- Display your 50 most recently listened tracks
- Get recommednations based on selected genres and song attributes
- Get recommendations based on selected artists and tracks
- Ability to save playlists of any tracklist

## Framework, Libraries and Technologies

- ReactJS
- Uses Node express server for auth flow [provided by Spotify](https://developer.spotify.com/documentation/web-api/quick-start/)
- Uses Spotify Web Api JS [by Jose Perez](https://github.com/JMPerez/spotify-web-api-js/)
- Hosted through Vercel at https://tonedeaf.vercel.app

## Installation

- Run `npm install` in both `tonedeaf-express` and `tonedeaf-react` folders
- Run `npm start` in `tonedeaf-express` to start the node server for authentication and demo services
- Run `npm run dev` in `tonedeaf-react` to start the client

## Environment Variables

```properties
CLIENT_S=YOUR_SPOTIFY_CLIENT_SECRET_HERE
CLIENT_ID=YOUR_SPOTIFY_CLIENT_ID_HERE
DEV=true
```
