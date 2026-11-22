"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useChat } from "../hooks/use-chat";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { ChatSidebar } from "./chat-sidebar";
import { EmptyState } from "./empty-state";
import { MessageList } from "./message-list";

export function ChatShell() {
  const chat = useChat();
  const isMobile = useIsMobile();
  const { resolvedTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const hasMessages = chat.messages.length > 0;
  const showEmptyState = !hasMessages && !chat.isLoadingConversation;

  const mobileBackground =
    isMobile && showEmptyState
      ? {
          backgroundImage: resolvedTheme === "dark" ? "url(/mobile-app.svg)" : "url(/mobile-app-light.svg)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center top",
          backgroundSize: "cover",
        }
      : undefined;

  return (
    <div className="flex h-dvh overflow-hidden bg-white dark:bg-black">
      <div
        className={cn(
          "hidden md:block shrink-0 overflow-hidden border-r transition-[width] duration-200 ease-out",
          sidebarOpen ? "w-72" : "w-0 border-r-0"
        )}
      >
        <div className="h-full w-72">
          <ChatSidebar chat={chat} variant="desktop" onClose={() => setSidebarOpen(false)} />
        </div>
      </div>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[85%] max-w-xs gap-0 p-0 [&>button:last-child]:hidden">
          <SheetTitle className="sr-only">Conversations</SheetTitle>
          <ChatSidebar chat={chat} variant="mobile" onClose={() => setMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden" style={mobileBackground}>
        <ChatHeader
          title={chat.activeConversation?.title}
          sidebarOpen={sidebarOpen}
          onOpenSidebar={() => (isMobile ? setMobileMenuOpen(true) : setSidebarOpen(true))}
          onNewChat={chat.newChat}
        />

        {chat.isLoadingConversation ? (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-primary" aria-label="Loading conversation" />
          </div>
        ) : showEmptyState ? (
          <EmptyState onSendMessage={chat.sendMessage} />
        ) : (
          <>
            <MessageList messages={chat.messages} onRetry={chat.retryLast} />
            <div className="shrink-0 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 md:px-6">
              <ChatInput
                onSendMessage={chat.sendMessage}
                onStop={chat.stopGeneration}
                isStreaming={chat.isStreaming}
              />
              <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-muted-foreground">
                FAAN Assist can make mistakes. Please verify important travel information.
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
