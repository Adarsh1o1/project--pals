import React, { useEffect, useRef, useState } from 'react';
import './style/Messanger.css'
import Messagecomp from './Messagecomp'
import arrowBack from'./style/arrow_back_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png'
import { useNavigate } from 'react-router-dom';

const Messanger = () => {

  const [recentChats, setRecentChats] = useState([]);
  const token = sessionStorage.getItem('token');
  const navigate = useNavigate()
  const your_id = sessionStorage.getItem('your_id');
  const messageComponent = useRef(null);  // Keep this as useRef for future WebSocket references

  useEffect(() => {
    // Initialize the WebSocket connection
    messageComponent.current = new WebSocket(`ws://127.0.0.1:8000/ws/recent/${your_id}/`);

    messageComponent.current.onopen = () => {
      console.log('MessageComponent connected');
    };

    // Handle incoming WebSocket messages
    messageComponent.current.onmessage = function (e) {
      const data = JSON.parse(e.data);
      console.log("Received data from WebSocket:", data);
      setRecentChats(data.recent_chats)
    };

    messageComponent.current.onclose = () => {
      console.log('MessageComponent disconnected');
    };

    // Clean up the WebSocket connection on unmount
    return () => {
      if (messageComponent.current) {
        messageComponent.current.close();
      }
    };
  }, [token, your_id]);

  const handleBack = () =>{
    navigate('/post')
  }

  return (
    <div className='chats'>
        <div className="messanger-main-container">
        <div className="messanger-heading">
        <div className="arrow-back"><img style={{width:'35px'}} onClick={handleBack} src={arrowBack}/></div>
       <h3>Messages</h3>
        </div>
      <div className="messanger-container">
      { recentChats.length > 0 ? (
          recentChats.map((element) => (
            <Messagecomp key={element.chat_id} recentChats={element.name} user_id={element.userid} image={element.image} last_message={element.last_message} last_updated={element.last_updated}/> // Render the name of the chat
          ))
        ) : (
          <span>No Chats</span>
        )}

      </div>
      </div>
    </div>
  )
}

export default Messanger
