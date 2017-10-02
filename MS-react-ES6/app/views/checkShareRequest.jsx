import React from 'react'
import {withRouter} from "react-router-dom"

import MusicNav from "../components/MusicNav/MusicNav.jsx"
import MusicModal from "../components/MusicModal/MusicModal.jsx"

import styles from '../css/checkShareRequest.css'
import bus from '../bus'
class CheckShareRequest extends React.Component {
   	render() {
   		let checkShareList = this.state.shareRequests.map((shareRequest, index)=>(
			<li key={index} className="list-group-item">
			    <div className="row">
                    <span className="col-xs-4">歌曲名称：</span>
                    <span className="col-xs-8 text-right">{shareRequest.song.name}</span>
                </div>
                <div className="row">
                    <span className="col-xs-4">发起人：</span>
                    <span className="col-xs-8 text-right">{shareRequest.owner.name}</span>
                </div>
                <div className="row">
                    <span className="col-xs-4">接收人：</span>
                    <span className="col-xs-8 text-right">{shareRequest.target.name}</span>
                </div>
                <div className="row">
                    <span className="col-xs-4">类型：</span>
                    {shareRequest.owner.name==this.state.user.name &&
                    	<span className="col-xs-8 text-right">发起</span>
	            	}
	            	{shareRequest.target.name==this.state.user.name &&
                    	<span className="col-xs-8 text-right">接收</span>
	            	}
                </div>
	            {shareRequest.target.name==this.state.user.name && shareRequest.status==0 &&
		            <div className="row">
		                <button className="btn btn-success col-xs-3 col-xs-offset-2"
		                	onClick={this.replyShareRequest.bind(this, shareRequest._id, 1)}>
		                	同意请求
		                </button>
		                <button className="btn btn-danger col-xs-3 col-xs-offset-2"
		                	onClick={this.replyShareRequest.bind(this, shareRequest._id, 2)}>
		                	拒绝请求
		                </button>
		            </div>
	            }
	            {shareRequest.status==1 &&
	            	<p className="text-center text-success">已成功操作</p>
	            }
	            {shareRequest.status==2 &&
	            	<p className="text-center text-danger">已拒绝操作</p>
	            }
	        </li>
   		))

   		let friendList = this.state.user.friends.map((friend, index)=>(
            <tr key={index}>
                <th>{friend.name}</th>
                <th>
                    <button type="button" className="btn btn-primary"
                    	onClick={this.selectFriend.bind(this, friend)}>  
                        选择
                    </button>
                </th>
            </tr>
   		))


   		let songList = this.state.user.songs.map((song, index)=>(
		    <tr key={index}>
	            <th>{song.name}</th>
	            <th>
	                <button type="button" className="btn btn-primary"
	                	onClick={this.selectSong.bind(this, song)} data-dismiss="modal"> 
	                    选择并确定
	                </button>
	            </th>
	        </tr>
   		))

     	return (
			<div className="container checkShareRequest">
			    <MusicNav showName={true} username={this.state.user.name}>
			        <li onClick={this.toLogin.bind(this)}>注销</li>
			        <li onClick={this.toHome.bind(this)}>个人中心</li>  
			    </MusicNav>
			    <ul className="nav nav-pills" role="tablist">
			        <li role="presentation" className="active">
			            <a href="javascript:;">分享事项</a>
			        </li>
			        <button className='btn btn-success pull-right'
			        	data-toggle="modal" data-target="#myModal">
			        	点击创建分享
			        </button>
			    </ul>
			    <div className="checkShareList">
			    	{this.state.shareRequests.length == 0 &&
			        	<span className="text-danger">无</span>
			    	}
			    	{this.state.shareRequests.length != 0 &&
			        	<ul className="list-group">
			            	{checkShareList}
			        	</ul>       
			    	}
			    </div>
			    <MusicModal id="myModal">
		    		<div key="title">
		            	<button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.resetStatus.bind(this)}>
		                	<span aria-hidden="true">&times;</span>
		            	</button>
		            	{this.state.shareOperationStatus==0 &&
		            		<h4 className="modal-title" id="myModalLabel">选择好友</h4>
		            	}
		            	{this.state.shareOperationStatus==1 &&
		            		<h4 className="modal-title" id="myModalLabel">选择歌曲</h4>
		            	}
		        	</div>	
			        <div key="body">
			        	{this.state.shareOperationStatus==0 &&
				            <table className="table">
				                <thead>
				                    <tr>
				                        <th>姓名</th>
				                        <th>操作</th>
				                    </tr>
				                </thead>
				                <tbody>
				                	{friendList}
				                </tbody>
				            </table>
			        	}
			        	{this.state.shareOperationStatus==1 &&
				            <table className="table">
				                <thead>
				                    <tr>
				                        <th>歌曲名</th>
				                        <th>操作</th>
				                    </tr>
				                </thead>
				                <tbody>
				                	{songList}
				                </tbody>
				            </table>
			        	}
			        </div>
			    	<div key="footer">
			            <button type="button" className="btn btn-default"
			            	data-dismiss="modal" onClick={this.resetStatus.bind(this)}>
			            	关闭
			            </button>
			    	</div>
			    </MusicModal>

			</div> 
    	)
    }
        constructor(props) {
    	super(props)
    	this.state = {
            user : {
            	songs : [], 
            	friends : []
            }, 
            shareRequests : [], 
            shareOperationStatus : 0, 
            friendName : ""
    	}
  	}
  	componentDidMount(){
        let id = localStorage.getItem("identity")
        if (id == null)
            this.props.history.push("/login") 
        this.setState({id:id})

        var _this = this
        $.get('checkshareRequest?id=' + id, 
        	(data)=>{
                if(data.result==='success'){
                	_this.setState({
                		user : data.data.user, 
                		shareRequests : data.data.shareRequests
                	})
                } else {
                    bus.dispatch('alert', data.message)
                }
        	}
        ) 
  	}
	selectFriend(friend){
        this.setState({
        	shareOperationStatus : 1, 
        	friendName : friend.name
        })
    }
    selectSong(song){
        this.setState({shareOperationStatus : 0})
        if(this.state.friendName == ""){
        	bus.dispatch('alert', "未知错误！")
            return
        }
        var _this = this
        let postData = {
            id : _this.state.id, 
            friendName : _this.state.friendName, 
            songId : song._id
        } 
        $.post('addShare', postData, 
        	(data)=>{
                if(data.result==='success'){
                	bus.dispatch('alert', "分享已经发送！", ()=>{
                    	window.location.reload()
                	})
                } else {
                    bus.dispatch('alert', data.message)
                }
        	}
        )
    }
    resetStatus(){
        this.setState({shareOperationStatus : 0})
    }
    replyShareRequest(requestId, status){
        let postData = {
           requestId : requestId,
           status : status
        }  
        $.post('replyShareRequest', postData, 
        	(data)=>{
                if(data.result==='success'){
                	bus.dispatch('alert', "您的回复已经发送！歌曲会出现在您列表里！", ()=>{
                    	window.location.reload()
                	})
                } else {
                    bus.dispatch('alert', data.message)
                }
        	}
        )   
    }
    toLogin(){
        localStorage.removeItem("identity")
    	this.props.history.push("/login")  
    } 
    toHome(){
    	this.props.history.push("/home")  
    }
}
export default withRouter(CheckShareRequest)