import { Component, Input } from '@angular/core'
 
@Component({
	selector: 'music-nav',
	template: `
		<nav class="navbar navbar-inverse navbar-fixed-top">
		    <div class="navbar-header">
			    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false">
					<span class="sr-only">Toggle navigation</span>
			        <span class="icon-bar"></span>
			        <span class="icon-bar"></span>
			        <span class="icon-bar"></span>
			    </button>
			    <span *ngIf="!showName" class="navbar-brand">音乐分享平台</span>
			    <div *ngIf="showName" class="name">
			    	<span>{{username}}</span>，欢迎回来！
			    </div>
		  	</div>
		  	<div class="collapse navbar-collapse" id="navbar">
		  		<ul class="nav navbar-nav">
		  			<ng-content></ng-content>
		  		</ul>
		  	</div>
		</nav>`, 
	styles : [`
		.name{
			color:white;
			font-size: 20px;
			line-height: 50px; 
			height: 50px; 
			padding:0 5%;
		}
		.name span{
			color:red!important;
		}
	`]
})
export class MusicNav {
	@Input() showName: boolean
	@Input() username: string
}