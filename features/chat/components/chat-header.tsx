"use client";

import Image from "next/image";
import { Menu, PanelLeft, SquarePen } from "lucide-react";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "./theme-toggle";

interface ChatHeaderProps {
  title?: string;
  sidebarOpen: boolean;
  onOpenSidebar: () => void;
  onNewChat: () => void;
}

export function ChatHeader({ title, sidebarOpen, onOpenSidebar, onNewChat }: ChatHeaderProps) {
  const isMobile = useIsMobile();
  const showLogo = isMobile || !sidebarOpen;

  return (
    <header className="sticky top-0 z-20 w-full shrink-0 py-2 md:py-3">
      <div className="flex h-10 items-center justify-between gap-2 px-3 md:px-6">
        <div className="flex min-w-0 items-center gap-1 md:gap-2">
          {(isMobile || !sidebarOpen) && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onOpenSidebar}
              className="shrink-0 rounded-full text-muted-foreground"
              aria-label={isMobile ? "Open menu" : "Expand sidebar"}
            >
              {isMobile ? <Menu className="size-5" /> : <PanelLeft className="size-4" />}
            </Button>
          )}
          {!isMobile && !sidebarOpen && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onNewChat}
              className="shrink-0 rounded-full text-muted-foreground"
              aria-label="New chat"
            >
              <SquarePen className="size-4" />
            </Button>
          )}
          {showLogo ? (
            <Logo className="ml-1" />
          ) : (
            title && (
              <h2 className="truncate text-sm font-medium text-foreground md:text-[0.9375rem]">
                {title}
              </h2>
            )
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle isMobile />
          <Image
            src="/servicom_logo.svg"
            alt="SERVICOM"
            width={isMobile ? 35 : 50}
            height={isMobile ? 35 : 50}
          />
        </div>
      </div>
    </header>
  );
}
