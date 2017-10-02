import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Main } from './typescripts/main'
import { Home } from './typescripts/home'
import { Login } from './typescripts/login'
import { Apply } from './typescripts/apply'
import { CheckFriendRequest } from './typescripts/checkFriendRequest'
import { CheckShareRequest } from './typescripts/checkShareRequest'
const routes: Routes = [
	{ path: '', redirectTo: '/main', pathMatch: 'full' }, 
	{ path: 'main',  component: Main },
	{ path: 'home',  component: Home },
	{ path: 'login', component: Login }, 
	{ path: 'apply', component: Apply }, 
	{ path: 'checkFriendRequest',  component: CheckFriendRequest },
	{ path: 'checkShareRequest', component: CheckShareRequest }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}