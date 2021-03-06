var express = require('express');
var co = require('co'); 
var mongoose = require('mongoose');
var logger = require("./lib/logger"); 
var Config = require("./proxy/config"); 

var qiniu = require("qiniu");
qiniu.conf.ACCESS_KEY = Config.qiniu.ACCESS_KEY;
qiniu.conf.SECRET_KEY = Config.qiniu.SECRET_KEY; 

var User = mongoose.model("User"); 
var Song = mongoose.model("Song"); 
var FriendRequest = mongoose.model("FriendRequest"); 
var ShareRequest = mongoose.model("ShareRequest"); 

var route = express.Router(); 
route.post('/apply', function(req,res,next){
    co(function*(){
        if(!req.body.username||!req.body.password||!req.body.interest)
            return Config.FAIL("0012");  
        //check exists
        var checkUser = yield User.findOne({"name" : req.body.username}); 
        if(checkUser)
            return Config.FAIL("0013");  
        //add
        var user = new User({
            name : req.body.username, 
            songs : [],  
            password : req.body.password, 
            interest : req.body.interest, 
            friends : [], 
            share : []
        });
        user = yield user.save();
        return Config.SUCCESS(user._id);
    }).then(function(data){
        res.json(data);
    }, function(e){
        logger.info(e); 
    });  
})
route.post('/login',function(req,res,next){
    co(function*(){
        var user = yield User.findOne({"name" : req.body.username}); 
        if(!user)
        	return Config.FAIL("0001");  
        if(user.password != req.body.password)
        	return Config.FAIL("0002"); 
        return Config.SUCCESS(user._id);
    }).then(function(data){
        res.json(data);
    }, function(e){
    	logger.info(e); 
    });
});


route.get('/user',function(req,res,next){
    co(function*(){
        var user = yield User.findOne({"_id" : req.query.id}).populate("friends songs"); 
        if(!user)
        	return Config.FAIL("0003"); 
        return Config.SUCCESS(user); 
    }).then(function(data){
        res.json(data);
    }, function(e){
    	logger.info(e); 
    });
});


route.get('/searchSongs',function(req,res,next){
    co(function*(){
        var songs = [];
        songs = yield Song.find({"name" : {
            $regex : new RegExp(req.query.songname) 
        }}).limit(10); 
        if(songs.length == 0)
            return Config.FAIL("0016"); 
        return Config.SUCCESS(songs); 
    }).then(function(data){
        res.json(data);
    }, function(e){
        logger.info(e); 
    });
});

route.post('/addSongToMyList',function(req,res,next){
    co(function*(){
        //check exist
        var user = yield User.findOne({"_id" : req.body.id});
        if(!user)
            return Config.FAIL("0001"); 
        var song = yield Song.findOne({"_id" : req.body.songId}); 
        if(!song)
            return Config.FAIL("0006");
        for(var i = 0; i < user.songs.length; i++){
            if(song._id.toString() == user.songs[i].toString())
                return Config.FAIL("0017"); 
        }
        user.songs.push(song._id);
        yield user.save();
        return Config.SUCCESS(); 
    }).then(function(data){
        res.json(data);
    }, function(e){
        logger.info(e); 
    });
});
route.get('/searchFriends',function(req,res,next){
    co(function*(){
        var users = [];
        users = yield User.find({"name" : {
            $regex : new RegExp(req.query.username), 
            $ne : req.query.myname
        }}).limit(5); 
        if(users.length == 0)
            return Config.FAIL("0015"); 
        return Config.SUCCESS(users); 
    }).then(function(data){
        res.json(data);
    }, function(e){
        logger.info(e); 
    });
});

route.post('/addFriend',function(req,res,next){
    co(function*(){
        //check exist
        var origin = yield User.findOne({"_id" : req.body.id});
        if(!origin)
            return Config.FAIL("0003"); 
        var target = yield User.findOne({"name" : req.body.friendName}); 
        if(!target)
            return Config.FAIL("0004");
        //check self 
        if(origin._id == target._id)
            return Config.FAIL("0010");
        //check duplicate request    !!!!!!!!!!!!!!!!!!!1
        var partA = yield FriendRequest.findOne({"origin" : origin._id, "target": target._id});
        var partB = yield FriendRequest.findOne({"target" : origin._id, "origin": target._id});
        if(partA||partB)
            return Config.FAIL("0011");
        //add
        var friendRequest = new FriendRequest({
            origin : req.body.id,  
            target : target._id, 
            status : 0
        });
        yield friendRequest.save();
        return Config.SUCCESS(); 
    }).then(function(data){
        res.json(data);
    }, function(e){
    	logger.info(e); 
    });
});


route.get('/checkFriendRequest',function(req,res,next){
    co(function*(){
        var user = yield User.findOne({"_id" : req.query.id}); 
        if(!user)
            return Config.FAIL("0003"); 
        var partA = yield FriendRequest.find({"origin" : user._id}).populate('origin target');
        var partB = yield FriendRequest.find({"target" : user._id}).populate('origin target');
        var friendRequests = partA.concat(partB); 
        return Config.SUCCESS({
            user : user, 
            friendRequests:friendRequests, 
        }); 
    }).then(function(data){
        res.json(data);
    }, function(e){
    	logger.info(e); 
    });
});




route.post('/replyFriendRequest',function(req,res,next){
    co(function*(){
        var request = yield FriendRequest.findOne({"_id" : req.body.requestId}); 
        if(!request)
            return Config.FAIL("0005"); 
        request.status = req.body.status; 
        yield request.save();
        var origin = yield User.findOne({"_id" : request.origin});
        var target = yield User.findOne({"_id" : request.target}); 
        origin.friends.push(request.target);
        target.friends.push(request.origin);
        yield origin.save(); 
        yield target.save(); 
        return Config.SUCCESS();
    }).then(function(data){
        res.json(data);
    }, function(e){
    	logger.info(e); 
    });
});



//七牛上传获取token
route.post('/token',function(req,res,next){
    co(function*(){
        //check exists
        var song = yield Song.findOne({"name" : req.body.filename}); 
        if(song)
            return Config.FAIL("0014"); 
        var key = req.body.id + '-' + req.body.filename;
        var bucket = 'songs';
        var putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key);
        var token = putPolicy.token();
        return Config.SUCCESS({
            key: key,
            token: token
        });
    }).then(function(data){
        res.json(data);
    }, function(e){
        logger.error(e);
    });
});

//上传完成数据库创建记录
route.post('/createSong',function(req,res,next){
    co(function*(){
        var user = yield User.findOne({"_id" : req.body.userID}).populate("songs"); 
        if(!user)
            return Config.FAIL("0003");
        var song = new Song({
            name : req.body.name, 
            url : req.body.url
        });
        yield song.save();
        user.songs.push(song); 
        yield user.save(); 
        return Config.SUCCESS();
    }).then(function(data){
        res.json(data);
    }, function(e){
        logger.error(e);
    });
});



route.post('/addShare',function(req,res,next){
    co(function*(){
        //check exist
        var owner = yield User.findOne({"_id" : req.body.id});
        if(!owner)
            return Config.FAIL("0003"); 
        var target = yield User.findOne({"name" : req.body.friendName}); 
        if(!target)
            return Config.FAIL("0004");
        var song = yield Song.findOne({"_id" : req.body.songId}); 
        if(!song)
            return Config.FAIL("0006");
        //add
        var shareRequest = new ShareRequest({
            owner : req.body.id,  
            target : target._id, 
            song : song._id, 
            status : 0
        });
        yield shareRequest.save();
        return Config.SUCCESS(); 
    }).then(function(data){
        res.json(data);
    }, function(e){
    	logger.info(e); 
    });
});


route.get('/checkShareRequest',function(req,res,next){
    co(function*(){
        var user = yield User.findOne({"_id" : req.query.id}).populate("friends songs"); 
        if(!user)
            return Config.FAIL("0003");
        var partA = yield ShareRequest.find({"owner" : user._id}).populate('owner target song');
        var partB = yield ShareRequest.find({"target" : user._id}).populate('owner target song');
        var shareRequests = partA.concat(partB);
        return Config.SUCCESS({
            user : user, 
            shareRequests:shareRequests, 
        }); 
    }).then(function(data){
        res.json(data);
    }, function(e){
    	logger.info(e); 
    });
});


route.post('/replyShareRequest',function(req,res,next){
    co(function*(){
        var request = yield ShareRequest.findOne({"_id" : req.body.requestId}); 
        if(!request)
            return Config.FAIL("0007"); 
        request.status = req.body.status; 
        yield request.save();
        var target = yield User.findOne({"_id" : request.target}); 
        target.songs.push(request.song);
        yield target.save(); 
        return Config.SUCCESS();
    }).then(function(data){
        res.json(data);
    }, function(e){
    	logger.info(e); 
    });
});


route.get('/downloadSong',function(req,res,next){
    co(function*(){
        var policy = new qiniu.rs.GetPolicy();
        var downloadUrl = policy.makeRequest(req.query.url);
        return Config.SUCCESS(downloadUrl);
    }).then(function(data){
        res.json(data);
    }, function(e){
    	logger.info(e); 
    });
});


module.exports = route;