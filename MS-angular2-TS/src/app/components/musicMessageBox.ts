import { Component } from '@angular/core'
import { BusService }    from '../bus.service'
declare var $ : any
interface MessageBox {
	message : String
	callback? : Function
}
@Component({
	selector: 'music-message-box',
	template: `
		<div id="messageBox" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<span *ngIf="type=='alert'">提示</span>
                		<span *ngIf="type=='confirm'">请确认</span>
					</div>
					<div class="modal-body">
						{{message}}
					</div>
					<div class="modal-footer">
						<div class="row" *ngIf="type=='alert'">
		                    <button type="button" class="btn btn-default col-xs-4 col-xs-offset-4" data-dismiss="modal" (click)="callback()">关闭</button>
		                </div>
		                <div class='row' *ngIf="type=='confirm'">
		                    <div class="col-xs-3 col-xs-offset-2">
		                        <button type="button" class="btn btn-default" data-dismiss="modal" (click)="callback()">确认</button>
		                    </div>
		                    <div class="col-xs-3 col-xs-offset-2">
		                        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
		                    </div>
		                </div>
					</div>
				</div>
			</div>
		</div>`, 
	styles : [`
	`]
})
export class MusicMessageBox {
	message : String
	callbackObj : Function
	type : String
    constructor(
    	private busService: BusService
    ){}
	ngOnInit() : void {
		this.busService.alert.subscribe((messageBox:MessageBox)=>{
			this.callbackObj = null
			this.type = "alert"
            this.message = messageBox['message']
			$('#messageBox').modal()
            if(messageBox['callback'])
            	this.callbackObj = messageBox['callback']
        })
       	this.busService.confirm.subscribe((messageBox:MessageBox)=>{
			this.callbackObj = null
			this.type = "confirm"
            this.message = messageBox['message']
			$('#messageBox').modal()
            if(messageBox['callback'])
            	this.callbackObj = messageBox['callback']
        })
	}
    callback(arr, obj) : void {
    	if(this.callbackObj)
            this.callbackObj()
    }
}