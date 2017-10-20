const SET_ID = 'SET_ID'

export default {
	[SET_ID] (state, { id }) {
    	state.id = id
  	},
	setId (state, {id}){
		state.id = id
	}, 
	setUsername (state, {username}){
		state.username = username
	}, 
	setPassword (state, {password}){
		state.password = password
	}, 
	setUser(state, {user}){
		state.user = user
	},
	setMusicFlag(state, {musicFlag}){
		state.musicFlag = musicFlag
	},
	setMusicUrl(state, {musicUrl}){
		state.musicUrl = musicUrl
	},
	initLoginForm(state){
		state.username = ""
		state.password = ""
		state.interest = ""
	}, 	
	initApplyForm(state){
		state.username = ""
		state.password = ""
		state.interest = ""
	}, 
	initHomePage(state){
		state.tab = "SongTab" //SongTab为音乐列表，FriendTab为好友列表，UploadTab为上传列表 SearchTab为歌曲搜索页面
		state.musicFlag = false,
    	state.musicUrl = "",
    	state.searchSong = "", 
    	state.timer = null,
    	state.resultSongs = [],   //成功时的数据
    	state.resultMessage = "",  //失败时的信息
    	state.searchingStatus = "before"   //4个状态 before search over 
	}
}