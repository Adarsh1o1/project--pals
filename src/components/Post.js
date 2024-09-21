import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/Post.css';
import addimage from './style/add-on-icon-29.jpg';
import Postitem from './Postitem';

const Post = (props) => {
  const [credentials, setCredentials] = useState({ title: '', category: '', description: '' });
  const [modalResult, setModalResult] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [posts, setPosts] = useState([]);
  const [requests, setRequests] = useState([]);
  const token = sessionStorage.getItem('token');
  const category = sessionStorage.getItem('category');
  const notification = sessionStorage.getItem('notification') === 'true'; // Convert to boolean
  const [close, setClose] = useState(!notification); // Set close to true if notification is false

  const navigate = useNavigate();

  const changed = (e) => {
    setCredentials({
      ...credentials, [e.target.name]: e.target.value
    });
  }

  const postData = async (e) => {
    e.preventDefault();

    let response = await fetch('http://127.0.0.1:8000/api/core/create-post/', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: credentials.title,
        category: credentials.category,
        description: credentials.description
      })
    });

    if (response.ok) {
      fetchAllPosts();
    }
    setCredentials({ title: '', category: '', description: '' });
  }

  const fetchAllPosts = async () => {
    if (!category) {
      let response = await fetch('http://127.0.0.1:8000/api/core/show-post/', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      let json = await response.json();
      console.log('allposts',json);
      setPosts(json.payload);
    }
  }

  const fetchData = async () => {
    if (!category) return;
    let response = await fetch(`http://127.0.0.1:8000/api/core/search/${category}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    const actualData = data.payload;
    if (actualData.length > 0) {
      setSearchResults(actualData);
      setModalResult(true);
    } else {
      setSearchResults([]);
      setModalResult(false);
    }
  };

  const fetchNotification = async () => {
    if (!token) {
      navigate('/login');
    }

    let response = await fetch(`http://127.0.0.1:8000/api/chat/pendingRequest/`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    setRequests(data);
  };

  const handleDecline = async (id) => {
    if (!token) {
      navigate('/login');
    }

    await fetch(`http://127.0.0.1:8000/api/chat/request/${id}/decline`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    fetchNotification(); // Refresh notifications
  };

  const handleAccept = async (id) => {
    if (!token) {
      navigate('/login');
    }

    let response = await fetch(`http://127.0.0.1:8000/api/chat/request/${id}/accept`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    let json = await response.json();
    sessionStorage.setItem('user_id',json.from_user);
    navigate("/message");
  };

  useEffect(() => {
    if (!token) {
      return navigate('/login');
    }

    if (category !== "") {
      fetchData();
    }
  }, [category, token]);

  useEffect(() => {
    fetchAllPosts();
    fetchNotification();
  }, [token]);

  const closeNotification = () => {
    setClose(false); // Close the notification when called
    sessionStorage.setItem('notification', 'false'); // Update session storage
    window.location.reload()
  }
  

  return (
    <div className='post-main-container'>
      <div className="post-submain-container">
        <div className="post-first-container">
          <div className="post-subfirst-container">
            <div className="post-subsubfirst-container">
              <ul>
                <li>
                  <label htmlFor="greetings" id="post-heading">Hello, {sessionStorage.getItem('username')}</label>
                </li>
                <li>
                  What's on your mind today?
                </li>
              </ul>
            </div>
            <div className="post-subsubsecond-container">
              <ul>
                <li>
                  <div className="createpost-subsubsecond-container">
                    <label htmlFor="greetings" id="createpost-heading">View Posts of Universities/Colleges</label>
                    <img src={addimage} alt="an addition sign" />
                  </div>
                </li>
                <li>
                  Got some awesome projects? Find the best team to team up now!!
                </li>
              </ul>
            </div>
          </div>

          {/* Notifications Section */}
          <div className='notification' style={close ? { display: 'none' } : { display: 'flex' }}>
            <div className='Not-heading'>
              <ul>
                <li>
                  <h2 id="notification-heading">Notifications</h2>
                </li>
                <li>
                  <button onClick={closeNotification} className='X'>X</button>
                </li>
              </ul>
            </div>

            {Array.isArray(requests) && requests.length > 0 ? (
              requests.map((element) => (
                <div className='requests' key={element.id}>
                  <div className='request-name'>
                    <span style={{ textDecoration: 'underline', color: '#015B8E' }}>@{element.from_user}</span> sent a request to connect with you &nbsp; &nbsp; <span> • {element.time}</span>
                    <br />
                    <div className='accept-decline'>
                      <button onClick={() => handleAccept(element.id)} className='accept'>Accept</button>
                      <button onClick={() => handleDecline(element.id)} className='decline'>Decline</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <span style={{ display: 'flex', height: '80%', justifyContent: 'center', alignItems: 'center', fontSize: '18px' }}>
                No New Notifications
              </span>
            )}
          </div>

          <div className="post-secondmain-container">
            <div className="all-posts">
              {modalResult ? (
                searchResults.length > 0 ? (
                  searchResults.map((element) => (
                    <Postitem key={element.id} showalert={props.showalert} post={element} />
                  ))
                ) : (
                  <p>No posts available</p>
                )
              ) : (
                Array.isArray(posts) && posts.length > 0 ? (
                  posts.map((element) => (
                    <Postitem key={element.id} showalert={props.showalert} post={element} />
                  ))
                ) : (
                  <p>No posts available</p>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Section */}
      <div className="post-second-container">
        <label htmlFor="Create Post" id='create-post'>Create Post</label>
        <div className="createpost-first-container">
          <div className="createpost-second-container">
            <ul>
              <li>
                <label htmlFor="Choose a Title">Write your Requirement Title:</label>
              </li>
              <li>
                <input type="text" className='ep' onChange={changed} value={credentials.title} name="title" maxLength={50} />
              </li>
              <li>
                <label htmlFor="Choose a Title">Write your Project Category:</label>
              </li>
              <li>
                <input type="text" className='ep' id='Category' value={credentials.category} onChange={changed} name="category" maxLength={60} />
              </li>
              <li>
                <label htmlFor="Validation">Post validity (in days):</label>
              </li>
              <li>
                <input type="number" className='ep' name="post-validation" id='post-validation' />
              </li>
              <li>
                <label htmlFor="Description">Write about your post:</label>
              </li>
              <li>
                <textarea name="description" className='ep' id="description" value={credentials.description} onChange={changed}></textarea>
              </li>
            </ul>
          </div>
        </div>
        <div className="cp-button">
          <button onClick={postData}>Create Post</button>
        </div>
      </div>
    </div>
  );
}

export default Post;
