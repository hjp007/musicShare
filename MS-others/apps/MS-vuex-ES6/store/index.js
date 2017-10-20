import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import mutations from './mutations'
import actions from './actions'
import state from './state'
import getters from './getters'

export default new Vuex.Store({
	actions, 
	state, 
	getters, 
	mutations 
})