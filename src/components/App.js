import { useEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Error from './Error';
import Home from './Home';
import Navbar from './Navbar';
import Signup from './Signup';
import Login from './Login';
import './style/App.css';
import Post from './Post';
import Alert from './Alert';
import Chatapp from './Chatapp';
import Profile from './Profile';
import About from './About';
import Youraccount from './Youraccount';
import CreatePost from './CreatePost';

function App() {
  const [alert, setAlert] = useState(null);
  const [userStatuses, setUserStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  
  const token = sessionStorage.getItem('token');
  const username = sessionStorage.getItem('username');
  const location = useLocation();
  const navigate = useNavigate();
  
  const onlineStatusSocket = useRef(null);

  // Handle alert
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };

  // Redirect based on token and location
  // useEffect(() => {
  //   if (token && (location.pathname === "/login" || location.pathname === "/signup")) {
  //     navigate('/post');
  //   }
  // }, [location, navigate, token]);

  // Handle loading state
  useEffect(() => {
    const delay = 1000; // 1 second
    const timeout = setTimeout(() => {
      setLoading(false);
    }, delay);

    return () => clearTimeout(timeout);
  }, []);

  // WebSocket for online status
  useEffect(() => {
    if (!token) return; // Don't set up WebSocket if token is not present

    onlineStatusSocket.current = new WebSocket(`ws://127.0.0.1:8000/ws/online/`);

    const sendOnlineStatus = (status) => {
      if (onlineStatusSocket.current && onlineStatusSocket.current.readyState === WebSocket.OPEN) {
        onlineStatusSocket.current.send(JSON.stringify({
          'username': username,
          'online_status': status
        }));
      }
    };

    const handleBeforeUnload = (e) => {
      // Prevent the default action and remove the alert prompt
      // e.preventDefault();
      // e.returnValue = ''; // Some browsers require returnValue to be set for the message to appear
      sendOnlineStatus(false);
    };

    onlineStatusSocket.current.onopen = () => {
      console.log("CONNECTED TO ONLINE STATUS CONSUMER");
      sendOnlineStatus(true);
    };

    onlineStatusSocket.current.onclose = () => {
      console.log("DISCONNECTED FROM ONLINE STATUS CONSUMER");
    };

    onlineStatusSocket.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.username !== username) {
        setUserStatuses(prevStatuses => ({
          ...prevStatuses,
          [data.username]: data.online_status ? true : false
        }));
      }
    };

    // Add event listener for tab close/unload
    window.addEventListener("beforeunload", handleBeforeUnload);
    // window.addEventListener("close",handleBeforeUnload)

    return () => {
      // window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("close", handleBeforeUnload);
      if (onlineStatusSocket.current && !token) {
        sendOnlineStatus(false); // Ensure status is sent before closing
        onlineStatusSocket.current.close();
      }
    };
  }, [username, token]);

  return (
    <div className="App">
      <Navbar />
      {alert && <Alert alert={alert} />}
      
      {/* Placeholder for alert */}
      <div 
        className="alert-placeholder" 
        style={location.pathname === '/post' ? { height: '40px' } : { display: "none" }} 
      />

      <Routes>
        
        <Route path='*' element={<Error />} />
        <Route path='/aboutus' element={<About />} />
        <Route path='/paartnup' element={<Home />} />
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/user-profile' element={<Profile showalert={showAlert} />} />
        <Route path='/your-profile' element={<Youraccount />} />
        <Route path='/post' element={<Post showalert={showAlert} />} />
        <Route path='/create-post' element={<CreatePost showalert={showAlert} />} />
        <Route path='/message' element={<Chatapp />} />
      </Routes>
    </div>
  );
}

export default App;
