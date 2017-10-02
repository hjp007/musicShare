import React from 'react'
import {withRouter} from "react-router-dom"

import MusicNav from "../components/MusicNav/MusicNav.jsx"
import style from '../css/apply.css'
import bus from '../bus'
class Apply extends React.Component {
   	render() {
     	return (
          <div className="container apply">
              <MusicNav showName={false}>
                  <li onClick={this.toMain.bind(this)}>返回首页</li>
                  <li onClick={this.toLogin.bind(this)}>返回登录页</li>
              </MusicNav>
              <div className="panel panel-primary">
                  <div className="panel-heading">
                      <h3 className="panel-title">注册账号</h3>
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
                      <div className="form-group">
                          <label>兴趣</label>
                          <input type="text" className="form-control" placeholder="请输入兴趣"
                              value={this.state.interest} onChange={evt => this.updateInterest(evt)}/>
                      </div>
                      <div className="row">
                          <button className="btn btn-primary col-xs-4 col-xs-offset-4" onClick={this.applyAccount.bind(this)}>注册账号</button>
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
      		password : "", 
          interest : ""
    	}
  	}

  	componentDidMount(){
    	this.state.id = localStorage.getItem("identity")
        if (this.state.id !== null){
            this.props.history.push("/home")      
        }
  	}
    applyAccount(){
        if (this.state.username==="") {
            bus.dispatch('alert', "账号不能为空")
            return 
        }
        if (this.state.password==="") {
            bus.dispatch('alert', "密码不能为空")
            alert("密码不能为空")
            return 
        }
        if (this.state.interest==="") {
            bus.dispatch('alert', "兴趣不能为空")
            return
        }
        let postData = {
            username : this.state.username, 
            password : this.state.password, 
            interest : this.state.interest
        }
        var _this = this
        bus.dispatch('confirm', "确认创建用户" + this.state.username + "吗？", ()=>{
          $.post("apply", postData,
              function(data) {
      				    if(data.result==='success'){
                      localStorage.setItem("identity", data.data)
                      _this.props.history.push("/home")  
                  } else {
                      setTimeout(()=>{
                        bus.dispatch('alert', data.message)
                      },1000)
                  }
              }
          )
        })
    }
    toMain(){
      this.props.history.push("/main")  
    }    
    toLogin(){
      this.props.history.push("/login")  
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
    updateInterest(evt) {
      this.setState({
          interest: evt.target.value
      })
    }

}
export default withRouter(Apply)