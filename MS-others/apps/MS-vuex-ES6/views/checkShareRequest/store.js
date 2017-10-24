import elephant from '@/elephant-ui'
import * as types from '@/mutation-types'
const http = elephant.http
const bus = elephant.bus 
export default {
    namespaced:true, 
    state : {
        user : {}, 
        shareRequests : [], 
        shareOperationStatus : 0, 
        friendName : ""
    }, 
    mutations : {
        [types.SET_VALUE] (state, obj) {           //eg: commit("SET_VALUE", {user:xxx, id:xxx})
            for (var index in obj) { 
                state[index] = obj[index]
            }
        },
    }, 
    actions : {
        [types.API_CHECK_SHARE_REQUEST]({ commit, state, rootState }) {
            return new Promise((resolve, reject) => {
                http.get('../checkshareRequest?id=' + rootState.id)
                    .then(function (response) {
                        if(response.data.result==='success'){
                            commit("SET_VALUE", {
                                user : response.data.data.user, 
                                shareRequests : response.data.data.shareRequests
                            })
                        } else {
                            bus.$emit('alert', response.data.message)
                        }
                    }, function (err) {
                    })  
            })
        },
        [types.API_ADD_SHARE]({ commit, state, rootState }, { song }){
            commit("SET_VALUE", {
                shareOperationStatus : 0
            })
            if(state.friendName == ""){
                bus.$emit('alert', "未知错误！")
                return
            }
            let postData = {
                id : rootState.id, 
                friendName : state.friendName, 
                songId : song._id
            } 
            http.post('../addShare', postData)
                .then(function (response) {
                    if(response.data.result==='success'){
                        bus.$emit('alert', "分享已经发送！", ()=>{
                            window.location.reload()
                        })
                    } else {
                        bus.$emit('alert', response.data.message)
                    }
                }, function (err) {

                }) 
        },
        [types.API_REPLY_SHARE_REQUEST]({ commit, state }, { requestId, status }){
            let postData = {
               requestId : requestId,
               status : status
            }  
            http.post('../replyShareRequest', postData)
                .then(function (response) {
                    if(response.data.result==='success'){
                        bus.$emit('alert', "您的回复已经发送！歌曲会出现在您列表里！", ()=>{
                            window.location.reload()
                        })
                    } else {
                        bus.$emit('alert', response.data.message)
                    }
                }, function (err) {
                })     
        },
    }
}