import React from 'react'
import styles from "./MusicUploader.css"
import bus from '../../bus'

class MusicUploader extends React.Component{
	constructor(props) {
	    super(props)
	    this.state = {
	        userid: props.userid, 
	        percentage : 0,  
    		accepts : {
                checkType : ['audio/mp3','audio/wav','audio/wma','audio/ogg','audio/mpeg', 'audio/x-ms-wma'], //手机会被转成mpeg,x-ms-wma格式
		        maxSize : 11000000
		    }, 
		    isBeforeUploading : false
	    }
	}
    contains(arr, obj) {
        var i = arr.length
        while (i--) {
            if (arr[i] === obj) {
                return true
            }
        }
        return false
    }
    upload(event) {
        var file = event.target.files[0]
        console.log(file)
        var _this = this
        if (file) {
            if(file.size > this.state.accepts.maxSize){
            	bus.dispatch('alert', "文件超过10M！")
                return
            }
            if(!this.contains(this.state.accepts.checkType, file.type)){
            	bus.dispatch('alert', "请上传音乐！目前支持mp3,wav,wma,ogg格式！")
                return
            }
            this.setState({isBeforeUploading : true})
            var formData = new FormData()
            formData.append('file', file)
            let postData = {
                filename : file.name, 
                id : _this.props.userid
            }
            $.post('token', postData, 
            	(data)=>{
                    if(data.result==='success'){
                        formData.append('token', data.data.token)
                        formData.append('key', data.data.key)
                        $.ajax({
                        	type: 'POST',
  							url: "https://up.qbox.me/",
  							data: formData,
  							contentType : false, 
  							processData: false,
						    xhr: function() {
						        var xhr = new window.XMLHttpRequest();
						        xhr.upload.addEventListener("progress", function(evt) {
						        	//上传中途处理
						            if (evt.lengthComputable) {
						                _this.setState({
						                	percentage : Math.round(evt.loaded*100 / evt.total)
						                })
						                if(_this.state.isBeforeUploading == true && _this.state.percentage!=0){
                                        	_this.setState({isBeforeUploading : false})
                                    	}
						            }
						       }, false)
						       return xhr
						    }, 
							success: (response)=>{
								console.log("七牛云上传成功！")
	                            if(response.hash && response.key){
	                                let postData = {
	                                    userID : _this.props.userid, 
	                                    name : file.name, 
	                                    url : 'http://oqyw1ztb2.bkt.clouddn.com/' + response.key
	                                }
	                                $.post('createSong', postData, 
	                                	(data)=>{
	                                		if(data.result==='success'){
	                                			bus.dispatch('alert', "操作成功！", ()=>{
	                                            	window.location.reload() 
	                                			})
	                                        } else{
	                                            bus.dispatch('alert', data.message)
	                                        }
	                                	}
	                                )
	                            }	
							}
                        })
                    } else{
                        _this.setState({isBeforeUploading : false})
                        bus.dispatch('alert', data.message);
                    }
            	}
            )
        }
    }

    render(){
	    return(
			<div>
			    <div className="uploader row">
			        <input type="file" id="uploader" onChange={(evt)=>this.upload(evt)}
			        	accept='audio/mp3,audio/wav,audio/wma,audio/ogg'/>
			        <button className='btn btn-success col-xs-4 col-xs-offset-4'
			        	onClick={(evt)=>document.getElementById('uploader').click()}>
			        	点击上传
			        </button>
			    </div>
			    {this.state.isBeforeUploading &&
					<span>
				        校验成功，正准备上传，请等待。
				    </span>
			    }
			    {this.state.percentage != 0 &&
				    <div>
				        <h2 className="text-danger">上传进度</h2>
				        <div className="progress">
				            <div className="progress-bar progress-bar-striped active" role="progressbar"
				            	style={{minWidth: '2em' , width : this.state.percentage + '%'}}>
				                {this.state.percentage}%
				            </div>
				        </div>
				    </div> 
			    }
	  
			</div>
	    )   	
    }

}
export default MusicUploader