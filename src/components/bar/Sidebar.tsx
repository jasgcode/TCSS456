import React from 'react';
import type {SidebarProps } from '../types';


const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation, 
  isCollapsed,
  onToggleCollapse,
}) => {
  return (
    <>
      {/* Hamburger Menu Button - Always Visible */}
      <button
        onClick={onToggleCollapse}
        className="hamburger-menu"
        aria-label={isCollapsed ? 'Open sidebar' : 'Close sidebar'}
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        {/* Header with New Conversation Button */}
        <div className="sidebar-header">
          <button
            onClick={onNewConversation}
            className="new-conversation-btn"
          >
            <span className="plus-icon">+</span>
            <span>New Conversation</span>
          </button>
        </div>

        {/* Conversations List */}
        <div className="conversations-list">
          {conversations.length === 0 ? (
            <div className="empty-state">
              No conversations yet
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`conversation-item ${
                  conversation.id === currentConversationId ? 'active' : ''
                }`}
              >
                <div
                  className="conversation-info"
                  onClick={() => conversation.id && onSelectConversation(conversation.id)}
                >
                  <div className="conversation-title">
                    {conversation.title}
                  </div>
                  <div className="conversation-date">
                    {new Date(conversation.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent selecting conversation when deleting
                    conversation.id && onDeleteConversation(conversation.id);
                  }}
                  className="delete-conversation-btn"
                  aria-label={`Delete conversation ${conversation.title}`}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {!isCollapsed && (
        <div 
          className="sidebar-overlay"
          onClick={onToggleCollapse}
        />
      )}
    </>
  );
};

export default Sidebar;