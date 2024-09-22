import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Userpost from './Userpost';
import './style/Youraccount.css';

const Youraccount = (props) => {
  const initialposts = [];
  const initialsearched = [];
  const [posts, setposts] = useState(initialposts);
  const [search, setsearch] = useState(initialsearched);
  const [form, setForm] = useState(false);
  const [credentials, setcredentials] = useState({
    username: "",
    full_name: "",
    bio: "",
    img: null // Use null initially for image
  });

  const token = sessionStorage.getItem('token');
  const searched_name = sessionStorage.getItem('username');

  const fetchallposts = async () => {
    let response = await fetch(`http://127.0.0.1:8000/api/core/any-user-post/${searched_name}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    let json = await response.json();
    setposts(json.payload);
  };

  const fetchalldata = async () => {
    let response = await fetch(`http://127.0.0.1:8000/api/accounts/profile/`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    let json = await response.json();
    console.log("Profile:", json);
    setsearch(json);
    sessionStorage.setItem('your_id',json.user_id);
    setcredentials({
      username: json.username,
      full_name: json.full_name,
      bio: json.bio,
      img: json.image // This will handle the image URL if needed
    });
  };

  const editprofile = async (e) => {
    e.preventDefault();

    // Use FormData to handle both text and file inputs
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('full_name', credentials.full_name);
    formData.append('bio', credentials.bio);
    if (credentials.img instanceof File) {
      formData.append('image', credentials.img); // Only append file if it's a new file
    }

    await fetch(`http://127.0.0.1:8000/api/accounts/profile/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData // Send FormData instead of JSON
    });
    sessionStorage.setItem('username',credentials.username);
    window.location.reload(); // Refresh page to reflect changes
  };

  let navigate = useNavigate();
  const { showalert } = props;

  useEffect(() => {
    if (!token) {
      return navigate('/login');
    }
    fetchalldata();
    fetchallposts();
  }, [token]); // Empty array ensures it runs once on mount

  const clicked = () => {
    setForm(true);
  };

  const changed = (e) => {
    const { name, value } = e.target;
    setcredentials((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setcredentials((prev) => ({
      ...prev,
      img: e.target.files[0] // Handle file input separately
    }));
  };

  const second_clicked = () => {
    setForm(false);
  };

  return (
    <div className='profile-main-container'>
      <div className="profile-first-container" key={search.id}>
        <div className='image-name'>
          <div className="account-image">
            <img src={search.image} alt="Profile" />
          </div>
          <div className="profile-details">
            <ul>
              <li>
                <h1>{search.full_name}</h1>
              </li>
              <li>
                <h3>@{search.username}</h3>
              </li>
              <li >
                <button className='Edit-button' onClick={clicked}>Edit your Profile</button>
              </li>
            </ul>
          </div>
        </div>

        <div className="profile-biodetails">
        <h2 style={{fontSize:'20px'}}>About:</h2>
          <div className="profile-bio">
            {search.bio}
          </div>
        </div>
      </div>

      <div className="profile-secondmain-container">
        {form ? (
          <form method="post" className='edit-form' encType="multipart/form-data" onSubmit={editprofile}>
            <label htmlFor='Edit' id='edit-your-profile'><h1 style={{textAlign:'center'}}>Edit your profile</h1></label>
            <br /><br />
            <label htmlFor="fullname" className='edit-label'>Edit your name: <input
              type="text"
              className='ep'
              name="full_name"
              onChange={changed}
              value={credentials.full_name}
              required
            /><br /><br /> </label>
            

            <label htmlFor="username" className='edit-label'>Edit your username:             <input
              type="text"
              className='ep'
              id="edit-username"
              value={credentials.username}
              onChange={changed}
              name="username"
            /><br /><br /></label>


            <label htmlFor="about" className='edit-label'>Edit your bio:           <input
              type="text"
              className='ep'
              id="edit-about"
              value={credentials.bio}
              onChange={changed}
              name="bio"
              maxLength='300'
              required
            /><br /><br /></label>


            <label htmlFor="imgUpload" className='edit-label'>Upload Image:             <input
              type="file"
              id="imgUpload"
              name="img"
              
              onChange={handleFileChange}
              accept="image/*"
            /><br /><br /></label>

            <div className='submit-cancel'>
            <input type="submit" className='edit-submit' value="Submit Form" />
            <button type="button" className='edit-submit' onClick={second_clicked}>Cancel</button>
            </div>
            
          </form>
        ) : (
          <div className="all-posts">
            {Array.isArray(posts) && posts.length > 0 ? (
              posts.map((element) => (
                <Userpost key={element.id} post={element} />
              ))
            ) : (
              <p>No posts available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Youraccount;
