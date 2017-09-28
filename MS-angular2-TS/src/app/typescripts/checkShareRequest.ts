import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { ApiService }    from '../api.service'
@Component({
	selector: 'app-root',
	templateUrl: '../views/checkShareRequest.html',
	styleUrls: ['../css/checkShareRequest.css']
})
export class CheckShareRequest implements OnInit {
	id : string
	shareRequests = []
	username : string
	shareOperationStatus = 0
	friendName : string
	friends = []
	songs = []

	constructor(
    	private router: Router, 
    	private apiService: ApiService,
    ){}
   	ngOnInit(): void {
   		this.id = localStorage.getItem("identity")
		if(this.id == null)
			this.router.navigate(['/login'])
		this.apiService.checkShareRequest(this.id)
			.then((data)=>{
				this.shareRequests = data['shareRequests']
				this.username = data['user']['name']
				this.friends = data['user']['friends']
				this.songs = data['user']['songs']
			})
	}
	selectFriend(friend): void {
		this.shareOperationStatus = 1 
		this.friendName = friend['name']
	}
	selectSong(song): void{
		this.shareOperationStatus = 0
		if(this.friendName == ""){
			alert("未知错误！")
			return 
		}
		this.apiService.addShare(this.id, this.friendName, song._id)
			.then(()=>{
		        alert("分享已经发送！") 
		        window.location.reload()
			})
	}
	resetStatus(): void {
		this.shareOperationStatus = 0
	}
	replyShareRequest(requestId, status): void{
		this.apiService.replyShareRequest(requestId, status)
			.then(()=>{
		        alert("您的回复已经发送！歌曲会出现在您列表里！")
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