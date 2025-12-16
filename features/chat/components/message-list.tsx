"use client";

import { useEffect, useRef } from "react";
import { Message } from "../types";
import { MessageItem } from "./message-item";
import { Loader2 } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onRetry?: (messageId: string) => void;
}

export function MessageList({ messages, isLoading, onRetry }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  console.log(messages, "messages==========")

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto scroll-smooth max-w-4xl mx-auto scrolbar-hide"
      style={{ scrollbarGutter: "stable", scrollbarWidth: "none" }}
    >
      <div className="flex flex-col">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            onRetry={onRetry}
          />
        ))}

        {/* Loading indicator for assistant response */}
        {isLoading && (
          <div className="flex gap-3 px-4 py-4 md:px-6">
            <div className="h-8 w-8 shrink-0 rounded-full bg-primary-500 flex items-center justify-center">
              <span className="text-white text-xs font-semibold">NT</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-muted/80 dark:bg-muted/40">
              <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
              <span className="text-sm text-muted-foreground">
                Analyzing your question...
              </span>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

