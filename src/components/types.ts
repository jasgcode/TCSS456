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

export interface IConversation {
  id?: number;
  title: string;
  timestamp: number;
  messages: MessageProps[];
}
