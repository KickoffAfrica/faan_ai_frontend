"use client"

import React from "react"
import Topbar from "./topnav"
// import Sidebar from "./dashboard-sidebar"
// import Topbar from "./topnav"
// import MobileNav from "./mobile-nav"


type Props = { children?: React.ReactNode }

export default function DashboardWrapper({ children }: Props) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-screen w-full">
        {/* Sidebar: hidden on small screens, shown on md+ */}
        {/* <aside className="hidden md:flex md:col-span-3 lg:col-span-2 border-r bg-sidebar">
          <Sidebar />
        </aside> */}

        {/* Main content */}
        <main className="col-span-1 md:col-span-6 lg:col-span-7  bg-[#F6F5F8] w-screen md:w-full lg:w-full">
          <div className="w-full">

          <Topbar />
          </div>
          <div className="mt-2 lg:mt-6 p-2 md:px-8 md:p-4 w-full">{children}</div>
        </main>
        

        {/* Right column widgets (desktop only) */}
        {/* <aside className="hidden md:block md:col-span-3 lg:col-span-3 p-4">
          
          aside with leaderboard
        </aside> */}
      </div>

      {/* Mobile bottom nav (always mounted, hidden on md+) */}
      {/* <MobileNav /> */}
    </div>
  )
}