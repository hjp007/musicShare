import React from 'react'
import {withRouter} from "react-router-dom"

import MusicNav from "../components/MusicNav/MusicNav.jsx"

import styles from '../css/checkFriendRequest.css'
class CheckFriendRequest extends React.Component {
   	render() {
   		var checkFriendList = this.state.friendRequests.map((friendRequest, index)=>(
			<li key={index} className="list-group-item">
	            <p>发起人：<span className='fr'>{friendRequest.origin.name}</span></p>
	            <p>接收人：<span className='fr'>{friendRequest.target.name}</span></p>
	            <p>类型：
	            	{friendRequest.origin.name==this.state.user.name &&
	                	<span className='fr'>发起</span>
	            	}
	            	{friendRequest.origin.name!=this.state.user.name &&
	                	<span className='fr'>接收</span>
	            	}
	            </p>
	            {friendRequest.target.name==this.state.user.name && friendRequest.status==0 &&
     				<div className="row">
	      				<button className="btn btn-success col-xs-3 col-xs-offset-2" 
	     					onClick={this.replyFriendRequest.bind(this, friendRequest._id, 1)}>
	     					同意请求
	     				</button>
		                <button className="btn btn-danger col-xs-3 col-xs-offset-2"
		                	onClick={this.replyFriendRequest.bind(this, friendRequest._id, 2)}>
		                	拒绝请求
		                </button>    					
     				</div>
	            }
	            {friendRequest.status==1 &&
	            	<p className="text-center text-success">已成功加友</p>
	            }
	            {friendRequest.status==2 &&
		            <p className="text-center text-danger">已拒绝加友</p>
	            }
	        </li>	

   		))



   		let content = null
   		if(this.state.tab == 'CheckTab')
   			content = (
   				<div className="checkFriendList">
   					{this.state.friendRequests.length == 0 &&
			        	<span className="text-danger">无</span>
   					}
   					{this.state.friendRequests.length != 0 &&
				        <ul className="list-group">
				            {checkFriendList}
				        </ul> 
   					}
   				</div>
   			)
   		else if(this.state.tab == 'AddTab')
   			content = (
   				<div className="addChart">
			        <div className="panel panel-primary">
			            <div className="panel-heading">
			                <h3 className="panel-title">查找好友姓名</h3>
			            </div>
			            <div className="panel-body">
			                <input type="text" className="form-control" placeholder="请输入查找人的名字"
			                	value={this.state.searchuser} onChange={evt => this.updateSearchuser(evt)}/>
			                <div className="row">
			                    <button className="btn btn-primary search col-xs-6 col-xs-offset-3"
			                    	onClick={this.searchFriend.bind(this)}>
			                    	查找
			                    </button>
			                </div>
			                {this.state.emshow.show &&
				                <div>
				                    <p>姓名：<span className='fr'>{this.state.result.name}</span></p>
				                    <p>兴趣：<span className='fr'>{this.state.user.interest}</span></p>
				                    <div className="row">
				                        <button className="btn btn-primary col-xs-6 col-xs-offset-3"
				                        	onClick={this.friendRequest.bind(this)}>
				                        	发起请求
				                        </button>
				                    </div>
				                </div>
			                }
			            </div>
			        </div> 					
   				</div>
   			)

     	return (
			<div className="container checkFriendRequest">
			    <MusicNav showName={true} username={this.state.user.name}>
			        <li onClick={this.toLogin.bind(this)}>注销</li>
			        <li onClick={this.toHome.bind(this)}>个人中心</li>  
			    </MusicNav>
			    <ul className="nav nav-pills" role="tablist">
			        <li role="presentation" onClick={(evt)=>this.setState({tab:'CheckTab'})}
			        	className={this.state.tab === 'CheckTab'?'active':''}>
			            <a href="javascript:;">加友事项</a>
			        </li>
			        <li role="presentation" onClick={(evt)=>this.setState({tab:'AddTab'})}
			        	className={this.state.tab === 'AddTab'?'active':''}>
			            <a href="javascript:;">添加好友</a>
			        </li>
			    </ul>
			    {content}
			</div>
    	)
    }
    constructor(props) {
    	super(props)
    	this.state = {
            tab : 'CheckTab', //CheckTab为信息列表，AddTab为加友页面
            id : "",
            user : {}, 
            friendRequests : [], 
            searchuser : "", 
            result : {}, 
            emshow : {show: false}
    	}
  	}
  	componentDidMount(){
        let id = localStorage.getItem("identity")
        if (id == null)
            this.props.history.push("/login") 
        this.setState({id:id})

        var _this = this
        $.get('checkFriendRequest?id=' + id, 
        	(data)=>{
                if(data.result==='success'){
                	_this.setState({
                		user : data.data.user, 
                		friendRequests : data.data.friendRequests
                	})
                } else {
                    alert(data.message)
                }
        	}
        ) 
  	}
	searchFriend(){
		var _this = this
        $.get('searchFriend?username='+ this.state.searchuser,
        	(data)=>{
                if(data.result==='success'){
                    _this.setState({
                    	result : data.data, 
                    	emshow : {show:true}
                    })
                } else {
                    alert(data.message)
                    _this.setState({
                    	emshow : {show:false}
                    })
                }
        	}
        )
    } 
    friendRequest(){
        let postData = {
           id : this.state.id,
           friendName : this.state.result.name
        }
        $.post('addFriend', postData, 
        	(data)=>{
        		if(data.result==='success'){
                    alert("您的请求已经发送，等待对方确认！")
                    window.location.reload()
                } else {
                    alert(data.message)
                }
        	}
        )   
    } 
    replyFriendRequest(requestId, status){
        let postData = {
           requestId : requestId,
           status : status
        }
        $.post('replyFriendRequest', postData
        	,(data)=>{
                if(data.result==='success'){
                    alert("您的回复已经发送！") 
                    window.location.reload()
                } else {
                    alert(data.message)
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
    updateSearchuser(evt){
    	this.setState({
      		searchuser: evt.target.value
    	})
    }
}
export default withRouter(CheckFriendRequest)