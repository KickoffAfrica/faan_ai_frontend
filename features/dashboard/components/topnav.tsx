"use client";

import { Button } from "@/components/ui/button";
import { AlignVerticalJustifyStart, BellIcon, RefreshCcwIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Topbar() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const bgStyle: React.CSSProperties = {
    backgroundImage: `url('/images/win-jara-bg.svg')`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: isMobile ? "center top" : "left center",
  }


  if (isMobile) {
    return (
      <div style={bgStyle} className="w-full flex items-center justify-between bg-primary-500 border-b border-border py-4 px-2 gap-2 overflow-hidden">
        <div className="flex items-center gap-2">
          <div>
            <Avatar>
              <AvatarImage src="/images/avatar.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        
        <div className="text-sm text-white/80 shrink min-w-0 pr-2">
          Good Afternoon, <br />{" "}
          <span className="text-base font-medium text-white">
            Asake Bin Michael
          </span>
        </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="default"
            size="sm"
            className="rounded-full bg-linear-to-b from-primary-500 to-primary-600 px-2 py-1 text-xs  whitespace-nowrap shadow-[0_2px_0_0_rgba(122,74,255,0.4)]"
          >
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <RefreshCcwIcon className="w-3 h-3 text-primary-500" />
            </div>{" "}
            <span className="text-white text-xs font-medium">1</span> Free Spin
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-between bg-white border-b border-border px-8 py-2">
      <div className="text-sm text-muted-500">
        Good Afternoon, <br />{" "}
        <span className="text-lg font-medium text-primary-900">
          Asake Bin Michael
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="default"
          size="sm"
          className="rounded-full bg-linear-to-b from-primary-500 to-primary-600 px-3 py-1 text-sm shadow-md"
        >
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <RefreshCcwIcon className="w-4 h-4 text-primary-500" />
          </div>{" "}
          <span className="text-white text-sm font-medium">1</span> Free Spin
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full px-3 py-1 text-sm shadow-sm bg-muted-50 relative"
        >
          <BellIcon className="w-6 h-6 text-muted-600 font-medium" />
          <div className="absolute top-0 -right-2 w-5   h-5 bg-primary-50 rounded-full text-primary-500 border border-primary-500 text-xs font-medium flex items-center justify-center">
            2
          </div>
        </Button>
      </div>
    </div>
  );
}
