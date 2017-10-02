import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { ApiService }    from '../api.service'
import { BusService }    from '../bus.service'

@Component({
	selector: 'app-root',
	templateUrl : '../views/checkFriendRequest.html',
	styleUrls: ['../css/checkFriendRequest.css']
})
export class CheckFriendRequest implements OnInit {
	id = ""
	tab = 'CheckTab' //CheckTab为信息列表，AddTab为加友页面
	friendRequests = []
	searchuser = ""
	result : object
	emShow = false
	username = ""

	constructor(
    	private router: Router, 
    	private apiService: ApiService,
    	private busService: BusService
    ){}
   	ngOnInit(): void {
   		this.id = localStorage.getItem("identity")
		if(this.id == null)
			this.router.navigate(['/login'])
		this.apiService.checkFriendRequest(this.id)
			.then((data:any)=>{
				if(!data.code){
					this.friendRequests = data.data['friendRequests']
					this.username = data.data['user']['name']
				}else{
					this.busService.alert.emit({
						message : data.message
					})
				}
			
			})
	}
	searchFriend() : void {
	    if(this.searchuser===""){
	    	this.busService.alert.emit({
				message : "请填写名称！"
			})
            return
        }
        if(this.searchuser===this.username){
    		this.busService.alert.emit({
				message : "请不要写自己的名字！"
			})
            return
        }
		this.apiService.searchFriend(this.searchuser)
			.then((data:any)=>{
				if(!data.code){
					this.emShow = true
					this.result = data.data
				}else{
					this.emShow = false
					this.busService.alert.emit({
						message : data.message
					})
				}
			})
	}
	friendRequest() : void {
		this.apiService.addFriend(this.id, this.result['name'])
			.then((data:any)=>{
				if(!data.code){
					this.busService.alert.emit({
						message : "您的请求已经发送，等待对方确认！", 
						callback : ()=>{
			        		window.location.reload()
						}
					})
				} else{
					this.busService.alert.emit({
						message : data.message
					})
				}

			})
	}
	replyFriendRequest(requestId : string, status : number) : void {
		this.apiService.replyFriendRequest(requestId, status)
			.then((data:any)=>{
				if(!data.code){
					this.busService.alert.emit({
						message : "您的回复已经发送！", 
						callback : ()=>{
			        		window.location.reload()
						}
					})
				} else{
					this.busService.alert.emit({
						message : data.message
					})
				}
			})	
	}
	toLogin() : void {
		localStorage.removeItem('identity')
		this.router.navigate(['/login'])
	}
	toHome() : void {
		this.router.navigate(['/home'])
	}
}