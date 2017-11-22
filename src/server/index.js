var express = require('express')
var path = require('path')
var app = express()
var proxy = require('express-http-proxy');
var cors = require('cors')
var request = require('request-promise');
var port = process.env.API_PORT || 9000

app.use(cors())

app.options(/(.*)/, (req, res, next) => {
   res.sendStatus(200) // Always respond OK on OPTIONS requests.
})

app.use('/github', proxy('https://api.github.com'))

app.listen(port, function () {
  console.log(`api running on port ${port}`)
})

// Serve static assets
app.use(express.static(path.resolve(__dirname, '../../build')))
