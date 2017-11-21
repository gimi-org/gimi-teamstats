var proxy = require('express-http-proxy');
var app = require('express')();
var request = require('request-promise');
var port = process.env.API_PORT || 3001

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header("Access-Control-Allow-Credentials", "true")
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, text/html, application/xhtml+xml, application/xml, image/webp, image/apng, */*')

  if ('OPTIONS' == req.method) {
  res.sendStatus(200);
  } else {
    next();
  }
});

// app.options(/(.*)/, (req, res, next) => {
//   res.sendStatus(200) // Always respond OK on OPTIONS requests.
// })

app.use('/github', proxy('https://api.github.com'));

app.listen(port, function () {
  console.log(`api running on port ${port}`)
})

app.get('/', (req, res) => {
  res.send("Ready!")
})


app.get('/github2', (req, res) => {
  let headers = req.headers

  console.log('headers')
  console.log(headers)
  request('https://api.github.com/repos/angular/angular.js/stats/participation')
   .then(response => {
     res.end(response)
   })
  // .catch(console.error)
})




//
//
// var http = require('http'),
//     httpProxy = require('http-proxy');
// //
// // Create your proxy server
// //
// httpProxy.createServer(9000, 'localhost').listen(8000);
//
// //
// // Create your target server
// //
// http.createServer(function (req, res) {
//   res.writeHead(200, { 'Content-Type': 'text/plain' });
//   res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2));
//   res.end();
// }).listen(9000);
