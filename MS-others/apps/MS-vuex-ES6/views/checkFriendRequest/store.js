import elephant from '@/elephant-ui'
import * as types from '@/mutation-types'
const http = elephant.http
const bus = elephant.bus 
export default {
    namespaced:true, 
    state : {
        tab : 'CheckTab', //CheckTab为信息列表，AddTab为加友页面
        user : {   //接口获取用户信息
            songs : [], 
            friends : []
        },  
        friendRequests : [], 
        searchuser : "", 
        result : {},
        timer : null,
        resultUsers : [],   //成功时的数据
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
        [types.API_CHECK_FRIEND_REQUEST]({ commit, state, rootState }) {
            return new Promise((resolve, reject) => {
                http.get('../checkFriendRequest?id=' + rootState.id)
                    .then(function (response) {
                        if(response.data.result==='success'){
                            commit('SET_VALUE', {
                                user : response.data.data.user,
                                friendRequests : response.data.data.friendRequests
                            })
                            resolve()
                        } else {
                            bus.$emit('alert', response.data.message)
                        }
                    }, function (err) {
                    })  
            })
        },
        [types.API_SEARCH_FRIENDS]({ commit, state }){
            if(state.searchuser===""){
                commit("SET_VALUE", {
                    resultUsers : [], 
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
                        searchingStatus : 'before'
                    })
                    setTimeout(()=>{
                        if(state.searchingStatus != "over")
                            commit("SET_VALUE", {
                                searchingStatus : 'search'
                            })
                    }, 300)
                    //500毫秒后查找
                    http.get('../searchFriends?username=' + state.searchuser + '&myname=' + state.user.name)
                        .then((response)=> {
                            commit("SET_VALUE", {
                                searchingStatus : 'over'
                            })
                            if(response.data.result==='success')
                                commit("SET_VALUE", {
                                    resultUsers : response.data.data
                                })
                            else 
                                commit("SET_VALUE", {
                                    resultUsers : [], 
                                    resultMessage : response.data.message
                                })
                            
                        })    
                },500)
            })
        }, 
        [types.API_FRIEND_REQUEST]({ commit, state, rootState }, { user }){
            let postData = {
               id : rootState.id,
               friendName : user.name
            }
            http.post('../addFriend', postData)
                .then(function (response) {
                    if(response.data.result==='success'){
                        bus.$emit('alert', "您的请求已经发送，等待对方确认！", ()=>{
                            window.location.reload()
                        })
                    } else {
                        bus.$emit('alert', response.data.message)
                    }
                }, function (err) {

                })     
        },
        [types.API_REPLY_FRIEND_REQUEST]({ commit, state }, { requestId, status }){
            let postData = {
               requestId : requestId,
               status : status
            }
            http.post('../replyFriendRequest', postData)
                .then(function (response) {
                    if(response.data.result==='success'){
                        bus.$emit('alert', "您的回复已经发送！", ()=>{
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