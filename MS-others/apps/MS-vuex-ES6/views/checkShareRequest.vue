<template>
<div class="container checkShareRequest">
    <music-nav v-bind:showName="true" v-bind:username="user.name">
        <li @click="toLogin()">注销</li>
        <li @click="toHome()">个人中心</li>  
    </music-nav>
    <ul class="nav nav-pills" role="tablist">
        <li role="presentation" class="active">
            <a href="javascript:;">分享事项</a>
        </li>
        <button class='btn btn-success pull-right' data-toggle="modal" data-target="#myModal">点击创建分享</button>
    </ul>
    <div class="checkShareList">
        <span v-if="shareRequests.length==0" class="text-danger">无</span>
        <ul v-if="shareRequests.length!=0" class="list-group">
            <li class="list-group-item" v-for="shareRequest in shareRequests">
                <div class="row">
                    <span class="col-xs-4">歌曲名称：</span>
                    <span class="col-xs-8 text-right">{{shareRequest.song.name}}</span>
                </div>
                <div class="row">
                    <span class="col-xs-4">发起人：</span>
                    <span class="col-xs-8 text-right">{{shareRequest.owner.name}}</span>
                </div>
                <div class="row">
                    <span class="col-xs-4">接收人：</span>
                    <span class="col-xs-8 text-right">{{shareRequest.target.name}}</span>
                </div>
                <div class="row">
                    <span class="col-xs-4">类型：</span>
                    <span class="col-xs-8 text-right" v-if="shareRequest.owner.name==user.name">发起</span>
                    <span class="col-xs-8 text-right" v-if="shareRequest.target.name==user.name">接收</span>
                </div>
                <div class="row" v-if="shareRequest.target.name==user.name&&shareRequest.status==0">
                    <button class="btn btn-success col-xs-3 col-xs-offset-2" @click="replyShareRequest(shareRequest._id, 1)">同意请求</button>
                    <button class="btn btn-danger col-xs-3 col-xs-offset-2" @click="replyShareRequest(shareRequest._id, 2)">拒绝请求</button>
                </div>
                <p class="text-center text-success" v-if="shareRequest.status==1">已成功操作</p>
                <p class="text-center text-danger" v-if="shareRequest.status==2">已拒绝操作</p>
            </li>
        </ul>       
    </div>
    <!-- Modal -->
    <music-modal id="myModal">
        <div slot="title">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="resetStatus()">
                <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title" id="myModalLabel" v-if="shareOperationStatus==0">选择好友</h4>
            <h4 class="modal-title" id="myModalLabel" v-if="shareOperationStatus==1">选择歌曲</h4>
        </div>
        <div slot="body">
            <table class="table" v-if="shareOperationStatus==0">
                <thead>
                    <tr>
                        <th>姓名</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="friend in user.friends">
                        <th>{{friend.name}}</th>
                        <th>
                            <button type="button" class="btn btn-primary" @click.stop="selectFriend(friend)">  
                                选择
                            </button>
                        </th>
                    </tr>
                </tbody>
            </table>
            <table class="table" v-if="shareOperationStatus==1">
                <thead>
                    <tr>
                        <th>歌曲名</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="song in user.songs">
                        <th>{{song.name}}</th>
                        <th>
                            <button type="button" class="btn btn-primary" @click="selectSong(song)" data-dismiss="modal"> 
                                选择并确定
                            </button>
                        </th>
                    </tr>
                </tbody>
            </table>
        </div>
        <div slot="footer">
            <button type="button" class="btn btn-default" data-dismiss="modal" @click="resetStatus()">关闭</button>
        </div>
    </music-modal>
</div>  
</template>
<script>
import { mapGetters } from 'vuex'
import musicNav from '../components/musicNav'
import musicModal from '../components/musicModal'
import bus from '../bus'
export default {
    components : {
        musicNav, 
        musicModal
    },
    data () {
        return {
            user : {}, 
            shareRequests : [], 
            shareOperationStatus : 0, 
            friendName : ""
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

        this.$http.get('checkshareRequest?id=' + this.id)
            .then(function (response) {
                if(response.data.result==='success'){
                    this.user = response.data.data.user
                    this.shareRequests = response.data.data.shareRequests
                } else {
                    bus.$emit('alert', response.data.message)
                }
            }, function (err) {

            })  
    }, 
    methods:{
        selectFriend(friend){
            this.shareOperationStatus = 1
            this.friendName = friend.name
        },
        selectSong(song){
            this.shareOperationStatus = 0
            if(this.friendName == ""){
                bus.$emit('alert', "未知错误！")
                return
            }
            let postData = {
                id : this.id, 
                friendName : this.friendName, 
                songId : song._id
            } 
            this.$http.post('addShare', postData)
                .then(function (response) {
                    if(response.data.result==='success'){
                        bus.$emit('alert', "分享已经发送！", ()=>{
                            window.location.reload()
                        })
                    } else {
                        bus.$emit('alert', response.data.message)
                    }
                }, function (err) {

                }) 
        },
        resetStatus(){
            this.shareOperationStatus = 0
        },
        replyShareRequest(requestId, status){
            let postData = {
               requestId : requestId,
               status : status
            }  
            this.$http.post('replyShareRequest', postData)
                .then(function (response) {
                    if(response.data.result==='success'){
                        bus.$emit('alert', "您的回复已经发送！歌曲会出现在您列表里！", ()=>{
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

.checkShareList .list-group-item p{
    line-height: 34px; 
    height: 34px; 
    font-size: 16px; 
}
</style>