import { ConversationHistory, Message } from "../types";

const STORAGE_KEY = "nigerian-tax-chat-history";
const CURRENT_CONVERSATION_KEY = "nigerian-tax-current-conversation";

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined";

export const chatStorage = {
  // Get all conversation histories
  getAllConversations(): ConversationHistory[] {
    if (!isBrowser) return [];
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading chat history:", error);
      return [];
    }
  },

  // Get current conversation
  getCurrentConversation(): ConversationHistory | null {
    if (!isBrowser) return null;
    
    try {
      const id = localStorage.getItem(CURRENT_CONVERSATION_KEY);
      if (!id) return null;

      const conversations = this.getAllConversations();
      return conversations.find((c) => c.id === id) || null;
    } catch (error) {
      console.error("Error reading current conversation:", error);
      return null;
    }
  },

  // Save or update a conversation
  saveConversation(conversation: ConversationHistory): void {
    if (!isBrowser) return;
    
    try {
      const conversations = this.getAllConversations();
      const index = conversations.findIndex((c) => c.id === conversation.id);

      if (index >= 0) {
        conversations[index] = conversation;
      } else {
        conversations.push(conversation);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
      localStorage.setItem(CURRENT_CONVERSATION_KEY, conversation.id);
    } catch (error) {
      console.error("Error saving conversation:", error);
    }
  },

  // Update messages in current conversation
  updateMessages(messages: Message[]): void {
    if (!isBrowser) return;
    
    try {
      const currentId = localStorage.getItem(CURRENT_CONVERSATION_KEY);
      if (!currentId) return;

      const conversations = this.getAllConversations();
      const index = conversations.findIndex((c) => c.id === currentId);

      if (index >= 0) {
        conversations[index] = {
          ...conversations[index],
          messages,
          lastUpdated: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
      }
    } catch (error) {
      console.error("Error updating messages:", error);
    }
  },

  // Create a new conversation
  createNewConversation(): ConversationHistory {
    const newConversation: ConversationHistory = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      messages: [],
      lastUpdated: Date.now(),
      title: "New Conversation",
    };

    if (isBrowser) {
      this.saveConversation(newConversation);
    }

    return newConversation;
  },

  // Set current conversation
  setCurrentConversation(id: string): void {
    if (!isBrowser) return;
    
    try {
      localStorage.setItem(CURRENT_CONVERSATION_KEY, id);
    } catch (error) {
      console.error("Error setting current conversation:", error);
    }
  },

  // Delete a conversation
  deleteConversation(id: string): void {
    if (!isBrowser) return;
    
    try {
      const conversations = this.getAllConversations();
      const filtered = conversations.filter((c) => c.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

      // If deleted conversation was current, clear it
      const currentId = localStorage.getItem(CURRENT_CONVERSATION_KEY);
      if (currentId === id) {
        localStorage.removeItem(CURRENT_CONVERSATION_KEY);
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  },

  // Clear all conversations
  clearAllConversations(): void {
    if (!isBrowser) return;
    
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(CURRENT_CONVERSATION_KEY);
    } catch (error) {
      console.error("Error clearing conversations:", error);
    }
  },
};

