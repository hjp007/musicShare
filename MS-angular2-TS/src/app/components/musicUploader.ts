import { Component, Input } from '@angular/core'
import { ApiService }    from '../api.service'
import { BusService }    from '../bus.service'

import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http'
@Component({
	selector: 'music-uploader',
	template: `
		<div class="uploader row">
			<input type="file" id="uploader" (change)="upload($event)" accept='audio/mp3,audio/wav,audio/wma,audio/ogg'/>
			<button class='btn btn-success col-xs-4 col-xs-offset-4' onclick="document.getElementById('uploader').click()">点击上传</button>
		</div>
		<span *ngIf="isBeforeUploading">
        	校验成功，正准备上传，请等待。
    	</span>
		<div *ngIf="percentage!=0">
			<h2 class="text-danger">上传进度</h2>
			<div class="progress">
					<div class="progress-bar progress-bar-striped active" role="progressbar" style="min-width: 2em;" [ngStyle]="{ 'width' : percentage + '%'}">
					{{percentage}}%
					</div>
			</div>
		</div>
`, 
	styles : [`
	.uploader input[type="file"]{
    	display: none;
	}
	`]
})
export class MusicUploader {
	percentage = 0
	id = ""
	constructor(
    	private apiService: ApiService,
    	private httpClient: HttpClient, 
    	private busService: BusService
    ){}
    isBeforeUploading = false
	accepts = {
        checkType : ['audio/mp3','audio/wav','audio/wma','audio/ogg','audio/mpeg', 'audio/x-ms-wma'], //手机会被转成mpeg,x-ms-wma格式
        maxSize : 11000000
    }
    contains(arr, obj) : boolean {
		var i = arr.length
		while (i--) {
		  	if (arr[i] === obj) {
		    	return true
		  	}
		}
		return false
    }
    upload(event): void{
        var file = event.target.files[0]
        this.id = localStorage.getItem('identity')
        console.log(file)
        if (file) {
            if(file.size > this.accepts.maxSize){
            	this.busService.alert.emit({
            		message:"文件超过10M！"
            	})
                return
            }
            if(!this.contains(this.accepts.checkType, file.type)){
            	this.busService.alert.emit({
            		message:"请上传音乐！目前支持mp3,wav,wma,ogg格式！"
            	})
                return
            }
            this.isBeforeUploading = true
            var formData = new FormData()
            formData.append('file', file)
            this.apiService.token(this.id, file.name)
            	.then((data:any)=>{
            		if(!data.code){
	            		formData.append('token', data.data['token'])
	                    formData.append('key', data.data['key'])
						this.httpClient.request(new HttpRequest(
							'POST',
							'https://up.qbox.me', 
							formData, 
							{
	  							reportProgress: true,
							}
						)).subscribe(event => {
		  					if (event.type === HttpEventType.UploadProgress) {
		    					this.percentage = Math.round(100 * event.loaded / event.total)
		    					if(this.isBeforeUploading == true && this.percentage!=0){
                                    this.isBeforeUploading = false
                                }
		  					} else if (event instanceof HttpResponse) {
	                    		this.apiService.createSong(this.id, file.name, 'http://oqyw1ztb2.bkt.clouddn.com/' + event['body']['key'])
	                    			.then((data:any)=>{
	                    				if(!data.code){
											this.busService.alert.emit({
            									message:"操作成功！", 
            									callback : ()=>{
	                    							window.location.reload()
            									}
            								})
	                    				} else{
	                    					this.busService.alert.emit({
            									message:data.message
            								})	
	                    				}
	                    		})
		  					}
						})	
            		}else {
            		    this.busService.alert.emit({
            				message:data.message
            			})	
            		}
    
				})
          }
    }
}