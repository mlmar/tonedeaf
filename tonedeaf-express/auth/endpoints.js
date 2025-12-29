const express = require("express");
const request = require("request");
const app = (module.exports = express());
const router = express.Router();

const client_id = process.env.CLIENT_ID; // Your client id
const client_secret = process.env.CLIENT_S; // Your secret
const redirect_uri = process.env.DEV
    ? "http://127.0.0.1:8888/api/auth/callback"
    : "https://tonedeaf.vercel.app/api/auth/callback"; // Your redirect uri
const home = process.env.DEV
    ? "http://127.0.0.1:3000"
    : "http://tonedeaf.vercel.app";

app.use("/auth", router);

const scope = [
    "user-read-private",
    "user-read-email",
    "user-read-playback-state",
    "user-follow-read",
    "user-library-read",
    "playlist-read-private",
    "playlist-read-collaborative",
    "user-top-read",
    "user-read-playback-position",
    "user-read-recently-played",
    "playlist-modify-private",
    "playlist-modify-public",
    "user-modify-playback-state",
].join(" ");

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function (length) {
    var text = "";
    var possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const stateKey = "spotify_auth_state";
router.get("/login", function (req, res) {
    let state = generateRandomString(16);
    res.cookie(stateKey, state);

    res.redirect(
        "https://accounts.spotify.com/authorize?" +
            new URLSearchParams({
                response_type: "code",
                client_id: client_id,
                scope: scope,
                redirect_uri: redirect_uri,
                state: state,
            })
    );
});

router.get("/change_user", function (req, res) {
    let state = generateRandomString(16);
    res.cookie(stateKey, state);

    res.redirect(
        "https://accounts.spotify.com/authorize?" +
            new URLSearchParams({
                response_type: "code",
                client_id: client_id,
                scope: scope,
                redirect_uri: redirect_uri,
                state: state,
                show_dialog: true,
            })
    );
});

router.get("/callback", function (req, res) {
    // your application requests refresh and access tokens
    // after checking the state parameter

    let code = req.query.code || null;
    let state = req.query.state || null;
    let storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect(
            "/#" +
                new URLSearchParams({
                    error: "state_mismatch",
                })
        );
    } else {
        res.clearCookie(stateKey);
        let authOptions = {
            url: "https://accounts.spotify.com/api/token",
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: "authorization_code",
            },
            headers: {
                Authorization:
                    "Basic " +
                    new Buffer(client_id + ":" + client_secret).toString(
                        "base64"
                    ),
            },
            json: true,
        };

        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                let access_token = body.access_token,
                    refresh_token = body.refresh_token;

                let options = {
                    url: "https://api.spotify.com/v1/me",
                    headers: { Authorization: "Bearer " + access_token },
                    json: true,
                };

                // use the access token to access the Spotify Web API
                request.get(options, function (error, response, body) {
                    console.log(body);
                });

                // we can also pass the token to the browser to make requests from there
                res.redirect(
                    home +
                        "/#" +
                        new URLSearchParams({
                            access_token: access_token,
                            refresh_token: refresh_token,
                        })
                );
            } else {
                res.redirect(home + "/#");
            }
        });
    }
});

router.get("/refresh_token", function (req, res) {
    // requesting access token from refresh token
    let refresh_token = req.query.refresh_token;
    let authOptions = {
        url: "https://accounts.spotify.com/api/token",
        headers: {
            Authorization:
                "Basic " +
                new Buffer(client_id + ":" + client_secret).toString("base64"),
        },
        form: {
            grant_type: "refresh_token",
            refresh_token: refresh_token,
        },
        json: true,
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            let access_token = body.access_token;
            res.send({
                access_token: access_token,
            });
        }
    });
});
