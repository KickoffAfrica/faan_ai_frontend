"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "../hooks/use-chat";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { MessageList } from "./message-list";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ChatInterfaceProps {
  initialPrompt?: string;
}

export function ChatInterface({ initialPrompt }: ChatInterfaceProps) {
  const router = useRouter();
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    retryMessage,
    startNewConversation,
    clearError,
  } = useChat();

  const hasProcessedPrompt = useRef(false);

  // Handle initial prompt from URL
  useEffect(() => {
    if (initialPrompt && !hasProcessedPrompt.current) {
      hasProcessedPrompt.current = true;
      // Clear the URL parameter after reading it
      router.replace("/c", { scroll: false });
      // Small delay to ensure state is ready
      setTimeout(() => {
        sendMessage(initialPrompt);
      }, 100);
    }
  }, [initialPrompt, router, sendMessage]);

  const handleSendMessage = (content: string, image?: File) => {
    sendMessage(content, image);
  };

  const handleNewChat = () => {
    startNewConversation();
    router.push("/");
  };

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      {/* Header */}
      <ChatHeader onNewChat={handleNewChat} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Error alert */}
        {error && (
          <div className="px-4 pt-4 md:px-6">
            <Alert variant="destructive" className="mb-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <button
                  onClick={clearError}
                  className="text-sm underline hover:no-underline ml-4"
                >
                  Dismiss
                </button>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Messages area */}
        <MessageList
          messages={messages}
          isLoading={isLoading}
          onRetry={retryMessage}
        />
      </div>

      {/* Input area */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isLoading}
        placeholder="+ Ask FAAN Assistant..."
      />
    </div>
  );
}

