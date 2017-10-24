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
import store from './store'
import elephant from '@/elephant-ui'
//模块名称及局部数据
let moduleData = {
    mName : 'musicUploader', 
    store, 
}
//组件数据的配置项
let vuexSettings = {
    state : {
        self : ['percentage', 'accepts', 'isBeforeUploading'], 
        global : ['id']
    }, 
    mutations : {
        self : ['SET_VALUE']
    }, 
    actions : {
        self : ['API_UPLOAD_TOKEN', 'API_UPLOAD_PROGRESS', 'API_UPLOAD_SAVE']
    }
}
//vue组件配置项
let vueComponent = {
    name : 'musicUploader',
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
            if (file) {
                if(file.size > this.accepts.maxSize){
                    bus.$emit('alert', "文件超过10M！")
                    return
                }
                if(!this.contains(this.accepts.checkType, file.type)){
                    bus.$emit('alert', "请上传音乐！目前支持mp3,wav,wma,ogg格式！") 
                    return
                }
                this.SET_VALUE({isBeforeUploading : true})
                var formData = new FormData()
                formData.append('file', file)
                this.API_UPLOAD_TOKEN({ name : file.name })
                    .then(({ token, key })=>{
                        formData.append('token', token)
                        formData.append('key', key)
                        this.API_UPLOAD_PROGRESS({ formData : formData })
                            .then(({ key })=>{
                                this.API_UPLOAD_SAVE({ name : file.name, key : key })
                            })
                    })

                             
            }
        }
    }
}
export default elephant.component(vueComponent, vuexSettings, moduleData)
</script>