"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Plane, Search, Building2, Wifi, Car, AlertTriangle } from "lucide-react";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { useIsMobile } from "@/hooks/use-mobile";

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

export function LandingPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { theme } = useTheme();

  // Select background image based on theme
  const mobileBackgroundImage = theme === "dark" 
    ? "url(/mobile-app.svg)" 
    : "url(/mobile-app-light.svg)";

  const handleSelectPrompt = (prompt: string) => {
    // Navigate to /c with the prompt as a query parameter
    const encodedPrompt = encodeURIComponent(prompt);
    router.push(`/c?prompt=${encodedPrompt}`);
  };

  const handleSendMessage = (message: string, image?: File) => {
    // Navigate to /c with the message
    const encodedMessage = encodeURIComponent(message);
    router.push(`/c?prompt=${encodedMessage}`);
  };

  return (
    <div 
      className="flex flex-col h-screen max-h-screen overflow-hidden bg-white dark:bg-black"
      style={isMobile ? {
        backgroundImage: mobileBackgroundImage,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center top',
        backgroundSize: 'cover',
      } : undefined}
    >
      {/* Header */}
      <ChatHeader />

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <div className="flex flex-col items-center justify-center min-h-[70vh] h-full px-4 pb-6 overflow-y-auto">
          {/* Welcome message */}
          <div className="text-center md:mb-8 mb-4 md:mt-2 mt-24 max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold md:mb-3 text-foreground">
              How can we help you today?
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Ask about flights, navigation, or lost items.
            </p>
          </div>

          {/* Input area - positioned after welcome message */}
          <div className="w-full max-w-3xl mb-6">
            <ChatInput
              onSendMessage={handleSendMessage}
              placeholder="+ Ask FAAN Assistant..."
              sticky={false}
            />
          </div>

          {/* Suggested prompts grid */}
          <div className="w-full max-w-3xl mb-6">
            <h3 className="text-sm md:text-lg font-normal mb-4 text-foreground">Suggestions</h3>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
              {prompts.map((prompt, index) => {
                const Icon = prompt.icon;
                return (
                  <button
                    key={index}
                    style={{boxShadow: "0px 2px 4px 0.5px #0960C11A"}}
                    className="flex  items-center gap-2 md:gap-5 justify-center px-2 py-3 md:py-4 md:px-2  rounded-lg bg-white dark:bg-[#1A1D21] md:border md:border-primary-100 dark:border dark:border-[#3C4753] hover:bg-primary-50 hover:border-primary transition-all duration-200 cursor-pointer group"
                    onClick={() => handleSelectPrompt(prompt.question)}
                  >
                    <Icon className={`h-6 w-6  ${prompt.iconColor}`} />
                    <span className="text-xs md:text-base font-medium text-foreground text-center">
                      {prompt.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional hint */}
          {/* <p className="mt-8 text-xs md:text-sm text-muted-foreground text-center">
            Click on a suggestion above or type your own question below
          </p> */}
        </div>
      </div>
    </div>
  );
}
