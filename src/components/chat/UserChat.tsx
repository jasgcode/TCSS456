import React from 'react';
import type { UserChatProps } from '../types';

const UserChat: React.FC<UserChatProps> = ({ messages }) => {
  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '1rem' }}>
      {messages.map(({ role, content, timestamp }, index) => (
        <div
          key={index}
          style={{
            marginBottom: '1rem',
            textAlign: role === 'user' ? 'right' : 'left',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              backgroundColor: role === 'user' ? '#4a90e2' : '#eee',
              color: role === 'user' ? 'white' : 'black',
              padding: '0.5rem 1rem',
              borderRadius: '12px',
              maxWidth: '70%',
              whiteSpace: 'pre-wrap',
            }}
          >
            {content}
          </div>
          {timestamp && (
            <div
              style={{
                fontSize: '0.7rem',
                color: '#666',
                marginTop: '0.25rem',
              }}
            >
              {new Date(timestamp).toLocaleTimeString()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserChat;
