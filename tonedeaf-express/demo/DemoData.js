const demoArtists = require('./DemoArtists.js').demoArtists;
const demoGenres = require('./DemoGenres').demoGenres;
const demoTracks = require('./DemoTracks.js').demoTracks;
const demoFeatures = require('./DemoFeatures.js').demoFeatures;
const demoAverages = require('./DemoAverages.js').demoAverages;
const demoRecent = require('./DemoRecent.js').demoRecent;
const demoSeeds = require('./DemoSeeds.js').demoSeeds;

const demoTrack = {
  "title": "Hypotheticals",
  "artists": [
      "Lake Street Dive"
  ],
  "image": "https://i.scdn.co/image/ab67616d0000b273fbcf73d482a33264a852eebd",
  "duration": 230.178,
  "progress": 1.945,
  "url": "spotify:track:5lE2EFXt4muvLFMGQg4hZN",
  "playing": true
}


module.exports = { demoTrack, demoArtists, demoGenres, demoTracks, demoFeatures, demoAverages, demoRecent, demoSeeds }