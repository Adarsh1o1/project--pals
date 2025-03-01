import React from 'react'
import './style/Studentcollege.css'
import imcollege from './style/university.jpg'
import imstudent from './style/student.jpg'


const Studentcollege = ({ onNext, onNext2 }) => {
  return (<>
      {/* student college */}
    <div className='stdclg-main-container'>
    <label htmlFor="signup" id='signupas'>Signup as</label>
    <div className="stdclg-secondmain-container">

      <div className="stdclg-first-container">
        <ul>
          <li>
            <img src={imstudent} alt="a university/college" />
          </li>

          <li>
            <button id="student-signup" onClick={onNext}>student</button>
          </li>
        </ul>
      </div>
      <div id='Or'>Or</div>
      <div className="stdclg-second-container">
        <ul>
          <li>
            <img src={imcollege} alt="a university/college" />
          </li>
          <li>
            <button onClick={onNext2}>college</button>
          </li>
        </ul>
      </div>
            
    </div>
    </div>
  </>
  )
}

export default Studentcollege
