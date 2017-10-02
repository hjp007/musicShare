import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { ApiService }    from '../api.service'
import { BusService }    from '../bus.service'

@Component({
	selector: 'app-root',
	templateUrl : '../views/login.html',
	styleUrls: ['../css/login.css']
})

export class Login  implements OnInit {
	id = ""
	username = ""
	password = ""

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
	toApply() : void {
		this.router.navigate(['/apply'])
	}
	toHome() : void {
		if (this.username==="") {
			this.busService.alert.emit({
				message: "账号不能为空"
			})
			return
		}
		else if (this.password==="") {
			this.busService.alert.emit({
				message: "密码不能为空"
			})
			return
		}
		this.apiService.login(this.username, this.password)
			.then((data:any)=>{
				console.log(data)
				if(!data.code){
					localStorage.setItem("identity", data.data)
					this.router.navigate(['/home'])
				}else {
					this.busService.alert.emit({
						message: data.message
					})
				}
			}) 
	}
}