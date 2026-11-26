/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

const express = require("express"); // Express web server framework
const { readFile } = require("node:fs/promises");
const path = require("path");
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

// Vercel forwards / to Express while serving the other public files itself.
app.get("/", async function (_req, res, next) {
    try {
        const index = await readFile(path.join(__dirname, "public", "index.html"));
        res.type("html").send(index);
    } catch (error) {
        if (error.code !== "ENOENT") {
            next(error);
            return;
        }

        if (process.env.VERCEL) {
            res.redirect("/index.html");
            return;
        }

        next();
    }
});

// A local server can also serve the other files in the build.
if (require.main === module) {
    app.use(express.static(path.join(__dirname, "public")));
    app.listen(8888, () => console.log("Listening on 8888"));
}

module.exports = app;
