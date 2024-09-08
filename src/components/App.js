import Error from './Error';
import Home from './Home';
import Navbar from './Navbar';
import Signup from './Signup';
import Login from './Login';
import './style/App.css';
import { Routes, Route, useLocation, useNavigate} from 'react-router-dom';
import Post from './Post';
import Alert from './Alert';
import { useEffect, useState } from 'react';
import Chatapp from './Chatapp';
import Searchmodal from './Searchmodal';
import Profile from './Profile';
import About from './About';

function App() {
  const[alert,setalert] = useState(null);
  const token = sessionStorage.getItem('token');
  let navigate = useNavigate();
  const location =  useLocation();
  const showalert = (message,type) =>{
    setalert({
      msg:message,
      type:type
    });
    setTimeout(()=>{
      setalert(null);
    },1500)
  }

  const sendBack = () =>{
    if(token && (location.pathname==="/login" || location.pathname==="/signup")){
      
      navigate('/post')
      
    }
    
  }

  const [loading, setLoading] = useState(true);
 useEffect(()=>{
  sendBack()
 },[location, navigate, token])

  useEffect(() => {
    const delay = 1000; // 1 second
    const timeout = setTimeout(() => {
      setLoading(false);
    }, delay);

    // Clean up the timeout when the component unmounts
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const unblock = navigate((nextLocation, action) => {
      if (token && (nextLocation.pathname === '/login' || nextLocation.pathname === '/signup')) {
        navigate('/post');
        return false; // Block navigation
      }
    });

    return () => {
      if (unblock) unblock(); // Clean up on unmount
    };
  }, [navigate, token]);


  return (

    <div className="App">
    <Navbar/>
    {/* {alert !== null && <Alert alert={alert} />}  */}
    {alert ? (
          <Alert alert={alert} />
        ) : (
          <div className="alert-placeholder" style={location.pathname ==='/post'?{height:'40px'}:{display:"none"}}/>
        )}
        


        <Routes>
          <Route path='*' element={<Error />} />
          <Route  path='/aboutus' element={<About />} />
          <Route path='/paartnup' element={<Home />} />
          <Route path='/' element={<Home />} />
          <Route exact path='/signup' element={<Signup />} />
          <Route exact path='/login' element={<Login />} />
          
          <Route exact path='/user-profile' element={<Profile showalert={showalert}/>} />
          <Route exact path='/post' element={<Post showalert={showalert} />} />
          <Route exact path='/message' element={<Chatapp />} />
        </Routes>
    </div>

  );
}

export default App;
