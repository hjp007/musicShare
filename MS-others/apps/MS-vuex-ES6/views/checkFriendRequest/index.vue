<template>
<div class="container checkFriendRequest">
    <music-nav v-bind:showName="true" v-bind:username="user.name">
        <li @click="toLogin()">注销</li>
        <li @click="toHome()">个人中心</li>  
    </music-nav>
    <ul class="nav nav-pills" role="tablist">
        <li role="presentation" v-bind:class="[tab=='CheckTab' ? 'active' : '']" @click="changeTab('CheckTab')">
            <a href="javascript:;">加友事项</a>
        </li>
        <li role="presentation" v-bind:class="[tab=='AddTab' ? 'active' : '']" @click="changeTab('AddTab')">
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
                <input type="text" class="form-control" :value="searchuser" @input="dynamicSearch">
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
import musicNav from '../../components/musicNav'
import store from './store'
import elephant from '../../elephant-ui'
//模块名称及局部数据
let moduleData = {
    mName : 'checkFriendRequest', 
    store, 
}
//组件数据的配置项
let vuexSettings = {
    state : {
        self : ['tab', 'user', 'searchuser', 'friendRequests', 'result', 'timer', 'resultUsers', 'resultMessage', 'searchingStatus'], 
        global : ['id']
    }, 
    mutations : {
        self : ['SET_VALUE'], 
        global : ['INIT_ID']
    }, 
    actions : {
        self : ['API_CHECK_FRIEND_REQUEST', 'API_SEARCH_FRIENDS', 'FRIEND_REQUEST', 'REPLY_FRIEND_REQUEST']
    }
}
//vue组件配置项
let vueComponent = {
    components : {
        musicNav
    },
    created() {
        this.INIT_ID()
        if (this.id == null)
            this.$router.push({name:'login'})   
        this.API_CHECK_FRIEND_REQUEST()
    },
    methods:{
        changeTab(newTab){
            this.SET_VALUE({tab:newTab})
        }, 
        dynamicSearch(e){
            this.SET_VALUE({ searchuser : e.target.value})
            this.API_SEARCH_FRIENDS()
        }, 
        friendRequest(user){
            this.API_FRIEND_REQUEST({ user : user })
        }, 
        replyFriendRequest(requestId, status){
            this.API_REPLY_FRIEND_REQUEST({
                requestId : requestId, 
                status : status
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
export default elephant.component(vueComponent, vuexSettings, moduleData)
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