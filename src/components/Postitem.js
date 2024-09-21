import React, { useEffect, useState } from 'react';
import './style/Postitem.css';
import { useLocation, useNavigate } from 'react-router-dom';

const Postitem = ({ post, showalert }) => {
  const token = sessionStorage.getItem('token');
  const navigate = useNavigate();
  let location = useLocation();
  const [showMore, setShowmore] = useState(false);

  function capitalize(str) {
    if (!str) return ''; // Handle empty or null strings
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  // Initialize connectButton from sessionStorage or default to 'Connect'
  const [connectButton, setConnectButton] = useState(
    sessionStorage.getItem(`connectStatus_${post?.id}`) || 'Connect'
  );

  const [connectStatus, setConnectStatus] = useState(false);

  const username1 = sessionStorage.getItem('username1');

  const handleUsernameClick = () => {
    if (post?.username) {
      sessionStorage.setItem('username1', post.username);
      
      if (location.pathname === "/user-profile") {
        window.location.reload();
      }
      navigate('/user-profile');
    }
  };

  const toggleShowMore = () => {
    setShowmore(!showMore);
  };

  const clicked = async () => {
    const username1 = post?.username;
    const userId = post?.userid;
    const emails = post?.email;
    const post_id = post?.id;
    sessionStorage.removeItem('Status');
    sessionStorage.setItem('username1', username1);
    sessionStorage.setItem('user_id', userId);
  
    // First API call
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

    // Second API call
    let response2 = await fetch('http://127.0.0.1:8000/api/chat/request/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        to_user: username1,
      }),
    });
  
    let json2 = await response2.json();
    let detail = capitalize(json2.detail);
    console.log('detail:',detail)
    // Update the connect button state and store it in sessionStorage
    setConnectButton(detail);
    setConnectStatus(true);
    sessionStorage.setItem(`connectStatus_${post_id}`, json2.detail);  // Store with unique key for the user
    console.log('Request sent', json2);
  };

  return (
    <div className='postitem-main-container'>
      <div className="postitem-first-container">
        <div className="postitem-subfirst-container">
          <ul>
            <li id='name'>
              <div className='post-username' onClick={handleUsernameClick}>@{post?.username}</div>
              <div id='post_time'> Updated {post?.time_since_posted}</div>
            </li>
            <li className='connect-button'>
              <button onClick={clicked}>{connectButton}</button>
            </li>
          </ul>
        </div>

        <div className="postitem-subsecond-container">
          <ul>
            <li id='Title'>Need: {post?.title}</li>
            <li id='Category'>Category: {post?.category}</li>
            <li id='Description'>
              {showMore ? post?.description : post?.description?.substring(0, 400)}
              {post?.description?.length > 400 && (
                <span className="read-more" onClick={toggleShowMore}>
                  {showMore ? " Show Less" : "... Read More"}
                </span>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Postitem;
