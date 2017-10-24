import elephant from '@/elephant-ui'
import * as types from '@/mutation-types'
const http = elephant.http
const bus = elephant.bus 
export default  {
    namespaced : true, 
    state : {
        user : {   //接口获取用户信息
            songs : [], 
            friends : []
        },  
        tab : "SongTab", //页面选择用  
        musicFlag : false,
        musicUrl : "",
        searchSong : "", 
        timer : null,
        resultSongs : [],   //成功时的数据
        resultMessage : "",  //失败时的信息
        searchingStatus : "before"   //4个状态 before search over 
    },
    mutations : {
        [types.SET_VALUE] (state, obj) {           //eg: commit("SET_VALUE", {user:xxx, id:xxx})
            for (var index in obj) { 
                state[index] = obj[index]
            }
        },
        [types.CLEAR_TIMER] (state, obj) {    
            clearTimeout(state.timer)
        },
    },
    actions : {
        [types.API_USER]({ commit, state, rootState }) {
            return new Promise((resolve, reject) => {
                http.get('../user?id=' + rootState.id)
                    .then(function (response) {
                        if(response.data.result==='success'){
                            commit('SET_VALUE', { user : response.data.data })
                            resolve()
                        } else {
                            bus.$emit('alert', response.data.message)
                        }
                    }, function (err) {
                    })  
            })
        },
        [types.API_DOWNLOAD_SONG]({ commit, state }, { url }) {
            return new Promise((resolve, reject) => {
                http.get('../downloadSong?url=' + url)
                    .then(function (response) {
                        if(response.data.result==='success'){
                            commit('SET_VALUE', {
                                musicFlag : true, 
                                musicUrl : response.data.data
                            })
                            resolve()
                        } else {
                            bus.$emit('alert', response.data.message)
                        }
                    }, function (err) {
                    })  
            })
        },
        [types.API_ADD_SONG]({ commit, state }, callback) {
            let postData = {
                songId : song._id, 
                id : state.id
            }
            return new Promise((resolve, reject) => {
                http.post('../addSongToMyList', postData)
                    .then(function (response) {
                        if(response.data.result==='success'){
                            bus.$emit('alert', "歌曲添加成功！", ()=>{
                                resolve(callback)
                            })
                        } else {
                            bus.$emit('alert', response.data.message)
                        }
                    })
            })  
        },
        [types.API_SEARCH_SONGS]({ commit, state }) {
            if(state.searchSong===""){
                commit("SET_VALUE", {
                    resultSongs : [], 
                    resultMessage : "请填写名称！"
                })
                commit("CLEAR_TIMER")
                return
            }
            commit("CLEAR_TIMER")
            commit("SET_VALUE", {
                timer : setTimeout(()=>{
                    //正在搜索字样也不要立刻就展示,如果300毫秒内拿到结果了就不展示了
                    commit("SET_VALUE", {
                        searchingStatus : "before"   
                    })
                    setTimeout(()=>{
                        if(state.searchingStatus != "over")
                            commit("SET_VALUE", {
                                searchingStatus : "search"   
                            })
                    }, 300)
                    //500毫秒后查找
                    http.get('../searchSongs?songname=' + state.searchSong)
                        .then(function (response) {
                            commit("SET_VALUE", {
                                searchingStatus : "over"   
                            })
                            if(response.data.result==='success'){
                                commit("SET_VALUE", {
                                    resultSongs : response.data.data  
                                })
                            } else {
                                commit("SET_VALUE", {
                                    resultSongs : [], 
                                    resultMessage : response.data.message
                                })
                            }
                        })    
                },500)
            })
        },
    }
}