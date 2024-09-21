import React, { useState } from 'react';
import './style/Message.css';

const Message = ({ message, position, time, date }) => {
  const [realDate, setRealDate] = useState(false);

  // Function to break the message into lines of max 40 characters
  const breakMessageIntoLines = (msg) => {
    const maxLineLength = 150;
    const regex = new RegExp(`.{1,${maxLineLength}}`, 'g');
    return msg.match(regex) || []; // Return an empty array if no match
  };

  // Handle hover to show date
  const handleHover = () => setRealDate(true);
  const handleHover2 = () => setRealDate(false);

  // Break the message into chunks
  const messageLines = breakMessageIntoLines(message);

  return (
    <>
      <div
        className={`message-box ${position}`}
        onMouseEnter={handleHover}
        onMouseLeave={handleHover2}
      >
        <div className='messages' style={{whiteSpace:'pre-wrap'}}>
          {messageLines.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
          {/* {message} */}
        </div>
        <div className='time-date'>
          {realDate ? (
            <span style={{ textAlign: 'right' }}>{date}</span>
          ) : (
            <span style={{ textAlign: 'right' }}>{time}</span>
          )}
        </div>
      </div>
    </>
  );
};

export default Message;
