import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { ApiService }    from '../api.service';


@Component({
	selector: 'app-root',
	templateUrl : '../views/login.html',
	styleUrls: ['../css/login.css']
})

export class Login  implements OnInit {
	id : string
	username : string
	password : string

	constructor(
    	private router: Router, 
    	private apiService: ApiService,
    ){}
	ngOnInit() : void {
		this.id = localStorage.getItem("identity")
		if(this.id !== null)
			this.router.navigate(['/home'])
	}
	toMain() : void {
		this.router.navigate(['/main'])
	}
	toHome() : void {
		if (this.username==="") {
			alert("账号不能为空")
			return
		}
		else if (this.password==="") {
			alert("密码不能为空")
			return
		}
		this.apiService.login(this.username, this.password)
			.then((userId)=>{
				localStorage.setItem("identity", userId)
				this.router.navigate(['/home'])
			}) 
	}
}