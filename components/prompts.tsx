"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Bug, LifeBuoy, X, ArrowRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { usePwaInstall } from "@/hooks/use-pwa-install"

type PromptType = "instagram" | "bugs" | "support" | "pwa-app"

interface PromptData {
  id: PromptType
  icon: typeof MessageSquare
  title: string
  detail: string
  action: string
  href: string
  external?: boolean
  accent: string
}

const PROMPTS: PromptData[] = [
  {
    id: "instagram",
    icon: MessageSquare,
    title: "Connect on Instagram?",
    detail: "Join 2,500+ devs discussing lessons in real-time.",
    action: "Join Server",
    href: "https://www.instagram.com/http.sejed.official/",
    external: true,
    accent: "oklch(0.60 0.22 295)",
  },
  {
    id: "bugs",
    icon: Bug,
    title: "Encountered a glitch?",
    detail: "Check our known bugs list or report a new one.",
    action: "See Status",
    href: "/bugs",
    accent: "oklch(0.63 0.20 25)",
  },
  {
    id: "support",
    icon: LifeBuoy,
    title: "Join our support server?",
    detail: "Direct access to instructors and maintainers.",
    action: "Get Help",
    href: "https://www.instagram.com/http.sejed.official/",
    external: true,
    accent: "oklch(0.75 0.20 85)",
  },
  {
    id: "pwa-app",
    icon: ArrowRight,
    title: "Download the App",
    detail: "Install OpenSyntax for offline learning and zero mobile lag.",
    action: "Install Now",
    href: "/#pwa-install",
    accent: "oklch(0.60 0.18 145)",
  },
]

const STORAGE_KEY = "opensyntax-dismissed-prompts"

function getDismissed(): Set<string> {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch { return new Set() }
}

function saveDismissed(set: Set<string>) {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify([...set]))
  } catch { /* noop */ }
}

export function Prompts() {
  const [active, setActive] = useState<PromptType | null>(null)
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [showDiscord, setShowDiscord] = useState(false)
  const pathname = usePathname()
  const { available, installPwa } = usePwaInstall()

  useEffect(() => {
    setDismissed(getDismissed())
  }, [])

  useEffect(() => {
    const stored = getDismissed()
    const timer = setTimeout(() => {
      let pick: PromptType = "pwa-app"
      if (pathname === "/bugs") pick = "instagram"
      else if (pathname === "/") pick = "pwa-app"
      else pick = "pwa-app"

      if (!stored.has(pick)) {
        if (pick === "pwa-app" && !available) {
          setActive("instagram")
        } else {
          setActive(pick)
        }
      }
    }, 8000)

    return () => clearTimeout(timer)
  }, [pathname])

  useEffect(() => {
    const stored = getDismissed()
    if (stored.has("discord")) return

    let shown = false
    const maybeShow = () => {
      if (!shown) {
        shown = true
        setShowDiscord(true)
      }
    }

    const timer = setTimeout(maybeShow, 30000)

    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight
      const winHeight = window.innerHeight
      const scrollable = docHeight - winHeight
      if (scrollable > 0 && scrollTop / scrollable > 0.5) {
        maybeShow()
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      clearTimeout(timer)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  const dismiss = () => {
    if (active) {
      const next = new Set(dismissed)
      next.add(active)
      setDismissed(next)
      saveDismissed(next)
      setActive(null)
    }
  }

  const dismissDiscord = () => {
    const next = new Set(dismissed)
    next.add("discord")
    setDismissed(next)
    saveDismissed(next)
    setShowDiscord(false)
  }

  const current = PROMPTS.find(p => p.id === active && !dismissed.has(p.id))

  const handleAction = (e: React.MouseEvent) => {
    if (active === "pwa-app") {
      e.preventDefault()
      installPwa()
      dismiss()
    } else {
      dismiss()
    }
  }

  const hasActivePrompt = active !== null && !dismissed.has(active)
  const showDiscordBanner = showDiscord && !dismissed.has("discord") && !hasActivePrompt
  const anyNotification = hasActivePrompt || showDiscordBanner
  const discordBottom = current ? "148px" : "24px"

  return (
    <>
      {/* Backdrop */}
      {anyNotification && (
        <div className="fixed inset-0 z-[90] bg-black/20 backdrop-blur-[2px]" onClick={() => { setActive(null); setShowDiscord(false) }} />
      )}

      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] w-[calc(100vw-32px)] sm:w-[300px] pointer-events-auto"
          >
            <div className="glass rounded-2xl p-5 shadow-2xl overflow-hidden relative group">
              <button 
                onClick={dismiss}
                className="absolute top-3 right-3 p-1 text-muted-foreground/40 hover:text-foreground transition-colors z-20"
              >
                <X size={14} />
              </button>

              <div className="flex items-start gap-4">
                <div 
                  className="p-2.5 rounded-xl flex-shrink-0"
                  style={{ background: current.accent + "15", border: `1px solid ${current.accent}20` }}
                >
                  <current.icon size={18} style={{ color: current.accent }} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-foreground mb-1 leading-tight tracking-tight">{current.title}</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">{current.detail}</p>
                  
                  <Link 
                    href={current.href}
                    target={current.external ? "_blank" : undefined}
                    rel={current.external ? "noopener noreferrer" : undefined}
                    onClick={handleAction}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-[10px] font-bold transition-all hover:gap-3 shadow-lg"
                  >
                    {current.action}
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>

              <div 
                className="absolute -right-4 -bottom-4 h-20 w-20 rounded-full blur-[40px] opacity-10 pointer-events-none"
                style={{ background: current.accent }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDiscordBanner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed right-4 sm:right-6 z-[99] w-[calc(100vw-32px)] sm:w-[300px] pointer-events-auto"
            style={{ bottom: discordBottom }}
          >
            <div className="glass rounded-2xl p-5 shadow-2xl overflow-hidden relative group">
              <button
                onClick={dismissDiscord}
                className="absolute top-3 right-3 p-1 text-muted-foreground/40 hover:text-foreground transition-colors z-20"
              >
                <X size={14} />
              </button>

              <div className="flex items-start gap-4">
                <div
                  className="p-2.5 rounded-xl flex-shrink-0"
                  style={{ background: "var(--discord)15", border: "1px solid var(--discord)20" }}
                >
                  <MessageSquare size={18} style={{ color: "var(--discord)" }} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-foreground mb-1 leading-tight tracking-tight">Join the Cortex HQ Discord</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
                    Get help, request ads, suggest features, or just hang out with fellow devs.
                  </p>

                  <a
                    href="#"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-[10px] font-bold transition-all hover:gap-3 shadow-lg"
                    style={{ background: "var(--discord)" }}
                  >
                    Join Discord →
                  </a>
                </div>
              </div>

              <div
                className="absolute -right-4 -bottom-4 h-20 w-20 rounded-full blur-[40px] opacity-10 pointer-events-none"
                style={{ background: "var(--discord)" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function ContactDevBanner() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-4">
      <div className="glass rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Need a custom bot or project?{" "}
          <a
            href="https://sejed.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-foreground hover:text-accent transition-colors"
          >
            Contact the dev at sejed.dev
          </a>
        </p>
        <a
          href="https://sejed.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-[10px] font-bold transition-all hover:gap-3 shadow-lg"
        >
          Contact Now
          <ArrowRight size={12} />
        </a>
      </div>
    </div>
  )
}
