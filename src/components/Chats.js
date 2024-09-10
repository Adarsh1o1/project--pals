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
  const [userStatuses, setUserStatuses] = useState({}); // Track user statuses
  const inputRef = useRef(null);
  const emojiSelectorRef = useRef(null);
  const chatSocket = useRef(null);
  const onlineStatusSocket = useRef(null);

  const token = sessionStorage.getItem('token');
  const username = sessionStorage.getItem('username');

  // WebSocket for chat messages
  useEffect(() => {
    chatSocket.current = new WebSocket(`ws://127.0.0.1:8000/ws/chat/testing/?token=${token}`);

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
  useEffect(() => {
    const loggedin_user = JSON.stringify(username.textContent);

    onlineStatusSocket.current = new WebSocket(
      'ws://' + window.location.host + '/ws/online/'
    );

    onlineStatusSocket.current.onopen = function(e) {
      console.log("CONNECTED TO ONLINE STATUS CONSUMER");
      onlineStatusSocket.current.send(JSON.stringify({
        'username': loggedin_user,
        'online_status': true
      }));
    };

    onlineStatusSocket.current.onclose = function(e) {
      console.log("DISCONNECTED FROM ONLINE STATUS CONSUMER");
    };

    onlineStatusSocket.current.onmessage = function(e) {
      const data = JSON.parse(e.data);
      if (data.username !== loggedin_user) {
        setUserStatuses(prevStatuses => ({
          ...prevStatuses,
          [data.username]: data.online_status ? 'Online' : 'Offline'
        }));
      }
    };

    window.addEventListener("beforeunload", function() {
      onlineStatusSocket.current.send(JSON.stringify({
        'username': loggedin_user,
        'online_status': false
      }));
    });

    return () => {
      if (onlineStatusSocket.current) {
        onlineStatusSocket.current.close();
      }
    };
  }, []);

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

  const sendMessage = () => {
    if (chatSocket.current && chatSocket.current.readyState === WebSocket.OPEN && message !== "") {
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

  return (
    <div className="chats">
      <div className="chats-container">
        <div className="chat-header"></div>
        <ReactScrollToBottom className="chat-box">
          {messages.map((item, i) => (
            <Message key={i} message={item.message} position={item.position} />
          ))}
          <div className="emoji-selector" style={isPickerVisible ? { display: 'block', transform: 'translateY(100%)' } : { display: 'none' }} ref={emojiSelectorRef}>
            <Picker data={data} onEmojiSelect={handleEmojiSelect} emojiSize={24} />
          </div>
        </ReactScrollToBottom>
        <div className="chat-input">
          <button className="emoji-button" onClick={toggleEmojiPicker}>emoji</button>
          <input className="input-text" onChange={handleInputChange} ref={inputRef} value={message} name='chat-input' placeholder="Type your message..." type="text" />
          <button className="send-message" onClick={sendMessage}>send</button>
        </div>
      </div>
      <div className="user-status">
        <h4>Online Status</h4>
        {Object.keys(userStatuses).map(user => (
          <div key={user}>
            <span id={`${user}_status`} style={{ color: userStatuses[user] === 'Online' ? 'green' : 'grey' }}>
              {user}
            </span>
            <small id={`${user}_small`}>{userStatuses[user]}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chats;
