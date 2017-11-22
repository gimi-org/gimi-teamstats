var express = require('express')
var path = require('path')
var app = express()
var proxy = require('express-http-proxy');
var cors = require('cors')
var request = require('request-promise');
var port = process.env.API_PORT || 9000

// app.all('*', function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header("Access-Control-Allow-Credentials", "true")
//   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, text/html, application/xhtml+xml, application/xml, image/webp, image/apng, */*')
//
//   if ('OPTIONS' == req.method) {
//   res.sendStatus(200);
//   } else {
//     next();
//   }
// });

app.use(cors())

// app.options(/(.*)/, (req, res, next) => {
//   res.sendStatus(200) // Always respond OK on OPTIONS requests.
// })

app.use('/github', proxy('https://api.github.com'))

app.listen(port, function () {
  console.log(`api running on port ${port}`)
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

// Serve static assets
app.use(express.static(path.resolve(__dirname, '../../build')))
