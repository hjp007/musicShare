<template>
<div class="container">
    <music-nav v-bind:showName="false">
        <li v-if="!id">未登录</li>
        <li v-if="id">已登录</li> 
    </music-nav>
    <img src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2550279230,467606093&fm=200&gp=0.jpg" class="img-responsive logo" alt="欢迎使用音乐分享平台">
    <img src="https://cn.vuejs.org/images/logo.png" class="img-responsive version_logo">
    <h1 class="version_text">VUE版本</h1>        
  
    <p>这是一个音乐分享平台，实现音乐上传，在线播放，添加好友和给好友分享音乐的功能。</p>
    <p>项目逻辑不复杂，功能不多，本人做这个项目仅供学习，严禁任何人用于商业。</p>
    <p>希望能帮助大家学习框架API的使用，以及对不同框架的差别理解。</p>

    <div class="row" v-if="!id">
        <button class="btn btn-primary col-xs-3 col-xs-offset-2" @click="toLogin()">
            <span>点此登录</span>
        </button>
        <button class="btn btn-success col-xs-3 col-xs-offset-2" @click="toApply()">
            <span>注册</span>
        </button>
    </div>
    <div class="row" v-if="id">
        <button class="btn btn-primary col-xs-6 col-xs-offset-3" @click="toHome()" >
            <span>点此进入首页</span>
        </button>
    </div>
    <br>
    <p>作者：星空下的凡尘</p>
    <p>邮箱：645566979@qq.com</p>
</div>
</template>

<script>
import musicNav from '../components/musicNav'
export default {
    components : {
        musicNav
    },
    data () {
        return {
            id : ""
        }
    },
    created() {
        this.id = localStorage.getItem("identity")
    },
    methods:{
        toLogin(){
            this.$router.push({name:'login'})
        }, 
        toHome(){
            this.$router.push({name:'home'})
        }, 
        toApply(){
            this.$router.push({name:'apply'})

        
        }
    }
}
</script>

<style scoped>
.logo{
    width:200px;
    margin:0 auto;
}
.version_logo{
    width:60px;
    margin:0 auto;
}
.version_text{
    text-align: center;
}
</style>