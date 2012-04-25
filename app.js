
/**
 * Module dependencies.
 */

var express = require('express');

var app = express.createServer(
  express.logger()
);
app.use(
    express.cookieParser({ secret: 'keyboard cat' }));
app.use(
    express.session({ secret: 'keyboard cat' }));

app.get('/', function(req, res){
  var body = '';
  if (req.session.hasOwnProperty('views')) {
    ++req.session.views;
  } else {
    req.session.views = 1;
    body += '<p>First time visiting? view this page in several browsers :)</p>';
  }
  res.send(body + '<p>viewed <strong>' + req.session.views + '</strong> times.</p>');
});

app.listen(3000);
console.log('Express app started on port 3000');
