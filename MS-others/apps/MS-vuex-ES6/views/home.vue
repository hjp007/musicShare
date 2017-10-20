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
import { mapGetters } from 'vuex'
import musicUploader from '../components/musicUploader'
import musicNav from '../components/musicNav'
import bus from '../bus'
export default {
	components : {
        musicUploader, 
        musicNav
    },
    computed: mapGetters([
        'id', 
        'tab', 
        'user', 
        'musicFlag',
        'musicUrl',
        'searchSong', 
        'musicUrl',
        'searchSong', 
        'timer',
        'resultSongs',  
        'resultMessage', 
        'searchingStatus'  
    ]),
    created() {
        this.$store.commit('initHomePage')
        this.$store.commit('setId', {
            id : localStorage.getItem("identity")
        })
        if (this.id == null){
            this.$router.push({name:'login'})   
        }
        this.$store.dispatch('userApi').then((user) => {
            this.$store.commit('setUser', { user })
        })
    }, 
    watch:{
        searchSong : "dynamicSearch"
    }, 
    methods:{
        download(url){
            this.$store.dispatch('downloadSongApi', {
                url : url
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
            this.$store.dispatch('searchSongsApi')
        }, 
        addSong(song){
            this.$store.dispatch('addSong', {
                song : song
            }, ()=>{
                window.location.reload()
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