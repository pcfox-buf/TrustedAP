var express = require('express');
var app = express();
app.use(express.static('src'));
app.use(express.static('../TrustedAP-contract/build/contracts'));
app.get('/', function (req, res) {
  res.render('index.html');
});
app.listen(3010, function () {
  console.log('Example app listening on port 3010!');
});
