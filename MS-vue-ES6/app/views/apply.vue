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
import bus from '../bus'
export default {
    components : {
        musicNav
    },
    data () {
        return {
            backgroundDiv :  {
                backgroundImage: 'url(' + require('../images/bg1.jpg') + ')',
            }, 
            id : "", 
            username : "", 
            password : "", 
            interest : ""
        }
    },
    created() {
        this.id = localStorage.getItem("identity")
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
            if (this.username==="") {
                bus.$emit('alert', "账号不能为空")
                return   
            }         
            if (this.password==="") {
                bus.$emit('alert', "密码不能为空")
                return  
            }          
            if (this.interest==="") {
                bus.$emit('alert', "兴趣不能为空")
                return
            }
            let postData = {
                username : this.username, 
                password : this.password,
                interest : this.interest
            }
            bus.$emit('confirm', "确认创建用户" + this.username + "吗？", ()=>{
                this.$http.post('apply', postData)
                    .then(function (response) {
                        if(response.data.result==='success'){
                            localStorage.setItem("identity", response.data.data)
                            this.$router.push({name:'home'})
                        } else {
                            setTimeout(()=>{
                                bus.$emit('alert', response.data.message)
                            }, 1000)
                        }
                    }, function (err) {

                    })
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
}
</style>