"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ChatApiError,
  cancelGeneration,
  deleteConversation as deleteConversationRequest,
  getConversation,
  sendMessageStream,
} from "../services/chat-api";
import {
  ApiConversationWithMessages,
  ApiMessage,
  ChatMessage,
} from "../types";
import {
  conversationStore,
  useStoredConversations,
} from "../utils/conversation-store";
import {
  groupConversations,
  splitStoppedSuffix,
  titleFromMessage,
} from "../utils/format";

const conversationKey = (id: string) => ["conversation", id] as const;
const STOP_FALLBACK_MS = 5000;

/** The exchange currently in flight (or the last one that failed). */
interface LiveExchange {
  conversationId: string | null;
  /** Server messages that existed before this exchange; later ones are already shown live. */
  baseCount: number;
  user: ChatMessage;
  assistant: ChatMessage;
}

function conversationIdFromPath(pathname: string | null): string | null {
  const match = pathname?.match(/^\/c\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function toChatMessage(message: ApiMessage): ChatMessage {
  const { content, stopped } =
    message.role === "assistant"
      ? splitStoppedSuffix(message.content)
      : { content: message.content, stopped: false };

  return {
    id: message.id,
    role: message.role,
    content,
    createdAt: new Date(message.created_at),
    stopped,
  };
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

export function useChat() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const activeId = conversationIdFromPath(pathname);

  const conversations = useStoredConversations();
  const groupedConversations = useMemo(
    () => groupConversations(conversations),
    [conversations]
  );

  const [live, setLive] = useState<LiveExchange | null>(null);
  const liveRef = useRef<LiveExchange | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const stopTimerRef = useRef<number | null>(null);

  const updateLive = useCallback(
    (updater: (prev: LiveExchange | null) => LiveExchange | null) => {
      liveRef.current = updater(liveRef.current);
      setLive(liveRef.current);
    },
    []
  );

  const isStreaming = Boolean(
    live && (live.assistant.pending || live.assistant.isStreaming)
  );

  const conversationQuery = useQuery({
    queryKey: conversationKey(activeId ?? ""),
    queryFn: () => getConversation(activeId as string),
    enabled: Boolean(activeId) && !isStreaming,
    retry: (count, error) =>
      !(error instanceof ChatApiError && error.statusCode === 404) && count < 1,
  });

  // Keep the local history in sync with what the server knows.
  useEffect(() => {
    const data = conversationQuery.data;
    if (!data) return;
    const existing = conversations.find((c) => c.id === data.id);
    const title = data.title ?? existing?.title;
    const updatedAt = data.last_message_at
      ? new Date(data.last_message_at).getTime()
      : existing?.updatedAt;
    if (!existing || existing.title !== title || existing.updatedAt !== updatedAt) {
      conversationStore.upsert({ id: data.id, title: title ?? undefined, updatedAt });
    }
  }, [conversationQuery.data, conversations]);

  // Deleted or unknown conversation in the URL.
  useEffect(() => {
    const error = conversationQuery.error;
    if (!activeId || !(error instanceof ChatApiError) || error.statusCode !== 404) {
      return;
    }
    conversationStore.remove(activeId);
    toast.error("That conversation is no longer available.");
    router.replace("/");
  }, [activeId, conversationQuery.error, router]);

  const clearStopTimer = () => {
    if (stopTimerRef.current !== null) {
      window.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
  };

  /** Ask the server to stop (so partial output is saved), then drop the connection. */
  const abortInFlight = useCallback(() => {
    const conversationId = liveRef.current?.conversationId;
    if (conversationId && (liveRef.current?.assistant.pending || liveRef.current?.assistant.isStreaming)) {
      void cancelGeneration(conversationId).catch(() => {});
    }
    clearStopTimer();
    abortRef.current?.abort();
    abortRef.current = null;
    updateLive(() => null);
  }, [updateLive]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const sendMessage = useCallback(
    async (rawContent: string) => {
      const content = rawContent.trim();
      if (!content || abortRef.current) return;

      const now = new Date();
      const baseCount = activeId
        ? (queryClient.getQueryData<ApiConversationWithMessages>(
            conversationKey(activeId)
          )?.messages.length ?? 0)
        : 0;
      updateLive(() => ({
        conversationId: activeId,
        baseCount,
        user: { id: "live-user", role: "user", content, createdAt: now },
        assistant: {
          id: "live-assistant",
          role: "assistant",
          content: "",
          createdAt: now,
          pending: true,
        },
      }));

      const controller = new AbortController();
      abortRef.current = controller;

      let conversationId = activeId;
      if (conversationId) {
        conversationStore.upsert({ id: conversationId, updatedAt: Date.now() });
      }

      try {
        let streamed = "";
        const outcome = await sendMessageStream(conversationId, content, {
          signal: controller.signal,
          onConversationId: (createdId) => {
            conversationId = createdId;
            const createdAt = now.toISOString();
            queryClient.setQueryData<ApiConversationWithMessages>(conversationKey(createdId), {
              id: createdId,
              title: null,
              created_at: createdAt,
              messages: [],
            });
            conversationStore.upsert({
              id: createdId,
              title: titleFromMessage(content),
              updatedAt: Date.now(),
            });
            updateLive((prev) => (prev ? { ...prev, conversationId: createdId } : prev));
            router.push(`/c/${createdId}`);
          },
          onChunk: (chunk) => {
            streamed += chunk;
            updateLive((prev) =>
              prev
                ? {
                    ...prev,
                    assistant: {
                      ...prev.assistant,
                      content: streamed,
                      pending: false,
                      isStreaming: true,
                    },
                  }
                : prev
            );
          },
        });

        conversationId = outcome.conversationId ?? conversationId;
        const finalMessage = outcome.message;
        if (finalMessage && conversationId) {
          queryClient.setQueryData<ApiConversationWithMessages>(
            conversationKey(conversationId),
            (old) =>
              old && {
                ...old,
                last_message_at: finalMessage.created_at,
                messages: [
                  ...old.messages,
                  {
                    id: `local-${Date.now()}`,
                    role: "user",
                    content,
                    created_at: now.toISOString(),
                  },
                  finalMessage,
                ],
              }
          );
        }
        updateLive(() => null);
        if (conversationId) {
          conversationStore.upsert({ id: conversationId, updatedAt: Date.now() });
          void queryClient.invalidateQueries({ queryKey: conversationKey(conversationId) });
        }
      } catch (error) {
        if (isAbortError(error) || controller.signal.aborted) {
          updateLive(() => null);
          if (conversationId) {
            void queryClient.invalidateQueries({ queryKey: conversationKey(conversationId) });
          }
          return;
        }

        const message =
          error instanceof ChatApiError
            ? error.message
            : "Something went wrong. Please try again.";
        toast.error(message);
        updateLive((prev) =>
          prev
            ? {
                ...prev,
                assistant: {
                  ...prev.assistant,
                  pending: false,
                  isStreaming: false,
                  failed: true,
                },
              }
            : prev
        );
      } finally {
        clearStopTimer();
        if (abortRef.current === controller) abortRef.current = null;
      }
    },
    [activeId, queryClient, router, updateLive]
  );

  const stopGeneration = useCallback(() => {
    const current = liveRef.current;
    if (!current || !abortRef.current) return;

    if (!current.conversationId) {
      abortInFlight();
      return;
    }

    // The stream ends with a "cancelled" line once the server stops; the
    // timer is a fallback in case that line never arrives.
    clearStopTimer();
    stopTimerRef.current = window.setTimeout(() => abortRef.current?.abort(), STOP_FALLBACK_MS);
    cancelGeneration(current.conversationId)
      .then((cancelled) => {
        if (!cancelled) abortRef.current?.abort();
      })
      .catch(() => abortRef.current?.abort());
  }, [abortInFlight]);

  const retryLast = useCallback(() => {
    const current = liveRef.current;
    if (!current?.assistant.failed) return;
    updateLive(() => null);
    void sendMessage(current.user.content);
  }, [sendMessage, updateLive]);

  const newChat = useCallback(() => {
    abortInFlight();
    if (pathname !== "/") router.push("/");
  }, [abortInFlight, pathname, router]);

  const selectConversation = useCallback(
    (id: string) => {
      if (id === activeId) return;
      abortInFlight();
      router.push(`/c/${id}`);
    },
    [abortInFlight, activeId, router]
  );

  const deleteConversation = useCallback(
    async (id: string) => {
      if (liveRef.current?.conversationId === id) abortInFlight();
      await deleteConversationRequest(id);
      conversationStore.remove(id);
      queryClient.removeQueries({ queryKey: conversationKey(id) });
      if (id === activeId) router.push("/");
    },
    [abortInFlight, activeId, queryClient, router]
  );

  const showLive =
    live && (live.conversationId === null || live.conversationId === activeId || !activeId);

  const messages = useMemo<ChatMessage[]>(() => {
    const server = activeId
      ? (conversationQuery.data?.messages ?? []).map(toChatMessage)
      : [];
    if (!showLive || !live) return server;
    return [...server.slice(0, live.baseCount), live.user, live.assistant];
  }, [activeId, conversationQuery.data, live, showLive]);

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;

  return {
    activeId,
    activeConversation,
    conversations,
    groupedConversations,
    messages,
    isStreaming,
    isLoadingConversation:
      Boolean(activeId) && conversationQuery.isPending && !showLive,
    sendMessage,
    stopGeneration,
    retryLast,
    newChat,
    selectConversation,
    deleteConversation,
  };
}

export type UseChatReturn = ReturnType<typeof useChat>;
