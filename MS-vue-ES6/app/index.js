import Vue from 'vue/dist/vue.min'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

Vue.use(VueRouter)
Vue.use(VueResource)

// 开启debug模式
Vue.config.debug = true



import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import './style.css'


import main from './views/main'
import login from './views/login'
import home from "./views/home"
import checkShareRequest from './views/checkShareRequest'
import checkFriendRequest from './views/checkFriendRequest'

const routes = [
  { path: '/',                   name:'main',              component: main }, 
  { path: '/login',              name:'login',             component: login }, 
  { path: '/checkFriendRequest', name:'checkFriendRequest',component: checkFriendRequest }, 
  { path: '/checkShareRequest',  name:"checkShareRequest", component : checkShareRequest }, 
  { path: '/home',               name:"home",              component: home }
]

const router = new VueRouter({
  routes 
}) 

const app = new Vue({
  router
}).$mount('#app')

