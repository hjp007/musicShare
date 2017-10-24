import Vue from 'vue'
import VueResource from 'vue-resource'

import bus from './bus'

import {
	mapState, 
	mapActions,
	mapMutations, 
	mapGetters
} from 'vuex'

const elephant = {}
//http模块
Vue.use(VueResource)
Vue.http.options.emulateJSON = true
elephant.http=Vue.http
//bus模块
elephant.bus = bus
//component
const _toString = Object.prototype.toString

elephant.isObject = (val) => 
	val !== null && typeof val === 'object'

elephant.isPlainObject = (val) => 
	_toString.call(val) === '[object Object]'

elephant.isString = (val) => 
	typeof val === 'string'

/**
 * store数据的通用map方法
 * @param mName 当前视图的store模块名称
 * @param mapData 需要关联映射的字段map
 * @param type 映射的类型，包括state、action、getter、和mutation
 * @return {*} 返回映射后的结果
*/
const mapExt = (mName, mapData, type) => {
	if(!mapData) 
		return {}
	let methodMap = {
		state : mapState, 
		action : mapActions, 
		mutation: mapMutations, 
		getter: mapGetters 
	}
	if(Array.isArray(mapData)){
		//如果是数组类型，那么直接调用map方法
		return mName?methodMap[type](mName, mapData) : methodMap[type](mapData)
	} else if (elephant.isObject(mapData)) {
		let simpleImport = false
		let ret = {}
		for(let key of Object.keys(mapData)){
			if(elephant.isString(mapData[key])){
				simpleImport = true
				break
			} else {
				if((key === 'self' && !mName) || key === 'global') {
					//如果是当前自己的store环境且没有模块名称，那么被当做是全局模式
					//全局模式下，直接从全局store获取
					ret = {
						...ret, 
						...methodMap[type](mapData[key])
					}
				} else {
					//如果非全局模式，需要先定位到store模块
					ret = {
						...ret, 
						...methodMap[type]((key === 'self' ? mName : key), mapData[key])
					}
				}
			}
		}
		if(simpleImport) {
			//如果只是改变字段映射方式，那么直接调用map方法
			return mName? methodMap[type](mName, mapData) : methodMap[type](mapData)
		}
		return ret
	}
}

/**
 * 创建UI组件对象
 * @param option UI组件对象的配置项
 * @param fieldMap 需要从store中映射过来的字段名，包括state、actions、mutations、getters四个部分
 * @param state 组件关联的数据状态
 * @param
*/
elephant.component = (option, fieldMap, state) => {
	option = option || {}
	let comInstance = {
		...option
	}
	if(state) {
		let { mName, store } = state 
		let { beforeCreate, destoryed } = option 
		comInstance.beforeCreate = function(){
			this.$store.registerModule(mName, store) 
			beforeCreate && beforeCreate.call(this)
		}
		comInstance.destoryed = function(){
			this.$store.unregisterModule(mName) 
			destoryed && destoryed.call(this)
		}
		if(fieldMap) {
			comInstance.computed = {
				...mapExt(mName, fieldMap.state, 'state'), 
				...mapExt(mName, fieldMap.getters, 'getter'), 
				...option.computed
			}
			comInstance.methods = {
				...mapExt(mName, fieldMap.actions, 'action'), 
				...mapExt(mName, fieldMap.mutations, 'mutation'), 
				...option.methods
			}
		}
	} else {
		if(fieldMap) {
			comInstance.computed = {
				...mapExt(null, fieldMap.state, 'state'), 
				...mapExt(null, fieldMap.getters, 'getter'), 
				...option.computed
			}
			comInstance.methods = {
				...mapExt(null, fieldMap.actions, 'action'), 
				...mapExt(null, fieldMap.mutations, 'mutation'), 
				...option.methods
			}	
		}
	}
	option = null  //释放配置项空间
	return comInstance
}



//主要3个模块，components，http和bus
export default elephant