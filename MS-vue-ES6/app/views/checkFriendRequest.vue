<template>
<div class="container checkFriendRequest">
    <music-nav v-bind:showName="true" v-bind:username="user.name">
        <li @click="toLogin()">注销</li>
        <li @click="toHome()">个人中心</li>  
    </music-nav>
    <ul class="nav nav-pills" role="tablist">
        <li role="presentation" v-bind:class="[tab=='CheckTab' ? 'active' : '', errorClass]" @click="tab='CheckTab'">
            <a href="javascript:;">加友事项</a>
        </li>
        <li role="presentation" v-bind:class="[tab=='AddTab' ? 'active' : '', errorClass]" @click="tab='AddTab'">
            <a href="javascript:;">添加好友</a>
        </li>
    </ul>
    <div v-if="tab=='CheckTab'" class="checkFriendList">
        <span v-if="friendRequests.length==0" class="text-danger">无</span>
        <ul v-if="friendRequests.length!=0" class="list-group">

            <li class="list-group-item" v-for="friendRequest in friendRequests">
                <p>发起人：<span class='fr'>{{friendRequest.origin.name}}</span></p>
                <p>接收人：<span class='fr'>{{friendRequest.target.name}}</span></p>
                <p>类型：
                    <span class='fr' v-if="friendRequest.origin.name==user.name">发起</span>
                    <span class='fr' v-if="friendRequest.target.name==user.name">接收</span>
                </p>
                <div class="row" v-if="friendRequest.target.name==user.name&&friendRequest.status==0">
                    <button class="btn btn-success col-xs-3 col-xs-offset-2" @click="replyFriendRequest(friendRequest._id, 1)">同意请求</button>
                    <button class="btn btn-danger col-xs-3 col-xs-offset-2" @click="replyFriendRequest(friendRequest._id, 2)">拒绝请求</button>
                </div>
                <p class="text-center text-success" v-if="friendRequest.status==1">已成功加友</p>
                <p class="text-center text-danger" v-if="friendRequest.status==2">已拒绝加友</p>
            </li>
        </ul>       
    </div>
    <div v-if="tab=='AddTab'" class="addChart">
        <div class="panel panel-primary">
            <div class="panel-heading">
                <h3 class="panel-title">查找好友姓名</h3>
            </div>
            <div class="panel-body">
                <input type="text" class="form-control" v-model="searchuser">
                <div class="row">
                    <button class="btn btn-primary search col-xs-6 col-xs-offset-3" @click="searchFriend()">查找</button>
                </div>
                <div v-if="emshow.show">
                    <p>姓名：<span class='fr'>{{result.name}}</span></p>
                    <p>兴趣：<span class='fr'>{{result.interest}}</span></p>
                    <div class="row">
                        <button class="btn btn-primary col-xs-6 col-xs-offset-3" @click="friendRequest()">发起请求</button>
                    </div>
                </div>
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

            tab : 'CheckTab', //CheckTab为信息列表，AddTab为加友页面
            id : "", 
            user : {}, 
            friendRequests : [], 
            searchuser : "", 
            result : {}, 
            emshow : {show: false}

        }
    },
    created() {
        this.id = localStorage.getItem("identity")
        if (this.id == null)
            this.$router.push({name:'login'})   

        this.$http.get('checkFriendRequest?id=' + this.id)
            .then(function (response) {
                if(response.data.result==='success'){
                    this.user = response.data.data.user
                    this.friendRequests = response.data.data.friendRequests
                } else {
                    alert(response.data.message)
                }
            }, function (err) {

            })  
    }, 
    methods:{
        searchFriend(){
            this.$http.get('searchFriend?username='+this.searchuser)
                .then(function (response) {
                    if(response.data.result==='success'){
                        this.result = response.data.data
                        this.emshow = {
                            show: true                 
                        }
                    } else {
                        alert(response.data.message)
                        this.emshow = {
                            show: false                 
                        }
                    }
                }, function (err) {

                })  
        }, 
        friendRequest(){
            let postData = {
               id : this.id,
               friendName : this.result.name
            }
            this.$http.post('addFriend', postData)
                .then(function (response) {
                    if(response.data.result==='success'){
                        alert("您的请求已经发送，等待对方确认！")
                        window.location.reload()
                    } else {
                        alert(response.data.message)
                    }
                }, function (err) {

                })    
        }, 
        replyFriendRequest(requestId, status){
            let postData = {
               requestId : requestId,
               status : status
            }
            this.$http.post('replyFriendRequest', postData)
                .then(function (response) {
                    if(response.data.result==='success'){
                        alert("您的回复已经发送！") 
                        window.location.reload()
                    } else {
                        alert(response.data.message)
                    }
                }, function (err) {

                }) 
        }, 
        toLogin(){
            localStorage.removeItem("identity")
            this.$router.push({name:'login'})  
        }, 
        toHome(){
            this.$router.push({name:'home'})  
        }
    }
}
</script>
<style scoped>
.nav-pills{
    padding-top: 20px; 
    margin-bottom: 10px; 
}

.checkFriendList .list-group-item p{
    line-height: 34px; 
    height: 34px; 
    font-size: 16px; 
}
.panel-body .search{
    margin-top: 10px;
    margin-bottom: 10px; 
}

.panel-body p{
    line-height: 34px; 
    height: 34px; 
    font-size: 16px; 
}
</style>