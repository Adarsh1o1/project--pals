import React, { useState } from 'react'
import './style/Otp.css'
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
import { Token } from '@mui/icons-material';

const Otp = (props) => {
  // otp
  let navigate = useNavigate();
  const token = sessionStorage.getItem('token')
  const [check, setcheck] = useState(true)
  const handleClick = () => {
    props.onBack();
  }

  const otpdata = async () => {
    let response = await fetch('http://127.0.0.1:8000/api/accounts/verify-otp/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: sessionStorage.getItem('email'), otp: otp })
    })

    let datarecieved = await response.json();
    if (response.ok) {
      console.log('OTP verification successful');
      navigate('/login');
    } else {
      console.log('Error:', datarecieved.msg);
      // Optionally, handle failed OTP verification
    }
    
  }

  const toggle = () => {
    setcheck(!check);
  }
  const [otp, setOtp] = useState('');
  return (
    <div className='otp-first-main-container'>
      <div className="otp-main-container">
        <label htmlFor="account" id='otp-account'>Create account</label>
        <div className="otp-first-container">
          <p>Enter OTP:</p>

          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={4}
            renderSeparator={<span>&nbsp;&nbsp;&nbsp;</span>}
            renderInput={(props) => <input {...props}
            />}
            inputStyle={{ width: "70px" }}

          />
          <div className="otp-resend">
            <a href="#">Resend</a> in time
          </div>
          <div className="otp-second-container" style={{ marginTop: '30px' }}>
        <input type="checkbox" onClick={toggle} /> I have read and agree to all the <a href='#'>terms and condition</a>
      </div>
        </div>


      </div>
        <button type="submit" style={{ marginTop: '50px',marginRight:'10px' }} onClick={handleClick} className="otp-Signup">Back</button>
        <button disabled={check ? true : false} onClick={otpdata} className="otp-Signup">Signup</button>

    </div>
  )
}

export default Otp
