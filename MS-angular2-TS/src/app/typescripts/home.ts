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
    searchSong = ""
	timer = null
	resultSongs = []  //成功时的数据
    resultMessage = "" //失败时的信息
    searchingStatus = "before"   //4个状态 before search over 

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
    dynamicSearch(){
        if(this.searchSong===""){
            this.resultSongs = []
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
            this.apiService.searchSongs(this.searchSong)
            	.then((data:any)=>{
                    this.searchingStatus = "over"
					if(!data.code){
                        this.resultSongs = data.data
					}else {
						this.resultSongs = []
                        this.resultMessage = data.message
					}
				})
        },500)
    } 
    addSong(song){
        this.apiService.addSongToMyList(this.id, song._id)
        	.then((data:any)=>{
				if(!data.code){
                    this.busService.alert.emit({
						message: "歌曲添加成功！", 
						callback :()=>{
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
}

