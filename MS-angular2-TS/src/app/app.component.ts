import { Component } from '@angular/core';

@Component({
  	selector: 'app-root',
  	template: `
  		<router-outlet></router-outlet>
  		<music-message-box></music-message-box>
  	`
})
export class AppComponent {
}

