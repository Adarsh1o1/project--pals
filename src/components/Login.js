import React from 'react'
import './style/Login.css'
import realimage from './style/another3dpicture.png'
import Loginform from './Loginform'

const Login = () => {

    return (
        <div className='big-container'>
            {/*login page  */}
            <div className="login-maincontainer">
                <div className="login-secondcontainer">
                    <ul>
                        <li>
                            <p>Uniting Dreams,</p>
                        </li>
                        <li>
                            <p>Defining Success!!</p>
                        </li>
                        <img src={realimage} alt="A 3D Art" />
                    </ul>
                </div>
                <div className="login-content">
                    <Loginform/>
                </div>



            </div>
        </div>
    )
}

export default Login
