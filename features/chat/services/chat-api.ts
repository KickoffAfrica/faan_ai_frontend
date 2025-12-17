import api from "@/lib/axios";
import { AxiosError } from "axios";
import {
  ChatMessageResult,
  FaanChatRequest,
  FaanChatResponse,
} from "../types";

export class ChatApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = "ChatApiError";
  }
}

/**
 * Send a chat message to the backend.
 * Single call – no polling. Backend returns the final response and conversationId.
 * @param message - The user's question
 * @param conversationId - Conversation ID for continuing conversation (undefined for first message)
 */
export async function sendChatMessage(
  message: string,
  conversationId?: string
): Promise<ChatMessageResult> {
  try {
    const payload: FaanChatRequest = {
      message,
      conversationId,
      // airport: "Lagos",
    };

    const response = await api.post<FaanChatResponse>("/api/chat", payload);

    if (!response.data.success) {
      throw new ChatApiError("Chat request failed", 400, response.data);
    }

    return {
      response: response.data.data.response,
      conversationId: response.data.data.conversationId,
      userId: response.data.data.userId,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status;
      const message =
        (error.response?.data as any)?.message ||
        error.message ||
        "Failed to send chat message";

      throw new ChatApiError(message, statusCode, error.response?.data);
    }

    throw new ChatApiError(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
}
