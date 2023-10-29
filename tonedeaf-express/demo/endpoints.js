const express = require('express')
const app = module.exports = express();
const router = express.Router();

const demoData = require('./DemoData.json');

app.use('/demo', router);

router.get('/', function(req, res) {
  res.send(demoData);
});