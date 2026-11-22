"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { ChatMessage } from "../types";
import { MessageItem } from "./message-item";

interface MessageListProps {
  messages: ChatMessage[];
  onRetry?: () => void;
}

const BOTTOM_THRESHOLD_PX = 80;

export function MessageList({ messages, onRetry }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const el = containerRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < BOTTOM_THRESHOLD_PX;
    stickToBottomRef.current = atBottom;
    setShowScrollButton(!atBottom);
  };

  const last = messages[messages.length - 1];
  const lastUserId = [...messages].reverse().find((m) => m.role === "user")?.id;

  // Always jump to the latest message when the user sends one.
  useEffect(() => {
    stickToBottomRef.current = true;
    scrollToBottom("smooth");
  }, [lastUserId, messages.length, scrollToBottom]);

  // Follow streaming output only while the reader is at the bottom.
  useEffect(() => {
    if (stickToBottomRef.current) scrollToBottom("auto");
  }, [last?.content, scrollToBottom]);

  return (
    <div className="relative flex-1 min-h-0">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto"
        style={{ scrollbarGutter: "stable" }}
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-6 md:py-10">
          {messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              onRetry={message.failed ? onRetry : undefined}
            />
          ))}
        </div>
      </div>

      {showScrollButton && (
        <button
          type="button"
          onClick={() => scrollToBottom()}
          aria-label="Scroll to latest message"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full border bg-white text-foreground shadow-md transition-colors hover:bg-muted dark:bg-[#1A1D21] dark:border-[#3C4753] animate-in fade-in"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
