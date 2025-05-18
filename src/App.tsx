// App.tsx
import React, { useState } from 'react';
import Robot from './components/Avatar/Robot';
import UserChat from './components/chat/UserChat';
import Input from './components/chat/Input';

function App(): React.JSX.Element {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]); // Array to store messages

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, message]);
      setMessage(''); // Clear input
    }
  };

  return (
    <div className="app-layout">
      {/* Left Side: Robot Animation */}
      <Robot />
  
      {/* Right Side: Chat UI */}
      <div className="chat-side">
        <UserChat messages={messages} />
        <Input 
          message={message} 
          setMessage={setMessage} 
          onSendMessage={handleSendMessage} 
        />
      </div>
    </div>
  );
}

export default App;

