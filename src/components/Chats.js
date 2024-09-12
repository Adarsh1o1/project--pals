import React, { useRef, useState, useEffect } from "react";
import './style/Chats.css';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import Message from "./Message";
import ReactScrollToBottom from 'react-scroll-to-bottom';

const Chats = () => {
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const initialsearched = [];
  const inputRef = useRef(null);
  const emojiSelectorRef = useRef(null);
  const chatSocket = useRef(null);
  const [search, setsearch] = useState(initialsearched);
  const searched_name = sessionStorage.getItem('username1')
  const token = sessionStorage.getItem('token');
  const username = sessionStorage.getItem('username');


  const fetchalldata = async () => {
    let response = await fetch(`http://127.0.0.1:8000/api/accounts/search/${searched_name}`, {
      method: 'GET',
      headers: { 'Authorization':`Bearer ${token}` }
    });
    let json = await response.json();
    console.log("json:",json)
    setsearch(json);
    
  }
  
  let user_id = sessionStorage.getItem('user_id')
  // WebSocket for chat messages
  useEffect(() => {
    fetchalldata();
    console.log(message);
    chatSocket.current = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${user_id}/?token=${token}`);

    const handleOpen = () => console.log('WebSocket connected');
    const handleMessage = (e) => {
      const data = JSON.parse(e.data);
      const position = data.username !== username ? 'left' : 'right';
      setMessages(prevMessages => [...prevMessages, { message: data.message, position }]);
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
  }, [token, username]);

  // WebSocket for user online status
 
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
    if(message==="" || message===null){
      return
    }
    else if (chatSocket.current && chatSocket.current.readyState === WebSocket.OPEN) {
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
  // useKeyPress('Enter', handleOutsideClick);

  return (
    <div className="chats">
      <div className="chats-container">
        <div className="chat-header">
      {Array.isArray(search) ? (search.map((element)=>(
        <div className="chat-name-pic">
        <div className="circle" style={element.online_status?{border:'3px solid #25D366'}:{border:'3px solid lightgray'}}><img src={element.image}/></div>
        <h2>{element.full_name}</h2>
        </div>))):""}

        </div>
        <ReactScrollToBottom className="chat-box">
          {messages.map((item, i) => (
            <Message key={i} message={item.message} position={item.position} />
          ))}
          <div className="emoji-selector" style={isPickerVisible ? { display: 'block',position:'fixed', transform: 'translateY(85%)' } : { display: 'none' }} ref={emojiSelectorRef}>
            <Picker data={data} onEmojiSelect={handleEmojiSelect} emojiSize={24} />
          </div>
        </ReactScrollToBottom>
        <div className="chat-input">
          <button className="emoji-button" onClick={toggleEmojiPicker}>emoji</button>
          <input className="input-text" onChange={handleInputChange} ref={inputRef} value={message} name='chat-input' placeholder="Type your message..." type="text" />
          <button className="send-message" onClick={sendMessage}>send</button>
        </div>
      </div>
    </div>
  );
};

export default Chats;
