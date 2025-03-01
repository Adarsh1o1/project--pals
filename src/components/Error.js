import React from 'react'
import './style/Error.css'
import { Link, useNavigate } from 'react-router-dom'

const Error = () => {
  let navigate = useNavigate();
  const logout = () => {
    sessionStorage.clear();
    navigate('/')
}

  return (
    <div className='Error-main-container'>
      {/* error page */}
      <label htmlFor="Error" id='route_error'>No Page found</label>
      <Link to='/'>
      <button type="submit" onClick={logout} className="error-submit">Go Back</button>
      </Link>
    </div>
  )
}

export default Error
