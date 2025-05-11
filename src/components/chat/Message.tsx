import React from 'react';

interface MessageProps {
  content: string;
}

// Prevent re-renders if content hasn't changed
const Message: React.FC<MessageProps> = React.memo(({ content }) => {
  return (
    <div className="message">{content}</div>
  );
});

export default Message;