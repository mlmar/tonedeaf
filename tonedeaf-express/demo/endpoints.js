const express = require("express");
const app = (module.exports = express());
const router = express.Router();

const demoData = require("./DemoData.json");

app.use("/demo", router);

router.get("/artists", function (req, res) {
  res.send(demoData["artists"]);
});
router.get("/genres", function (req, res) {
  res.send(demoData["genres"]);
});
router.get("/tracks", function (req, res) {
  res.send(demoData["tracks"]);
});
router.get("/features", function (req, res) {
  res.send(demoData["features"]);
});
router.get("/averages", function (req, res) {
  res.send(demoData["averages"]);
});
router.get("/genre-seeds", function (req, res) {
  res.send(demoData["genreSeeds"]);
});
router.get("/now-playing", function (req, res) {
  res.send(demoData["nowPlaying"]);
});
router.get("/recent", function (req, res) {
  res.send(demoData["recent"]);
});
