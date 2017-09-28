import { Injectable }    from '@angular/core'
import { Http } from '@angular/http'

import 'rxjs/add/operator/toPromise'

interface ResponseObj {
	result : string
	data : object
}
interface ResponseStr {
	result : string
	data : string
}
interface ResponseNull {
	result : string
}
@Injectable()
export class ApiService {
	private uploadHeaders = new Headers({'Content-Type': undefined})
	private judgeStr(res : ResponseStr, api : string): string {
		if(res.result != "success"){
			throw new Error('wrong at ' + api)
		}
		return res.data
	}
	private judgeObj(res : ResponseObj, api : string): object {
		if(res.result != "success"){
			throw new Error('wrong at ' + api)
		}
		return res.data
	}
	private judgeNull(res : ResponseNull, api : string): void {
		if(res.result != "success"){
			throw new Error('wrong at ' + api)
		}
		return 
	}
	private handleError(error: any): Promise<any> {
    	console.error('An error occurred', error); // for demo purposes only
    	return Promise.reject(error.message || error);
  	}
    constructor(private http: Http) { }
    login (username:string, password:string): Promise<string>{
		return this.http.post('login', {username:username, password:password})
			.toPromise()
			.then(response => this.judgeStr(response.json(), 'login') as string)
			.catch(this.handleError)
	}
	user(id : string): Promise<object>{
		return this.http.get('user?id=' + id)
			.toPromise()
			.then(response => this.judgeObj(response.json(), 'user') as object)
			.catch(this.handleError)
	}
	downloadSong(url : string): Promise<string>{
		return this.http.get('downloadSong?url=' + url)
			.toPromise()
			.then(response => this.judgeStr(response.json(), 'downloadSong') as string)
			.catch(this.handleError)
	}
	checkFriendRequest(id : string): Promise<object>{
		return this.http.get('checkFriendRequest?id=' + id)
			.toPromise()
			.then(response => this.judgeObj(response.json(), 'checkFriendRequest') as object)
			.catch(this.handleError)	
	}
	searchFriend(username : string): Promise<object>{
		return this.http.get('searchFriend?username=' + username)
			.toPromise()
			.then(response => this.judgeObj(response.json(), 'searchFriend') as object)
			.catch(this.handleError)	
	}
	addFriend (id:string, friendName:string): Promise<void>{
		return this.http.post('addFriend', {id:id, friendName:friendName})
			.toPromise()
			.then(response => this.judgeNull(response.json(), 'addFriend') as void)
			.catch(this.handleError)
	}
	replyFriendRequest(requestId: string, status: number): Promise<void>{
		return this.http.post('replyFriendRequest', {requestId:requestId, status:status})
			.toPromise()
			.then(response => this.judgeNull(response.json(), 'replyFriendRequest') as void)
			.catch(this.handleError)
	}
	checkShareRequest(id : string): Promise<object>{
		return this.http.get('checkShareRequest?id=' + id)
			.toPromise()
			.then(response => this.judgeObj(response.json(), 'checkShareRequest') as object)
			.catch(this.handleError)	
	}
	addShare (id:string, friendName:string, songId:string): Promise<void>{
		return this.http.post('addShare', {id:id, friendName:friendName, songId: songId})
			.toPromise()
			.then(response => this.judgeNull(response.json(), 'addShare') as void)
			.catch(this.handleError)
	}
	replyShareRequest(requestId: string, status: number): Promise<void>{
		return this.http.post('replyShareRequest', {requestId:requestId, status:status})
			.toPromise()
			.then(response => this.judgeNull(response.json(), 'replyShareRequest') as void)
			.catch(this.handleError)
	}
	token(id : string, filename: string): Promise<object>{
		return this.http.post('token', {id : id, filename:filename})
			.toPromise()
			.then(response => this.judgeObj(response.json(), 'token') as object)
			.catch(this.handleError)	
	}
	createSong(userID : string, name: string, url : string): Promise<void>{
		return this.http.post('createSong', {userID:userID, name:name, url:url})
			.toPromise()
			.then(response => this.judgeNull(response.json(), 'createSong') as void)
			.catch(this.handleError)
	}

}