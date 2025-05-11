import React, { useRef, useEffect } from 'react';
import Message from './Message';

interface UserChatProps {
  messages: string[];
}

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
        <Message key={index} content={msg} />
      ))}
    </div>
  );
};

export default UserChat;