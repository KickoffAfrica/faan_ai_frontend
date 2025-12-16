"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  isMobile?: boolean;
}

export function ThemeToggle({ isMobile }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full">
        <div className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full h-8 w-8 md:h-10 md:w-10 p-2  bg-white dark:bg-black hover:bg-transparent dark:hover:bg-transparent"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4 md:h-5 w-4 md:w-5 text-primary-950 dark:text-white" />
      ) : (
        <Moon className="h-4 md:h-5 w-4 md:w-5 text-primary-950 dark:text-white" />
      )}
    </Button>
  );
}

