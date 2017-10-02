import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { ApiService }    from '../api.service'
import { BusService }    from '../bus.service'

@Component({
	selector: 'app-root',
	templateUrl : '../views/home.html',
	styleUrls: ['../css/home.css']
})
export class Home  implements OnInit {
	id = ""
	tab = 'SongTab'  //SongTab为音乐列表，FriendTab为好友列表 UploadTab为上传页面
	username = ""
	songs = []
	friends = []
	musicFlag = false
	musicUrl = ""

	constructor(
    	private router: Router, 
    	private apiService: ApiService,
    	private busService: BusService
    ){}
	ngOnInit() : void {
		this.id = localStorage.getItem("identity")
		if(this.id == null)
			this.router.navigate(['/login'])
		this.apiService.user(this.id)
			.then((data:any)=>{
				if(!data.code){
					this.username = data.data['name']
					this.songs    = data.data['songs']
					this.friends  = data.data['friends']
				}else {
					this.busService.alert.emit({
						message: data.message
					})
				}
				
			})
	}
	download(url : string) : void {
		this.musicFlag = true
        this.musicUrl = url
	}
	toLogin() : void {
		localStorage.removeItem('identity')
		this.router.navigate(['/login'])
	}
	toCheckFriendRequest() : void {
		this.router.navigate(['/checkFriendRequest'])
	}
	toCheckShareRequest() : void {
		this.router.navigate(['/checkShareRequest'])
	}
}

