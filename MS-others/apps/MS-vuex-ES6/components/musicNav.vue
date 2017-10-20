<template>
<nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>
        <span v-if="!showName" class="navbar-brand">音乐分享平台</span>
        <div v-if="showName" class="name">
            <span>{{username}}</span>，欢迎回来！
        </div>
    </div>
    <div class="collapse navbar-collapse" id="navbar">
        <ul class="nav navbar-nav">
            <slot></slot>
        </ul>
    </div>
</nav>
</template>
<style scoped>
.name{
    color:white;
    font-size: 20px;
    line-height: 50px; 
    height: 50px; 
    padding:0 5%;
}
.name span{
    color:red!important;
}
.navbar-nav {
    color:white;
}
@media (max-width: 767px){
    .navbar-nav > li {
        font-size: 20px;
        line-height: 50px;
        height: 50px;
        margin:0 5%;
    }   
}

@media (min-width: 768px) {
    .navbar-nav{
        float: right;
    }
    .navbar-header{
        min-width: 200px;
    }
    .navbar-nav > li {
        cursor : pointer;
        margin-right: 20px; 
        padding-top: 15px;
        padding-bottom: 15px;
    }
}
</style>
<script>
export default {
    name : 'musicNav',
    props : {
        showName : { 
            type : Boolean
        }, 
        username : {
            type : String, 
            default : ""
        }
    },
    data:function(){
        return {

        }
    },
    methods: {
    }
}

  
</script>