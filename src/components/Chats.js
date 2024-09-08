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
  const inputRef = useRef(null);
  const emojiSelectorRef = useRef(null);
  const chatSocket = useRef(null);
  
  const token = sessionStorage.getItem('token');
  const username = sessionStorage.getItem('username');

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
    <div className="emoji-selector" style={isPickerVisible ? { display: 'block',transform:'translateY(100%)'} : { display: 'none' }} ref={emojiSelectorRef}>
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
