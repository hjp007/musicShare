import React from 'react'
import {withRouter} from "react-router-dom"

import MusicNav from "../components/MusicNav/MusicNav.jsx"
import style from '../css/login.css'
class Login extends React.Component {
   	render() {
     	return (
          <div className="container login">
              <MusicNav showName={false}>
                  <li onClick={this.toMain.bind(this)}>返回首页</li>
              </MusicNav>
              <div className="panel panel-primary">
                  <div className="panel-heading">
                      <h3 className="panel-title">音乐分享平台</h3>
                  </div>
                  <div className="panel-body">
                      <div className="form-group">
                          <label>登录名</label>
                          <input type="text" className="form-control" placeholder="请输入登录名" 
                              value={this.state.username} onChange={evt => this.updateUsername(evt)}/>
                      </div>
                      <div className="form-group">
                          <label>密码</label>
                          <input type="password" className="form-control" placeholder="请输入密码"
                              value={this.state.password} onChange={evt => this.updatePassword(evt)}/>
                      </div>
                      <div className="row">
                          <button className="btn btn-primary col-xs-4 col-xs-offset-4" onClick={this.toHome.bind(this)}>登录</button>
                      </div>
                  </div>
              </div>
          </div>
    	)
    }
    constructor(props) {
    	super(props)
    	this.state = {
      		id: "", 
      		username : "",
      		password : ""
    	}
  	}

  	componentDidMount(){
    	this.state.id = localStorage.getItem("identity")
        if (this.state.id !== null){
            this.props.history.push("/home")      
        }
  	}
    toHome(){
        if (this.state.username==="") {
            alert("账号不能为空")
            return; 
        }
        else if (this.state.password==="") {
            alert("密码不能为空")
            return; 
        }
        let postData = {
            username : this.state.username, 
            password : this.state.password
        }
        var _this = this
        $.post("login", postData,
            function(data) {
    				    if(data.result==='success'){
                    localStorage.setItem("identity", data.data)
                    _this.props.history.push("/home")  
                } else {
                    alert(data.message)
                }
            }
        )
    }
    toMain(){
      this.props.history.push("/main")  
    }
    updateUsername(evt) {
    	this.setState({
      		username: evt.target.value
    	})
  	}
  	updatePassword(evt) {
    	this.setState({
      		password: evt.target.value
    	})
  	}

}
export default withRouter(Login)