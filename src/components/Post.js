import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style/Post.css';
import addimage from './style/add-on-icon-29.jpg';
import Postitem from './Postitem';
import { FlashOnTwoTone } from '@mui/icons-material';
// import InfiniteScroll from "react-infinite-scroll-component";

const Post = (props) => {

  const [color,setColor] = useState('#015B8E')
  const [textColor,setTextColor] = useState('white')
  const [Next,setNext] = useState(false)
  const [Prev,setPrev] = useState(true)
  const [prevcolor,setprevColor] = useState('#015B8E')
  const [prevtextColor,setprevTextColor] = useState('white')
  const [modalResult, setModalResult] = useState(false);
  // const [hasMore, sethasMore] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [posts, setPosts] = useState([]);
  // const [totalposts, setTotalPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [hasMore, setHasMore] = useState(true); // Check if more posts are available

  const [requests, setRequests] = useState([]);
  const token = sessionStorage.getItem('token');
  const category = sessionStorage.getItem('category');
  const notification = sessionStorage.getItem('notification') === 'true'; // Convert to boolean
  const [close, setClose] = useState(!notification); // Set close to true if notification is false
  const navigate = useNavigate();
  const [nextPage ,setNextPage] = useState('');
  const [prevPage ,setPrevPage] = useState('');



    const updateColor = (status) => {
    // const status = sessionStorage.getItem(`connectStatus_${post?.userid}`);
    if (status === null) {
      setColor('lightgray');
      setTextColor('gray')
      setNext(true)
    }
    else {
      setColor('#015B8E');
      setTextColor('white')
      setNext(false)
    }
    console.log(Next)
  };
    const prevupdateColor = (status) => {
    // const status = sessionStorage.getItem(`connectStatus_${post?.userid}`);
    if (status === null) {
      setprevColor('lightgray');
      setprevTextColor('gray')
      setPrev(true);

    }
    else {
      setprevColor('#015B8E');
      setprevTextColor('white')
      setPrev(false);
    }
    console.log("Prev",Prev)
  };



  // const fetchAllPosts = async (prev_number,post_number) => {
  //   if (!category) {
  //     const response = await fetch('http://127.0.0.1:8000/api/core/show-post/', {
  //       method: 'GET',
  //       headers: { 'Authorization': `Bearer ${token}` }
  //     });
  //     const json = await response.json();
  //     console.log('allposts', json);
  //     setTotalPosts(json.payload);

  //     if(json.payload.length>5){
  //       setPosts(json.payload.slice(prev_number,post_number));
  //     }
  //     else{
  //       setPosts(json.payload);
  //     }

  //     if(totalposts.length>posts.length){
  //       sethasMore(true);
  //     }
  //     else{
  //       sethasMore(false);
  //     }
  //   }
  // }


  const fetchAllPosts = async () => {
    let response = await fetch(`http://127.0.0.1:8000/api/core/show-post/`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    let json = await response.json();
    console.log('allposts', json);

    // If first page, set posts to the fetched posts
    if (currentPage === 1) {
      setPosts(json.posts);
    } else {
      // Append new posts
      setPosts(prevPosts => [...prevPosts, ...json.posts]);
    }
    setNextPage(json.next_page);
    prevupdateColor(null);
  }


  const fetchData = async () => {
    if (!category) return;
    const response = await fetch(`http://127.0.0.1:8000/api/core/search/${category}`, {
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

    const response = await fetch('http://127.0.0.1:8000/api/chat/pendingRequest/', {
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

    const response = await fetch(`http://127.0.0.1:8000/api/chat/request/${id}/accept`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const json = await response.json();
    console.log(json);
    sessionStorage.setItem('user_id', json.from_user);
    sessionStorage.setItem(`connectStatus_${json.from_user}`, json.detail);
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
    setClose(true); // Close the notification when called
    sessionStorage.setItem('notification', 'false'); // Update session storage
    window.location.reload();
  }
  
  const PageData = async() =>{

      let response = await fetch( nextPage, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      let json = await response.json();
      console.log('allposts', json);
  
      // If first page, set posts to the fetched posts

        // Append new posts
        setPosts(prevPosts => [...prevPosts, ...json.posts]);
      
      setNextPage(json.next_page);
      setPrevPage(json.previous_page);
      updateColor(json.next_page);
      prevupdateColor(json.previous_page);
    
  }
  // const PrevPageData = async() =>{
  //   if(prevPage===null){
  //     setPrev(true);
  //     return;
  //   }
  //       setPrev(false)
  //       let response = await fetch( prevPage, {
  //         method: 'GET',
  //         headers: { 'Authorization': `Bearer ${token}` }
  //       });
  //       let json = await response.json();
  //       console.log('allposts', json);
    
  //       // If first page, set posts to the fetched posts
  
  //         // Append new posts
  //       setPosts(prevPosts => [...prevPosts, ...json.posts]);
        
  //       setPrevPage(json.previous_page);
  //       prevupdateColor(json.previous_page);


    
  // }
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
                <li id='some-text'>
                  What's on your mind today?
                </li>
              </ul>
            </div>
            <div className="post-subsubsecond-container">
              <ul>
                <li>
                  <div className="createpost-subsubsecond-container">
                    <label htmlFor="greetings" id="createpost-heading">Create Your Post</label>
                    <Link to={'/create-post'}><img src={addimage} style={{cursor:'pointer'}} alt="an addition sign" /></Link>
                  </div>
                </li>
                <li >
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
          {/* <InfiniteScroll
            dataLength={totalposts.length}
            next={fetchMoreData}
            hasMore={(hasMore)}
            loader={<h4>Loading...</h4>}
          > */}
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
            <div className='next-prev' style={posts.length > 0 ?{display:'flex'}:{display:'none'}} >                
              {/* <button className='next-prev-button' onClick={PrevPageData} style={{backgroundColor:prevcolor,color:prevtextColor}} disabled={Prev}>Previous</button> */}
                <button className='next-prev-button' style={{backgroundColor:color,color:textColor}} onClick={PageData} disabled={Next}>Load More</button>
            </div>
          {/* </InfiniteScroll> */}
        </div>
      </div>


    </div>
  );
}

export default Post;
