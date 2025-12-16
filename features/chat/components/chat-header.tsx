// "use client";

// import { Button } from "@/components/ui/button";
// import { MessageSquareIcon } from "lucide-react";
// import { ThemeToggle } from "./theme-toggle";

// interface ChatHeaderProps {
//   onNewChat?: () => void;
// }

// export function ChatHeader({ onNewChat }: ChatHeaderProps) {
//   return (
//     <header className="sticky top-0 z-10 w-full border-b bg-primary  py-2 md:py-4">
//       <div className="flex h-16 items-center justify-between px-4 md:px-6">
//         {/* Left: New chat button */}
//         <div className="flex items-center gap-3">
//           <Button 
//             variant="ghost" 
//             size="sm" 
//             onClick={onNewChat} 
//             className="flex gap-2 p-2 rounded-full bg-white/20 md:bg-[#1b1a1a33] md:dark:bg-primary h-8 w-8 md:h-10 md:w-10"
//           >
//             <MessageSquareIcon className="h-4 md:h-6 w-4 md:w-6 text-white md:text-white" />
//           </Button>
//         </div>

//         {/* Center: Title */}
//         <div className="text-center">
//           <h1 className="text-lg md:text-3xl font-semibold text-white">
//             Nigerian Tax Assistant
//           </h1>
//           <p className="text-sm md:text-lg text-white/80  block">
//             Tax Laws & Guidance
//           </p>
//         </div>

//         {/* Right: Theme toggle */}
//         <div className="flex items-center gap-2">
//           <ThemeToggle isMobile />
//         </div>
//       </div>
//     </header>
//   );
// }



"use client";

import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";

import { useIsMobile } from "@/hooks/use-mobile";
import Logo from "@/components/logo";

interface ChatHeaderProps {
  onNewChat?: () => void;
}

export function ChatHeader({ onNewChat }: ChatHeaderProps = {}) {
  const isMobile = useIsMobile()
  return (
    <header className="sticky top-0 z-20 w-full py-2 md:py-3" style={{ backgroundColor: "transparent" }}>
      <div className="flex h-10 items-center justify-between px-4 md:px-6 max-w-5xl w-full mx-auto">
        {/* Left: Logo and Branding */}
        <div className="flex items-center gap-2">
          <Logo />
          
        </div>

        {/* Right: Theme toggle */}
        <div className="flex items-center gap-2">
          <ThemeToggle isMobile />
          <div>
          <Image src="/servicom_logo.svg" alt="Logo" width={isMobile ? 35 : 50} height={isMobile ? 35 : 50} />
          </div>
        </div>
      </div>
    </header>
  );
}


