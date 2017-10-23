import * as types from '../mutation-types'
//根级别mutations
export default {
  	[types.INIT_ID](state){
		state.id = localStorage.getItem("identity")
	}, 
}