import React, { useRef, useEffect } from 'react';
import Message from './Message';

import { UserChatProps } from '../types';

const UserChat: React.FC<UserChatProps> = ({ messages }) => {
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  
  // Scroll to the bottom to show the newest message
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  
  }, [messages]); // Run this effect whenever messages change

  return (
    <div className="message-container" ref={messageContainerRef}>
      {messages.map((msg, index) => (
        <Message key={index} content={msg} role="user" />
      ))}
    </div>
  );
};

export default UserChat;