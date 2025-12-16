"use client";

import { Plane, Search, Building2, Wifi, Car, AlertTriangle } from "lucide-react";

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const prompts = [
  {
    icon: Plane,
    title: "Check flight status",
    question: "Check flight status",
    iconColor: "text-[#2B7FFF]",
  },
  {
    icon: Search,
    title: "Report lost item",
    question: "Report lost item",
    iconColor: "text-[#00B8DB]",
  },
  {
    icon: Building2,
    title: "Find restrooms",
    question: "Find restrooms",
    iconColor: "text-[#2B7FFF]",
  },
  {
    icon: Wifi,
    title: "Connect to Wi-Fi",
    question: "Connect to Wi-Fi",
    iconColor: "text-[#2B7FFF]",
  },
  {
    icon: Car,
    title: "Car park info",
    question: "Car park info",
    iconColor: "text-[#F6339A]",
  },
  {
    icon: AlertTriangle,
    title: "Prohibited items",
    question: "Prohibited items",
    iconColor: "text-[#FF6900]",
  },
];

export function SuggestedPrompts({ onSelectPrompt }: SuggestedPromptsProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8">
      {/* Welcome message */}
      <div className="text-center mb-8 max-w-2xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
          How can we help you today?
        </h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Ask about flights, navigation, or lost items.
        </p>
      </div>

      {/* Suggested prompts grid */}
      <div className="w-full max-w-3xl mb-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Suggestions</h3>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
          {prompts.map((prompt, index) => {
            const Icon = prompt.icon;
            return (
              <button
                key={index}
                className="flex flex-col items-center justify-center p-4 rounded-lg bg-background dark:bg-[#1a1a1a] border border-primary-100 dark:border-blue-700 hover:bg-primary-200 hover:border-primary transition-all duration-200 cursor-pointer group"
                onClick={() => onSelectPrompt(prompt.question)}
              >
                <Icon className={`h-10 w-10 mb-2 ${prompt.iconColor}`} />
                <span className="text-sm font-medium text-foreground text-center">
                  {prompt.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
