"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Send, Square } from "lucide-react";
import { useEffect, useRef, useState, KeyboardEvent } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onStop?: () => void;
  isStreaming?: boolean;
  disabled?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

export function ChatInput({
  onSendMessage,
  onStop,
  isStreaming = false,
  disabled = false,
  placeholder = "+ Ask FAAN Assistant...",
  autoFocus = false,
  className,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus();
  }, [autoFocus]);

  const resetHeight = () => {
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleSend = () => {
    if (isStreaming) {
      onStop?.();
      return;
    }
    const trimmed = message.trim();
    if (!trimmed || disabled) return;
    onSendMessage(trimmed);
    setMessage("");
    resetHeight();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (!isStreaming) handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  const hasText = message.trim().length > 0;

  return (
    <div className={cn("flex items-end gap-2 w-full max-w-3xl mx-auto", className)}>
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={handleTextareaChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        aria-label="Message"
        className="min-h-[45px] md:min-h-[50px] max-h-[200px] resize-none focus-visible:border-muted-foreground focus-visible:ring-ring/50 bg-muted dark:bg-[#EEF0F11A] rounded-3xl pt-3 pl-5 dark:border-none"
      />

      {isStreaming ? (
        <Button
          onClick={onStop}
          size="default"
          className="shrink-0 h-[45px] md:h-[50px] w-[45px] md:w-[50px] rounded-full bg-primary hover:bg-primary/90"
          aria-label="Stop generating"
        >
          <Square className="h-4 w-4 fill-current text-white" />
        </Button>
      ) : (
        <Button
          onClick={handleSend}
          disabled={disabled || !hasText}
          size="default"
          className={cn(
            "shrink-0 h-[45px] md:h-[50px] w-[45px] md:w-[50px] rounded-full",
            hasText ? "bg-primary hover:bg-primary/90" : "bg-[#8D97A3] hover:bg-[#6D7681]"
          )}
          aria-label="Send message"
        >
          <Send className="h-10 w-10 text-white" />
        </Button>
      )}
    </div>
  );
}
