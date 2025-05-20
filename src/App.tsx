import React, { useState } from 'react';
import Robot from './components/Avatar/Robot';
import UserChat from './components/chat/UserChat';
import Input from './components/chat/Input';
import type { MessageProps } from './components/types';

function App(): React.JSX.Element {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [message, setMessage] = useState('');

  async function handleSendMessage(content: string) {
    if (!content.trim()) return;

    const userMessage: MessageProps = {
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    // Add user message locally
    setMessages((prev) => [...prev, userMessage]);
    setMessage(''); // clear input

    try {
      const response = await fetch('http://localhost:8000/api/v1/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: messages.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.statusText}`);
      }

      const data = await response.json();

      const modelMessage: MessageProps = {
        role: 'model',
        content: data.response,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: 'Error: Could not get response from assistant.',
          timestamp: Date.now(),
        },
      ]);
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div
        style={{
          flex: 1,
          backgroundColor: '#222',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Robot />
      </div>

      <div
        style={{
          flex: 2,
          display: 'flex',
          flexDirection: 'column',
          padding: '1rem',
        }}
      >
        <UserChat messages={messages} />
        <Input message={message} setMessage={setMessage} onSendMessage={() => handleSendMessage(message)} />
      </div>
    </div>
  );
}

export default App;
