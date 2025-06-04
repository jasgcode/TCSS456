import React, { useEffect, useRef } from 'react';
import type { UserChatProps } from '../types';

const UserChat: React.FC<UserChatProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      {messages.map(({ role, content, timestamp }, index) => {
        const wrapperClass = role === 'user' ? 'message-wrapper user' : 'message-wrapper model';
        const bubbleClass  = role === 'user' ? 'message-bubble user' : 'message-bubble model';

        return (
          // The anonymous div that was here has been removed.
          // The .message-bubble and .message-timestamp are now direct children of the wrapper.
          <div key={index} className={wrapperClass}>
            <div className={bubbleClass}>{content}</div>
            {timestamp && (
              <div className="message-timestamp">
                {new Date(timestamp).toLocaleTimeString()}
              </div>
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </>
  );
};

export default UserChat;