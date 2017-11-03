var logger = require("../lib/logger.js"); 
var mongoose = require("mongoose"); 

var Schema = mongoose.Schema; 

var Config = require("./config.js");

var UserSchema = new Schema({
	name : String, 
	songs : [{type : Schema.Types.ObjectId, ref : "Song"}], 
	password : String, 
	interest : String, 
	friends : [{type : Schema.Types.ObjectId, ref : "User"}], 
	share : [{type : Schema.Types.ObjectId, ref : "Song"}]
});

var SongSchema = new Schema({
	name : String, 
	url : String
});

var ShareRequestSchema = new Schema({
	song :  {type : Schema.Types.ObjectId, ref : "Song"}, 
	owner : {type : Schema.Types.ObjectId, ref : "User"}, 
	target : {type : Schema.Types.ObjectId, ref : "User"}, 
	status : Number
});

var FriendRequestSchema = new Schema({
	origin : {type : Schema.Types.ObjectId, ref : "User"}, 
	target : {type : Schema.Types.ObjectId, ref : "User"}, 
    status : Number
});

mongoose.model("User", UserSchema); 
mongoose.model("Song", SongSchema); 
mongoose.model("ShareRequest", ShareRequestSchema); 
mongoose.model("FriendRequest", FriendRequestSchema); 

mongoose.connect(Config.DB.uri); 


var db = mongoose.connection;
db.on("error", function(e) {
    logger.error(e);
});

db.on("connecting", function() {
    logger.info("Mongod DB mongodb connecting");
});

db.on("connected", function() {
    logger.info("Mongod DB Connected");
});

db.on("open", function() {
    logger.info("Mongod DB open");
});

db.on("reconnected", function() {
    logger.warn("Mongod DB reconnected");
});

db.on("disconnected", function() {
    logger.error("Mongod DB disconnected");
});

db.on("close", function() {
    logger.error("Mongod DB mongodb connection closed!");
});






