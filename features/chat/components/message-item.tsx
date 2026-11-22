"use client";

import { useEffect, useMemo, useState } from "react";
import Markdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { AlertCircle, BotIcon, Check, Copy, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ChatMessage } from "../types";
import { formatMessageTime, stabilizeStreamingMarkdown } from "../utils/format";
import { ThinkingIndicator } from "./thinking-indicator";

const markdownComponents: Components = {
  h1: ({ children }) => <h1 className="text-2xl font-bold mb-2 mt-4 first:mt-0">{children}</h1>,
  h2: ({ children }) => <h2 className="text-xl font-bold mb-2 mt-4 first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-semibold mb-2 mt-3 first:mt-0">{children}</h3>,
  h4: ({ children }) => <h4 className="text-base font-semibold mb-1 mt-2 first:mt-0">{children}</h4>,
  h5: ({ children }) => <h5 className="text-sm font-semibold mb-1 mt-2 first:mt-0">{children}</h5>,
  h6: ({ children }) => <h6 className="text-sm font-medium mb-1 mt-2 first:mt-0">{children}</h6>,
  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
  li: ({ children }) => <li className="pl-1">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children }) => (
    <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="bg-muted p-3 rounded-lg overflow-x-auto mb-3 text-xs font-mono [&_code]:bg-transparent [&_code]:p-0">
      {children}
    </pre>
  ),
  a: ({ href, children }) => (
    <a href={href} className="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-muted-foreground pl-4 italic my-2">{children}</blockquote>
  ),
  hr: () => <hr className="my-4 border-muted-foreground" />,
  table: ({ children }) => (
    <div className="overflow-x-auto my-3">
      <table className="min-w-full border-collapse border border-muted-foreground">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr className="border-b border-muted-foreground">{children}</tr>,
  th: ({ children }) => (
    <th className="border border-muted-foreground px-3 py-2 text-left font-semibold">{children}</th>
  ),
  td: ({ children }) => <td className="border border-muted-foreground px-3 py-2">{children}</td>,
};

interface MessageItemProps {
  message: ChatMessage;
  onRetry?: () => void;
}

export function MessageItem({ message, onRetry }: MessageItemProps) {
  return message.role === "user" ? (
    <UserMessage message={message} />
  ) : (
    <AssistantMessage message={message} onRetry={onRetry} />
  );
}

function UserMessage({ message }: { message: ChatMessage }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] md:max-w-[75%] rounded-2xl rounded-br-none bg-primary px-4 py-3 text-sm leading-relaxed text-white whitespace-pre-wrap wrap-break-word">
        {message.content}
      </div>
    </div>
  );
}

function AssistantMessage({ message, onRetry }: MessageItemProps) {
  const showThinking = message.pending;
  const showBody = !message.pending && message.content.length > 0;
  const isDone = !message.pending && !message.isStreaming;

  const content = useMemo(
    () => (message.isStreaming ? stabilizeStreamingMarkdown(message.content) : message.content),
    [message.content, message.isStreaming]
  );

  return (
    <article className="group/message flex gap-3">
      <Avatar className="h-8 w-8 shrink-0 bg-(--primary-100) dark:bg-muted-foreground flex items-center justify-center">
        <BotIcon className="h-4 w-4 dark:text-background text-primary" />
      </Avatar>

      <div className="min-w-0 flex-1 pt-1">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">FAAN Assist</span>
          {isDone && (
            <time className="text-xs text-muted-foreground">{formatMessageTime(message.createdAt)}</time>
          )}
        </div>

        {showThinking && <ThinkingIndicator />}

        {showBody && (
          <div className="text-sm md:text-[0.9375rem] leading-relaxed text-foreground wrap-break-word">
            <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {content}
            </Markdown>
            {message.isStreaming && (
              <span className="ml-0.5 inline-block h-[1.1em] w-0.5 animate-pulse bg-primary align-text-bottom" />
            )}
          </div>
        )}

        {message.stopped && (
          <p className="mt-2 text-xs italic text-muted-foreground">Response stopped</p>
        )}

        {message.failed && (
          <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Couldn&apos;t get a response.</span>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1 font-medium underline-offset-2 hover:underline"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Retry
              </button>
            )}
          </div>
        )}

        {isDone && showBody && !message.failed && <CopyButton text={message.content} />}
      </div>
    </article>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  };

  return (
    <div className="mt-2 flex items-center opacity-100 transition-opacity md:opacity-0 md:group-hover/message:opacity-100 md:focus-within:opacity-100">
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy response"}
        className={cn(
          "flex h-7 items-center gap-1.5 rounded-full px-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        )}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
