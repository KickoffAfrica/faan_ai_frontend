"use client";

import { ChatInterface } from "@/features/chat/components/chat-interface";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ChatPageContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || undefined;

  return <ChatInterface initialPrompt={initialPrompt} />;
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <ChatPageContent />
    </Suspense>
  );
}

