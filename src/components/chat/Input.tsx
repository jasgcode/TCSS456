import React, { useRef } from 'react';
import { InputProps } from '../types';

const Input: React.FC<InputProps> = ({ message, setMessage, onSendMessage }) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent newline
      if (message.trim()) {
        onSendMessage();

        // Reset textarea height
        if (textAreaRef.current) {
          textAreaRef.current.style.height = '75px'; // match your min-height
        }
      }
    }
  };

  const handleInput = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto'; // Reset height
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Set to scroll height
    }
  };

  return (
    <textarea
      className="input-box"
      placeholder="Ask me anything..."
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={handleKeyDown}
      onInput={handleInput}
      ref={textAreaRef}
      style={{ minHeight: '75px', resize: 'none' }}
    />
  );
};

export default Input;
