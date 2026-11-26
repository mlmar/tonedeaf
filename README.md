# tonedeaf

<img src="https://user-images.githubusercontent.com/63682846/127954118-72b282c1-1ef1-42c6-814f-c39a5c35d8f3.png" width=550/> <img src="https://user-images.githubusercontent.com/63682846/127954200-9799b310-3892-49fd-b5ff-bac5f48c6719.png" width=143/>

- [tonedeaf.vercel.app](https://tonedeaf.vercel.app)
- **Requires a Spotify account to sign in but a demo is provided.**
- Display a summary of your top artists and tracks within a time range (long term, 6 months, 1 month)
- Display your top 50 Artists/Tracks from a time range
- Display your 50 most recently listened tracks
- Get recommednations based on selected genres and song attributes
- Get recommendations based on selected artists and tracks
- Ability to save playlists of any tracklist

## Framework, Libraries and Technologies

- ReactJS
- [**zustand**](https://zustand.docs.pmnd.rs/getting-started/introduction) for global state
- [**TanStack Query**](https://tanstack.com/query/latest) for data retrieval and cacheing
- Uses Node express server for auth flow [provided by Spotify](https://developer.spotify.com/documentation/web-api/quick-start/)
- Uses Spotify Web Api JS [by Jose Perez](https://github.com/JMPerez/spotify-web-api-js/)
- Unit Testing with [vitest](https://vitest.dev/) and [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)
- Hosted through Vercel at https://tonedeaf.vercel.app

## Installation

- Use Node.js 24 and run `npm ci` in both `tonedeaf-express` and `tonedeaf-react`.
- Run `npm start` in `tonedeaf-express` to start the Node server for authentication and demo services.
- Run `npm run dev` in `tonedeaf-react` and open `http://127.0.0.1:3000`. Register `http://127.0.0.1:8888/api/auth/callback` in Spotify for local sign-in. Use the loopback IP so the OAuth callback and app share the browser’s session cookies.
- To serve a production build locally, run `npm run build` in `tonedeaf-react` and open `http://127.0.0.1:8888` with Express running.

## Deployment

Pull requests to `main` run the Express auth tests, client tests, and a Vite build. On pushes to `main`, the **Deploy client build branch** workflow runs the same checks and publishes the Express server and the generated `tonedeaf-express/public/` directory to `build/client`. The generated commit records the source SHA. To rerun publication, select `main` under **Actions → Deploy client build branch → Run workflow**.

For the initial rollout, set `main` as the GitHub default branch and let the first successful workflow run create `build/client`.

In Vercel, set the Root Directory to `tonedeaf-express` and Node.js version to 24.x. Let the Express preset install dependencies, package `index.js`, and serve `public/` from the CDN. Leave the custom build and output directory overrides disabled. Set Production Branch Tracking to `build/client`. Set `CLIENT_ID` and `CLIENT_S` for production and register `https://tonedeaf.vercel.app/api/auth/callback` in Spotify.

Before deploying the session changes, generate a 32-byte secret with `openssl rand -hex 32` and set it as `AUTH_SESSION_SECRET` in Vercel’s Production environment. Use a separate secret locally. Keep the production secret stable across deployments. Changing it requires users to sign in again. After deploying to `https://tonedeaf.vercel.app`, verify sign-in, session restore, logout, and account switching with two authorized Spotify accounts.

## Environment Variables

```properties
CLIENT_S=YOUR_SPOTIFY_CLIENT_SECRET_HERE
CLIENT_ID=YOUR_SPOTIFY_CLIENT_ID_HERE
AUTH_SESSION_SECRET=YOUR_64_CHARACTER_HEX_SECRET_HERE
DEV=true
```
