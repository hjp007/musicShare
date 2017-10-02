import {Component,Injectable,EventEmitter} from '@angular/core'
interface MessageBox {
	message : String
	callback? : Function
}
@Injectable()
export class BusService {
    alert: EventEmitter<MessageBox>
    confirm: EventEmitter<MessageBox>
    constructor(){
        this.alert = new EventEmitter()
        this.confirm = new EventEmitter()
    }
}
