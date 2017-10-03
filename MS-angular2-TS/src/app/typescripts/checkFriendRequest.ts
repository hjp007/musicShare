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
	username = ""
	searchuser = ""
	timer = null
	resultUsers = []  //成功时的数据
    resultMessage = "" //失败时的信息
    searchingStatus = "before"   //4个状态 before search over 

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
	dynamicSearch(){
        if(this.searchuser===""){
            this.resultUsers = []
            this.resultMessage = "请填写名称！"
            clearTimeout(this.timer)
            return
        }
        clearTimeout(this.timer)
        this.timer = setTimeout(()=>{
            //正在搜索字样也不要立刻就展示,如果300毫秒内拿到结果了就不展示了
            this.searchingStatus = "before";   
            setTimeout(()=>{
                if(this.searchingStatus != "over")
                    this.searchingStatus = "search"
            }, 300)
            //500毫秒后查找
            this.apiService.searchFriends(this.searchuser, this.username)
            	.then((data:any)=>{
                    this.searchingStatus = "over"
					if(!data.code){
                        this.resultUsers = data.data
					}else {
						this.resultUsers = []
                        this.resultMessage = data.message
					}
				})
        },500)
    } 
	friendRequest(user) : void {
		this.apiService.addFriend(this.id, user['name'])
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