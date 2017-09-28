var express = require('express');
var logger = require('./lib/logger');                     //日志
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

var webpack = require('webpack')
var WebpackDevMiddleware = require('webpack-dev-middleware')
var WebpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.dev.config')
var compiler = webpack(config)
app.use(WebpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: { colors: true }
}))
app.use(WebpackHotMiddleware(compiler, {
  log: console.log
}))
//后端 -----------------------------------------
require('./proxy/mongoose-schema'); 
var router = require('./router'); 
app.use(router); 
app.listen(8080, function () {
   logger.info("Server is listening on 8080! ");
});

