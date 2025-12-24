"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Message } from "../types";
import { cn } from "@/lib/utils";
import { AlertCircle, BotIcon, CheckCircle2, Loader2, User } from "lucide-react";
import Image from "next/image";
// import { MarkdownText } from "../utils/parse-markdown";
import Markdown from 'react-markdown'
import { Components } from 'react-markdown'

interface MessageItemProps {
  message: Message;
  onRetry?: (messageId: string) => void;
}

// Custom components for react-markdown to properly style markdown elements
const markdownComponents: Components = {
  // Headers
  h1: ({ children }) => <h1 className="text-2xl font-bold mb-2 mt-4 first:mt-0">{children}</h1>,
  h2: ({ children }) => <h2 className="text-xl font-bold mb-2 mt-4 first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-semibold mb-2 mt-3 first:mt-0">{children}</h3>,
  h4: ({ children }) => <h4 className="text-base font-semibold mb-1 mt-2 first:mt-0">{children}</h4>,
  h5: ({ children }) => <h5 className="text-sm font-semibold mb-1 mt-2 first:mt-0">{children}</h5>,
  h6: ({ children }) => <h6 className="text-sm font-medium mb-1 mt-2 first:mt-0">{children}</h6>,
  
  // Paragraphs
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  
  // Lists
  ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1 ml-2">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1 ml-2">{children}</ol>,
  li: ({ children }) => <li className="ml-2">{children}</li>,
  
  // Text formatting
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children }) => (
    <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
  ),
  
  // Code blocks
  pre: ({ children }) => (
    <pre className="bg-muted p-3 rounded-lg overflow-x-auto mb-2 text-xs font-mono">
      {children}
    </pre>
  ),
  
  // Links
  a: ({ href, children }) => (
    <a href={href} className="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  
  // Blockquotes
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-muted-foreground pl-4 italic my-2">
      {children}
    </blockquote>
  ),
  
  // Horizontal rule
  hr: () => <hr className="my-4 border-muted-foreground" />,
  
  // Tables
  table: ({ children }) => (
    <div className="overflow-x-auto my-2">
      <table className="min-w-full border-collapse border border-muted-foreground">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr className="border-b border-muted-foreground">{children}</tr>,
  th: ({ children }) => (
    <th className="border border-muted-foreground px-3 py-2 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-muted-foreground px-3 py-2">{children}</td>
  ),
};

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
          <div className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert">
            {isUser ? (
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : (
              <Markdown components={markdownComponents}>{message.content}</Markdown>
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

