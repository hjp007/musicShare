export default {
	id : state => {
		return state.id	
	}, 
	username : state => {
		return state.username	
	},
	password : state => {
		return state.password	
	}, 
	interest : state => {
		return state.interest
	}, 
	user : state => state.user 
	, 
	tab : state => {
		return state.tab
	}, 
	musicFlag : state => {
		return state.musicFlag
	}, 
	musicUrl : state => {
		return state.musicUrl
	}, 
	searchSong : state => {
		return state.searchSong
	}, 
	timer : state => {
		return state.timer
	}, 
	resultSongs : state => {
		return state.resultSongs
	}, 		
	resultMessage : state => {
		return state.resultMessage
	}, 
	searchingStatus : state => {
		return state.searchingStatus
	}
}