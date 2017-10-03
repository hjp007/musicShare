import React from 'react'
import {withRouter} from "react-router-dom"

import MusicNav from "../components/MusicNav/MusicNav.jsx"

import styles from '../css/checkFriendRequest.css'
import bus from '../bus'
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
      var resultUsers = this.state.resultUsers.map((user, index)=>(
          <div key={index} className="row container search">
              <p className="col-xs-7">姓名：{user.name}</p>
              <button className="btn btn-primary col-xs-4 col-offset-1" 
              onClick={this.friendRequest.bind(this, user)}>
                  发起请求
              </button>
          </div>
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
			                <h3 className="panel-title">查找好友姓名（最多同时显示5条）</h3>
			            </div>
			            <div className="panel-body">
                      <input type="text" className="form-control" placeholder="请输入查找人的名字"
                      value={this.state.searchuser} onChange={evt => this.updateSearchuser(evt)}/>
                      {this.state.resultUsers.length != 0 && this.state.searchingStatus != 'search' &&
                          resultUsers
                      }
                      {this.state.resultUsers.length == 0 && this.state.searchingStatus != 'search' &&
                          <p>{this.state.resultMessage}</p>
                      }
                      {this.state.searchingStatus == 'search' &&
                          <p>正在搜索中...</p>
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
            timer : null,
            resultUsers : [],   //成功时的数据
            resultMessage : "",  //失败时的信息
            searchingStatus : "before"   //4个状态 before search over 
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
                    bus.dispatch('alert', data.message)
                }
        	}
        ) 
  	}
    searchFriend(){
  		var _this = this
      if(this.state.searchuser===""){
          bus.dispatch('alert', "请填写名称！")
          return
      }
      if(this.state.searchuser===this.state.user.name){
          bus.dispatch('alert', "请不要写自己的名字！")
          return
      }
      $.get('searchFriend?username='+ this.state.searchuser,
      	(data)=>{
              if(data.result==='success'){
                  _this.setState({
                  	result : data.data, 
                  	emshow : {show:true}
                  })
              } else {
                  bus.dispatch('alert', data.message)
                  _this.setState({
                  	emshow : {show:false}
                  })
              }
      	}
      )
    } 
    updateSearchuser(evt){
      this.setState({
          searchuser: evt.target.value
      }, ()=>{
        this.dynamicSearch()
      })
    }
    dynamicSearch(){
      if(this.state.searchuser===""){
        this.setState({
          resultUsers : [],
          resultMessage : "请填写名称！"
        })
        clearTimeout(this.state.timer)
        return
      }
      clearTimeout(this.state.timer)
      var _this = this
      this.setState({
        timer : setTimeout(()=>{
          //正在搜索字样也不要立刻就展示,如果300毫秒内拿到结果了就不展示了
          _this.setState({searchingStatus : "before"})   
          setTimeout(()=>{
              if(_this.state.searchingStatus != "over")
                  _this.setState({searchingStatus : "search"})
          }, 300)
          //500毫秒后查找
          $.get('searchFriends?username=' + _this.state.searchuser + '&myname=' + _this.state.user.name)
              .then(function (data) {
                  _this.setState({searchingStatus : "over"})
                  if(data.result==='success'){
                    _this.setState({resultUsers: data.data})
                  } else {
                    _this.setState({
                      resultUsers : [], 
                      resultMessage : data.message
                    })
                  }
              })    
        },500)
      })
    }
    friendRequest(user){
        let postData = {
           id : this.state.id,
           friendName : user.name
        }
        $.post('addFriend', postData, 
        	(data)=>{
        		if(data.result==='success'){
                    bus.dispatch('alert', '您的请求已经发送，等待对方确认！', ()=>{
                      window.location.reload()
                    })
                } else {
                    bus.dispatch('alert', data.message)
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
                    bus.dispatch('alert', '您的回复已经发送！', ()=>{
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
export default withRouter(CheckFriendRequest)