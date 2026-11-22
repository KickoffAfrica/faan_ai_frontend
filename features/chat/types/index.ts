export type MessageRole = "user" | "assistant";

// ---- API shapes (https://api-faan.kickoff.africa/docs) ----

export interface ApiConversation {
  id: string;
  title: string | null;
  created_at: string;
  last_message_at?: string | null;
}

export interface ApiMessage {
  id: string;
  role: MessageRole;
  content: string;
  attachment_url?: string | null;
  attachment_type?: "image" | "pdf" | "text" | null;
  attachment_name?: string | null;
  model_used?: string | null;
  tokens_used?: number | null;
  created_at: string;
}

export interface ApiConversationWithMessages extends ApiConversation {
  messages: ApiMessage[];
}

interface StreamResultFields {
  conversation_id?: string;
  message?: ApiMessage;
  model_used?: string;
  tokens_used?: number;
  used_web_search?: boolean;
  used_knowledge_base?: boolean;
}

export type StreamEvent =
  | { type: "queued"; elapsed_seconds: number }
  | { type: "chunk"; content: string }
  | ({ type: "done"; message: ApiMessage } & StreamResultFields)
  | ({ type: "cancelled" } & StreamResultFields)
  | { type: "error"; error: string };

export type StreamOutcome =
  | { status: "done"; message: ApiMessage; conversationId: string | null }
  | { status: "cancelled"; message?: ApiMessage; conversationId: string | null };

// ---- UI shapes ----

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
  /** Waiting on the first token from the API. */
  pending?: boolean;
  /** Tokens are arriving for this message. */
  isStreaming?: boolean;
  /** The user stopped generation before it finished. */
  stopped?: boolean;
  /** Generation failed; the message can be retried. */
  failed?: boolean;
}

export interface ConversationSummary {
  id: string;
  title: string;
  updatedAt: number;
}

export interface ConversationGroup {
  label: string;
  conversations: ConversationSummary[];
}
