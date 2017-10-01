<template>
<div class="container home">
    <music-nav v-bind:showName="true" v-bind:username="user.name">
        <li @click="toLogin()">注销</li>
        <li @click="toCheckFriendRequest()">加友管理</li>
        <li @click="toCheckShareRequest()">音乐分享</li>    
    </music-nav>
	<ul class="nav nav-pills" id="container" role="tablist">
  		<li role="presentation" v-bind:class="[tab=='SongTab' ? 'active' : '', errorClass]" @click="tab='SongTab'">
    		<a href="javascript:;">音乐列表</a>
  		</li>
  		<li role="presentation" v-bind:class="[tab=='FriendTab' ? 'active' : '', errorClass]" @click="tab='FriendTab'">
    		<a href="javascript:;">好友列表</a>
  		</li>
        <li role="presentation" v-bind:class="[tab=='UploadTab' ? 'active' : '', errorClass]" @click="tab='UploadTab'">
            <a href="javascript:;">音乐上传</a>
        </li>
	</ul>
	<div v-if="tab=='SongTab'" class="songList">
		<span v-if="user.songs.length==0" class="text-danger">无</span>
		<ul v-if="user.songs.length!=0" class="list-group">
		    <li class="list-group-item row" v-for="song in user.songs">
                <div class="col-xs-8">
                    <span>{{song.name}}</span>
                </div>
                <div class="col-xs-4">
                    <button class="btn btn-success fr" @click="download(song.url)">收听</button>
                </div>
		    </li>
	  	</ul>		
	</div>
	<div v-if="tab=='FriendTab'" class="friendList">
		<span v-if="user.friends.length==0" class="text-danger">无</span>
		<ul v-if="user.friends.length!=0" class="list-group">
		    <li class="list-group-item row" v-for="friend in user.friends">
                <div class="col-xs-6">
                    <span>{{friend.name}}</span>
                </div>
                <div class="col-xs-6">
                    <span class="fr">兴趣：{{friend.interest}}</span>
                </div>
		    </li>
	  	</ul>		
	</div>
    <div v-if="tab=='UploadTab'" class="uploadPage">
        <music-uploader v-bind:id="id"></music-uploader>
    </div>
    <div class="audioDiv" v-if="musicFlag">
        <audio controls autoplay :src="musicUrl">
        </audio>        
    </div>
</div>
</template>
<script>
import musicUploader from '../components/musicUploader'
import musicNav from '../components/musicNav'
import bus from '../bus'
export default {
	components : {
        musicUploader, 
        musicNav
    },
    data () {
        return {
        	tab : "SongTab", //SongTab为音乐列表，FriendTab为好友列表，UploadTab为上传列表
            id : "",
            user : {
            	songs : [], 
            	friends : []
            },
            musicFlag : false,
            musicUrl : ""
        }
    },
    created() {
        this.id = localStorage.getItem("identity")
        if (this.id == null){
            this.$router.push({name:'login'})   
        }

        this.$http.get('user?id=' + this.id)
            .then(function (response) {
                if(response.data.result==='success'){
                    this.user = response.data.data
                } else {
                    bus.$emit('alert', response.data.message)
                }
            }, function (err) {

            })  
    }, 
    methods:{
        download(url){
            var _this = this
            this.$http.get('downloadSong?url=' + url)
                    .then(function (response) {
                        if(response.data.result==='success'){
                            _this.musicFlag = true
                            _this.musicUrl = response.data.data
                        } else {
                            bus.$emit('alert', response.data.message)
                        }
                    }, function (err) {

                    })  
        }, 
        toLogin(){
        	localStorage.removeItem("identity")
        	this.$router.push({name:'login'})  
        },
        toCheckFriendRequest(){
        	this.$router.push({name:'checkFriendRequest'})  
        },
        toCheckShareRequest(){
        	this.$router.push({name:'checkShareRequest'})  
        },
    }
}
</script>
<style scoped>
.nav-pills{
	padding-top: 20px; 
	margin-bottom: 10px; 
}

.songList .list-group-item span{
	line-height: 34px; 
	height: 34px; 
}
.friendList .list-group-item span{
	line-height: 34px; 
	height: 34px; 
}
.audioDiv{
    position: fixed;
    bottom: 0;
    left:0;
    width:100%;
    height: 48px; 
    box-sizing: content-box;
}
.audioDiv audio{
    width: 100%;
    height: 100%;
}
</style>