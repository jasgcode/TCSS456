import React, { useRef } from 'react';
import { InputProps } from '../types';

const Input: React.FC<InputProps> = ({ message, setMessage, onSendMessage }) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent newline
      if (message.trim()) {
        onSendMessage();
      }
    }
  };

  return (
    <textarea
      className="input-box"
      placeholder="Ask me anything..."
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={handleKeyDown}
      ref={textAreaRef}
    />
  );
};

export default Input;