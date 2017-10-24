import elephant from '@/elephant-ui'
import * as types from '@/mutation-types'
const http = elephant.http
const bus = elephant.bus 
export default  {
    namespaced:true, 
    state : {
        username : '', 
        password : ''
    }, 
    mutations : {
        [types.SET_VALUE] (state, obj) {           //eg: commit("SET_VALUE", {user:xxx, id:xxx})
            for (var index in obj) { 
                state[index] = obj[index]
            }
        },
    }, 
    actions : {
        [types.API_LOGIN]({ commit, state }, callback) {
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
            return new Promise((resolve, reject) => {
                http.post('../login', postData)
                    .then(function (response) {
                        if(response.data.result==='success'){
                            localStorage.setItem("identity", response.data.data)
                            resolve()
                        } else {
                            bus.$emit('alert', response.data.message)
                        }
                    }, function (err) {

                    })            
            })
        }
    }
}