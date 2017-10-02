import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { ApiService }    from '../api.service'
import { BusService }    from '../bus.service'

@Component({
	selector: 'app-root',
	templateUrl : '../views/apply.html',
	styleUrls: ['../css/apply.css']
})

export class Apply  implements OnInit {
	id : string
	username = ""
	password = ""
	interest = ""

	constructor(
    	private router: Router, 
    	private apiService: ApiService,
    	private busService: BusService
    ){}
	ngOnInit() : void {
		this.id = localStorage.getItem("identity")
		if(this.id !== null)
			this.router.navigate(['/home'])
	}
	toMain() : void {
		this.router.navigate(['/main'])
	}	
	toLogin() : void {
		this.router.navigate(['/login'])
	}
	applyAccount() : void {
		if (this.username==="") {
			this.busService.alert.emit({
				message: "账号不能为空"
			})
			return
		}
		if (this.password==="") {
			this.busService.alert.emit({
				message: "密码不能为空"
			})
			return
		}		
		if (this.interest==="") {
			this.busService.alert.emit({
				message: "兴趣不能为空"
			})
			return
		}
		this.busService.confirm.emit({
			message : "确认创建用户" + this.username + "吗？", 
			callback : ()=>{
			this.apiService.apply(this.username, this.password, this.interest)
				.then((data : any)=>{
					if(!data.code){
						localStorage.setItem("identity", data.data)
						this.router.navigate(['/home'])
					}else {
						setTimeout(()=>{
							this.busService.alert.emit({
								message: data.message
							})
						}, 1000)
					}
				}) 
			}
		})

	}
}