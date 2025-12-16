"use client";

import { useEffect, useState } from "react";
import { ConversationHistory, Message } from "../types";
import { chatStorage } from "../utils/chat-storage";

export function useChatHistory() {
  const [currentConversation, setCurrentConversation] =
    useState<ConversationHistory | null>(null);
  const [allConversations, setAllConversations] = useState<
    ConversationHistory[]
  >([]);

  // Load conversation on mount - always start fresh for /c route
  useEffect(() => {
    // Always create a new conversation when visiting /c
    // This ensures a fresh state each time
    const newConv = chatStorage.createNewConversation();
    setCurrentConversation(newConv);
    setAllConversations(chatStorage.getAllConversations());
  }, []);

  // Save messages to storage
  const saveMessages = (messages: Message[]) => {
    if (currentConversation) {
      const updated: ConversationHistory = {
        ...currentConversation,
        messages,
        lastUpdated: Date.now(),
        // Update title based on first user message if not set
        title:
          messages.length > 0 && currentConversation.title === "New Conversation"
            ? messages[0].content.substring(0, 50) + "..."
            : currentConversation.title,
      };
      chatStorage.saveConversation(updated);
      setCurrentConversation(updated);
    }
  };

  // Create new conversation
  const createNewConversation = () => {
    const newConv = chatStorage.createNewConversation();
    setCurrentConversation(newConv);
    setAllConversations(chatStorage.getAllConversations());
    return newConv;
  };

  // Switch to a different conversation
  const switchConversation = (id: string) => {
    const conversations = chatStorage.getAllConversations();
    const conv = conversations.find((c) => c.id === id);
    if (conv) {
      chatStorage.setCurrentConversation(id);
      setCurrentConversation(conv);
    }
  };

  // Delete conversation
  const deleteConversation = (id: string) => {
    chatStorage.deleteConversation(id);
    setAllConversations(chatStorage.getAllConversations());

    // If deleted conversation was current, create new one
    if (currentConversation?.id === id) {
      createNewConversation();
    }
  };

  // Clear all history
  const clearAllHistory = () => {
    chatStorage.clearAllConversations();
    const newConv = chatStorage.createNewConversation();
    setCurrentConversation(newConv);
    setAllConversations([]);
  };

  return {
    currentConversation,
    allConversations,
    saveMessages,
    createNewConversation,
    switchConversation,
    deleteConversation,
    clearAllHistory,
  };
}

