const express = require('express')
const app = module.exports = express();
const router = express.Router();

const { demoTrack, demoArtists, demoGenres, demoTracks, demoFeatures, demoAverages, demoRecent, demoSeeds } = require('./DemoData.js');

app.use('/demo', router);

router.get('/nowplaying', function(req, res) {
  res.send(demoTrack);
});

router.get('/artists', function(req, res) {
  res.send(demoArtists);
});

router.get('/genres', function(req, res) {
  res.send(demoGenres);
});

router.get('/tracks', function(req, res) {
  res.send(demoTracks);
});

router.get('/features', function(req, res) {
  res.send(demoFeatures);
});

router.get('/averages', function(req, res) {
  res.send(demoAverages);
});

router.get('/recent', function(req, res) {
  res.send(demoRecent);
});

router.get('/seeds', function(req, res) {
  res.send(demoSeeds);
}); 