export default {
	id : "",
	username : "",
	password : "", 
	interest : "", 
	user : {   //接口获取用户信息
        songs : [], 
        friends : []
    },  
    tab : "", //页面选择用  
    musicFlag : false,
    musicUrl : "",
    searchSong : "", 
    timer : null,
    resultSongs : [],   //成功时的数据
    resultMessage : "",  //失败时的信息
    searchingStatus : "before"   //4个状态 before search over 
}