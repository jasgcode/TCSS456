import React, { useState, useEffect } from 'react';
import Robot from './components/Avatar/Robot';
import Sidebar from './components/bar/Sidebar';
import Conversation from './components/bar/Conversation';
import { getAllConversations, startNewConversation, deleteConversation } from './utils';
import type { IConversation, MessageProps } from './components/types';

function App(): React.JSX.Element {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  // Load all conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    const allConversations = await getAllConversations();
    setConversations(allConversations);
    // If no conversation is selected, or the current one was deleted, clear selection
    if (currentConversationId && !allConversations.some(conv => conv.id === currentConversationId)) {
      setCurrentConversationId(null);
    }
  };

  const handleNewConversation = async () => {
    const initialMessage: MessageProps = {
      role: 'model',
      content: 'Hello! How can I help you today?',
      timestamp: Date.now(),
    };

    const newConversationId = await startNewConversation(
      [initialMessage],
      `Conversation ${new Date().toLocaleString()}`
    );

    if (newConversationId) {
      await loadConversations();
      setCurrentConversationId(newConversationId);
      // Collapse sidebar after creating new conversation
      setIsSidebarCollapsed(true);
    }
  };

  const handleSelectConversation = (id: number) => {
    setCurrentConversationId(id);
    // Collapse sidebar after selecting conversation
    setIsSidebarCollapsed(true);
  };

  const handleConversationUpdate = () => {
    // Reload conversations to update sidebar with any title changes
    loadConversations();
  };

  const handleDeleteConversation = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this conversation?");
    if (confirmDelete) {
      await deleteConversation(id);
      await loadConversations();
      if (currentConversationId === id) {
        setCurrentConversationId(null); // Deselect if the deleted conversation was active
      }
    }
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="app-layout">
      {/* Sidebar - always rendered, but with collapsed state */}
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />

      {/* Main Content Area - Add sidebar-open class when sidebar is visible */}
      <div className={`main-content-area ${!isSidebarCollapsed ? 'sidebar-open' : ''}`}>
        {/* Robot Avatar Display - Always visible */}
        <div className="robot-side">
          <Robot />
        </div>  

        {/* Conversation Display or Welcome Screen */}
        {currentConversationId ? (
          <div className="chat-area">
            <Conversation
              conversationId={currentConversationId}
              onConversationUpdate={handleConversationUpdate}
            />
          </div>
        ) : (
          <div className="welcome-screen">
            <div className="welcome-content">
              <h1 className="welcome-title">Welcome to AI Chat</h1>
              <p className="welcome-subtitle">
                Start a new conversation to begin chatting
              </p>
              <button
                onClick={handleNewConversation}
                className="welcome-start-btn"
              >
                Start New Conversation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;