import React, { useState } from 'react'
import { Toast, Button } from 'react-bootstrap'

export default function BootToast(props) {
    const {buttonName, toastMessage} = props;  
    const [view, initView] = useState(false)

    const handleClick = () => {
        initView(true)
        
    }    
    return (
        <div>
        
        <Toast onClose={() => initView(false)} show={view} delay={5000} autohide>
            <Toast.Header>
            <strong className="mr-auto"></strong>
            <small></small>
            </Toast.Header>
            <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>

        <Button onClick={handleClick}>{buttonName}</Button>
        </div>
    )
}