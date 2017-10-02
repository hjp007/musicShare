import React from 'react'
import {withRouter} from "react-router-dom"
import CSSModules from 'react-css-modules'
import styles from '../css/main.css'

import MusicNav from '../components/MusicNav/MusicNav.jsx'
class Main extends React.Component {
   	render() {
   		let mainButton = null
   		if(this.state.id)
   			mainButton = (
   				<button className="btn btn-primary col-xs-6 col-xs-offset-3" onClick={this.toHome.bind(this)}>
			        <span>点此进入首页</span>
			    </button>	
   			)
   		else
   			mainButton = (
          <div className="row">
            <button className="btn btn-primary col-xs-3 col-xs-offset-2" onClick={this.toLogin.bind(this)}>
              <span>点此登录</span>
            </button>
            <button className="btn btn-success col-xs-3 col-xs-offset-2" onClick={this.toApply.bind(this)}>
              <span>注册</span>
            </button>
          </div>
   			)

   		let status = null
   		if(this.state.id)
   			status = (
   				<li>已登录</li>
   			)
   		else
   			status = (
   				<li>未登录</li>
   			)


     	return (
    			<div className="container">
    				<MusicNav showName={false}>
    	     			{status}
    	     	</MusicNav>
            <img src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2550279230,467606093&fm=200&gp=0.jpg" className="img-responsive logo" alt="欢迎使用音乐分享平台"/>
            <img src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1952752745,2045652368&fm=15&gp=0.jpg" className="img-responsive version_logo"/>
            <h1 className="version_text">REACT版本</h1>        
            <p>电脑端使用时请用手机适配模式，目前平台只支持移动端</p>
            <p>这是一个音乐分享平台，实现音乐上传，在线播放，添加好友和给好友分享音乐的功能。</p>
            <p>项目逻辑不复杂，功能不多，本人做这个项目仅供学习，严禁任何人用于商业。</p>
            <p>希望能帮助大家学习框架API的使用，以及对不同框架的差别理解。</p>
    				{mainButton}
            <br></br>
            <p className="marginTop20">作者：星空下的凡尘</p>
            <p>邮箱：645566979@qq.com</p>
    			</div>
    	)
    }
    constructor(props) {
    	super(props)
    	this.state = {
            id : ""
    	}
  	}
  	componentDidMount(){
        this.setState({id : localStorage.getItem("identity")})
  	}
	toLogin(){
		this.props.history.push("/login")
	}
  toHome(){
    this.props.history.push("/home")
  }
  toApply(){
    this.props.history.push("/apply")
  }
}
export default CSSModules(withRouter(Main), styles)
