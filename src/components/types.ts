export interface MessageProps {
  role: 'user' | 'model';
  content: string;
  timestamp?: number;
}

export interface InputProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  onSendMessage: () => void;
}

export interface UserChatProps {
  messages: MessageProps[];
}

export interface SidebarProps {
  conversations: IConversation[];
  currentConversationId: number | null;
  onSelectConversation: (id: number) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: number) => void; 
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export interface IConversation {
  id?: number;
  title: string;
  timestamp: number;
  messages: MessageProps[];
}
export interface ConversationProps {
  conversationId: number | null;
  onConversationUpdate?: () => void;
}