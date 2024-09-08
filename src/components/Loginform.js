import React, { useState } from 'react'
import './style/Loginform.css'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';

const Loginform = (props) => {
    // const [loggedin, setloggedin] = useState(false);
    let navigate = useNavigate();
    const [credstate, setcredstate] = useState({ email: '', password: '' })

    const changed = (e) => {
        setcredstate({
            ...credstate, [e.target.name]: e.target.value
        })
        console.log(e.target.name);
    }

    const datasend = async (e) => {
        e.preventDefault();
        sessionStorage.removeItem('token');
        try {
            let response = await fetch('http://127.0.0.1:8000/api/accounts/login/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: credstate.email
                    , password: credstate.password
                })
            })
            // console.log(credstate.email);
            let data = await response.json();
            // console.log(data);
            // props.onSubmit();
            if(!data.errors){

                sessionStorage.setItem('token', data.token.access);
                // sessionStorage.setItem('msg', data.msg);
                sessionStorage.setItem('username', data.username);
                navigate('/post');
                sessionStorage.setItem('email', credstate.email);
            }
            else{
                alert('Recheck your email and password');
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div>
            <div className="loginform-main-container">
                <form onSubmit={datasend}>
                    <div className="loginform-container">
                        <label htmlFor="account" id='account'>Login</label>
                        <input type="text" name='email' className="email" onChange={changed} placeholder='Email' />
                        <input type="password" name='password' className="password" onChange={changed} placeholder='Password' />

                        <button type="submit" className="loginform-submit">Next</button>
                        <div className="refer">
                        <Link id='refer' to="/signup">
                            <div className="link">
                                Don't have an account?
                                <Link id='link' to="/signup">Signup</Link>
                            </div>
                        </Link>
                    </div>

                    </div>

                </form>
            </div>
        </div>
    )
}

export default Loginform
