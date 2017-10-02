import React from 'react'
import CSSModules from 'react-css-modules'
import styles from "./MusicMessageBox.css"
import bus from '../../bus'

class MusicMessageBox extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            messageBox : {
                type : '', 
                message : '', 
                callback : null
            }
        }
    }
    callback(){
        if(this.state.messageBox.callback)
            this.state.messageBox.callback()
    }
    componentDidMount(){
        var _this = this
        bus.subscribe('alert', (message, callback)=>{
            _this.setState({
                messageBox : {
                    type : 'alert', 
                    message : message, 
                    callback : callback
                }    
            })
            $("#messageBox").modal()
        })
        bus.subscribe('confirm', (message, callback)=>{
            _this.setState({
                messageBox : {
                    type : 'confirm', 
                    message : message, 
                    callback : callback
                }    
            })
            $("#messageBox").modal()
        })

    }
    render(){
        return(
            <div id={this.props.id} className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            {this.state.messageBox.type =='alert' &&
                               <span>提示</span>
                            }
                            {this.state.messageBox.type =='confirm' &&
                                <span>请确认</span>
                            }
                        </div>
                        <div className="modal-body">
                            {this.state.messageBox.message}
                        </div>
                        <div className="modal-footer">
                            {this.state.messageBox.type =='alert' &&
                                <div className="row">
                                    <button type="button" className="btn btn-default col-xs-4 col-xs-offset-4" data-dismiss="modal" onClick={this.callback.bind(this)}>关闭</button>
                                </div>
                            }
                            {this.state.messageBox.type =='confirm' &&
                                <div className='row'>
                                    <div className="col-xs-3 col-xs-offset-2">
                                        <button type="button" className="btn btn-default" data-dismiss="modal"  onClick={this.callback.bind(this)}>确认</button>
                                    </div>
                                    <div className="col-xs-3 col-xs-offset-2">
                                        <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )      
    }

}
export default CSSModules(MusicMessageBox, styles)