import { useMemo, useSyncExternalStore } from "react";
import { ConversationSummary } from "../types";

// GET /conversations returns every conversation in the shared guest account,
// so each browser only lists the conversations it created itself.
const STORAGE_KEY = "faan-assist-conversations";
const EMPTY: ConversationSummary[] = [];

type Listener = () => void;
const listeners = new Set<Listener>();

let cachedRaw: string | null = null;
let cachedValue: ConversationSummary[] = EMPTY;

function read(): ConversationSummary[] {
  if (typeof window === "undefined") return EMPTY;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedValue;

  cachedRaw = raw;
  try {
    const parsed = raw ? (JSON.parse(raw) as ConversationSummary[]) : EMPTY;
    cachedValue = Array.isArray(parsed) ? parsed : EMPTY;
  } catch {
    cachedValue = EMPTY;
  }
  return cachedValue;
}

function write(next: ConversationSummary[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export const conversationStore = {
  has(id: string) {
    return read().some((c) => c.id === id);
  },

  upsert(conversation: Pick<ConversationSummary, "id"> & Partial<ConversationSummary>) {
    const all = read();
    const existing = all.find((c) => c.id === conversation.id);
    const merged: ConversationSummary = {
      id: conversation.id,
      title: conversation.title ?? existing?.title ?? "New conversation",
      updatedAt: conversation.updatedAt ?? existing?.updatedAt ?? Date.now(),
    };
    write([merged, ...all.filter((c) => c.id !== conversation.id)]);
  },

  remove(id: string) {
    write(read().filter((c) => c.id !== id));
  },
};

export function useStoredConversations(): ConversationSummary[] {
  const conversations = useSyncExternalStore(subscribe, read, () => EMPTY);
  return useMemo(
    () => [...conversations].sort((a, b) => b.updatedAt - a.updatedAt),
    [conversations]
  );
}
