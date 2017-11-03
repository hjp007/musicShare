var express = require('express');
var logger = require('./lib/logger');                     //日志
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//后端 -----------------------------------------
require('./proxy/mongoose-schema'); 
var router = require('./router'); 
app.use(router); 
//前端 -----------------------------------------
app.use(express.static(__dirname + "/dist"));
app.listen(80, function () {
   logger.info("Server is listening on 80! ");
});

