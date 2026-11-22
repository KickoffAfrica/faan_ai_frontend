"use client";

import { useEffect, useState } from "react";

const PHRASES = [
  "Checking the departure boards…",
  "Looking that up for you…",
  "Asking the information desk…",
  "Reviewing airport guidelines…",
  "Putting your answer together…",
];

const PHRASE_INTERVAL_MS = 3500;

export function ThinkingIndicator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % PHRASES.length),
      PHRASE_INTERVAL_MS
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="flex items-center gap-2.5 py-1 text-sm text-muted-foreground"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="relative flex size-4 shrink-0 items-center justify-center">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/25 motion-reduce:animate-none" />
        <span className="relative size-2 rounded-full bg-primary" />
      </span>
      <span key={index} className="animate-in fade-in duration-300">
        {PHRASES[index]}
      </span>
    </div>
  );
}
