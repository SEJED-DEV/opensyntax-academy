"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Terminal } from "lucide-react"
import { getTranslations, Locale, DEFAULT_LOCALE, I18N_STORAGE_KEY, LOCALES } from "@/lib/i18n"

type Command = {
  cmd: string
  output: React.ReactNode
}

const HISTORY: Command[] = [
  {
    cmd: "npx create-opensyntax-app@latest",
    output: (
      <div className="text-emerald-400">
        <p>Creating a new OpenSyntax application...</p>
        <p>Installing dependencies: react, next, framer-motion...</p>
        <p>Initialized a git repository.</p>
        <p className="text-white mt-2">Success! Ready to build the future.</p>
      </div>
    )
  },
]

export function InteractiveTerminal() {
  const [history, setHistory] = useState<Command[]>(HISTORY)
  const [input, setInput] = useState("")
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE)

  // Ref for the scroll container (the terminal body div), NOT bottomRef
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Listen for locale changes
  useEffect(() => {
    try {
      const stored = localStorage.getItem(I18N_STORAGE_KEY) as Locale | null
      if (stored && LOCALES.find(l => l.code === stored)) setLocale(stored)
    } catch {}
    const handler = (e: Event) => setLocale((e as CustomEvent<Locale>).detail)
    window.addEventListener("localechange", handler)
    return () => window.removeEventListener("localechange", handler)
  }, [])

  // Scroll ONLY the terminal container — NOT the whole page
  // Only scroll when user has actually typed something (history.length > 1)
  useEffect(() => {
    if (history.length <= 1) return
    const container = scrollContainerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [history])

  const t = getTranslations(locale)

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const trimmed = input.trim()
    let output: React.ReactNode = <span className="text-red-400">Command not found: {trimmed}</span>

    if (trimmed === "clear") {
      setHistory([])
      setInput("")
      return
    }

    if (trimmed === "help") {
      output = (
        <div className="text-blue-300">
          <p>Available commands:</p>
          <ul className="list-disc pl-4 mt-1 space-y-1">
            <li><span className="text-emerald-300 font-bold">whoami</span> - Display current user info</li>
            <li><span className="text-emerald-300 font-bold">courses</span> - List all available learning paths</li>
            <li><span className="text-emerald-300 font-bold">stats</span> - Platform statistics</li>
            <li><span className="text-emerald-300 font-bold">about</span> - About OpenSyntax Academy</li>
            <li><span className="text-emerald-300 font-bold">latest</span> - Latest platform updates</li>
            <li><span className="text-emerald-300 font-bold">version</span> - Show platform version</li>
            <li><span className="text-emerald-300 font-bold">lang</span> - Show supported languages</li>
            <li><span className="text-emerald-300 font-bold">enroll</span> - Start your journey</li>
            <li><span className="text-emerald-300 font-bold">clear</span> - Clear the terminal</li>
          </ul>
        </div>
      )
    } else if (trimmed === "whoami") {
      output = <span className="text-purple-300">guest_user_992 @ opensyntax-academy</span>
    } else if (trimmed === "courses") {
      output = (
        <div className="text-yellow-200">
          <p>1. Web Engineering (Next.js, Edge)</p>
          <p>2. System Design (Kafka, Redis, Sharding)</p>
          <p>3. Rust &amp; Systems Programming</p>
          <p>4. AI/ML Engineering</p>
          <p>5. DevOps &amp; Cloud</p>
          <p>6. Advanced Discord Development</p>
          <p>7. Database Engineering</p>
          <p className="text-gray-400 italic mt-1">...and 6 more. 13 paths total.</p>
        </div>
      )
    } else if (trimmed === "stats") {
      output = (
        <div className="text-cyan-300">
          <p>📊 <span className="text-white font-bold">Platform Statistics</span></p>
          <p className="mt-1">  Courses:    <span className="text-emerald-300 font-bold">13</span></p>
          <p>  Lessons:    <span className="text-emerald-300 font-bold">250+</span></p>
          <p>  Content:    <span className="text-emerald-300 font-bold">50h+</span></p>
          <p>  Languages:  <span className="text-emerald-300 font-bold">5 (EN/AR/TN/FR/DE)</span></p>
          <p>  License:    <span className="text-emerald-300 font-bold">Apache 2.0</span></p>
          <p>  Price:      <span className="text-emerald-300 font-bold">$0 forever</span></p>
        </div>
      )
    } else if (trimmed === "about") {
      output = (
        <div className="text-blue-200">
          <p className="text-white font-bold">OpenSyntax Academy</p>
          <p className="mt-1">A premium, completely free platform built to elevate your</p>
          <p>development skills. Community-funded, open-source, and</p>
          <p>designed for real-world engineering — not toy examples.</p>
          <p className="mt-1 text-emerald-300">Now supports: EN · AR · TN · FR · DE</p>
          <p className="mt-1 text-gray-400">→ https://opensyntax-academy.vercel.app</p>
        </div>
      )
    } else if (trimmed === "latest") {
      output = (
        <div className="text-amber-200">
          <p className="text-white font-bold">🚀 v5.0.0 — VS Code Glass Redesign</p>
          <p className="mt-1 text-emerald-300">+ Multi-language support (EN, AR, TN, FR, DE)</p>
          <p className="text-emerald-300">+ RTL layout for Arabic & Tunisian</p>
          <p className="text-emerald-300">+ Known Bugs page added to nav</p>
          <p className="text-emerald-300">+ Terminal scroll page-hijack fixed</p>
          <p className="text-emerald-300">+ Landing page top visibility fixed</p>
          <p className="text-gray-400 italic mt-1">Run &apos;enroll&apos; to start learning.</p>
        </div>
      )
    } else if (trimmed === "version") {
      output = (
        <div className="text-purple-300">
          <p>OpenSyntax OS <span className="text-white font-bold">v5.0.0</span></p>
          <p className="text-gray-500 text-xs mt-1">Built with Next.js 16 · React 19 · Framer Motion</p>
          <p className="text-gray-500 text-xs">i18n: EN · AR (RTL) · TN (RTL) · FR · DE</p>
        </div>
      )
    } else if (trimmed === "lang") {
      output = (
        <div className="text-pink-300">
          <p className="text-white font-bold">🌐 Supported Languages</p>
          <p className="mt-1">  <span className="text-emerald-300">en</span> — English</p>
          <p>  <span className="text-emerald-300">ar</span> — العربية (Arabic · RTL)</p>
          <p>  <span className="text-emerald-300">tn</span> — تونسي (Tunisian Darija · RTL)</p>
          <p>  <span className="text-emerald-300">fr</span> — Français (French)</p>
          <p>  <span className="text-emerald-300">de</span> — Deutsch (German)</p>
          <p className="text-gray-400 italic mt-1">Use the globe icon in the navbar to switch.</p>
        </div>
      )
    } else if (trimmed === "enroll") {
      output = <span className="text-emerald-400">Access Granted. Routing to dashboard...</span>
      setTimeout(() => {
        window.location.href = "/courses"
      }, 1500)
    } else if (trimmed.startsWith("echo ")) {
      output = <span className="text-white">{trimmed.substring(5)}</span>
    } else if (trimmed === "sudo") {
      output = <span className="text-red-500 font-bold">Nice try. But you don&apos;t have root privileges here.</span>
    }

    setHistory(prev => [...prev, { cmd: trimmed, output }])
    setInput("")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-white/10"
      style={{
        background: "linear-gradient(180deg, rgba(15,15,20,0.95) 0%, rgba(10,10,15,0.98) 100%)",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 198, 255, 0.1)"
      }}
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
          <Terminal size={12} />
          <span>bash — opensyntax-cli</span>
        </div>
        <div className="w-12" />
      </div>

      {/* Terminal Body — scroll is contained here, NOT the page */}
      <div
        ref={scrollContainerRef}
        className="p-5 font-mono text-sm h-[320px] overflow-y-auto custom-scrollbar"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="text-gray-400 mb-4">
          <p>{t.terminal_welcome_1}</p>
          <p>Type <span className="text-emerald-400 font-bold">&apos;help&apos;</span> to see available commands.</p>
        </div>

        {history.map((h, i) => (
          <div key={i} className="mb-4">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <span className="text-blue-400">~/opensyntax</span>
              <span className="text-gray-500">$</span>
              <span className="text-white">{h.cmd}</span>
            </div>
            <div>{h.output}</div>
          </div>
        ))}

        <form onSubmit={handleCommand} className="flex items-center gap-2 mt-4">
          <span className="text-blue-400">~/opensyntax</span>
          <span className="text-gray-500">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none text-white font-mono placeholder:text-gray-700"
            placeholder="Type a command..."
            spellCheck={false}
            autoComplete="off"
            // autoFocus REMOVED — was causing the page to scroll down on load
          />
        </form>
      </div>
    </motion.div>
  )
}
