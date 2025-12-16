"use client";

import { useMutation } from "@tanstack/react-query";
import { sendChatMessage, ChatApiError } from "../services/chat-api";
import { ChatMessageResult } from "../types";

interface ChatMutationVariables {
  message: string;
  sessionId?: string;
}

export function useChatMutation() {
  return useMutation<ChatMessageResult, ChatApiError, ChatMutationVariables>({
    mutationFn: ({ message, sessionId = "" }) => sendChatMessage(message, sessionId),
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx) or timeout
      if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        return false;
      }
      // Retry up to 1 time for other errors
      return failureCount < 1;
    },
    retryDelay: 2000,
  });
}
