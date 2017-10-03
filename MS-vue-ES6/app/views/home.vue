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
        <li role="presentation" v-bind:class="[tab=='SearchTab' ? 'active' : '', errorClass]" @click="tab='SearchTab'">
            <a href="javascript:;">搜索歌曲</a>
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
    <div v-if="tab=='SearchTab'" class="SearchList">
        <div class="form-group">
            <input type="text" class="form-control" placeholder="请输入歌曲名称，每次最多返回10条"
                v-model="searchSong">
        </div>
        <ul class="list-group">
            <li class="list-group-item row" v-for="song in resultSongs"
                v-if="resultSongs.length != 0 && searchingStatus != 'search'">
                <div class="col-xs-8">
                    <span>{{song.name}}</span>
                </div>
                <div class="col-xs-4">
                    <button class="btn btn-success fr" @click="addSong(song)">添加至列表</button>
                </div>
            </li>
        </ul>
        <div v-if="resultSongs.length == 0 && searchingStatus != 'search'">
            <p>{{resultMessage}}</p>
        </div>  
        <div v-if="searchingStatus == 'search'">
            <p>正在搜索中...</p>
        </div>      
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
        	tab : "SongTab", //SongTab为音乐列表，FriendTab为好友列表，UploadTab为上传列表 SearchTab为歌曲搜索页面
            id : "",
            user : {
            	songs : [], 
            	friends : []
            },
            musicFlag : false,
            musicUrl : "",
            searchSong : "", 
            timer : null,
            resultSongs : [],   //成功时的数据
            resultMessage : "",  //失败时的信息
            searchingStatus : "before"   //4个状态 before search over 
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
    watch:{
        searchSong:"dynamicSearch"
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
        dynamicSearch(){
            if(this.searchSong===""){
                this.resultSongs = []
                this.resultMessage = "请填写名称！"
                clearTimeout(this.timer)
                return
            }
            clearTimeout(this.timer)
            var _this = this
            this.timer = setTimeout(()=>{
                //正在搜索字样也不要立刻就展示,如果300毫秒内拿到结果了就不展示了
                _this.searchingStatus = "before";   
                setTimeout(()=>{
                    if(_this.searchingStatus != "over")
                        _this.searchingStatus = "search"
                }, 300)
                //500毫秒后查找
                _this.$http.get('searchSongs?songname=' + _this.searchSong)
                    .then(function (response) {
                        _this.searchingStatus = "over"
                        if(response.data.result==='success'){
                            _this.resultSongs = response.data.data
                        } else {
                            _this.resultSongs = []
                            _this.resultMessage = response.data.message
                        }
                    })    
            },500)
        }, 
        addSong(song){
            let postData = {
                songId : song._id, 
                id : this.id
            }
            this.$http.post('addSongToMyList', postData)
                .then(function (response) {
                    if(response.data.result==='success'){
                        bus.$emit('alert', "歌曲添加成功！", ()=>{
                            window.location.reload();
                        })
                    } else {
                        bus.$emit('alert', response.data.message)
                    }
                })  
        }
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
.nav>li>a {
    padding-left: 14px!important;
    padding-right: 14px!important;
}
.searchList .list-group-item span{
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