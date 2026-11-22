import { ChatShell } from "@/features/chat/components/chat-shell";

// The shell lives in the layout so an in-flight response keeps streaming
// when the URL switches from "/" to "/c/[id]".
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ChatShell />
      {children}
    </>
  );
}
