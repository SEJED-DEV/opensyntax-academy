"use client"

import Link from "next/link"
import { useState, useEffect, JSX } from "react"
import { ArrowRight, Instagram, Play, Circle, GitBranch, Terminal as TerminalIcon } from "lucide-react"
import { motion, Variants } from "framer-motion"
import { InteractiveTerminal } from "./interactive-terminal"
import { getTranslations, Locale, DEFAULT_LOCALE, I18N_STORAGE_KEY, LOCALES } from "@/lib/i18n"

const CODE_LINES = [
  { text: '// OpenSyntax Academy — v5.0.0', color: 'text-emerald-500/70 italic' },
  { text: '// Premium open-source developer education', color: 'text-emerald-500/70 italic' },
  { text: '', color: '' },
  { text: 'import { Mastery } from \'opensyntax\'', color: 'text-code-kw' },
  { text: '', color: '' },
  { text: 'const student = await Academy.enroll({', color: 'text-code-fn' },
  { text: '  path: \'full-stack\',', color: 'text-code-str' },
  { text: '  level: \'advanced\',', color: 'text-code-str' },
  { text: '  cost: 0,  // always free', color: 'text-code-num' },
  { text: '})', color: 'text-foreground' },
  { text: '', color: '' },
  { text: 'await student.learn({', color: 'text-code-fn' },
  { text: '  track: \'Web Engineering\',', color: 'text-code-str' },
  { text: '  lessons: \'250+\',', color: 'text-code-str' },
  { text: '  community: \'Join us on Instagram\',', color: 'text-code-str' },
  { text: '})', color: 'text-foreground' },
]

function CodeEditor() {
  const [visibleLines, setVisibleLines] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (visibleLines < CODE_LINES.length) {
      const timer = setTimeout(() => setVisibleLines(v => v + 1), 80)
      return () => clearTimeout(timer)
    }
  }, [visibleLines])

  useEffect(() => {
    const cursor = setInterval(() => setShowCursor(c => !c), 530)
    return () => clearInterval(cursor)
  }, [])

  return (
    <div className="glass rounded-2xl overflow-hidden shadow-2xl border border-border/50 w-full max-w-xl mx-auto">
      {/* Tab bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-background/80 border-b border-border/50">
        <div className="flex items-center gap-1.5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground/60 font-mono">
          <TerminalIcon size={12} />
          <span>opensyntax.tsx</span>
        </div>
        <div className="w-14" />
      </div>

      {/* Code area */}
      <div className="flex bg-background/50">
        {/* Line numbers gutter */}
        <div className="select-none py-4 pr-3 pl-4 text-right text-[11px] leading-6 font-mono text-muted-foreground/20 border-r border-border/30 min-w-[3rem]">
          {CODE_LINES.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        {/* Code content */}
        <div className="py-4 pl-4 pr-6 overflow-x-auto w-full">
          {CODE_LINES.slice(0, visibleLines).map((line, i) => (
            <div key={i} className="text-[13px] leading-6 font-mono whitespace-pre">
              {i === visibleLines - 1 && visibleLines < CODE_LINES.length ? (
                <span>
                  <span className={line.color || 'text-foreground/80'}>{line.text}</span>
                  <span className={`inline-block w-[2px] h-[15px] ml-0.5 bg-accent align-middle ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
                </span>
              ) : (
                <span className={line.color || 'text-foreground/80'}>{line.text}</span>
              )}
            </div>
          ))}
          {visibleLines >= CODE_LINES.length && (
            <span className={`inline-block w-[2px] h-[15px] ml-0.5 bg-accent align-middle ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
          )}
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(I18N_STORAGE_KEY) as Locale | null
      if (stored && LOCALES.find(l => l.code === stored)) setLocale(stored)
    } catch {}
    const handler = (e: Event) => setLocale((e as CustomEvent<Locale>).detail)
    window.addEventListener("localechange", handler)
    return () => window.removeEventListener("localechange", handler)
  }, [])

  const t = getTranslations(locale)

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.15 }
    }
  }

  const item: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-4 pt-20 pb-0 overflow-hidden">
      {/* VS Code Editor Background */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]"
          style={{
            backgroundImage: `
              linear-gradient(to right, oklch(0.7 0.17 196 / 0.2) 1px, transparent 1px),
              linear-gradient(to bottom, oklch(0.7 0.17 196 / 0.2) 1px, transparent 1px)
            `,
            backgroundSize: "24px 24px"
          }} />
        {/* Subtle glow orbs */}
        <div className="absolute top-1/4 -left-32 w-[400px] h-[400px] rounded-full opacity-[0.08] dark:opacity-[0.12]"
          style={{ background: "radial-gradient(circle, oklch(0.72 0.17 196), transparent 60%)" }} />
        <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] rounded-full opacity-[0.08] dark:opacity-[0.12]"
          style={{ background: "radial-gradient(circle, oklch(0.60 0.22 295), transparent 60%)" }} />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center w-full max-w-5xl"
      >
        {/* VS Code-style badge */}
        <motion.div variants={item} className="mb-6">
          <div className="inline-flex items-center gap-2 glass rounded-lg px-3 py-1.5 text-xs text-muted-foreground font-mono border border-border/50">
            <Circle size={6} className="fill-emerald-500 text-emerald-500" />
            <span className="text-code-kw">stable</span>
            <span className="text-muted-foreground/40 mx-0.5">·</span>
            <span className="text-[10px]">v5.0.0</span>
          </div>
        </motion.div>

        {/* Code Editor Hero */}
        <motion.div variants={item} className="w-full flex flex-col lg:flex-row items-center gap-6 mb-8">
          {/* Code Editor */}
          <div className="w-full lg:flex-1">
            <CodeEditor />
          </div>

          {/* Terminal */}
          <div className="w-full lg:w-96">
            <InteractiveTerminal />
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div variants={item} className="flex flex-wrap gap-3 justify-center mb-8">
          <Link href="#courses" className="group inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-bold bg-accent text-accent-foreground hover:opacity-90 transition-all shadow-xl shadow-accent/20">
            <Play size={14} className="fill-current" />
            {t.hero_cta_start}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link href="/courses/web" className="group inline-flex items-center gap-2 rounded-lg glass px-5 py-3 text-sm font-bold text-foreground hover:bg-secondary/50 transition-all border border-border/50">
            <GitBranch size={14} />
            Explore Curriculum
          </Link>
          <a href="https://www.instagram.com/http.sejed.official/" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 rounded-lg glass px-5 py-3 text-sm font-bold text-foreground hover:text-pink-500 transition-all border border-border/50">
            <Instagram size={14} />
            {t.hero_cta_community}
          </a>
        </motion.div>

        {/* VS Code Status Bar */}
        <motion.div variants={item} className="w-full glass rounded-t-2xl rounded-b-lg px-4 sm:px-6 py-3 border border-border/50 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[10px] font-mono text-muted-foreground/60">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <GitBranch size={11} className="text-code-kw" />
              <span className="text-code-kw">main</span>
            </span>
            <span className="hidden sm:inline text-muted-foreground/30">|</span>
            <span className="hidden sm:flex items-center gap-1">
              <Circle size={6} className="fill-emerald-500 text-emerald-500" />
              <span>14 courses</span>
            </span>
            <span className="hidden sm:inline text-muted-foreground/30">|</span>
            <span>250+ lessons</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">UTF-8</span>
            <span className="hidden sm:inline text-muted-foreground/30">|</span>
            <span className="text-code-str">TypeScript</span>
            <span className="text-muted-foreground/30">|</span>
            <span>
              <span className="text-code-num">50</span>h+ content
            </span>
            <span className="text-muted-foreground/30">|</span>
            <span className="text-code-str">free</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
