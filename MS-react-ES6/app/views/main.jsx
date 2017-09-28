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
   				<button className="btn btn-primary col-xs-6 col-xs-offset-3" onClick={this.toHome.bind(this)} >
			        <span>点此进入首页</span>
			    </button>	
   			)
   		else
   			mainButton = (
   				<button className="btn btn-primary col-xs-6 col-xs-offset-3" onClick={this.toLogin.bind(this)} >
			        <span>点此登录</span>
			    </button>
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
    				<img src="http://www.cio.com.cn/source/attachments/image/20150810/20150810105138_30376.jpg" className="img-responsive" alt="欢迎使用音乐分享平台"/>
    				{mainButton}
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
}
export default CSSModules(withRouter(Main), styles)
