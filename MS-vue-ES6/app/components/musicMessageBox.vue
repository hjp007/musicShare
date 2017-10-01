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
import bus from '../bus'
export default {
    name : 'musicMessageBox',
    props : {
    },
    data () {
        return {
            messageBox : {
                type : '', 
                message : '', 
                callback : null
            }
        }
    },
    mounted () {
        bus.$on("alert", function (message, callback) {
            this.messageBox = {
                type : 'alert', 
                message : message, 
                callback : callback
            }
            $("#messageBox").modal()
        }.bind(this))
        bus.$on("confirm", function (message, callback) {
            this.messageBox = {
                type : 'confirm', 
                message : message, 
                callback : callback
            }
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
</script>