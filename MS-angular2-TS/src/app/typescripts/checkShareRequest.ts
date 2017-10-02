import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { ApiService }    from '../api.service'
import { BusService }    from '../bus.service'

@Component({
	selector: 'app-root',
	templateUrl: '../views/checkShareRequest.html',
	styleUrls: ['../css/checkShareRequest.css']
})
export class CheckShareRequest implements OnInit {
	id = ""
	shareRequests = []
	username = ""
	shareOperationStatus = 0
	friendName = ""
	friends = []
	songs = []

	constructor(
    	private router: Router, 
    	private apiService: ApiService,
    	private busService: BusService
    ){}
   	ngOnInit(): void {
   		this.id = localStorage.getItem("identity")
		if(this.id == null)
			this.router.navigate(['/login'])
		this.apiService.checkShareRequest(this.id)
			.then((data:any)=>{
				if(!data.code){
					this.shareRequests = data.data['shareRequests']
					this.username = data.data['user']['name']
					this.friends = data.data['user']['friends']
					this.songs = data.data['user']['songs']
				}else {
					this.busService.alert.emit({
						message: data.message
					})
				}
				
			})
	}
	selectFriend(friend): void {
		this.shareOperationStatus = 1 
		this.friendName = friend['name']
	}
	selectSong(song): void{
		this.shareOperationStatus = 0
		if(this.friendName == ""){
			this.busService.alert.emit({
				message: "未知错误！"
			})
			return 
		}
		this.apiService.addShare(this.id, this.friendName, song._id)
			.then((data:any)=>{
				if(!data.code){
					this.busService.alert.emit({
						message: "分享已经发送！", 
						callback: ()=>{
		        			window.location.reload()
						}
					})
				}else {
					this.busService.alert.emit({
						message: data.message
					})
				}
			})
	}
	resetStatus(): void {
		this.shareOperationStatus = 0
	}
	replyShareRequest(requestId, status): void{
		this.apiService.replyShareRequest(requestId, status)
			.then((data:any)=>{
				if(!data.code){
					this.busService.alert.emit({
						message: "您的回复已经发送！歌曲会出现在您列表里！", 
						callback: ()=>{
		        			window.location.reload()
						}
					})
				}else {
					this.busService.alert.emit({
						message: data.message
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