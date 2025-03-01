import React, { useEffect, useState } from 'react';
import './style/CreatePost.css'
import idea from './style/Idea_concept.jpg'
const CreatePost = () =>{
    const [credentials, setCredentials] = useState({ title: '', category: '', description: '' });
    const token = sessionStorage.getItem('token');


    const changed = (e) => {
        setCredentials({
          ...credentials, [e.target.name]: e.target.value
        });
      }

    const postData = async (e) => {
        e.preventDefault();
    
        const response = await fetch('http://127.0.0.1:8000/api/core/create-post/', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: credentials.title,
            category: credentials.category,
            description: credentials.description
          })
        });
        setCredentials({ title: '', category: '', description: '' });
      }
    return(
      <div className="createpost-main-container" style={{display:'flex'}}>
        <div className="createpost-heading-container">
          <h1 id="getpost-heading">Tell us What you need </h1>
          <h1 id="getpost-heading"style={{color:'#015B8E'}}>Today.</h1>
          <p id="getidea-heading">Got some idea? Find the best team to team up now!!</p>
          <img src={idea} style={{width:'400px',translate:'40px'}} alt="a png that shows idea connection" />
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
                    <input type="text" className='ep' onChange={changed} value={credentials.title} name="title" maxLength={50} />
                  </li>
                  <li>
                    <label htmlFor="Choose a Title">Write your Project Category:</label>
                  </li>
                  <li>
                    <input type="text" className='ep' id='Category' value={credentials.category} onChange={changed} name="category" maxLength={60} />
                  </li>
                  {/* <li>
                    <label htmlFor="Validation">Post validity (in days):</label>
                  </li>
                  <li>
                    <input type="number" className='ep' name="post-validation" id='post-validation' onChange={changed} />
                  </li> */}
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

export default CreatePost;