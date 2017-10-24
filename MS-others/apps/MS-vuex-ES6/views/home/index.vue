<template>
<div class="container home">
    <music-nav v-bind:showName="true" v-bind:username="user.name">
        <li @click="toLogin()">注销</li>
        <li @click="toCheckFriendRequest()">加友管理</li>
        <li @click="toCheckShareRequest()">音乐分享</li>    
    </music-nav>
	<ul class="nav nav-pills" id="container" role="tablist">
  		<li role="presentation" v-bind:class="[tab=='SongTab' ? 'active' : '']" @click="changeTab('SongTab')">
    		<a href="javascript:;">音乐列表</a>
  		</li>
  		<li role="presentation" v-bind:class="[tab=='FriendTab' ? 'active' : '']" @click="changeTab('FriendTab')">
    		<a href="javascript:;">好友列表</a>
  		</li>
        <li role="presentation" v-bind:class="[tab=='UploadTab' ? 'active' : '']" @click="changeTab('UploadTab')">
            <a href="javascript:;">音乐上传</a>
        </li>
        <li role="presentation" v-bind:class="[tab=='SearchTab' ? 'active' : '']" @click="changeTab('SearchTab')">
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
        <music-uploader></music-uploader>
    </div>
    <div v-if="tab=='SearchTab'" class="SearchList">
        <div class="form-group">
            <input type="text" class="form-control" placeholder="请输入歌曲名称，每次最多返回10条"
                :value="searchSong" @input="dynamicSearch">
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
import musicUploader from '@/components/musicUploader/index'
import musicNav from '@/components/musicNav/index'
import store from './store'
import elephant from '@/elephant-ui'

//模块名称及局部数据
let moduleData = {
    mName : 'home', 
    store, 
}
//组件数据的配置项
let vuexSettings = {
    state : {
        self : ['tab', 'user', 'musicFlag', 'musicUrl', 'searchSong', 'timer', 'resultSongs', 'resultMessage', 'searchingStatus'], 
        global : ['id']
    }, 
    mutations : {
        self : ['SET_VALUE'], 
        global : ['INIT_ID']
    }, 
    actions : {
        self : ['API_USER', 'API_DOWNLOAD_SONG', 'API_ADD_SONG', 'API_SEARCH_SONGS']
    }
}
//vue组件配置项
let vueComponent = {
	components : {
        musicUploader, 
        musicNav
    },
    created() {
        this.INIT_ID()
        if (this.id == null){
            this.$router.push({name:'login'})   
        }
        this.API_USER()
    }, 
    methods:{
        download(url){
            this.API_DOWNLOAD_SONG({
                url : url
            })
        }, 
        changeTab(newTab){
            this.SET_VALUE({tab:newTab})
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
        dynamicSearch(e){
            this.SET_VALUE({searchSong: e.target.value})
            this.API_SEARCH_SONGS()
        }, 
        addSong(song){
            this.API_ADD_SONG({
                song : song
            }).then(()=>{
                window.location.reload()
            })
        }
    }
}
export default elephant.component(vueComponent, vuexSettings, moduleData)
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