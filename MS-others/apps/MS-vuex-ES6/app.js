import 'babel-polyfill'
import Loading from './loading-common-js'
var loadingInterval = Loading()

import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

Vue.use(VueRouter)
Vue.use(VueResource)

import store from "./store"
// 开启debug模式
Vue.config.debug = true



import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import './style.css'


import main from './views/main/index'
import login from './views/login/index'
import apply from './views/apply/index'
import home from "./views/home/index"
import checkShareRequest from './views/checkShareRequest/index'
import checkFriendRequest from './views/checkFriendRequest/index'

const routes = [
  { path: '/',                   name:'main',              component: main }, 
  { path: '/login',              name:'login',             component: login }, 
  { path: '/checkFriendRequest', name:'checkFriendRequest',component: checkFriendRequest }, 
  { path: '/checkShareRequest',  name:"checkShareRequest", component : checkShareRequest }, 
  { path: '/home',               name:"home",              component: home },
  { path: '/apply',              name:"apply",             component: apply }
]

const router = new VueRouter({
  routes 
}) 
import musicMessageBox from './components/musicMessageBox'  //全局组件
const app = new Vue({
  store, 
  router,
	components : {
		musicMessageBox
	},
  created(){
    window.clearInterval(loadingInterval)
    $('#c').hide()
  }
}).$mount('#app')

