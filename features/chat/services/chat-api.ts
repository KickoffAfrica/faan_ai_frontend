import api, { API_BASE_URL } from "@/lib/axios";
import { AxiosError } from "axios";
import {
  ApiConversationWithMessages,
  StreamEvent,
  StreamOutcome,
} from "../types";
import { readNdjsonStream } from "../utils/ndjson";

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

function toChatApiError(error: unknown, fallback: string): ChatApiError {
  if (error instanceof ChatApiError) return error;
  if (error instanceof AxiosError) {
    const body = error.response?.data as { error?: string } | undefined;
    return new ChatApiError(
      body?.error || error.message || fallback,
      error.response?.status,
      body
    );
  }
  return new ChatApiError(error instanceof Error ? error.message : fallback);
}

export async function getConversation(
  id: string
): Promise<ApiConversationWithMessages> {
  try {
    const { data } = await api.get<ApiConversationWithMessages>(
      `/conversations/${id}`
    );
    return data;
  } catch (error) {
    throw toChatApiError(error, "Couldn't load this conversation");
  }
}

export async function deleteConversation(id: string): Promise<void> {
  try {
    await api.delete(`/conversations/${id}`);
  } catch (error) {
    const apiError = toChatApiError(error, "Couldn't delete this conversation");
    // Already gone on the server — treat as success.
    if (apiError.statusCode === 404) return;
    throw apiError;
  }
}

/** Resolves to false when nothing was generating (404). */
export async function cancelGeneration(id: string): Promise<boolean> {
  try {
    await api.post(`/conversations/${id}/cancel`);
    return true;
  } catch (error) {
    const apiError = toChatApiError(error, "Couldn't stop the response");
    if (apiError.statusCode === 404) return false;
    throw apiError;
  }
}

interface SendMessageOptions {
  file?: File;
  signal?: AbortSignal;
  onChunk: (content: string) => void;
  onQueued?: (elapsedSeconds: number) => void;
  /** Fires as soon as the server assigns an ID to a newly created conversation. */
  onConversationId?: (conversationId: string) => void;
}

/**
 * Streams an AI reply. With no `conversationId`, the server creates the
 * conversation (POST /conversations/messages) and reports its ID.
 */
export async function sendMessageStream(
  conversationId: string | null,
  content: string,
  { file, signal, onChunk, onQueued, onConversationId }: SendMessageOptions
): Promise<StreamOutcome> {
  let body: BodyInit;
  const headers: Record<string, string> = {};

  if (file) {
    const form = new FormData();
    form.append("content", content);
    form.append("file", file);
    body = form;
  } else {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify({ content });
  }

  const path = conversationId
    ? `/conversations/${conversationId}/messages`
    : "/conversations/messages";
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers,
    body,
    signal,
  });

  if (!response.ok) {
    let errorBody: { error?: string } | undefined;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = undefined;
    }
    throw new ChatApiError(
      errorBody?.error || response.statusText || "Failed to send message",
      response.status,
      errorBody
    );
  }

  if (!response.body) {
    throw new ChatApiError("Empty response from server", response.status);
  }

  let reportedId = conversationId;
  const reportConversationId = (id: string | null | undefined) => {
    if (id && id !== reportedId) {
      reportedId = id;
      onConversationId?.(id);
    }
  };
  reportConversationId(response.headers.get("X-Conversation-Id"));

  for await (const event of readNdjsonStream<StreamEvent>(response.body)) {
    switch (event.type) {
      case "queued":
        onQueued?.(event.elapsed_seconds);
        break;
      case "chunk":
        onChunk(event.content);
        break;
      case "done":
        reportConversationId(event.conversation_id);
        return { status: "done", message: event.message, conversationId: reportedId };
      case "cancelled":
        reportConversationId(event.conversation_id);
        return { status: "cancelled", message: event.message, conversationId: reportedId };
      case "error":
        throw new ChatApiError(event.error, response.status, event);
    }
  }

  throw new ChatApiError("The response ended unexpectedly", response.status);
}
