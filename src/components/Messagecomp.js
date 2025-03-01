import React, { useEffect, useRef, useState } from 'react';
import './style/Messagecomp.css';

const Messagecomp = ({recentChats,key,user_id,image,last_message,last_updated}) => {

  const handleUserId =()=>{
    sessionStorage.setItem('user_id',user_id);
    window.location.reload();
  }

  return (
    // msgcom
    <div>
      <div className="messagecomp-container">
        <div className='circle'><img src={image}/></div>
            <div className='recentChats' style={{display:'flex',flexDirection:'column',fontSize:'18px'}} key={key} onClick={handleUserId}>
            
              <ul>
                <li>{recentChats}</li>
                <li className='message-time' style={{fontSize:'13px',fontWeight:'500',color:'Black'}}><span>Updated&nbsp;{last_updated}</span></li>
              
              </ul>
            </div>
      </div>
    </div>
  );
};

export default Messagecomp;
