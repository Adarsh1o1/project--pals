import React, { useEffect, useState } from 'react';
import './style/Profile.css';
import { useNavigate } from 'react-router-dom';
import Userpost from './Userpost';
import { TrendingUpTwoTone } from '@mui/icons-material';

const Profile = (props) => {
  // Assuming posts is defined somewhere in your component's state or props
  const initialposts = [];
  const initialsearched = [];
  const [posts, setposts] = useState(initialposts);
  const [Disabled,setDisabled] = useState(false)
  const [Userid, SetUserid] = useState(null);
  const [search, setsearch] = useState(initialsearched);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowmore] = useState(false);
  const [messageBtn, setMessageBtn] = useState(false);
  const [connectButton, setConnectButton] = useState('Connect');
  const [color, setColor] = useState('linear-gradient(131deg, #BBC2FF 34.90%, #52BCE9 100%)');
  const [textColor,setTextColor] = useState('#015B8E')
  const userid1 = sessionStorage.getItem('user_id1');
  const toggleShowMore = () => {
    setShowmore(!showMore);
  };

  const RealhandleRequests = async() =>{
    const username1 = sessionStorage.getItem('username1')
    const response2 = await fetch('http://127.0.0.1:8000/api/chat/request/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ to_user: username1 }),
    });

    const json2 = await response2.json();
    console.log('Request Data',json2)
    // sessionStorage.setItem(`connectStatus_${post?.userid}`, json2.detail);
    // console.log("REQUEST iD:",json2);
    if(json2.detail==="accepted"){
      setMessageBtn(true);
    }
    // updateColor(json2.detail);
  }

  const updateColor = (status) => {
    // const status = sessionStorage.getItem(`connectStatus_${post?.userid}`);
    if (status === 'pending') {
      setColor('lightgray');
      setTextColor('gray');
      setDisabled(true);
    } else if (status === 'accepted') {
      setColor('#5bb450');
      setTextColor('white');
      setDisabled(true);
    } else {
      setColor('linear-gradient(131deg, #BBC2FF 34.90%, #52BCE9 100%)');
      setTextColor('#015B8E');
      setDisabled(false);
    }
  };



  const token = sessionStorage.getItem('token');
  const fetchallposts = async () => {
    let response = await fetch(`http://127.0.0.1:8000/api/core/any-user-post/${searched_name}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    let json = await response.json();
    // console.log(json)
    setposts(json.payload);
    
  }

  const searched_name = sessionStorage.getItem('username1')

  const fetchalldata = async () => {
    let response = await fetch(`http://127.0.0.1:8000/api/accounts/search/${searched_name}`, {
      method: 'GET',
      headers: { 'Authorization':`Bearer ${token}` }
    });
    let json = await response.json();
    console.log('profile data', json)
    // SetUserid(json[0]?.user_id)
    sessionStorage.setItem('user_id1',json[0]?.user_id);
    // sessionStorage.setItem("user_id",json[0].user_id);
    // console.log("user_id:",Userid)
    setsearch(json);
    
  }

  function capitalize(str) {
    if (!str) return ''; 
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }


  const handleRequests = async() =>{

    const response2 = await fetch( `http://127.0.0.1:8000/api/chat/RequestStatus/${userid1}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const json2 = await response2?.json();
    const detail = capitalize(json2?.status);
    // setLoading(false);

    // sessionStorage.setItem(`connectStatus_${post?.userid}`, json2.detail);
    console.log("Profile status:",json2);
    
    if(json2?.status===null){
      setConnectButton('Connect')
    }
    else{
      setConnectButton(detail);
    }
    if(json2?.status==="accepted"){
      setMessageBtn(true);

    }
    else{
      setMessageBtn(false);
    }
    updateColor(json2?.status);
  }

  let navigate = useNavigate();
  const { showalert } = props;

  useEffect(() => {

    if (sessionStorage.getItem('token') !== token || !token) {
      return navigate('/login');
    }
    fetchalldata();
    fetchallposts();
    handleRequests();
    // console.log(search);

  }, [userid1,token])

  const clicked = async() =>{
    setLoading(true);
    const emails = sessionStorage.getItem('emails');
    console.log(emails);

    let response = await fetch('http://127.0.0.1:8000/api/core/connect/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` },
        body: JSON.stringify({
            email: emails
        })
      });
      let json = await response.json();
      console.log(json);
      setLoading(false)
      RealhandleRequests();
      handleRequests();

    // props.showalert('Email has been sent', 'success');
    // navigate("/message")
  }
  
  const handleMessage = () =>{
  sessionStorage.getItem('user_id1',);
  navigate('/message')
}


  return (
    
    <div className='profile-main-container'>
      {Array.isArray(search) ? (search.map((element)=>(
      <div className="profile-first-container" key={element.id}>
        <div className='image-name'>
        <div className="account-image">
          <img src={element.image} />
        </div>
        <div className="profile-details">
          <ul>
            <li>
              <h1>{element.full_name}</h1>
            </li>
            <li>
              <h3>@{element.username}</h3>
            </li>
            <li className='connect-button'>
              <button onClick={clicked} disabled={Disabled} style={{ background: color, color:textColor, fontWeight:'500' }}>
                {loading ? "Loading..." : connectButton}
              </button>
            <li style={messageBtn?{display:'flex',marginLeft:'5px'}:{display:'none'}}>
              <button onClick={handleMessage}>
                Message
              </button>
              </li>
              </li>
          </ul>
        </div>
        </div>

        <div className="profile-biodetails">
          
          {/* <div className="profile-collegename">
            <ul>
              <li>
                <div className="circle"></div>
              </li>
              <li>
                Dronacharya College of Engineering
              </li>
            </ul>
          </div> */}
          <h2 style={{fontSize:'20px'}}>About:</h2>
          <div className="profile-bio">
          
          {element.bio}
          </div>
        </div>
      </div>))):('')}
      {/* <h2 id='POSTS'>Posts:</h2> */}
      <div className="profile-secondmain-container">
        <div className="all-posts">
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((element) => (
              <Userpost key={element.id} post={element} />
            ))
          ) : (
            <p>No posts available</p>
          )}
          {/* <Userpost/> */}
          
        </div>
      </div>
    </div>
  );
};

export default Profile;