import React from 'react'
import CSSModules from 'react-css-modules'
import styles from "./MusicModal.css"

const MusicModal = (props) =>{

    var getComponent =(key)=>{
        return props.children.filter( (comp) => {
            return comp.key === key
        })
    }
    return(
        <div id={props.id} className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        {getComponent('title')}
                    </div>
                    <div className="modal-body">
                        {getComponent('body')}
                    </div>
                    <div className="modal-footer">
                        {getComponent('footer')}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CSSModules(MusicModal, styles)