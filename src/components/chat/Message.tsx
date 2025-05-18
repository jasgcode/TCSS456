import React from 'react';
import { MessageProps } from '../types'


const Message: React.FC<MessageProps> = React.memo(({ content, role }) => {
  // Determine the className based on the role
  const messageClass = role === 'model' ? 'message_model' : 'message';

  return (
    <div className={messageClass}>
      {content}
    </div>
  );
});

export default Message;