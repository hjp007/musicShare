import { Injectable }    from '@angular/core'
import { Http } from '@angular/http'

import 'rxjs/add/operator/toPromise'

@Injectable()
export class ApiService {
	private uploadHeaders = new Headers({'Content-Type': undefined})
	private handleError(error: any): Promise<any> {
    	console.error('An error occurred', error); // for demo purposes only
    	return Promise.reject(error.message || error);
  	}
    constructor(private http: Http) { }
    apply (username:string, password:string, interest:string): Promise<string>{
		return this.http.post('apply', {username:username, password:password, interest:interest})
			.toPromise()
			.then(response => response.json() as any)
			.catch(this.handleError)
	}
    login (username:string, password:string): Promise<string>{
		return this.http.post('login', {username:username, password:password})
			.toPromise()
			.then(response => response.json() as any)
			.catch(this.handleError)
	}
	user(id : string): Promise<object>{
		return this.http.get('user?id=' + id)
			.toPromise()
			.then(response => response.json() as any)
			.catch(this.handleError)
	}
	downloadSong(url : string): Promise<string>{
		return this.http.get('downloadSong?url=' + url)
			.toPromise()
			.then(response => response.json() as any)
			.catch(this.handleError)
	}
	checkFriendRequest(id : string): Promise<object>{
		return this.http.get('checkFriendRequest?id=' + id)
			.toPromise()
			.then(response => response.json() as any)
			.catch(this.handleError)	
	}
	searchFriend(username : string): Promise<object>{
		return this.http.get('searchFriend?username=' + username)
			.toPromise()
			.then(response => response.json() as any)
			.catch(this.handleError)	
	}
	addFriend (id:string, friendName:string): Promise<void>{
		return this.http.post('addFriend', {id:id, friendName:friendName})
			.toPromise()
			.then(response => response.json() as any)
			.catch(this.handleError)
	}
	replyFriendRequest(requestId: string, status: number): Promise<void>{
		return this.http.post('replyFriendRequest', {requestId:requestId, status:status})
			.toPromise()
			.then(response => response.json() as any)
			.catch(this.handleError)
	}
	checkShareRequest(id : string): Promise<object>{
		return this.http.get('checkShareRequest?id=' + id)
			.toPromise()
			.then(response => response.json() as any)
			.catch(this.handleError)	
	}
	addShare (id:string, friendName:string, songId:string): Promise<void>{
		return this.http.post('addShare', {id:id, friendName:friendName, songId: songId})
			.toPromise()
			.then(response => response.json() as any)
			.catch(this.handleError)
	}
	replyShareRequest(requestId: string, status: number): Promise<void>{
		return this.http.post('replyShareRequest', {requestId:requestId, status:status})
			.toPromise()
			.then(response => response.json() as any)
			.catch(this.handleError)
	}
	token(id : string, filename: string): Promise<object>{
		return this.http.post('token', {id : id, filename:filename})
			.toPromise()
			.then(response => response.json() as any)
			.catch(this.handleError)	
	}
	createSong(userID : string, name: string, url : string): Promise<void>{
		return this.http.post('createSong', {userID:userID, name:name, url:url})
			.toPromise()
			.then(response => response.json() as any)
			.catch(this.handleError)
	}

}