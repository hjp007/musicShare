<template>
<div :style="backgroundDiv" class="container apply">
    <music-nav v-bind:showName="false">
        <li @click="toMain()">返回首页</li>
        <li @click="toLogin()">返回登录页</li>

    </music-nav>
    <div class="panel panel-primary">
        <div class="panel-heading">
            <h3 class="panel-title">注册账号</h3>
        </div>
        <div class="panel-body">
            <div class="form-group">
                <label>登录名</label>
                <input type="text" class="form-control" placeholder="请输入登录名" v-model="username">
            </div>
            <div class="form-group">
                <label>密码</label>
                <input type="password" class="form-control" placeholder="请输入密码" v-model="password">
            </div>
            <div class="form-group">
                <label>兴趣</label>
                <input type="text" class="form-control" placeholder="请输入兴趣" v-model="interest">
            </div>
            <div class="row">
                <button class="btn btn-danger col-xs-4 col-xs-offset-4" @click="applyAccount()">注册账号</button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import musicNav from '../components/musicNav'
import { mapGetters } from 'vuex'
import bus from '../bus'
export default {
    components : {
        musicNav
    },
    data () {
        return {
            backgroundDiv :  {
                backgroundImage: 'url(' + require('../images/bg1.jpg') + ')',
            }
        }
    },
    computed: {
        ...mapGetters({
          id: 'id',
          username: 'username', 
          password: 'password', 
          interest: 'interest'
        })
    },
    created() {
        this.$store.commit('initApplyForm')
        this.$store.commit('setId', {
            id : localStorage.getItem("identity")
        })
        if (this.id !== null){
            this.$router.push('home')      
        }
    }, 
    methods: {
        toMain(){
            this.$router.push({name:'main'})
        },
        toLogin(){
            this.$router.push({name:'login'})
        },
        applyAccount(){
            this.$store.dispatch('applyApi', (id)=>{
                localStorage.setItem("identity", id)
                this.$router.push({name:'home'})
            })

        }
    }
}
</script>

<style scoped>
.apply{
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