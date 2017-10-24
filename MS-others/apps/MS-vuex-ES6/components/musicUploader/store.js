import elephant from '@/elephant-ui'
import * as types from '@/mutation-types'
const http = elephant.http
const bus = elephant.bus 
export default {
    namespaced:true, 
    state : {
        percentage : 0, 
        accepts : {
            checkType : ['audio/mp3','audio/wav','audio/wma','audio/ogg','audio/mpeg', 'audio/x-ms-wma'], //手机会被转成mpeg,x-ms-wma格式
            maxSize : 11000000
        }, 
        isBeforeUploading : false
    }, 
    mutations : {
        [types.SET_VALUE] (state, obj) {           //eg: commit("SET_VALUE", {user:xxx, id:xxx})
            for (var index in obj) { 
                state[index] = obj[index]
            }
        },
    }, 
    actions : {
        [types.API_UPLOAD_TOKEN]({ commit, state, rootState }, { name }) {
    	    let postData = {
                filename : name, 
                id : rootState.id
            }
            return new Promise((resolve, reject) => {
                http.post('../token', postData)
                    .then(function (response) {
                        if(response.data.result==='success'){ 
                        	resolve({
                        		token : response.data.data.token, 
                        		key : response.data.data.key
                        	})               
                        } else{
                        	commit("SET_VALUE", { 
                        		isBeforeUploading : false 
                        	})
                            bus.$emit('alert', response.data.message)
                        }
                    }, function(err){})
            })
        },
        [types.API_UPLOAD_PROGRESS]({ commit, state }, { formData }) {
            return new Promise((resolve, reject) => {
                http.post('https://up.qbox.me/', formData, {
                    progress(event) {
                    	commit("SET_VALUE", {
                    		percentage : Math.round(event.loaded*100/event.total)
                    	})
                        if(state.isBeforeUploading == true && state.percentage != 0)
                        	commit("SET_VALUE", { 
                        		isBeforeUploading : false 
                        	})
                    }   
                })
                .then(function(response) {
                    console.log("七牛云上传成功！")
                    if(response.status == 200)
                    	resolve({ key : response.body.key })
                }, function(err){})
            })
        },
        [types.API_UPLOAD_SAVE]({ commit, state, rootState }, { name, key }) {
            let postData = {
                userID : rootState.id, 
                name : name, 
                url : 'http://oqyw1ztb2.bkt.clouddn.com/' + key
            }
            return new Promise((resolve, reject) => {
                http.post('../createSong', postData)
                    .then(function (response) {
                        if(response.data.result==='success'){
                            bus.$emit('alert', "操作成功！", ()=>{
                                window.location.reload() 
                            })
                        } else{
                            bus.$emit('alert', response.data.message)
                        }
                    }, function(err){})
            })
        },
    }
}