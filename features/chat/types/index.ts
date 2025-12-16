export type MessageRole = "user" | "assistant";

export type MessageStatus = "sending" | "sent" | "error";

export type QueryStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  imageUrl?: string;
  timestamp: number;
  status?: MessageStatus;
  queryId?: string; // Backend query ID for reference
}

// Result from sending a chat message (conversationId-based)
export interface ChatMessageResult {
  response: string;
  conversationId?: string;
  userId?: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface ConversationHistory {
  id: string;
  messages: Message[];
  lastUpdated: number;
  title?: string;
}

// New FAAN chat API types
export interface FaanChatRequest {
  message: string;
  conversationId?: string;
  airport: string;
}

export interface FaanChatResponse {
  success: boolean;
  data: {
    response: string;
    conversationId: string;
    userId?: string;
    sources: unknown[];
    category: string;
    shouldEscalate: boolean;
  };
}
