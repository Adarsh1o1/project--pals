import React from 'react'
import  './style/Alert.css'


const Alert = (props) => {
    return (
        <div className='alert-main-container'>
            {props.alert && <div className="alert-first-container">
                {/* <strong>Success</strong> : Email has been sent */}
                <strong>{props.alert.type}</strong> : {props.alert.msg}
            </div>}
        </div>
    )
}

export default Alert
