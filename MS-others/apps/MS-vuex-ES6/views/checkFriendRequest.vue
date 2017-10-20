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
                <h3 class="panel-title">查找好友姓名（最多同时显示5条）</h3>
            </div>
            <div class="panel-body">
                <input type="text" class="form-control" v-model="searchuser">
                <div v-if="resultUsers.length != 0 && searchingStatus != 'search'"
                    v-for="user in resultUsers" class="search">
                    <div class="row container">
                        <p class="col-xs-7">姓名：{{user.name}}</p>
                        <button class="btn btn-primary col-xs-4 col-offset-1" @click="friendRequest(user)">发起请求</button>
                    </div>
                </div>
                <div v-if="resultUsers.length == 0 && searchingStatus != 'search'">
                    <p>{{resultMessage}}</p>
                </div>              
                <div v-if="searchingStatus == 'search'">
                    <p>正在搜索中...</p>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import musicNav from '../components/musicNav'
import bus from '../bus'
export default {
    components : {
        musicNav
    },
    data () {
        return {
            tab : 'CheckTab', //CheckTab为信息列表，AddTab为加友页面
            user : {}, 
            friendRequests : [], 
            searchuser : "", 
            result : {},
            timer : null,
            resultUsers : [],   //成功时的数据
            resultMessage : "",  //失败时的信息
            searchingStatus : "before"   //4个状态 before search over 
        }
    },
    computed: {
        ...mapGetters({
          id: 'id',
        })
    },
    created() {
        this.$store.commit('setId', {
            id : localStorage.getItem("identity")
        })
        if (this.id == null)
            this.$router.push({name:'login'})   

        this.$http.get('checkFriendRequest?id=' + this.id)
            .then(function (response) {
                if(response.data.result==='success'){
                    this.user = response.data.data.user
                    this.friendRequests = response.data.data.friendRequests
                } else {
                    bus.$emit('alert', response.data.message)
                }
            }, function (err) {

            })  
    },
    watch:{
        searchuser:"dynamicSearch"
    }, 
    methods:{
        dynamicSearch(){
            if(this.searchuser===""){
                this.resultUsers = []
                this.resultMessage = "请填写名称！"
                clearTimeout(this.timer)
                return
            }
            clearTimeout(this.timer)
            var _this = this
            this.timer = setTimeout(()=>{
                //正在搜索字样也不要立刻就展示,如果300毫秒内拿到结果了就不展示了
                _this.searchingStatus = "before";   
                setTimeout(()=>{
                    if(_this.searchingStatus != "over")
                        _this.searchingStatus = "search"
                }, 300)
                //500毫秒后查找
                _this.$http.get('searchFriends?username=' + _this.searchuser + '&myname=' + _this.user.name)
                    .then(function (response) {
                        _this.searchingStatus = "over"
                        if(response.data.result==='success'){
                            _this.resultUsers = response.data.data
                        } else {
                            _this.resultUsers = []
                            _this.resultMessage = response.data.message
                        }
                    })    
            },500)
        }, 
        friendRequest(user){
            let postData = {
               id : this.id,
               friendName : user.name
            }
            this.$http.post('addFriend', postData)
                .then(function (response) {
                    if(response.data.result==='success'){
                        bus.$emit('alert', "您的请求已经发送，等待对方确认！", ()=>{
                            window.location.reload()
                        })
                    } else {
                        bus.$emit('alert', response.data.message)
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
                        bus.$emit('alert', "您的回复已经发送！", ()=>{
                            window.location.reload()
                        })
                    } else {
                        bus.$emit('alert', response.data.message)
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