import React from 'react'
import './style/Home.css'
import { Link } from 'react-router-dom'
import idea from './style/home-page-idea1.png.jpg'
const Home = () => {
  const token = sessionStorage.getItem('token');
  return (
    
    <>
    <br />
    <br />
      <div className="home-main-container">
        <div className="first-home-container">
          <ul>
            <li>
              <div className="home-line"></div>
            </li>
            <li>
              Connect, Collaborate
            </li>
            <li>
              & Create Together
            </li>
            <br />
            <li id='special-message'>
              <h5>A catalyst you need in connecting with the opportunities!!</h5>
            </li>
            <br />
            <li>
              <Link className='getstarted' to={'/signup'}><button style={{cursor:'pointer'}} disabled={token? true : false}>Get Started</button></Link>
            </li>
          </ul>
        </div>
        <div className="second-home-container">
          <img src={idea} alt="a png that shows idea connection" />
        </div>
      </div>
    </>
  )
}

export default Home
