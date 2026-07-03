"use client"

import { useState, useEffect } from "react"
import { SearchPalette } from "@/components/search-palette"
import { Prompts } from "@/components/prompts"
import { ScrollToTop } from "@/components/scroll-to-top"
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuShortcut } from "@/components/ui/context-menu"
import { useRouter } from "next/navigation"

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div>
          {children}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="glass border-border/50 backdrop-blur-xl rounded-xl p-1.5 min-w-[180px]">
        <ContextMenuItem onClick={() => router.back()} className="rounded-lg text-xs">
          Back
          <ContextMenuShortcut>Alt+←</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => router.forward()} className="rounded-lg text-xs">
          Forward
          <ContextMenuShortcut>Alt+→</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator className="bg-border/50" />
        <ContextMenuItem onClick={() => window.location.reload()} className="rounded-lg text-xs">
          Reload
          <ContextMenuShortcut>Ctrl+R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => { const sel = window.getSelection()?.toString(); if (sel) navigator.clipboard?.writeText(sel) }} className="rounded-lg text-xs">
          Copy
          <ContextMenuShortcut>Ctrl+C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => navigator.clipboard?.readText().then(t => document.execCommand?.("insertText", false, t)).catch(() => {})} className="rounded-lg text-xs">
          Paste
          <ContextMenuShortcut>Ctrl+V</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator className="bg-border/50" />
        <ContextMenuItem onClick={() => window.open("https://github.com/anomalyco/opensyntax/issues/new", "_blank")} className="rounded-lg text-xs">
          Report Issue
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
