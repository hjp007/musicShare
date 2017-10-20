<template>
<div>
    <div class="uploader row">
        <input type="file" id="uploader" @change="upload($event)" accept='audio/mp3,audio/wav,audio/wma,audio/ogg'/>
        <button class='btn btn-success col-xs-4 col-xs-offset-4' onclick="document.getElementById('uploader').click()">点击上传</button>
    </div>
    <span v-if="isBeforeUploading">
        校验成功，正准备上传，请等待。
    </span>
    <div v-if="percentage!=0">
        <h2 class="text-danger">上传进度</h2>
        <div class="progress">
                <div class="progress-bar progress-bar-striped active" role="progressbar" style="min-width: 2em;" v-bind:style="{ 'width' : percentage + '%'}">
                {{percentage}}%
                </div>
        </div>
    </div>   
</div>
</template>
<style scoped>
.uploader input[type="file"]{
    display: none;
}
.uploader button{
    margin-top: 30px; 
}
</style>
<script>
import bus from '../bus'
export default {
    name : 'musicUploader',
    props : {
        id : { 
            type : String
        }
    },
    data:function(){
        return {
            percentage : 0, 
            accepts : {
                checkType : ['audio/mp3','audio/wav','audio/wma','audio/ogg','audio/mpeg', 'audio/x-ms-wma'], //手机会被转成mpeg,x-ms-wma格式
                maxSize : 11000000
            }, 
            isBeforeUploading : false
        }
    },
    methods: {
        contains(arr, obj){
            var i = arr.length
            while (i--) {
                if (arr[i] === obj) {
                    return true
                }
            }
            return false
        }, 
        upload(event){
            var file = event.target.files[0]
            console.log(file)
            var _this = this
            if (file) {
                if(file.size > this.accepts.maxSize){
                    bus.$emit('alert', "文件超过10M！")
                    return
                }
                if(!this.contains(this.accepts.checkType, file.type)){
                    bus.$emit('alert', "请上传音乐！目前支持mp3,wav,wma,ogg格式！") 
                    return
                }
                this.isBeforeUploading = true
                var formData = new FormData()
                formData.append('file', file)
                let postData = {
                    filename : file.name, 
                    id : _this.id
                }
                this.$http.post('token', postData)
                    .then(function (response) {
                        if(response.data.result==='success'){
                            formData.append('token', response.data.data.token)
                            formData.append('key', response.data.data.key)
                            _this.$http.post('https://up.qbox.me/', formData,{
                                progress(event) {
                                    _this.percentage = Math.round(event.loaded*100/event.total)
                                    if(_this.isBeforeUploading == true && _this.percentage!=0){
                                        _this.isBeforeUploading = false
                                    }
                                }   
                            })
                            .then(function(response) {
                                console.log("七牛云上传成功！")
                                if(response.status == 200){
                                    console.log(111)
                                    let postData = {
                                        userID : _this.id, 
                                        name : file.name, 
                                        url : 'http://oqyw1ztb2.bkt.clouddn.com/' + response.body.key
                                    }
                                    console.log(postData)
                                    _this.$http.post('createSong', postData)
                                        .then(function (response) {
                                            if(response.data.result==='success'){
                                                bus.$emit('alert', "操作成功！", ()=>{
                                                    window.location.reload() 
                                                })
                                            } else{
                                                bus.$emit('alert', response.data.message)
                                            }
                                        }, function(err){})
                                }
                            }, function(err){})
                        } else{
                            _this.isBeforeUploading = false
                            bus.$emit('alert', response.data.message)
                        }
                    }, function(err){})
            }
        }
    }
}
</script>