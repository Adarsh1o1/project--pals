import React from 'react'
import './style/Chatapp.css'
import Messanger from './Messanger'
import Chats from './Chats'
import { Link, useNavigate } from 'react-router-dom'

const Chatapp = () => {
  let navigate = useNavigate();
  const logout = () => {
    // sessionStorage.clear();
    navigate('/')
}
  return (
    // <div className='chats' style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column',height:'100vh',textAlign:'center'}}>
    //   <h1>Will be available soon</h1>
    //   <Link to='/'>
    //   <button type="submit" onClick={logout} className="error-submit">Go Back</button>
    //   </Link>
    // </div>
    <div className="chat-container">
      
      <Messanger/>
      <Chats/>
    </div> 
  )
}

export default Chatapp
