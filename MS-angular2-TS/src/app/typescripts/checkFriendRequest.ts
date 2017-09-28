import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { ApiService }    from '../api.service'

@Component({
	selector: 'app-root',
	templateUrl : '../views/checkFriendRequest.html',
	styleUrls: ['../css/checkFriendRequest.css']
})
export class CheckFriendRequest implements OnInit {
	id : string
	tab = 'CheckTab' //CheckTab为信息列表，AddTab为加友页面
	friendRequests = []
	searchuser : string
	result : object
	emShow = false
	username : string

	constructor(
    	private router: Router, 
    	private apiService: ApiService,
    ){}
   	ngOnInit(): void {
   		this.id = localStorage.getItem("identity")
		if(this.id == null)
			this.router.navigate(['/login'])
		this.apiService.checkFriendRequest(this.id)
			.then((data)=>{
				this.friendRequests = data['friendRequests']
				this.username = data['user']['name']
			})
	}
	searchFriend() : void {
		this.apiService.searchFriend(this.searchuser)
			.then((result)=>{
				this.result = result
				this.emShow = true
			})
	}
	friendRequest() : void {
		this.apiService.addFriend(this.id, this.result['name'])
			.then(()=>{
		        alert("您的请求已经发送，等待对方确认！")
		        window.location.reload()
			})
	}
	replyFriendRequest(requestId : string, status : number) : void {
		this.apiService.replyFriendRequest(requestId, status)
			.then(()=>{
		        alert("您的回复已经发送！")
		        window.location.reload()
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