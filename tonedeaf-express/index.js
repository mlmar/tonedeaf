/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

const express = require("express"); // Express web server framework
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();
console.log("Development =", process.env.DEV);

const app = express();

app.use(cors()).use(cookieParser());

/*
  ENDPOINTS FOR DEMO SERVICE
*/
const demoEndpoints = require("./demo/endpoints.js");
app.use("/api", demoEndpoints);

/*
  ENDPOINTS FOR AUTH SERVICE
*/
const authEndpoints = require("./auth/endpoints.js");
app.use("/api", authEndpoints);

if (process.env.DEV) {
    console.log("Listening on 8888");
    app.listen(8888);
}
