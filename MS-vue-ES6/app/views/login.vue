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
                <input type="text" class="form-control" placeholder="请输入登录名" v-model="username">
            </div>
            <div class="form-group">
                <label>密码</label>
                <input type="password" class="form-control" placeholder="请输入密码" v-model="password">
            </div>
            <div class="row">
                <button class="btn btn-primary col-xs-4 col-xs-offset-4" @click="toHome()">登录</button>
            </div>
        </div>
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
            backgroundDiv :  {
                backgroundImage: 'url(' + require('../images/bg1.jpg') + ')',
            }, 
            id : "", 
            username : "", 
            password : ""
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
        toHome(){
            if (this.username==="") {
                alert("账号不能为空")
                return; 
            }
            else if (this.password==="") {
                alert("密码不能为空")
                return; 
            }
            let postData = {
                username : this.username, 
                password : this.password
            }
            this.$http.post('login', postData)
                .then(function (response) {
                    if(response.data.result==='success'){
                        localStorage.setItem("identity", response.data.data)
                        this.$router.push({name:'home'})
                    } else {
                        alert(response.data.message)
                    }
                }, function (err) {

                })
        }
    }
}
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
}
</style>