import { useState, useRef, useEffect } from 'react';

function App(): React.JSX.Element {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]); // Array to store messages
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent newline
      if (message.trim()) {
        setMessages([...messages, message]);
        setMessage(''); // Clear input
  
        // Reset textarea height
        if (textAreaRef.current) {
          textAreaRef.current.style.height = '75px'; // Match your min-height
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
  
  // Scroll to the bottom to show the newest message
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]); // Run this effect whenever messages change

  return (
    <div className="app-layout">
      {/* Left Side: Robot Animation */}
      <div className="robot-side">
        <img src="/robot.gif" alt="Robot" className="robot-animation" />
      </div>
  
      {/* Right Side: Chat UI */}
      <div className="chat-side">
        <div className="message-container" ref={messageContainerRef}>
          {messages.map((msg, index) => (
            <div key={index} className="message">{msg}</div>
          ))}
        </div>
  
        <textarea
          className="input-box"
          placeholder="Ask me anything..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          ref={textAreaRef}
        />
      </div>
    </div>
  );
}

  export default App;

