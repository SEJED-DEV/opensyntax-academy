"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, ChevronDown, Search as SearchIcon, Command, ArrowRight, Bug, GraduationCap, History, GitPullRequest, FileText, Shield } from "lucide-react"
import { LanguageSwitcher } from "./language-switcher"
import { ThemeToggle } from "./theme-toggle"
import { getTranslations, Locale, DEFAULT_LOCALE, I18N_STORAGE_KEY, LOCALES } from "@/lib/i18n"

const courses = [
  { href: "/courses/foundations",    label: "Computing Foundations",  tag: "Minus Zero",      category: "Foundations", difficulty: "Beginner" },
  { href: "/courses/web",            label: "Web Engineering",        tag: "Next.js 16",      category: "Web",         difficulty: "Advanced" },
  { href: "/courses/typescript",     label: "TypeScript Mastery",     tag: "Advanced Types",  category: "Web",         difficulty: "Advanced" },
  { href: "/courses/react-patterns", label: "React Advanced Patterns",tag: "Hooks · Perf",     category: "Web",         difficulty: "Expert" },
  { href: "/courses/discord",        label: "Discord Development",    tag: "discord.py",      category: "Discord",     difficulty: "Intermediate" },
  { href: "/courses/python",         label: "Python & Data Science",  tag: "Pandas · ML",     category: "Data & AI",   difficulty: "Intermediate" },
  { href: "/courses/ai-ml",          label: "AI/ML Engineering",      tag: "LLMs · RAG",      category: "Data & AI",   difficulty: "Advanced" },
  { href: "/courses/devops",         label: "DevOps & Cloud",         tag: "K8s · Terraform", category: "Systems",     difficulty: "Advanced" },
  { href: "/courses/databases",      label: "Database Engineering",   tag: "PostgreSQL",      category: "Systems",     difficulty: "Intermediate" },
  { href: "/courses/system-design",  label: "System Design",          tag: "Distributed",     category: "Systems",     difficulty: "Expert" },
  { href: "/courses/rust",           label: "Rust & Systems",         tag: "WASM · Tokio",    category: "Systems",     difficulty: "Advanced" },
  { href: "/courses/cybersecurity",  label: "Cybersecurity",          tag: "OWASP · Auth",    category: "Security",    difficulty: "Intermediate" },
  { href: "/courses/blockchain",     label: "Blockchain & Web3",      tag: "Solidity",        category: "Blockchain",  difficulty: "Intermediate" },
  { href: "/courses/mobile",         label: "Mobile · React Native",  tag: "Expo · Reanimated",category: "Mobile",      difficulty: "Intermediate" },
]

const categoryOrder = ["Foundations", "Web", "Discord", "Data & AI", "Systems", "Security", "Blockchain", "Mobile"]

const categoryDots: Record<string, string> = {
  "Foundations": "bg-emerald-500",
  "Web": "bg-blue-500",
  "Discord": "bg-purple-500",
  "Data & AI": "bg-amber-500",
  "Systems": "bg-cyan-500",
  "Security": "bg-red-500",
  "Blockchain": "bg-yellow-500",
  "Mobile": "bg-pink-500",
}

const badgeStyles: Record<string, string> = {
  "Beginner": "text-emerald-500 bg-emerald-500/10",
  "Intermediate": "text-amber-500 bg-amber-500/10",
  "Advanced": "text-red-500 bg-red-500/10",
  "Expert": "text-purple-500 bg-purple-500/10",
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState<string | false>(false)
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE)

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

  const toggleSearch = () => {
    const e = new KeyboardEvent("keydown", { key: "k", ctrlKey: true, metaKey: true })
    document.dispatchEvent(e)
  }

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-3 px-4">
      <nav className="glass rounded-2xl w-full max-w-6xl flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <svg width="110" height="24" viewBox="0 0 220 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="block">
            <defs>
              <linearGradient id="navLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="oklch(0.72 0.17 196)"/>
                <stop offset="100%" stopColor="oklch(0.60 0.22 295)"/>
              </linearGradient>
            </defs>
            <rect width="38" height="38" rx="9" fill="url(#navLogoGrad)"/>
            <path d="M12 16 L8 20 L12 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M18 15 H24 C26 15 27 16.5 27 18 V20 C27 21.5 26 23 24 23 H20 C18 23 17 24.5 17 26 V27.5 C17 29 18 30 20 30 H27" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M28 22 L30.5 26 L28 30" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5"/>
            <text x="50" y="22" fontFamily="system-ui, -apple-system, sans-serif" fontSize="16" fontWeight="600" fill="currentColor" letterSpacing="-0.3" className="fill-foreground">Open</text>
            <text x="50" y="39" fontFamily="system-ui, -apple-system, sans-serif" fontSize="16" fontWeight="700" fill="url(#navLogoGrad)" letterSpacing="-0.2">Syntax</text>
          </svg>
          <span className="hidden lg:inline text-[9px] font-mono text-muted-foreground/50 border border-border rounded px-1.5 py-0.5">v5</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-0.5 text-sm text-muted-foreground">
          {/* Courses dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropOpen(dropOpen === "courses" ? false : "courses")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-secondary/50 transition-colors"
            >
              <GraduationCap size={14} className="text-accent" />
              {t.nav_courses} <ChevronDown size={12} className={`transition-transform ${dropOpen === "courses" ? "rotate-180" : ""}`} />
            </button>
            {dropOpen === "courses" && (
              <div className="absolute top-full left-0 mt-1 w-[520px] rounded-2xl glass p-3 shadow-2xl pulse-in max-h-[75vh] overflow-y-auto animate-fade-in-up">
                {/* Search filter */}
                <div className="relative mb-3">
                  <SearchIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                  <input
                    type="text"
                    placeholder="Filter courses..."
                    className="w-full glass rounded-lg pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/30 border border-border/50 focus:outline-none focus:border-accent/50 transition-colors"
                  />
                </div>
                {/* Category groups */}
                {categoryOrder.map((cat) => {
                  const catCourses = courses.filter((c) => c.category === cat)
                  if (catCourses.length === 0) return null
                  return (
                    <div key={cat} className="mb-2 last:mb-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 px-2 py-1">
                        {cat}
                      </p>
                      <div className="grid grid-cols-2 gap-1">
                        {catCourses.map((c) => (
                          <Link
                            key={c.href}
                            href={c.href}
                            className="flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-secondary/50 hover:shadow-md transition-all group/course hover:-translate-y-0.5"
                            onClick={() => setDropOpen(false)}
                          >
                            <span className={`w-2 h-2 rounded-full shrink-0 ${categoryDots[c.category]} shadow-sm`} />
                            <span className="flex-1 min-w-0">
                              <span className="text-xs font-medium text-foreground group-hover/course:text-accent transition-colors line-clamp-1">{c.label}</span>
                            </span>
                            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${badgeStyles[c.difficulty]} shrink-0`}>{c.difficulty}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )
                })}
                {/* Browse all */}
                <Link
                  href="/courses"
                  className="flex items-center justify-center gap-1.5 mt-2 pt-2.5 border-t border-border/50 text-xs font-medium text-accent hover:text-accent/80 transition-colors group/browse"
                  onClick={() => setDropOpen(false)}
                >
                  Browse All Courses
                  <ArrowRight size={12} className="group-hover/browse:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            )}
          </div>

          {/* Resources dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropOpen(dropOpen === "resources" ? false : "resources")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:text-foreground hover:bg-secondary/50 transition-colors"
            >
              {t.nav_resources} <ChevronDown size={12} className={`transition-transform ${dropOpen === "resources" ? "rotate-180" : ""}`} />
            </button>
            {dropOpen === "resources" && (
              <div className="absolute top-full left-0 mt-1 w-56 rounded-2xl glass p-2 shadow-2xl pulse-in animate-fade-in-up">
                <Link
                  href="/status"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/50 transition-all group/res"
                  onClick={() => setDropOpen(false)}
                >
                  <span className="w-1 h-6 rounded-full bg-green-500 shrink-0" />
                  <span className="flex-1 text-xs font-medium text-foreground group-hover/res:text-accent transition-colors">{t.nav_status}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
                </Link>
                <div className="h-px bg-border my-1 mx-2" />
                <Link
                  href="/changelog"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/50 transition-all group/res"
                  onClick={() => setDropOpen(false)}
                >
                  <span className="w-1 h-6 rounded-full bg-blue-500 shrink-0" />
                  <History size={12} className="text-muted-foreground group-hover/res:text-accent transition-colors shrink-0" />
                  <span className="flex-1 text-xs font-medium text-foreground group-hover/res:text-accent transition-colors">{t.nav_changelog}</span>
                </Link>
                <Link
                  href="/contributing"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/50 transition-all group/res"
                  onClick={() => setDropOpen(false)}
                >
                  <span className="w-1 h-6 rounded-full bg-violet-500 shrink-0" />
                  <GitPullRequest size={12} className="text-muted-foreground group-hover/res:text-accent transition-colors shrink-0" />
                  <span className="flex-1 text-xs font-medium text-foreground group-hover/res:text-accent transition-colors">{t.nav_contributing}</span>
                </Link>
                <div className="h-px bg-border my-1 mx-2" />
                <Link
                  href="/bugs"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/50 transition-all group/res"
                  onClick={() => setDropOpen(false)}
                >
                  <span className="w-1 h-6 rounded-full bg-red-500 shrink-0" />
                  <Bug size={12} className="text-red-400 group-hover/res:text-red-300 transition-colors shrink-0" />
                  <span className="flex-1 text-xs font-medium text-red-400 group-hover/res:text-red-300 transition-colors">{t.nav_known_bugs}</span>
                </Link>
                <div className="h-px bg-border my-1 mx-2" />
                <Link
                  href="/terms"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/50 transition-all group/res"
                  onClick={() => setDropOpen(false)}
                >
                  <span className="w-1 h-6 rounded-full bg-neutral-500 shrink-0" />
                  <FileText size={12} className="text-muted-foreground group-hover/res:text-accent transition-colors shrink-0" />
                  <span className="flex-1 text-[11px] text-muted-foreground group-hover/res:text-foreground transition-colors">{t.nav_terms}</span>
                </Link>
                <Link
                  href="/privacy"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/50 transition-all group/res"
                  onClick={() => setDropOpen(false)}
                >
                  <span className="w-1 h-6 rounded-full bg-neutral-500 shrink-0" />
                  <Shield size={12} className="text-muted-foreground group-hover/res:text-accent transition-colors shrink-0" />
                  <span className="flex-1 text-[11px] text-muted-foreground group-hover/res:text-foreground transition-colors">{t.nav_privacy}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Search */}
          <button
            onClick={toggleSearch}
            className="group flex items-center gap-2 rounded-lg border border-border/50 glass px-3 py-1.5 text-muted-foreground hover:text-foreground transition-all min-w-[120px] ml-1"
          >
            <SearchIcon size={13} className="group-hover:text-accent transition-colors" />
            <span className="text-[11px] flex-1 text-left">{t.nav_search}</span>
            <kbd className="hidden sm:flex items-center gap-0.5 opacity-40 text-[9px] font-mono bg-secondary/50 px-1.5 py-0.5 rounded">
              <Command size={9} />K
            </kbd>
          </button>

          <div className="flex items-center gap-1 ml-2 border-l border-border/50 pl-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>

          <a href="https://www.instagram.com/http.sejed.official/" target="_blank" rel="noopener noreferrer"
            className="ml-2 flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-background hover:opacity-90 transition-opacity text-[11px] font-bold shadow-lg">
            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            {t.nav_community}
          </a>
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <LanguageSwitcher />
          <button className="text-muted-foreground hover:text-foreground transition-colors p-1.5" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden fixed inset-x-4 top-20 glass rounded-2xl p-4 flex flex-col gap-1 text-sm shadow-2xl animate-fade-in-up overflow-y-auto max-h-[70vh]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 px-3 pb-1.5">Explore Paths</p>
          <div className="grid grid-cols-1 gap-0.5 mb-3 text-foreground">
            {courses.map((c) => (
              <Link key={c.href} href={c.href}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-secondary/50 transition-colors"
                onClick={() => setOpen(false)}>
                <span className={`w-2 h-2 rounded-full shrink-0 ${categoryDots[c.category]}`} />
                <span className="text-xs font-medium flex-1">{c.label}</span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${badgeStyles[c.difficulty]} shrink-0`}>{c.difficulty}</span>
              </Link>
            ))}
          </div>

          <div className="h-px bg-border my-1" />

          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 px-3 pb-1.5 pt-1">Resources</p>

          <div className="flex flex-col gap-1 mb-3">
            <Link href="/status" className="flex items-center gap-3 px-3 py-2.5 rounded-xl glass text-xs text-foreground font-medium hover:bg-secondary/50 transition-all" onClick={() => setOpen(false)}>
              <span className="w-1 h-5 rounded-full bg-green-500 shrink-0" />
              <span className="flex-1">{t.nav_status}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
            </Link>
            <Link href="/changelog" className="flex items-center gap-3 px-3 py-2.5 rounded-xl glass text-xs text-foreground font-medium hover:bg-secondary/50 transition-all" onClick={() => setOpen(false)}>
              <span className="w-1 h-5 rounded-full bg-blue-500 shrink-0" />
              <History size={12} className="text-muted-foreground shrink-0" />
              <span>{t.nav_changelog}</span>
            </Link>
            <Link href="/contributing" className="flex items-center gap-3 px-3 py-2.5 rounded-xl glass text-xs text-foreground font-medium hover:bg-secondary/50 transition-all" onClick={() => setOpen(false)}>
              <span className="w-1 h-5 rounded-full bg-violet-500 shrink-0" />
              <GitPullRequest size={12} className="text-muted-foreground shrink-0" />
              <span>{t.nav_contributing}</span>
            </Link>
            <Link href="/bugs" className="flex items-center gap-3 px-3 py-2.5 rounded-xl glass text-xs text-red-500 font-medium hover:bg-secondary/50 transition-all" onClick={() => setOpen(false)}>
              <span className="w-1 h-5 rounded-full bg-red-500 shrink-0" />
              <Bug size={12} className="text-red-400 shrink-0" />
              <span>{t.nav_known_bugs}</span>
            </Link>
            <Link href="/terms" className="flex items-center gap-3 px-3 py-2.5 rounded-xl glass text-xs text-muted-foreground hover:bg-secondary/50 transition-all" onClick={() => setOpen(false)}>
              <span className="w-1 h-5 rounded-full bg-neutral-500 shrink-0" />
              <FileText size={12} className="text-muted-foreground shrink-0" />
              <span>{t.nav_terms}</span>
            </Link>
            <Link href="/privacy" className="flex items-center gap-3 px-3 py-2.5 rounded-xl glass text-xs text-muted-foreground hover:bg-secondary/50 transition-all" onClick={() => setOpen(false)}>
              <span className="w-1 h-5 rounded-full bg-neutral-500 shrink-0" />
              <Shield size={12} className="text-muted-foreground shrink-0" />
              <span>{t.nav_privacy}</span>
            </Link>
          </div>

          <button
            onClick={() => { setOpen(false); toggleSearch() }}
            className="w-full mb-2 flex items-center justify-center gap-2 px-3 py-3.5 rounded-xl glass text-foreground font-bold text-xs"
          >
            <SearchIcon size={15} className="text-accent" />
            {t.nav_search}
          </button>

          <a href="https://www.instagram.com/http.sejed.official/" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center py-3.5 rounded-xl bg-foreground text-background font-bold text-sm shadow-lg">{t.nav_community}</a>
        </div>
      )}
    </header>

    {dropOpen && (
      <div
        className="fixed inset-0 z-40 backdrop-blur-[1px]"
        onClick={() => setDropOpen(false)}
      />
    )}
    </>
  )
}
