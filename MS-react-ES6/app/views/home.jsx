import React from 'react'
import {withRouter} from "react-router-dom"

import MusicNav from "../components/MusicNav/MusicNav.jsx"
import MusicUploader from "../components/MusicUploader/MusicUploader.jsx"

import styles from '../css/home.css'
import bus from '../bus'
class Home extends React.Component {
   	render() {

   		var songList = this.state.user.songs.map((song, index)=>(
			<li key={index} className="list-group-item row">
	            <div className="col-xs-8">
	                <span>{song.name}</span>
	            </div>
	            <div className="col-xs-4">
	                <button className="btn btn-success fr"
	                	onClick={this.download.bind(this, song.url)}>
	                	收听
	                </button>
	            </div>
		    </li>
   		))

   		var friendList = this.state.user.friends.map((friend, index) =>(
		    <li key={index} className="list-group-item row">
                <div className="col-xs-6">
                    <span>{friend.name}</span>
                </div>
                <div className="col-xs-6">
                    <span className="fr">兴趣：{friend.interest}</span>
                </div>
		    </li>
   		))

   		var content = null
   		switch(this.state.tab){
   			case 'SongTab':
   			content = (
   				<div className="songList">
   					{this.state.user.songs.length==0 &&
						<span className="text-danger">无</span>
   					}
   					{this.state.user.songs.length!=0 &&
						<ul className="list-group">
   							{songList}
					  	</ul>
   					}
				</div>	
   			)
   			break;
   			case 'FriendTab':
   			content = (
   				<div className="friendList">
   					{this.state.user.friends.length==0 &&
						<span className="text-danger">无</span>
   					}
   					{this.state.user.friends.length!=0 &&
						<ul className="list-group">
   							{friendList}
					  	</ul>
   					}
				</div>	
   			)
   			break;
   			case 'UploadTab':
   			content = (
			    <div className="uploadPage">
			        <MusicUploader userid={this.state.id}></MusicUploader>
			    </div>
   			)
   			break;
   			default:
   			;
   		}
   		return (
			<div className="container home">
			    <MusicNav showName={true} username={this.state.user.name}>
			        <li onClick={this.toLogin.bind(this)}>注销</li>
			        <li onClick={this.toCheckFriendRequest.bind(this)}>加友管理</li>
			        <li onClick={this.toCheckShareRequest.bind(this)}>音乐分享</li>    
			    </MusicNav>
				<ul className="nav nav-pills" id="container" role="tablist">
			  		<li role="presentation" onClick={(evt)=>this.setState({tab:'SongTab'})} 
			  			className={this.state.tab === 'SongTab'?'active':''}>
			    		<a href="javascript:;">音乐列表</a>
			  		</li>
			  		<li role="presentation" onClick={(evt)=>this.setState({tab:'FriendTab'})} 
			  			className={this.state.tab === 'FriendTab'?'active':''}>
			    		<a href="javascript:;">好友列表</a>
			  		</li>
			        <li role="presentation" onClick={(evt)=>this.setState({tab:'UploadTab'})} 
			  			className={this.state.tab === 'UploadTab'?'active':''}>
			            <a href="javascript:;">音乐上传</a>
			        </li>
				</ul>
				{content}
        {this.state.musicFlag && 
          <div className="audioDiv">
              <audio controls autoPlay src={this.state.musicUrl}>
              </audio>        
          </div>
        }

			</div>
   		)
    }
    constructor(props) {
    	super(props)
    	this.state = {
    		tab : "SongTab", 
            id : "",
            user : {
            	songs : [], 
            	friends : []
            },
            musicFlag : false, 
            musicUrl : ""
    	}
  	}
  	componentDidMount(){
  		let id = localStorage.getItem("identity")
        if (id == null){
            this.props.history.push("/login")   
            return   
        }
        this.setState({id : id})

        var _this = this
        $.get('user?id=' + id, 
        	function(data){
                if(data.result==='success'){
                    _this.setState({user : data.data})
                } else {
                    bus.dispatch('alert', data.message)
                }    		
        	}
        )
  	}
    download(url){
      this.setState({
        musicFlag : true, 
        musicUrl : url
      })
    }
  	toLogin(){
        localStorage.removeItem("identity")
        this.props.history.push("/login")
    }
    toCheckFriendRequest(){
        this.props.history.push("/checkFriendRequest")
    }
    toCheckShareRequest(){
        this.props.history.push("/checkShareRequest")
    }
}
export default withRouter(Home)