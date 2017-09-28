import React from 'react'
import CSSModules from 'react-css-modules'
import styles from "./MusicNav.css"
const MusicNav = (props) => {
  	let title = null
  	if(props.showName)
  		title = (
  			<div className="name">
		        <span>{props.username}</span>，欢迎回来！
		    </div>
  		)
  	else
  		title = (
  			<span className="navbar-brand">音乐分享平台</span>
  		)

	return (
		<nav className="navbar navbar-inverse navbar-fixed-top">
		    <div className="navbar-header">
		        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false">
		            <span className="sr-only">Toggle navigation</span>
		            <span className="icon-bar"></span>
		            <span className="icon-bar"></span>
		            <span className="icon-bar"></span>
		        </button>
		        {title}
		    </div>
		    <div className="collapse navbar-collapse" id="navbar">
		        <ul className="nav navbar-nav">
		            {props.children}
		        </ul>
		    </div>
		</nav>
	)
}

export default CSSModules(MusicNav, styles)