import elephant from '@/elephant-ui'
import * as types from '@/mutation-types'
const http = elephant.http
const bus = elephant.bus 
export default {
    namespaced:true, 
    state : {
        username : '', 
        password : '', 
        interest : ''
    }, 
    mutations : {
        [types.SET_VALUE] (state, obj) {           //eg: commit("SET_VALUE", {user:xxx, id:xxx})
            for (var index in obj) { 
                state[index] = obj[index]
            }
        },
    }, 
    actions : {
        [types.API_APPLY]({ commit, state }, callback) {
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
            return new Promise((resolve, reject) => {
                bus.$emit('confirm', "确认创建用户" + state.username + "吗？", ()=>{
                    http.post('../apply', postData)
                        .then(function (response) {
                            if(response.data.result==='success'){
                                localStorage.setItem("identity", response.data.data)
                                resolve(callback)
                            } else {
                                setTimeout(()=>{
                                    bus.$emit('alert', response.data.message)
                                }, 1000)
                            }
                        }, function (err) {

                        })
                })
            })
        },
    }
}