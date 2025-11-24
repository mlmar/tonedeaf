/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require("express"); // Express web server framework
var request = require("request"); // "Request" library
var path = require("path");
var cors = require("cors");
var cookieParser = require("cookie-parser");

require("dotenv").config();

var client_id = process.env.CLIENT_ID; // Your client id
var client_secret = process.env.CLIENT_S; // Your secret
var redirect_uri = process.env.DEV
  ? "http://localhost:8888/callback"
  : "https://tonedeaf.vercel.app/callback"; // Your redirect uri
var home = process.env.DEV
  ? "http://localhost:3000"
  : "http://tonedeaf.vercel.app";
console.log("Development =", process.env.DEV);

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = "spotify_auth_state";

var app = express();

app
  .use(express.static(__dirname + "/public"))
  .use(cors())
  .use(cookieParser());

/*
  CUSTOM ENDPOINTS FOR DEMO SERVICE
*/
const demoEndpoints = require("./demo/endpoints.js");
app.use(demoEndpoints);

// your application requests authorization
const scope =
  "user-read-private user-read-email user-read-playback-state user-follow-read user-library-read playlist-read-private playlist-read-collaborative user-top-read user-read-playback-position user-read-recently-played playlist-modify-private playlist-modify-public user-modify-playback-state";

const REACT_DIRECTORY = "../tonedeaf-react/dist";
app.use(express.static(path.join(__dirname, REACT_DIRECTORY)));
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, REACT_DIRECTORY, "index.html"));
});

app.get("/login", function (req, res) {
  var state = generateRandomString(16);
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

app.get("/change_user", function (req, res) {
  var state = generateRandomString(16);
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

app.get("/callback", function (req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
        new URLSearchParams({
          error: "state_mismatch",
        })
    );
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        var options = {
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

app.get("/refresh_token", function (req, res) {
  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
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
      var access_token = body.access_token;
      res.send({
        access_token: access_token,
      });
    }
  });
});

console.log("Listening on 8888");
app.listen(8888);
