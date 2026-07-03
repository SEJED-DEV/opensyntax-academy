"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Instagram } from "lucide-react"
import { getTranslations, Locale, DEFAULT_LOCALE, I18N_STORAGE_KEY, LOCALES } from "@/lib/i18n"
import { ContactDevBanner } from "@/components/prompts"

const COURSE_LINKS = [
  { href: "/courses/foundations",    label: "Foundations (Minus Zero)" },
  { href: "/courses/web",            label: "Web Engineering" },
  { href: "/courses/discord",        label: "Discord Development" },
  { href: "/courses/python",         label: "Python & Data Science" },
  { href: "/courses/ai-ml",          label: "AI/ML Engineering" },
  { href: "/courses/typescript",     label: "TypeScript Mastery" },
  { href: "/courses/devops",         label: "DevOps & Cloud" },
  { href: "/courses/databases",      label: "Database Engineering" },
  { href: "/courses/react-patterns", label: "React Patterns" },
  { href: "/courses/cybersecurity",  label: "Cybersecurity" },
  { href: "/courses/blockchain",     label: "Blockchain & Web3" },
  { href: "/courses/mobile",         label: "Mobile · React Native" },
]

export function Footer() {
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

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <svg width="32" height="32" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <defs>
                <linearGradient id="footerLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="oklch(0.72 0.17 196)"/>
                  <stop offset="100%" stopColor="oklch(0.60 0.22 295)"/>
                </linearGradient>
              </defs>
              <rect width="180" height="180" rx="38" fill="url(#footerLogoGrad)"/>
              <path d="M56 66 L44 78 L56 90" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M76 66 L88 78 L76 90" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.4"/>
              <path d="M108 66 H128 C132 66 134 69 134 72 V78 C134 81 132 84 128 84 H112 C108 84 106 87 106 90 V96 C106 99 108 102 112 102 H134" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M132 64 L108 104" stroke="white" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.5"/>
              <path d="M140 84 L152 96 L140 108" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.35"/>
            </svg>
            <span className="font-semibold text-sm text-foreground">OpenSyntax</span>
          </div>
          <p className="text-xs text-muted-foreground/60 leading-relaxed">
            {t.footer_tagline}
          </p>
          <a href="https://www.instagram.com/http.sejed.official/" target="_blank" rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-2 rounded-xl glass px-3 py-2 text-xs text-foreground hover:border-accent/30 hover:text-accent transition-colors w-fit">
            <Instagram size={14} className="text-current" />
            Join @http.sejed.official
          </a>
        </div>

        {/* Courses — split across two columns */}
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-bold text-foreground uppercase tracking-widest mb-1">{t.footer_courses}</p>
          {COURSE_LINKS.slice(0, 6).map((c) => (
            <Link key={c.href} href={c.href} className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors">{c.label}</Link>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-bold text-foreground uppercase tracking-widest mb-1">{t.footer_more_courses}</p>
          {COURSE_LINKS.slice(6).map((c) => (
            <Link key={c.href} href={c.href} className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors">{c.label}</Link>
          ))}
          <Link href="/courses/system-design" className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors">System Design</Link>
          <Link href="/courses/rust" className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors">Rust</Link>
        </div>

        {/* Community + Legal */}
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-bold text-foreground uppercase tracking-widest mb-1">{t.footer_community}</p>
          <a href="https://www.instagram.com/http.sejed.official/" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors">{t.footer_instagram}</a>
          <a href="https://github.com/TSSEJED/opensyntax-academy" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors">{t.footer_github}</a>
          <div className="h-px bg-border my-2" />
          <p className="text-[10px] font-bold text-foreground uppercase tracking-widest mb-1">{t.footer_legal}</p>
          <Link href="/status" className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>{t.footer_status}</Link>
          <Link href="/changelog" className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors">{t.footer_changelog}</Link>
          <Link href="/contributing" className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors">{t.footer_contributing}</Link>
          <Link href="/certificates" className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors flex items-center gap-1.5">{t.footer_certificates}</Link>
          <Link href="/terms" className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors">{t.footer_terms}</Link>
          <Link href="/privacy" className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors">{t.footer_privacy}</Link>

          <div className="h-px bg-border my-2" />
          <p className="text-[10px] font-bold text-red-500/70 uppercase tracking-widest mb-1">{t.footer_issues}</p>
          <Link href="/bugs" className="text-xs text-red-500/60 hover:text-red-500 font-medium transition-colors">{t.footer_known_bugs}</Link>
          <a href="https://github.com/TSSEJED/opensyntax-academy/issues" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors">{t.footer_report_bug}</a>
          <p className="text-xs text-muted-foreground/40 mt-1">Apache 2.0 License</p>
        </div>
      </div>

      <ContactDevBanner />

      {/* VS Code-style status bar */}
      <div className="glass border-t border-border/50">
        <div className="mx-auto max-w-7xl px-6 py-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[10px] font-mono text-muted-foreground/50">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-code-kw">main</span>
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">Apache 2.0</span>
            <span className="hidden sm:inline">|</span>
            <span>UTF-8</span>
          </div>
          <div className="flex items-center gap-3">
            <span>© {new Date().getFullYear()} {t.footer_copyright}</span>
            <span className="hidden sm:inline">|</span>
            <a href="https://sejed.dev" target="_blank" rel="noopener noreferrer" className="text-code-str hover:underline">made by sejeddev</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
