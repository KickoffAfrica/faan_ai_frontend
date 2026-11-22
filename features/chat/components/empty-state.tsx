"use client";

import { Plane, Search, Building2, Wifi, Car, AlertTriangle } from "lucide-react";
import { ChatInput } from "./chat-input";

const prompts = [
  { icon: Plane, title: "Check flight status", iconColor: "text-[#2B7FFF]" },
  { icon: Search, title: "Report lost item", iconColor: "text-[#00B8DB]" },
  { icon: Building2, title: "Find restrooms", iconColor: "text-[#2B7FFF]" },
  { icon: Wifi, title: "Connect to Wi-Fi", iconColor: "text-[#2B7FFF]" },
  { icon: Car, title: "Car park info", iconColor: "text-[#F6339A]" },
  { icon: AlertTriangle, title: "Prohibited items", iconColor: "text-[#FF6900]" },
];

interface EmptyStateProps {
  onSendMessage: (message: string) => void;
}

export function EmptyState({ onSendMessage }: EmptyStateProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex min-h-full flex-col items-center justify-center px-4 pb-6">
        <div className="text-center md:mb-8 mb-4 md:mt-2 mt-16 max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h2 className="text-2xl md:text-3xl font-bold md:mb-3 text-foreground">
            How can we help you today?
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Ask about flights, navigation, or lost items.
          </p>
        </div>

        <div className="w-full max-w-3xl mb-6">
          <ChatInput onSendMessage={onSendMessage} autoFocus />
        </div>

        <div className="w-full max-w-3xl mb-6">
          <h3 className="text-sm md:text-lg font-normal mb-4 text-foreground">Suggestions</h3>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {prompts.map((prompt) => {
              const Icon = prompt.icon;
              return (
                <button
                  key={prompt.title}
                  type="button"
                  style={{ boxShadow: "0px 2px 4px 0.5px #0960C11A" }}
                  className="flex items-center gap-2 md:gap-5 justify-center px-2 py-3 md:py-4 md:px-2 rounded-lg bg-white dark:bg-[#1A1D21] md:border md:border-primary-100 dark:border dark:border-[#3C4753] hover:bg-primary-50 hover:border-primary transition-all duration-200 cursor-pointer group"
                  onClick={() => onSendMessage(prompt.title)}
                >
                  <Icon className={`h-6 w-6 ${prompt.iconColor}`} />
                  <span className="text-xs md:text-base font-medium text-foreground text-center">
                    {prompt.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
