"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Message } from "../types";
import { cn } from "@/lib/utils";
import { AlertCircle, BotIcon, CheckCircle2, Loader2, User } from "lucide-react";
import Image from "next/image";
import { MarkdownText } from "../utils/parse-markdown";

interface MessageItemProps {
  message: Message;
  onRetry?: (messageId: string) => void;
}

export function MessageItem({ message, onRetry }: MessageItemProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-4 md:px-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* Assistant avatar - left side */}
      {!isUser && (
        <Avatar className="h-8 w-8 shrink-0 bg-(--primary-100) dark:bg-muted-foreground flex items-center justify-center">
          <BotIcon className="h-4 w-4 dark:text-background text-primary" />
          {/* <User className="h-4 w-4 text-white" /> */}
        </Avatar>
      )}
      

      {/* Message content */}
      <div
        className={cn(
          "flex flex-col gap-2 max-w-[85%] md:max-w-[70%]",
          isUser && "items-end"
        )}
      >
        {/* Message bubble */}
        <div
          className={cn(
            "rounded-2xl px-4 py-3 wrap-break-word",
            isUser
              ? "bg-primary text-white rounded-br-none"
              : "bg-muted text-foreground rounded-bl-none"
          )}
        >
          {/* Image if present */}
          {message.imageUrl && (
            <div className="mb-2 rounded-lg overflow-hidden">
              <Image
                src={message.imageUrl}
                alt="Uploaded image"
                width={300}
                height={200}
                className="max-w-full h-auto"
              />
            </div>
          )}

          {/* Text content */}
          <div className="text-sm whitespace-pre-wrap leading-relaxed">
            {isUser ? (
              message.content
            ) : (
              <MarkdownText>{message.content}</MarkdownText>
            )}
          </div>
        </div>

        {/* Status indicators */}
        <div
          className={cn(
            "flex items-center gap-1 text-xs text-muted-foreground px-1",
            isUser && "justify-end"
          )}
        >
          {message.status === "sending" && (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Sending...</span>
            </>
          )}
          {message.status === "sent" && (
            <CheckCircle2 className="h-3 w-3 text-primary-500" />
          )}
          {message.status === "error" && (
            <>
              <AlertCircle className="h-3 w-3 text-destructive" />
              <button
                onClick={() => onRetry?.(message.id)}
                className="text-destructive hover:underline"
              >
                Failed. Retry?
              </button>
            </>
          )}
          {!message.status && (
            <span className="text-xs">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 shrink-0 bg-primary  flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
          {/* <User className="h-4 w-4 text-white" /> */}
        </Avatar>
      )}
      
    </div>
  );
}

