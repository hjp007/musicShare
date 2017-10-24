import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import mutations from './mutations'
import actions from './actions'
import state from './state'
import createLogger from '../../../lib/vuex-logger'

const debug = process.env.NODE_ENV !== 'production'
//根级别store
export default new Vuex.Store({
	actions, 
	state, 
	mutations, 
  	strict: debug,
  	plugins: debug ? [createLogger()] : []
})
