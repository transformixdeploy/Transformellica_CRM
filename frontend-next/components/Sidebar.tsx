"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Bot, LayoutDashboard, ChartNoAxesCombined, ClipboardMinus, Monitor, CircleQuestionMark, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-width', 
      isCollapsed ? '80px' : '256px'
    );
  }, [isCollapsed]);

  function handleOnClick(event: any){
    setIsCollapsed(!isCollapsed);
  }

  return (
    <>

      {/** Big Screens side bar */}
      <aside
        className={cn(
          "max-lg:hidden inset-y-0 left-0 z-10 border-r bg-background p-4 flex flex-col transition-all duration-300",
          isCollapsed ? "w-20" : "w-64"
        )}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
      >
        <nav className="flex flex-col gap-2 flex-grow">
          <Link
            href="/bi-analysis/display"
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary",
              pathname === "/bi-analysis/display" ? "bg-muted text-primary" : "text-muted-foreground",
              isCollapsed ? "justify-center" : "justify-start"
            )}
          >
            <Monitor className="h-4 w-4" />
            {!isCollapsed && "Display"}
          </Link>
          <Link
            href="/bi-analysis/ai-assistant"
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary",
              pathname === "/bi-analysis/ai-assistant" ? "bg-muted text-primary" : "text-muted-foreground",
              isCollapsed ? "justify-center" : "justify-start"
            )}
          >
            <Bot className="h-4 w-4" />
            {!isCollapsed && "AI Assistant"}
          </Link>
          <Link
            href="/bi-analysis/dashboard"
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary",
              pathname === "/bi-analysis/dashboard" ? "bg-muted text-primary" : "text-muted-foreground",
              isCollapsed ? "justify-center" : "justify-start"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            {!isCollapsed && "Dashboard"}
          </Link>
          <Link
            href="/bi-analysis/pattern-analysis"
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary",
              pathname === "/bi-analysis/pattern-analysis" ? "bg-muted text-primary" : "text-muted-foreground",
              isCollapsed ? "justify-center" : "justify-start"
            )}
          >
            <ChartNoAxesCombined className="h-4 w-4" />
            {!isCollapsed && "Pattern Analysis"}
          </Link>
          <Link
            href="/bi-analysis/how-it-works"
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary",
              pathname === "/bi-analysis/how-it-works" ? "bg-muted text-primary" : "text-muted-foreground",
              isCollapsed ? "justify-center" : "justify-start"
            )}
          >
            <CircleQuestionMark className="h-4 w-4" />
            {!isCollapsed && "How It Works"}
          </Link>
          <Link
            href="/bi-analysis/docs"
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary",
              pathname === "/bi-analysis/docs" ? "bg-muted text-primary" : "text-muted-foreground",
              isCollapsed ? "justify-center" : "justify-start"
            )}
          >
            <ClipboardMinus  className="h-4 w-4" />
            {!isCollapsed && "Docs"}
          </Link>
        </nav>
      </aside>
      
      {/** Small Screens side bar */}
      <aside className="lg:hidden">
        <Button onMouseEnter={handleOnClick} onMouseLeave={()=>{setIsCollapsed(true)}} onClick={handleOnClick} className="m-3 absolute" variant={"outline"}> <Menu></Menu> </Button>
        
        <nav className={cn(
          "flex-col gap-2 flex-grow absolute mt-15 inset-y-15 left-0 z-10 border-r rounded-3xl bg-gray-700 ease-in-out",
          isCollapsed ? "max-w-0 overflow-hidden p-0 -translate-x-full transition-none" : "max-w-64 p-4 mx-3 translate-x-0 transition-transform duration-300"
        )}>
          
          <Link
            href="/bi-analysis/display"
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary",
              pathname === "/bi-analysis/display" ? "bg-muted text-primary" : "text-muted-foreground",
              isCollapsed ? "justify-center" : "justify-start"
            )}
          >
            <Monitor className="h-4 w-4" />
            {!isCollapsed && "Display"}
          </Link>
          <Link
            href="/bi-analysis/ai-assistant"
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary",
              pathname === "/bi-analysis/ai-assistant" ? "bg-muted text-primary" : "text-muted-foreground",
              isCollapsed ? "justify-center" : "justify-start"
            )}
          >
            <Bot className="h-4 w-4" />
            {!isCollapsed && "AI Assistant"}
          </Link>
          <Link
            href="/bi-analysis/dashboard"
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary",
              pathname === "/bi-analysis/dashboard" ? "bg-muted text-primary" : "text-muted-foreground",
              isCollapsed ? "justify-center" : "justify-start"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            {!isCollapsed && "Dashboard"}
          </Link>
          <Link
            href="/bi-analysis/pattern-analysis"
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary",
              pathname === "/bi-analysis/pattern-analysis" ? "bg-muted text-primary" : "text-muted-foreground",
              isCollapsed ? "justify-center" : "justify-start"
            )}
          >
            <ChartNoAxesCombined className="h-4 w-4" />
            {!isCollapsed && "Pattern Analysis"}
          </Link>
          <Link
            href="/bi-analysis/how-it-works"
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary",
              pathname === "/bi-analysis/how-it-works" ? "bg-muted text-primary" : "text-muted-foreground",
              isCollapsed ? "justify-center" : "justify-start"
            )}
          >
            <CircleQuestionMark className="h-4 w-4" />
            {!isCollapsed && "How It Works"}
          </Link>
          <Link
            href="/bi-analysis/docs"
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary",
              pathname === "/bi-analysis/docs" ? "bg-muted text-primary" : "text-muted-foreground",
              isCollapsed ? "justify-center" : "justify-start"
            )}
          >
            <ClipboardMinus  className="h-4 w-4" />
            {!isCollapsed && "Docs"}
          </Link>
        </nav>
      </aside>


    </>
  );
}
