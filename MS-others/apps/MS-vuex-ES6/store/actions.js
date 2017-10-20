import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)
Vue.http.options.emulateJSON = true
const http=Vue.http
const SET_ID = 'SET_ID'
import bus from '../bus'

export default {
	loginApi({ commit, state }, callback) {
	    if (state.username==="") {
            bus.$emit('alert', "账号不能为空")
            return
        }
        if (state.password==="") {
            bus.$emit('alert', "密码不能为空")
            return 
        }
        let postData = {
            username : state.username, 
            password : state.password
        }
        http.post('../login', postData)
            .then(function (response) {
                if(response.data.result==='success'){
                    if(callback)
                    	callback(response.data.data)
                } else {
                    bus.$emit('alert', response.data.message)
                }
            }, function (err) {

            })
	}, 
	applyApi ({ commit, state }, callback){
        if (state.username==="") {
            bus.$emit('alert', "账号不能为空")
            return   
        }         
        if (state.password==="") {
            bus.$emit('alert', "密码不能为空")
            return  
        }          
        if (state.interest==="") {
            bus.$emit('alert', "兴趣不能为空")
            return
        }
        let postData = {
            username : state.username, 
            password : state.password,
            interest : state.interest
        }
        bus.$emit('confirm', "确认创建用户" + state.username + "吗？", ()=>{
            http.post('../apply', postData)
                .then(function (response) {
                    if(response.data.result==='success'){
                    	if(callback)
                    		callback(response.data.data)
                    } else {
                        setTimeout(()=>{
                            bus.$emit('alert', response.data.message)
                        }, 1000)
                    }
                }, function (err) {

                })
        })
	},
	userApi ({ commit, state }) {
    	return new Promise((resolve, reject) => {
	    	http.get('../user?id=' + state.id)
	            .then(function (response) {
	                if(response.data.result==='success'){
						resolve(response.data.data)
	                } else {
	                    bus.$emit('alert', response.data.message)
	                }
	            }, function (err) {
	            })  
	    })
  	}, 
  	downloadSongApi({ commit, state }, { url }){
	    http.get('../downloadSong?url=' + url)
	        .then(function (response) {
	            if(response.data.result==='success'){
	            	commit('setMusicFlag', {
	            		musicFlag : true
	            	})
	            	commit('setMusicUrl', {
	            		musicUrl : response.data.data
	            	})
	            } else {
	                bus.$emit('alert', response.data.message)
	            }
	        }, function (err) {

	        })  
  	}, 
  	searchSongsApi({commit, state}){
  		if(state.searchSong===""){
                state.resultSongs = []
                state.resultMessage = "请填写名称！"
                clearTimeout(state.timer)
                return
            }
            clearTimeout(state.timer)
            state.timer = setTimeout(()=>{
                //正在搜索字样也不要立刻就展示,如果300毫秒内拿到结果了就不展示了
                state.searchingStatus = "before";   
                setTimeout(()=>{
                    if(state.searchingStatus != "over")
                        state.searchingStatus = "search"
                }, 300)
                //500毫秒后查找
                http.get('../searchSongs?songname=' + state.searchSong)
                    .then(function (response) {
                        state.searchingStatus = "over"
                        if(response.data.result==='success'){
                            state.resultSongs = response.data.data
                        } else {
                            state.resultSongs = []
                            state.resultMessage = response.data.message
                        }
                    })    
            },500)
  	},
  	addSong({ commit, state }, { song }, callback){
        let postData = {
            songId : song._id, 
            id : state.id
        }
        http.post('../addSongToMyList', postData)
            .then(function (response) {
                if(response.data.result==='success'){
                    bus.$emit('alert', "歌曲添加成功！", ()=>{
                    	if(callback)
                    		callback()
                    })
                } else {
                    bus.$emit('alert', response.data.message)
                }
            })  
  	}
}