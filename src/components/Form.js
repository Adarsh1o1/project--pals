import React, { useState } from 'react'
import './style/Form.css'
import { Link } from 'react-router-dom'

const Form = (props) => {
    const [credstate, setcredstate] = useState({ email: '', username: '', password: '', password2: '', first_name: '', last_name: '' })
 
    const changed = (e) => {
        setcredstate({
            ...credstate, [e.target.name]: e.target.value
        })
        // console.log(e.target.name);
    }

    const datasend = async (e) => {
        // datasend
        try {
            e.preventDefault();

            let response = await fetch('http://127.0.0.1:8000/api/accounts/register/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: credstate.email
                    , username: credstate.username
                    , password: credstate.password
                    , password2: credstate.password2
                    , first_name: credstate.first_name
                    , last_name: credstate.last_name
                })
            })
            // console.log(credstate.email);
            let data = await response.json();
            console.log(data);
            sessionStorage.setItem('token', data.access);
            if(!data.errors){
                props.onNext();
            }
            else{
                // console.log(data.error)
                alert(`Check your credentials;
                Things to notice:
                1.Email should be unique
                2.Password must consists of 8 characters
                `)
            }

            sessionStorage.setItem('email',credstate.email);            
        } catch (error) {
            // alert('check your credentials')
            // console.log(error.message);
        }

    }

    const checked = () =>{
        if(credstate.email==='' || credstate.username==='' || credstate.password==='' || credstate.password2==='' || credstate.first_name===''){
            return true;
        }
        else{
            return false;
        }
    }

    const handleClick = () => {
        props.onBack();
    }
    return (
        <div className='form-main-container'>

            <form onSubmit={datasend}>
                <div className="form-container">
                    <label htmlFor="account" id='account'>Create account</label>
                    <input type="text" name='first_name' className="firstname"  onChange={changed} placeholder='First Name' />
                    <input type="text" name='last_name' className="firstname"  onChange={changed} placeholder='Last Name' />
                    <input type="text" name='username' className="username"  onChange={changed} placeholder='Username' />
                    <input type="text" name='email' className="email"  onChange={changed} placeholder='Email' />
                    <input type="text" name='collegename' className="Collegename"  placeholder='College Name' />
                    <input type="text" name='phonenumber' className="Phonenumber"  placeholder='Phone Number' />
                    <input type="password" name='password'  className="password" onChange={changed} placeholder='Password' />
                    <input type="password" name='password2' className="confirmpassword" onChange={changed} placeholder='Confirm Password' />
                    <div className="form-submit-button">
                    <button className="form-submit" onClick={handleClick}>Back</button>
                    <button type="submit" disabled={checked()} className="form-submit">Next</button>
 
                    </div>
                    <div className="refer">
                        <Link id='refer' to="/login">
                            <div className="link">
                                Already have an account?
                                <Link id='link' to="/login">Log in</Link>
                            </div>
                        </Link>
                    </div>
                    
                </div>

            </form>
        </div>
    )
}

export default Form
