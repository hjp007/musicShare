<template>
<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <span v-if="messageBox.type=='alert'">提示</span>
                <span v-if="messageBox.type=='confirm'">请确认</span>
            </div>
            <div class="modal-body">{{messageBox.message}}</div>
            <div class="modal-footer">
                <div class="row" v-if="messageBox.type=='alert'">
                    <button type="button" class="btn btn-default col-xs-4 col-xs-offset-4" data-dismiss="modal" @click="callback()">关闭</button>
                </div>
                <div class='row' v-if="messageBox.type=='confirm'">
                    <div class="col-xs-3 col-xs-offset-2">
                        <button type="button" class="btn btn-default" data-dismiss="modal" @click="callback()">确认</button>
                    </div>
                    <div class="col-xs-3 col-xs-offset-2">
                        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

</template>
<style scoped>

</style>
<script>
import bus from '@/bus'
import elephant from '@/elephant-ui'
import * as types from '../../mutation-types'
const store = {
    namespaced:true, 
    state : {
        messageBox : {
            type : '', 
            message : '', 
            callback : null
        }
    }, 
    mutations : {
        [types.SET_VALUE] (state, obj) {           //eg: commit("SET_VALUE", {user:xxx, id:xxx})
            for (var index in obj) { 
                state[index] = obj[index]
            }
        },
    },
}
//模块名称及局部数据
let moduleData = {
    mName : 'musicMessageBox', 
    store, 
}
//组件数据的配置项
let vuexSettings = {
    state : {
        self : ['messageBox']
    }, 
    mutations : {
        self : ['SET_VALUE']
    }
}
//vue组件配置项
let vueComponent = {
    name : 'musicMessageBox',
    mounted () {
        bus.$on("alert", function (message, callback) {
            this.SET_VALUE({
                messageBox : {
                    type : 'alert', 
                    message : message, 
                    callback : callback
                } 
            })
            $("#messageBox").modal()
        }.bind(this))
        bus.$on("confirm", function (message, callback) {
            this.SET_VALUE({
                messageBox : {
                    type : 'confirm', 
                    message : message, 
                    callback : callback
                } 
            })
            $("#messageBox").modal()
        }.bind(this))
    },
    methods: {
        callback(){
            if(this.messageBox.callback)
                this.messageBox.callback()
        }
    }
}
export default elephant.component(vueComponent, vuexSettings, moduleData)
</script>