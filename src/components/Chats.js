import React, { useRef, useState, useEffect } from "react";
import './style/Chats.css';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import Message from "./Message";
import ReactScrollToBottom from 'react-scroll-to-bottom';

const Chats = () => {
  const [ispickervisible, setPickervisible] = useState(false);
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const inputRef = useRef(null);
  const emojiSelectorRef = useRef(null);
  const chatSocket = useRef(null);
  const [position, setPosition] = useState('left')
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    chatSocket.current = new WebSocket(`ws://127.0.0.1:8000/ws/chat/testing/?token=${token}`);

    if (chatSocket.current) {
      chatSocket.current.onopen = function () {
        console.log('WebSocket connected');
      };

      chatSocket.current.onmessage = function (e) {
        const data = JSON.parse(e.data);
        console.log(data);
        setMessages(prevMessages => [...prevMessages, { message: data.message, position: "left" }]);
        // setPosition("left")
      };

      chatSocket.current.onclose = function () {
        console.log('WebSocket closed');
      };

      chatSocket.current.onerror = function (error) {
        console.error('WebSocket error:', error);
      };
    }

    return () => {
      if (chatSocket.current) {
        chatSocket.current.close(); // Close WebSocket connection on component unmount
      }
    };
  }, []);

  const inputtextvalue = (e) => {
    setMessage(e.target.value);

  }

  const handleEmojiSelect = (e) => {
    const selectedEmoji = e.native;
    setSelectedEmojis(prevEmojis => [...prevEmojis, selectedEmoji]);
    setMessage(prevMessage => prevMessage + selectedEmoji);
  }

  const handleEmojiButtonClick = (e) => {
    e.preventDefault();
    setPickervisible(!ispickervisible);
  }

  const handleOutsideClick = (event) => {
    if (emojiSelectorRef.current && !emojiSelectorRef.current.contains(event.target) && !event.target.classList.contains('emojibutton')) {
      setPickervisible(false);
    }
  }

  const sendmessage = () => {
    const username = sessionStorage.getItem('username')
    if (chatSocket.current && chatSocket.current.readyState === WebSocket.OPEN) {
      chatSocket.current.send(JSON.stringify({
        'message': message, 'username':username
      }));
      setMessage('');
      setMessages(prevMessage => [...prevMessage, { message, position: 'right' }])
      // setPosition('right')
      setSelectedEmojis([]);
    } else {
      console.error('WebSocket is not open.');
    }
    // setPosition(prevpos=>prevpos==='right'?'left':'right');
  }

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [ispickervisible]);

  const useKeyPress = (key, callback) => {
    useEffect(() => {
      const handleKeyPress = (e) => {
        if (e.key === key) {
          e.preventDefault();
          callback();
        }
      };

      // setPosition(prevPosition => prevPosition === 'right' ? 'left' : 'right');
      document.addEventListener('keydown', handleKeyPress);

      return () => {
        document.removeEventListener('keydown', handleKeyPress);
        // setPosition('left');
      };
    }, [key, callback]);
  };

  useKeyPress('Enter', sendmessage);
  return (
    <div className="chats">
      <div className="chats-container">
        <div className="chat-header"></div>
        <ReactScrollToBottom className="chat-box">
          {messages.map((item, i) => (
            <Message key={i} message={item.message} position={item.position} />
          ))}
          <div className="emoji-selector" style={ispickervisible ? { display: 'block', width: 'fit-content', height: 'fit-content', bottom: '0px', position: 'absolute', zIndex: '1000000' } : { display: 'none' }} ref={emojiSelectorRef}>
            <Picker data={data} previewPostion='bottom' onEmojiSelect={handleEmojiSelect} emojiSize={24} />
          </div>
        </ReactScrollToBottom>
        <div className="chat-input">
          <button className="emojibutton" onClick={handleEmojiButtonClick}>emoji</button>
          <input className="input-text" onChange={inputtextvalue} ref={inputRef} value={message} name='chat-input' placeholder="Type your message..." type="text" />
          <button className="send-message" onClick={sendmessage}>send</button>
        </div>
      </div >
    </div >
  );
  
}

export default Chats;