<template>
<div :style="backgroundDiv" class="container login">
    <music-nav v-bind:showName="false">
        <li @click="toMain()">返回首页</li>
    </music-nav>
    <div class="panel panel-primary">
        <div class="panel-heading">
            <h3 class="panel-title">音乐分享平台</h3>
        </div>
        <div class="panel-body">
            <div class="form-group">
                <label>登录名</label>
                <input type="text" class="form-control" placeholder="请输入登录名"
                    :value="username" @input="updateUsername">
            </div>
            <div class="form-group">
                <label>密码</label>
                <input type="password" class="form-control" placeholder="请输入密码"
                    :value="password" @input="updatePassword">
            </div>
            <div class="row">
                <button class="btn btn-primary col-xs-3 col-xs-offset-2" @click="toHome()">登录</button>
                <button class="btn btn-success col-xs-3 col-xs-offset-2" @click="toApply()">注册</button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import elephant from '@/elephant-ui'
import musicNav from '@/components/musicNav/index'
import store from './store'
const http = elephant.http
const bus = elephant.bus 
//模块名称及局部数据
let moduleData = {
    mName : 'login', 
    store,
}
//组件数据的配置项
let vuexSettings = {
    state : {
        self : ['username', 'password'], 
        global : ['id']
    }, 
    mutations : {
        self : ['SET_VALUE'], 
        global : ['INIT_ID']
    }, 
    actions : {
        self : ['API_LOGIN']
    }
}
//vue组件配置项
let vueComponent = {
    components : {
        musicNav
    },
    data () {
        return {
            backgroundDiv :  {
                backgroundImage: 'url(' + require('../../images/bg1.jpg') + ')',
            }
        }
    },
    created() {
        this.INIT_ID()
        if (this.id !== null){
            this.$router.push('home')      
        }

    }, 
    methods: {
        toMain(){
            this.$router.push({name:'main'})
        },
        toApply(){
            this.$router.push({name:'apply'})
        },
        toHome(){
            this.API_LOGIN().then(()=>{
                this.$router.push({name:'home'})
            })
        }, 
        updateUsername(e){
            this.SET_VALUE({username: e.target.value})
        },
        updatePassword(e){
            this.SET_VALUE({password: e.target.value})
        }, 
    }
}
export default elephant.component(vueComponent, vuexSettings, moduleData)
</script>

<style scoped>
.login{
    background:no-repeat 0px 0px;
    background-size:cover;
    -webkit-background-size:cover;
    -moz-background-size:cover;
    -o-background-size:cover;
    min-height:700px;
    padding-top:20px;
    width:100%;
}
</style>