"use client";

import { useState } from "react";
import { MoreHorizontal, PanelLeftClose, SquarePen, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { UseChatReturn } from "../hooks/use-chat";
import { ConversationSummary } from "../types";
import { DeleteConversationDialog } from "./delete-conversation-dialog";

interface ChatSidebarProps {
  chat: UseChatReturn;
  variant: "desktop" | "mobile";
  onClose: () => void;
}

export function ChatSidebar({ chat, variant, onClose }: ChatSidebarProps) {
  const isMobile = variant === "mobile";
  const [deleteTarget, setDeleteTarget] = useState<ConversationSummary | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleNewChat = () => {
    chat.newChat();
    if (isMobile) onClose();
  };

  const handleSelect = (id: string) => {
    chat.selectConversation(id);
    if (isMobile) onClose();
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await chat.deleteConversation(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      toast.error("Couldn't delete that conversation. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <aside className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-3">
        <Logo size="sm" />
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          className="shrink-0 rounded-full text-muted-foreground"
          aria-label={isMobile ? "Close menu" : "Collapse sidebar"}
        >
          {isMobile ? <X className="size-4" /> : <PanelLeftClose className="size-4" />}
        </Button>
      </div>

      <div className="px-3">
        <Button
          onClick={handleNewChat}
          className="h-10 w-full justify-start gap-2 rounded-full bg-primary-50 px-4 text-primary-500 shadow-none hover:bg-primary-100 dark:bg-primary-muted dark:text-primary-300 dark:hover:bg-primary-muted/70"
        >
          <SquarePen className="size-4" />
          New chat
        </Button>
      </div>

      <nav className="mt-4 min-h-0 flex-1 overflow-y-auto px-2 pb-4" aria-label="Conversation history">
        {chat.groupedConversations.length === 0 ? (
          <p className="px-3 py-2 text-xs text-muted-foreground">
            Your conversations will appear here.
          </p>
        ) : (
          chat.groupedConversations.map((group) => (
            <div key={group.label} className="mb-4">
              <p className="mb-1 px-3 text-xs font-medium text-muted-foreground">{group.label}</p>
              <ul className="space-y-0.5">
                {group.conversations.map((conversation) => (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    isActive={chat.activeId === conversation.id}
                    showActionsAlways={isMobile}
                    onSelect={handleSelect}
                    onDelete={setDeleteTarget}
                  />
                ))}
              </ul>
            </div>
          ))
        )}
      </nav>

      <p className="border-t px-4 py-3 text-[11px] leading-relaxed text-muted-foreground">
        Conversations are saved on this device only.
      </p>

      <DeleteConversationDialog
        open={!!deleteTarget}
        title={deleteTarget?.title ?? null}
        isDeleting={isDeleting}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </aside>
  );
}

interface ConversationItemProps {
  conversation: ConversationSummary;
  isActive: boolean;
  showActionsAlways: boolean;
  onSelect: (id: string) => void;
  onDelete: (conversation: ConversationSummary) => void;
}

function ConversationItem({
  conversation,
  isActive,
  showActionsAlways,
  onSelect,
  onDelete,
}: ConversationItemProps) {
  return (
    <li className="group/item">
      <div
        className={cn(
          "flex items-center rounded-lg transition-colors",
          isActive
            ? "bg-primary-50 text-primary-500 dark:bg-primary-muted dark:text-primary-300"
            : "hover:bg-muted"
        )}
      >
        <button
          type="button"
          onClick={() => onSelect(conversation.id)}
          className={cn(
            "min-w-0 flex-1 truncate px-3 py-2 text-left text-sm",
            isActive && "font-medium"
          )}
          title={conversation.title}
        >
          {conversation.title}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "mr-1 flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-opacity hover:text-foreground focus-visible:opacity-100 data-[state=open]:opacity-100",
                showActionsAlways
                  ? "opacity-100"
                  : "opacity-0 group-hover/item:opacity-100 group-focus-within/item:opacity-100"
              )}
              aria-label={`Options for ${conversation.title}`}
            >
              <MoreHorizontal className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-36">
            <DropdownMenuItem variant="destructive" onClick={() => onDelete(conversation)}>
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </li>
  );
}
