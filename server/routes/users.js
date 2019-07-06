var express = require('express');
var router = express.Router();
var num = 0;
/* GET users listing. */
router.get('/', function(req, res) {
  res.send(JSON.stringify({memeArray: null, number: num}))
  num++;
});

module.exports = router;
