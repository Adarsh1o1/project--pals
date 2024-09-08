import React, { useEffect, useState } from 'react';
import './style/Profile.css';
import { useNavigate } from 'react-router-dom';
import Userpost from './Userpost';

const Profile = (props) => {
  // Assuming posts is defined somewhere in your component's state or props
  const initialposts = [];
  const initialsearched = [];
  const [posts, setposts] = useState(initialposts);
  const [search, setsearch] = useState(initialsearched);
  const token = sessionStorage.getItem('token');
  const fetchallposts = async () => {
    let response = await fetch(`http://127.0.0.1:8000/api/core/any-user-post/${searched_name}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    let json = await response.json();
    console.log(json)
    setposts(json.payload);
    
  }

  const searched_name = sessionStorage.getItem('username1')

  const fetchalldata = async () => {
    let response = await fetch(`http://127.0.0.1:8000/api/accounts/search/${searched_name}`, {
      method: 'GET',
      headers: { 'Authorization':`Bearer ${token}` }
    });
    let json = await response.json();
    // console.log(json[0])
    setsearch(json);
    
  }

  let navigate = useNavigate();
  const { showalert } = props;

  useEffect(() => {

    if (sessionStorage.getItem('token') !== token || !token) {
      return navigate('/login');
    }
    fetchalldata();
    fetchallposts();
    console.log(search);

  }, [])

  const clicked = async() =>{

    const emails = search.email;

    let response = await fetch('http://127.0.0.1:8000/api/core/connect/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` },
        body: JSON.stringify({
            email: emails
        })
      });
      let json = await response.json();
      // console.log(json);
    props.showalert('Email has been sent', 'success');
    
    // navigate("/message")
}
  return (
    
    <div className='profile-main-container'>
      {Array.isArray(search) ? (search.map((element)=>(
      <div className="profile-first-container" key={element.id}>
        <div className="account-image">
          
        </div>
        <div className="profile-details">
          <ul>
            <li>
              <h1>{element.full_name}</h1>
            </li>
            <li>
              <h3>{element.username}</h3>
            </li>
            <li className='connect-button'>
              <button onClick={clicked}>Connect</button>
            </li>
          </ul>
        </div>
        <div className="profile-biodetails">
          <div className="profile-collegename">
            <ul>
              <li>
                <div className="circle"></div>
              </li>
              <li>
                Dronacharya College of Engineering
              </li>
            </ul>
          </div>
          <h4>About</h4>
          <div className="profile-bio">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero quaerat quasi minima nisi aliquid animi blanditiis nesciunt esse ea, culpa cumque, atque ex nihil labore.
          </div>
        </div>
      </div>))):('')}
      <h2 id='POSTS'>Posts:</h2>
      <div className="post-secondmain-container">
        <div className="all-posts">
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((element) => (
              <Userpost key={element.id} post={element} />
            ))
          ) : (
            <p>No posts available</p>
          )}
          {/* <Userpost/> */}
          
        </div>
      </div>
    </div>
  );
};

export default Profile;