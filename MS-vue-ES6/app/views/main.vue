<template>
<div class="container">
    <music-nav v-bind:showName="false">
        <li v-if="!id">未登录</li>
        <li v-if="id">已登录</li> 
    </music-nav>
    <img src="http://www.cio.com.cn/source/attachments/image/20150810/20150810105138_30376.jpg" class="img-responsive" alt="欢迎使用音乐分享平台">

    <div class="row" v-if="!id">
        <button class="btn btn-primary col-xs-6 col-xs-offset-3" @click="toLogin()" >
            <span>点此登录</span>
        </button>
    </div>
    <div class="row" v-if="id">
        <button class="btn btn-primary col-xs-6 col-xs-offset-3" @click="toHome()" >
            <span>点此进入首页</span>
        </button>
    </div>
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
        }
    }
}
</script>

<style scoped>
img{
    padding-top: 20px;
    margin-bottom: 20px;
}
</style>