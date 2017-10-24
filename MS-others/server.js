const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./apps/webpack.config')
var logger = require('./lib/logger');                     //日志

const app = express()
const compiler = webpack(WebpackConfig)

app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
  stats: {
    colors: true,
    chunks: false
  }
}))

app.use(webpackHotMiddleware(compiler))
app.use(express.static(__dirname + "/apps"))


var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
require('./proxy/mongoose-schema')
var router = require('./router') 
app.use(router)

const port = process.env.PORT || 80
module.exports = app.listen(port, () => {
   logger.info("Server is listening on 80! ")
})