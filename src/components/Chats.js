import React, { useRef, useState, useEffect } from "react";
import './style/Chats.css';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import Message from "./Message";
import ReactScrollToBottom from 'react-scroll-to-bottom';
import sendButton from './style/send_24dp_434343_FILL0_wght400_GRAD0_opsz24.png'
import { useNavigate } from "react-router-dom";

const Chats = () => {
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const initialsearched = [];
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const emojiSelectorRef = useRef(null);
  const chatSocket = useRef(null);
  const [search, setsearch] = useState(initialsearched);
  const searched_name = sessionStorage.getItem('username1');
  const token = sessionStorage.getItem('token');
  const username = sessionStorage.getItem('username');
  let user_id = sessionStorage.getItem('user_id');
  let your_id = sessionStorage.getItem('your_id');


  const fetchalldata = async () => {
    console.log('user_id', user_id);
    let response = await fetch(`http://127.0.0.1:8000/api/accounts/chat_profile/${user_id}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    let json = await response.json();
    console.log("json:", json);
    setsearch(json);
  };

  const fetchallmessage = async () => {
    console.log('user_id', user_id);
    let response = await fetch(`http://127.0.0.1:8000/api/chat/chatHistory/${user_id}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    let json = await response.json();
    

    // Handling the API response if it's an array inside another array
    // if (Array.isArray(json) && Array.isArray(json[0])) {
      const historyMessages = json[0].map((element) => ({
        sender: element.sender,
        message: element.Message,
        position: element.sender !== username ? 'left' : 'right', // Determine message position
        time:element.time,
        date:element.date
      }));
      
      // Update messages state with the fetched chat history
      setMessages(historyMessages);
    // } else {
      // console.error("Unexpected response format:", json);
    // }
  };


  // WebSocket for chat messages
  useEffect(() => {
    if (!user_id || user_id === '' || user_id === null) return;

    if (user_id) {
      fetchalldata();
      fetchallmessage();
    }

    chatSocket.current = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${user_id}/?token=${token}`);

    const handleOpen = () => console.log('WebSocket connected');
    const handleMessage = (e) => {
      const data = JSON.parse(e.data);
      const currentTime = new Date(); // Get the current date and time

    const formattedTime = currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    // Format the date as dd/mm/yy
    const day = String(currentTime.getDate()).padStart(2, '0');
    const month = String(currentTime.getMonth() + 1).padStart(2, '0');
    const year = String(currentTime.getFullYear()).slice(-2);
    const formattedDate = `${day}/${month}/${year}`;
      const position = data.username !== username ? 'left' : 'right';
      setMessages(prevMessages => [...prevMessages, { message: data.message, position,time:formattedTime,date:formattedDate }]);
    };
    const handleClose = () => console.log('WebSocket closed');
    const handleError = (error) => console.error('WebSocket error:', error);

    chatSocket.current.addEventListener('open', handleOpen);
    chatSocket.current.addEventListener('message', handleMessage);
    chatSocket.current.addEventListener('close', handleClose);
    chatSocket.current.addEventListener('error', handleError);

    return () => {
      chatSocket.current.removeEventListener('open', handleOpen);
      chatSocket.current.removeEventListener('message', handleMessage);
      chatSocket.current.removeEventListener('close', handleClose);
      chatSocket.current.removeEventListener('error', handleError);
      chatSocket.current.close();
    };
  }, [token, username, user_id]);

  const handleInputChange = (e) => setMessage(e.target.value);

  const handleEmojiSelect = (emoji) => setMessage(prevMessage => prevMessage + emoji.native);

  const toggleEmojiPicker = (e) => {
    e.preventDefault();
    setPickerVisible(!isPickerVisible);
  };

  const handleOutsideClick = (event) => {
    if (emojiSelectorRef.current && !emojiSelectorRef.current.contains(event.target) && !event.target.classList.contains('emoji-button')) {
      setPickerVisible(false);
    }
  };

  const sendMessage = (e) => {
    if (message === "" || message === null) return;
    if (chatSocket.current && chatSocket.current.readyState === WebSocket.OPEN) {
      chatSocket.current.send(JSON.stringify({ message, username }));
      setMessage('');
    } else {
      console.error('WebSocket is not open.');
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const useKeyPress = (key, callback) => {
    useEffect(() => {
      const handleKeyPress = (e) => {
        if (e.key === key) {
          e.preventDefault();
          callback();
        }
      };

      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }, [key, callback]);
  };

  useKeyPress('Enter', sendMessage);

    useEffect(() => {
      if (!token) {
        return navigate('/login');
      }

    }, [token]);

  return (
    <div className="chats">
      {user_id ? (
        <div className="chats-container">
          <div className="chat-header">
            {Array.isArray(search) && search.map((element) => (
              <div className="chat-name-pic" key={element.id}>
                <div className="circle" style={element.online_status ? { border: '3px solid #25D366' } : { border: '3px solid lightgray' }}>
                  <img src={element.image} alt="profile-pic" />
                </div>
                <h2>{element.full_name}</h2>
              </div>
            ))}
          </div>
          <ReactScrollToBottom className="chat-box">
          {/* <div className="chat-box"> */}
            {messages.map((item, i) => (
              <Message key={i} message={item.message} position={item.position} time={item.time} date={item.date}/>
            ))}
            <div className="emoji-selector" style={isPickerVisible ? { display: 'block', position: 'fixed', transform: 'translateY(85%)' } : { display: 'none' }} ref={emojiSelectorRef}>
              <Picker data={data} onEmojiSelect={handleEmojiSelect} emojiSize={24} />
            </div>
            {/* </div> */}
          </ReactScrollToBottom>
          <div className="chat-input">
            {/* button */}
            <button className="emoji-button" style={{background:'none',border:'none',outline:'none',fontSize:'28px',cursor:'pointer'}} onClick={toggleEmojiPicker}>🗿</button>
            <textarea className="input-text" rows={1} columns={50} onChange={handleInputChange} ref={inputRef} value={message} name='chat-input' placeholder="Type your message..." ></textarea>
            {/* <input className="input-text" onChange={handleInputChange} ref={inputRef} value={message} name='chat-input' placeholder="Type your message..." type="text" /> */}
            <span className="send-message"><img src={sendButton} style={{width:'40px',cursor:'pointer'}} onClick={sendMessage}/></span>
          </div>
        </div>
      ) : (
        <div className="empty-chat-container">start your conversation</div>
      )}
    </div>
  );
};

export default Chats;
