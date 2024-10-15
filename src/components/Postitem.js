import React, { useEffect, useState } from 'react';
import './style/Postitem.css';
import { useLocation, useNavigate } from 'react-router-dom';

const Postitem = ({ post, showalert }) => {
  const token = sessionStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();
  const [showMore, setShowmore] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [messageBtn, setMessageBtn] = useState(false);
  // const [color, setColor] = useState('linear-gradient(131deg, #BBC2FF 34.90%, #52BCE9 100%)');
  // const [textColor,setTextColor] = useState('#015B8E')
  // const [requestId,setRequestId] = useState(0)
  
  function capitalize(str) {
    if (!str) return ''; 
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const [connectButton, setConnectButton] = useState('Connect');

  const handleUsernameClick = () => {
    if (post?.username) {
      sessionStorage.setItem('username1', post.username);
      if (location.pathname === "/user-profile") {
        window.location.reload();
      } else {
        navigate('/user-profile');
      }
    }
  };


  // const updateColor = (status) => {
  //   // const status = sessionStorage.getItem(`connectStatus_${post?.userid}`);
  //   if (status === 'pending') {
  //     setColor('lightgray');
  //     setTextColor('gray')
  //   } else if (status === 'accepted') {
  //     setColor('#5bb450');
  //     setTextColor('white')
  //   } else {
  //     setColor('linear-gradient(131deg, #BBC2FF 34.90%, #52BCE9 100%)');
  //     setTextColor('#015B8E')
  //   }
  // };

  const toggleShowMore = () => {
    setShowmore(!showMore);
  };

  // const handleStatus = async()=>{
  //   const response2 = await fetch('http://127.0.0.1:8000/api/chat/request/', {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${token}`,
  //     },
  //   });

  //   const json2 = await response2.json();
  //   const detail = capitalize(json2.detail);

  //   setConnectButton(detail);
  //   setRequestId(json2.id);
  // }

  const handleRequests = async() =>{
    const username1 = post?.username
    const response2 = await fetch('http://127.0.0.1:8000/api/chat/request/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ to_user: username1 }),
    });

    const json2 = await response2.json();

    // sessionStorage.setItem(`connectStatus_${post?.userid}`, json2.detail);
    // console.log("REQUEST iD:",json2);
    if(json2.detail==="accepted"){
      setMessageBtn(true);
    }
    // updateColor(json2.detail);
  }

  // const handleMessage = () =>{
  //   const userId = post?.userid;
  //   const username1 = post?.username
  //   sessionStorage.setItem('user_id', userId);
  //   sessionStorage.setItem('username1', username1);
  //   navigate('/message')
  // }

  const clicked = async () => {
    // setLoading(true);
    // const username1 = post?.username;
    // const userId = post?.userid;
    const username1 = post?.username
    const emails = post?.email;
    // const post_id = post?.id;
    // sessionStorage.removeItem('Status');
    // sessionStorage.setItem('username1', username1);
    sessionStorage.setItem('emails', emails);
    sessionStorage.setItem('username1', username1);
    
    navigate('/user-profile')

    // try {
    //   const response = await fetch('http://127.0.0.1:8000/api/core/connect/', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${token}`,
    //     },
    //     body: JSON.stringify({ email: emails }),
    //   });

    //   const json = await response.json();
    // // handleRequests();
    // // setLoading(false);
    // } catch (error) {
    //   console.error("Error during fetch:", error);
    //   // setLoading(false);
    // }
  };

  useEffect(() => {
    // updateColor();
    // handleRequests(); // Update color based on connection status when component mounts or when token changes
  }, []);

  return (
    <div className='postitem-main-container'>
      <div className="postitem-first-container">
        <div className="postitem-subfirst-container">
          <ul>
            <li id='name'>
              <div className='post-username' onClick={handleUsernameClick}>@{post?.username}</div>
              <div id='post_time'>  {post?.time_since_posted}</div>
            </li>
            <li className='connect-button'>
              <button onClick={clicked}>
                Visit Profile
              </button>
            {/* <li style={messageBtn?{display:'flex',marginLeft:'5px'}:{display:'none'}}>
              <button onClick={handleMessage}>
                Message
              </button>
              </li> */}
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
          <div id='bottom-post_time'>  {post?.time_since_posted} ago</div>
        </div>
      </div>
    </div>
  );
};

export default Postitem;
