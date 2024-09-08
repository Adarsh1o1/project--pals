import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './style/Post.css'
import addimage from './style/add-on-icon-29.jpg'
import Postitem from './Postitem';

const Post = (props) => {
  const [credentials, setcredentials] = useState({ title: '', category: '', description: '' })
  const [modalResult, setModalResult] = useState(false);
  // const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [fetchResults, setFetchResults] = useState(false);
  const [posts, setPosts] = useState([]);
  const token = sessionStorage.getItem('token');
  const category = sessionStorage.getItem('category');
  console.log("category:",category)

  const navigate = useNavigate();
  // Handle input changes
  const changed = (e) => {
    setcredentials({
      ...credentials, [e.target.name]: e.target.value
    });
  }

  // Post new data to the server
  const postdata = async (e) => {
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


    // Refetch posts after a successful post creation instead of reloading the page
    if (response.ok) {
      fetchAllPosts();
    }
    setcredentials({ title: '', category: '', description: '' });

  }

  // Fetch all posts from the server
  const fetchAllPosts = async () => {
    if(category===null){
    let response = await fetch('http://127.0.0.1:8000/api/core/show-post/', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    let json = await response.json();
    setPosts(json.payload);}
  }

  const fetchData = async (e) => {
    if (category===null){return}
    let response = await fetch(`http://127.0.0.1:8000/api/core/search/${category}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    const actualData = data.payload;
    console.log(actualData);
    if (actualData.length > 0) {
        setSearchResults(actualData);
        setModalResult(true);
    }
    else {
        setSearchResults([]);
        setModalResult(false);
    }
  
};

  // Fetch posts on component mount
  useEffect(() => {
    if (!token) {
      return navigate('/login');
    }
    
    // Fetch all posts only once when the component mounts

    if(category!==""|| category){
      fetchData();
    }
    

  }, []); // Add relevant dependencies

  useEffect(()=>{
    fetchAllPosts();
  },[])

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
                  what's on your mind today?
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

          <div className="post-secondmain-container">
            <div className="all-posts">
              {modalResult?(searchResults.length > 0 ? (
                searchResults.map((element) => (
                  <Postitem key={element.id} showalert={props.showalert} post={element} />
                ))
              ) : (
                <p>No posts available</p>
              )):(Array.isArray(posts) && posts.length > 0 ? (
                posts.map((element) => (
                  <Postitem key={element.id} showalert={props.showalert} post={element} />
                ))
              ) : (
                <p>No posts available</p>
              ))}
            </div>
          </div>

        </div>
      </div>
      <div className="post-second-container">
        <label htmlFor="Create Post" id='create-post'>Create Post</label>
        <div className="createpost-first-container">
          <div className="createpost-second-container">
            <ul>
              <li>
                <label htmlFor="Choose a Title">Write your Requirement Title:</label>
              </li>
              <li>
                <input type="text" className='cp' onChange={changed} value={credentials.title} name="title" maxLength={50} />
              </li>
              <li>
                <label htmlFor="Choose a Title">Write your Project Category:</label>
              </li>
              <li>
                <input type="text" className='cp' id='Category' value={credentials.category} onChange={changed} name="category" maxLength={60} />
              </li>
              <li>
                <label htmlFor="Validation">Post validity(in days):</label>
              </li>
              <li>
                <input type="number" className='cp' name="post-validation" id='post-validation' />
              </li>
              <li>
                <label htmlFor="Description" >Write about your post:</label>
              </li>
              <li>
                <textarea name="description" className='cp' id="description" value={credentials.description} onChange={changed} maxLength={250}></textarea>
              </li>
            </ul>
          </div>
        </div>
        <div className="cp-button">
          <button onClick={postdata}>Create Post</button>
        </div>
      </div>
    </div>
  );
}

export default Post;
