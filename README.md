# tonedeaf
- First version of tonedeaf can be found at github.com/mlmar/tonedeaf-old.git
- This is a total rewrite of the original project primarily using functional components, async/await calls, and an updated UI



<img src="https://user-images.githubusercontent.com/63682846/127954118-72b282c1-1ef1-42c6-814f-c39a5c35d8f3.png" width=550/> <img src="https://user-images.githubusercontent.com/63682846/127954200-9799b310-3892-49fd-b5ff-bac5f48c6719.png" width=143/>



## Features
- **Requires a Spotify account to sign in but a demo is provided.**
- Display user's top 50 Artists/Tracks from a time range (long term, 6 months, 1 month)
- Display user's 50 most recently lsitened tracks
- Get recommednations based on selected genres and song attributes
- Get recommendations based on selected artists and tracks
- Ability to save playlists of any tracklist



## Framework, Libraries and Technologies
- ReactJS -- bootstrapped with [Create React App](https://github.com/facebook/create-react-app)
- Uses Node express server for auth flow [provided by Spotify](https://developer.spotify.com/documentation/web-api/quick-start/)
- Uses Spotify Web Api JS [by Jose Perez](https://github.com/JMPerez/spotify-web-api-js/)
- Hosted through Vercel at https://tonedeaf.vercel.app



## Installation
- Run `npm install` in both `tonedeaf-express` and `tonedeaf-react` folders
- Run `npm start` in `tonedeaf-express` to start the node server for authentication and demo services
- Run `npm start` in `tonedeaf-react` to start the client


## Environment Variables
- Spotify API keys are required to be set as `CLIENT_S` and `CLIENT_ID`
- Set `DEV` to true