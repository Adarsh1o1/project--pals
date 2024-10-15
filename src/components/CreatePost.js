import React, { useEffect, useState } from 'react';

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
        
    );
}

export default CreatePost;