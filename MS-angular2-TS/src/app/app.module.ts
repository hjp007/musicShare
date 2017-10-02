import { NgModule }       from '@angular/core'
import { BrowserModule }  from '@angular/platform-browser'
import { FormsModule }    from '@angular/forms'
import { HttpModule } from '@angular/http'
import { HttpClientModule } from '@angular/common/http'

import { ApiService }    from './api.service'
import { BusService }    from './bus.service'

import { MusicNav } from './components/musicNav'
import { MusicModal } from './components/musicModal'
import { MusicUploader } from './components/musicUploader'
import { MusicMessageBox } from './components/musicMessagebox'

import { AppComponent }  from './app.component'

import { Main } from './typescripts/main'
import { Home } from './typescripts/home'
import { Login } from './typescripts/login'
import { Apply } from './typescripts/apply'
import { CheckFriendRequest } from './typescripts/checkFriendRequest'
import { CheckShareRequest } from './typescripts/checkShareRequest'

import { AppRoutingModule }     from './app-routing.module'

@NgModule({
	imports: [
	    BrowserModule,
	    FormsModule,
	    AppRoutingModule, 
	    HttpModule,
	    HttpClientModule
	],
	declarations: [
		MusicNav, 
		MusicModal, 
		MusicUploader, 
		MusicMessageBox, 
		AppComponent, 
	    Main, 
	    Home, 
	    Login, 
	    Apply, 
	    CheckFriendRequest, 
	    CheckShareRequest
	],
	providers: [ ApiService, BusService ],
	bootstrap: [AppComponent]
})
export class AppModule { }
