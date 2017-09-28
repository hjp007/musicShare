var express = require('express');
//var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var logger = require('./lib/logger');                     //日志

require('./proxy/mongoose-schema'); 
//变量声明
var app = express();

var router = require('./router'); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(router); 

app.use(express.static(__dirname + "/app"));

app.listen(8080, function () {
  logger.info("Server is listening on 8080! ");
});




