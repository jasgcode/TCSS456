import { useState, useRef, useEffect } from 'react';
import electronLogo from './assets/electron.svg';

function App(): React.JSX.Element {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]); // Array to store messages
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent newline on Enter
      if (message.trim()) {
        // Add the new message at the bottom
        setMessages([...messages, message]);
        setMessage(''); // Clear the input field
      }
    }
  };

  const handleInput = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto'; // Reset height to auto to calculate new height
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Set height based on scrollHeight
    }
  };

  // Scroll to the bottom to show the newest message
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]); // Run this effect whenever messages change

  return (
    <>
      {/* Message container (Chat UI) */}
      <div className="message-container" ref={messageContainerRef}>
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {msg}
          </div>
        ))}
      </div>

      {/* Text input area */}
      <textarea
        className="input-box"
        placeholder="Ask me anything..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput} // Dynamically adjust height on input
        ref={textAreaRef} // Reference for the textarea element
      />
    </>
  );
}

export default App;

