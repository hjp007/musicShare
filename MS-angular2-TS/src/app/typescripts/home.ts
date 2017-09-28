import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { ApiService }    from '../api.service'

@Component({
	selector: 'app-root',
	templateUrl : '../views/home.html',
	styleUrls: ['../css/home.css']
})
export class Home  implements OnInit {
	id : string
	tab = 'SongTab'  //SongTab为音乐列表，FriendTab为好友列表 UploadTab为上传页面
	username : string
	songs = []
	friends = []

	constructor(
    	private router: Router, 
    	private apiService: ApiService,
    ){}
	ngOnInit() : void {
		this.id = localStorage.getItem("identity")
		if(this.id == null)
			this.router.navigate(['/login'])

		this.apiService.user(this.id)
			.then((user)=>{
				this.username = user['name']
				this.songs    = user['songs']
				this.friends  = user['friends']
			})
	}
	download(url : string) : void {
		this.apiService.downloadSong(url)
			.then((songUrl)=>
     	    	window.open(songUrl)     
			)
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

