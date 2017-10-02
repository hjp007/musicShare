import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
	selector: 'app-root',
	templateUrl: '../views/main.html',
	styleUrls: ['../css/main.css']
})
export class Main implements OnInit{
	id = ""

	constructor(
    	private router: Router
    ){}
	ngOnInit() : void {
		this.id = localStorage.getItem("identity")
	}
	toLogin() : void {
		this.router.navigate(['/login'])
	}
	toHome() : void {
		this.router.navigate(['/home'])
	}
	toApply() : void {
		this.router.navigate(['/apply'])
	}
}