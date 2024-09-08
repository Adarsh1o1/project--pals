import React, { useEffect, useState } from 'react';
import './style/Postitem.css';
import { useLocation, useNavigate } from 'react-router-dom';


const Postitem = ({ post, showalert }) => {
  const token = sessionStorage.getItem('token');
  const navigate = useNavigate();
  let location = useLocation();

  const username1 = sessionStorage.getItem('username1');

  const handleUsernameClick = () => {
    if (post?.username) {
      sessionStorage.setItem('username1', post.username);
      
      if(location.pathname==="/user-profile"){
        window.location.reload();
      }
      navigate('/user-profile');
    }
  };

  // const [loading, setLoading] = useState(false);


  // useEffect(()=>{
  //   if(category !== ""){
  //     fetchData();
  //     // window.location.reload();
  //   }
  // },[])
  const clicked = async () => {
    const emails = post.email;

    let response = await fetch('http://127.0.0.1:8000/api/core/connect/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: emails,
      }),
    });

    let json = await response.json();
    console.log(json);

    showalert('Email has been sent', 'success');
    // navigate("/message")
  };

  return (
    <div className='postitem-main-container'>
      <div className="postitem-first-container">
        
        <div className="postitem-subfirst-container" >

        <ul>
            <li id='name' onClick={handleUsernameClick}>@{post?.username}</li>
            <li className='connect-button'><button onClick={clicked}>Connect</button></li>
          </ul>
        </div>

        <div className="postitem-subsecond-container">
          <ul>
            <li id='Title'>{post?.title}</li>
            <li id='Description'>{post?.description}</li>
          </ul>
        </div>
        </div>

    </div>
  );
};

export default Postitem;