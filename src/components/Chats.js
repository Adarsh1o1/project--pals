import React, { useRef, useState, useEffect } from "react";
import './style/Chats.css';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import socketIo from "socket.io-client";
import Message from "./Message";
import ReactScrollToBottom, { useScrollTo } from 'react-scroll-to-bottom';

const Chats = () => {
  const [ispickervisible, setPickervisible] = useState(false);
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [message, setMessage] = useState("");
  const [currentmessage, setcurrentMessage] = useState("");
  const [messages,setmessages] = useState([]);
  const inputRef = useRef(null);
  const emojiSelectorRef = useRef(null);
  const [socket,setSocket] = useState(null);

  // const socket = socketIo(ENDPOINT,{transports:['websocket']});
  // useEffect(()=>{
  //   const newSocket = io("http://localhost:8080");
  //   setSocket(newSocket);

  //   return ()=>{
  //     newSocket.disconnect();
  //   }
  // },[10]);

  //   socket.emit('joined',{})
  //   return()=>{

  //   }
  // },[])

  const inputtextvalue = (e) => {
    setMessage(e.target.value);
    console.log(message);
  }

  const handleEmojiSelect = (e) => {
    const selectedEmoji = e.native;
    setSelectedEmojis((prevEmojis) => [...prevEmojis, selectedEmoji]);
    setMessage((prevMessage) => prevMessage + selectedEmoji);
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
    // setcurrentMessage(message);
    if(message!==''){
      setmessages([...messages,message]);
      setMessage('');
      setSelectedEmojis([]); // Clear selected emojis after sending the message
    }
  }
  

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
  }, [ispickervisible]);


  const useKeyPress = (key, callback) => {
    useEffect(() => {
      const handleKeyPress = (e) => {
        if (e.key === key) {
          e.preventDefault();
          callback();
        }
      };
  
      document.addEventListener('keydown', handleKeyPress);
  
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      };
    }, [key, callback]);
  };
  
  // Usage in your component
  useKeyPress('Enter', sendmessage);

  return (
    <div className="chats">
      <div className="chats-container">
        <div className="chat-header"></div>
        <ReactScrollToBottom className="chat-box">
          {/* <h1>{currentmessage}</h1> */}
          {messages.map((item, i) => (
  <Message key={i} message={item} />
))}

          {/* <Message message={currentmessage}/> */}
          <div
            className="emoji-selector"
            style={ispickervisible ? { display: 'block',width:'fit-content',height:'fit-content', bottom: '0px', position: 'absolute',zIndex:'1000000' } : { display: 'none' }}

            ref={emojiSelectorRef}
          >
            <Picker data={data} previewPostion='bottom' onEmojiSelect={handleEmojiSelect} emojiSize={24} />
          </div>
        </ReactScrollToBottom>
        <div className="chat-input">
          <button className="emojibutton" onClick={handleEmojiButtonClick}>emoji</button>
          <input
            className="input-text"
            onChange={inputtextvalue}
            ref={inputRef}
            value={message}
            name='chat-input'
            placeholder="Type your message..."
            type="text"
          />
          <button onClick={sendmessage} onEnter>send</button>
        </div>

      </div>
    </div>
  );
}

export default Chats;
