import { Component } from '@angular/core';
declare var loadingInterval : any
declare var $ : any
@Component({
  	selector: 'app-root',
  	template: `
  		<router-outlet></router-outlet>
  		<music-message-box></music-message-box>
  	`
})
export class AppComponent {
	ngAfterViewInit() : void {
		window.clearInterval(loadingInterval)
		$('#c').hide()		
	}
}

