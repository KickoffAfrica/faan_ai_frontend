import { ConversationGroup, ConversationSummary } from "../types";

const STOPPED_SUFFIX = "[Response stopped]";
const TITLE_LENGTH = 50;

/** The API appends "\n\n[Response stopped]" to cancelled replies. */
export function splitStoppedSuffix(content: string): {
  content: string;
  stopped: boolean;
} {
  const trimmed = content.trimEnd();
  if (!trimmed.endsWith(STOPPED_SUFFIX)) return { content, stopped: false };
  return {
    content: trimmed.slice(0, -STOPPED_SUFFIX.length).trimEnd(),
    stopped: true,
  };
}

/** Mirrors the server's auto-title: first 50 characters of the first message. */
export function titleFromMessage(content: string): string {
  const singleLine = content.replace(/\s+/g, " ").trim();
  return singleLine.slice(0, TITLE_LENGTH) || "New conversation";
}

/** Close an unclosed code fence so markdown renders stably mid-stream. */
export function stabilizeStreamingMarkdown(content: string): string {
  const fenceCount = (content.match(/```/g) ?? []).length;
  return fenceCount % 2 === 1 ? `${content}\n\`\`\`` : content;
}

export function formatMessageTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function groupConversations(
  conversations: ConversationSummary[]
): ConversationGroup[] {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const today = startOfToday.getTime();
  const day = 24 * 60 * 60 * 1000;

  const buckets: Record<string, ConversationSummary[]> = {
    Today: [],
    Yesterday: [],
    "Previous 7 days": [],
    "Previous 30 days": [],
    Older: [],
  };

  for (const conversation of conversations) {
    const t = conversation.updatedAt;
    if (t >= today) buckets.Today.push(conversation);
    else if (t >= today - day) buckets.Yesterday.push(conversation);
    else if (t >= today - 7 * day) buckets["Previous 7 days"].push(conversation);
    else if (t >= today - 30 * day) buckets["Previous 30 days"].push(conversation);
    else buckets.Older.push(conversation);
  }

  return Object.entries(buckets)
    .filter(([, items]) => items.length > 0)
    .map(([label, items]) => ({ label, conversations: items }));
}
