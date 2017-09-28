import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'

import './css/style.css'

import Home from './views/home.jsx'
import Main from './views/main.jsx'
import Login from './views/login.jsx'
import CheckFriendRequest from './views/checkFriendRequest.jsx'
import CheckShareRequest from './views/checkShareRequest.jsx'

ReactDOM.render((
	<Router>
		<div>
    		<Route path="/main" component={Main}/>
    		<Route path="/home" component={Home}/>
   			<Route path="/login" component={Login}/>
   			<Route path="/checkFriendRequest" component={CheckFriendRequest}/>
   			<Route path="/checkShareRequest" component={CheckShareRequest}/>
		</div>
    </Router>
), document.getElementById('app'))