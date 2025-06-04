import React, { useState, useEffect } from "react";
import UserChat from '../chat/UserChat';
import Input from '../chat/Input';
import { addMessageFetchResponse, getConversationById } from '../../utils';
import type { ConversationProps, MessageProps } from '../types';



const Conversation: React.FC<ConversationProps> = ({ conversationId, onConversationUpdate }) => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load conversation when conversationId changes
  useEffect(() => {
    const loadConversation = async () => {
      if (conversationId) {
        const conversation = await getConversationById(conversationId);
        if (conversation && conversation.messages) {
          setMessages(conversation.messages);
        } else {
          setMessages([]); // Clear messages if conversation not found or has no messages
        }
      } else {
        setMessages([]);
      }
    };

    loadConversation();
  }, [conversationId]);

  const handleSendMessage = async () => {
    if (!message.trim() || !conversationId || isLoading) return;

    const userMessage: MessageProps = {
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };

    // Optimistically update UI
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      // Send message and fetch response
      const success = await addMessageFetchResponse(conversationId, userMessage);
      
      if (success) {
        // Reload conversation to get the latest messages including the model response
        const updatedConversation = await getConversationById(conversationId);
        if (updatedConversation && updatedConversation.messages) {
          setMessages(updatedConversation.messages);
        }
        
        // Notify parent component about the update
        if (onConversationUpdate) {
          onConversationUpdate();
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // The error message is already handled in utils.ts
    } finally {
      setIsLoading(false);
    }
  };

  if (!conversationId) {
    // This case should ideally not be reached if App.tsx handles the display correctly
    // or it means no conversation is selected, and we show a prompt.
    return (
      <div className="no-conversation-selected">
        Select a conversation or start a new one
      </div>
    );
  }

  return (
    <div className="conversation-container">
      {/* Chat Messages Area */}
      <div className="message-container">
        <UserChat messages={messages} />
      </div>

      {/* Input Area */}
      <div className="input-area">
        <Input
          message={message}
          setMessage={setMessage}
          onSendMessage={handleSendMessage}
        />
        {isLoading && (
          <div className="loading-indicator">
            Thinking...
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversation;