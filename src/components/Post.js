import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './style/Post.css'
import addimage from './style/add-on-icon-29.jpg'
import Postitem from './Postitem';

const Post = (props) => {
  const [credentials, setcredentials] = useState({ title: '', category: '', description: '' })

  const changed = (e) => {
    setcredentials({
      ...credentials, [e.target.name]: e.target.value
    })
    console.log(e.target.name);
  }
  const token1 = sessionStorage.getItem('token');
  const postdata = async (e) => {
    e.preventDefault();

    let response = await fetch('http://127.0.0.1:8000/api/core/create-post/', { 
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token1}`
      },
      body: JSON.stringify({
        title: credentials.title
        , category: credentials.category
        , description: credentials.description
      })
    })
    window.location.reload()
    // let json = await response.json();
    // console.log(json);

  }


  const initialposts = [];
  const [posts, setposts] = useState(initialposts);
  const token = sessionStorage.getItem('token');
  const fetchallposts = async () => {
    let response = await fetch('http://127.0.0.1:8000/api/core/show-post/', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    let json = await response.json();
    // console.log(json.payload);
    setposts(json.payload);
  }

  let navigate = useNavigate();
  const { showalert } = props;

  useEffect(() => {

    if (sessionStorage.getItem('msg') !== "login success") {
      return navigate('/login');
    }
    // console.log(Array.isArray(posts));
    fetchallposts();

  }, [])
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
            {Array.isArray(posts) && posts.length > 0 ? (
              posts.map((element) => (
                <Postitem key={element.id} showalert={props.showalert} post={element} />
              ))
            ) : (
              <p>No posts available</p>
            )}


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
                <label htmlFor="Choose a Title">Choose a Title</label>
              </li>
              <li>
                <input type="text" className='cp' onChange={changed} name="title" maxLength={50} />
              </li>
              <li>
                <label htmlFor="Choose a Title">Choose your Category:</label>
              </li>
              <li>
                <input type="text" className='cp' id='Category' onChange={changed} name="category" maxLength={60} />
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
                {/* <input type="text" className='cp' id='description' maxLength={250}/> */}
                <textarea name="description" className='cp' id="description" onChange={changed} maxLength={250}></textarea>
              </li>
            </ul>
          </div>
        </div>
        <div className="cp-button">

          <button onClick={postdata}>Create Post</button>
        </div>
      </div>
    </div>

  )

}


export default Post
