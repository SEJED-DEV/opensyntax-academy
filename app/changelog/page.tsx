import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { GitCommit, Plus, RefreshCw, Trash2, Rocket, Calendar, Wrench } from "lucide-react"

export const metadata = {
  title: "Changelog — OpenSyntax Academy",
  description: "Recent updates and architectural changes to the platform.",
}

// ── v5.0.0 ──
const v50Added = [
  { label: "New Brand Identity", detail: "Designed a professional logo with a gradient chevron-bracket monogram. Updated all favicon files, navbar, and footer with the new brand mark. Replaced the old 'OS' badge with a polished SVG icon." },
  { label: "VS Code Glass Redesign", detail: "Complete platform-wide UI overhaul. All 27 pages now use the glass design system with backdrop blur, VS Code editor-inspired hero with live code typing animation, syntax-highlighting color tokens (code-kw, code-str, code-fn, code-num), and a VS Code status bar strip in the hero and footer." },
  { label: "Massive Course Expansion", detail: "All 14 course tracks expanded from 2-3 modules to 5 modules each with 15-20 lessons per course. New modules include: Performance & Monitoring, DeFi Deep Dive, Incident Response, Microservices Architecture, FAANG System Design Case Studies, Rust in Production, RLHF & Evaluation, and Advanced Kubernetes. Every lesson includes real code examples and quiz questions." },
  { label: "Cortex HQ AD Integration", detail: "New advertisement section on the homepage promoting Cortex HQ. Users can request their own ad placements by joining the community Discord server." },
  { label: "Footer Attribution", detail: "Replaced Discord Blueprint link with 'made by sejeddev' attribution in the status bar." },
]

const v50Fixed = [
  { label: "[BRD-001] Discord Logo in Community CTA", detail: "The Community CTA button was using Discord's SVG icon instead of Instagram's camera icon. Replaced with the correct Instagram icon path." },
  { label: "[BRD-002] Dashboard Removed", detail: "Removed the /dashboard page entirely since localStorage progress was not persistent across browser sessions. All navigation references to the dashboard have been cleaned up." },
  { label: "[BRD-003] Navbar Dropdown Hover Gap", detail: "Fixed the invisible gap between navbar dropdown buttons and their menus that caused premature closing on hover. Added click-to-toggle support for touch devices." },
  { label: "[BRD-004] Template Literal Escapes in Course Content", detail: "Fixed 5 course pages where raw `${}` and backtick characters in code examples broke the Next.js build. Escaped all template literal syntax in cybersecurity, rust, mobile, system-design, and discord courses." },
  { label: "[BRD-005] i18n Nav Keys for Dashboard", detail: "Removed i18n translation references to the dashboard navigation item." },
]

const v50Removed = [
  "Dashboard page and all related navigation links",
  "Discord Blueprint link from footer",
]

// ── v4.3.0 ──
const v43Added = [
  { label: "\"Minus Zero\" Foundations Track", detail: "Introduced a mandatory onboarding track (/courses/foundations) covering Hardware Logic, Internet Protocols, and Terminal internals to bridge absolute beginners." },
  { label: "Functional PWA Installation", detail: "Implemented a custom usePwaInstall hook and integrated it into the platform's prompt system. Users can now trigger a native browser installation dialog directly from the 'Download the App' popup." },
  { label: "Universal 3-Tier Curriculum", detail: "All 11 core domain tracks (Web, Discord, AI/ML, DevOps, Databases, TypeScript, React Patterns, Cybersecurity, Blockchain, Mobile, Python) have been fully restructured into a synchronized 3-Tier model (Foundations, Intermediate, Production)." },
]

const v43Changed = [
  { label: "Course Catalog Update", detail: "Expanded categories to include 'Foundations' and prioritized the new onboarding track for new users." },
  { label: "Platform-wide Documentation", detail: "Updated Terms, Privacy, and README to reflect the hierarchical curriculum changes and local AI processing standards." },
]

// ── v4.2.0 ──
const v42Added = [
  { label: "Tier-3 Python Enhancements", detail: "Deployed advanced Production-Grade module to the Python course covering Dask distributed dataframes and integrated local SLM inference." },
  { label: "PWA App Installation Prompts", detail: "Integrated a new 'Download the App' persistent popup into the prompts engine to encourage offline mobile usage." },
]

const v42Fixed = [
  { label: "[LDG-005] Mobile UI Lag Smoothing", detail: "Conditionally removed heavy CSS backdrop-blur-sm instances in mobile viewing modes optimizing DOM repaints." },
]

// ── v4.1.0 ──
const v41Added = [
  { label: "\"Minus Zero to Hero\" Curriculum Architecture", detail: "Restructured the platform's learning paths to accommodate absolute beginners with introductory hardware and networking modules." },
  { label: "3-Tier Track System", detail: "All 11 core domains explicitly tiered into Foundations, Intermediate, and Production-Grade." },
]

const v41Fixed = [
  { label: "[HRO-002] 3D Hero Stutter on Mobile", detail: "Drastically improved mobile performance by conditionally disabling the 3D Canvas on viewports <768px, falling back to an optimized CSS-blurred rendering." },
]

// ── v4.0.0 ──
const v40Added = [
  { label: "Multi-Language Support (i18n)", detail: "The platform now fully supports English, Arabic (العربية), Tunisian Darija (تونسي), French (Français), and German (Deutsch). A globe-icon language switcher is embedded in the navbar and mobile menu. Locale preference is persisted in localStorage." },
  { label: "RTL Layout Engine", detail: "Arabic and Tunisian Darija selections automatically apply dir=\"rtl\" to the HTML root, delivering a proper right-to-left reading experience across all translated UI surfaces." },
  { label: "Language Switcher Component", detail: "New language-switcher.tsx dropdown component with locale flags, native language labels, and a localechange custom event bus that keeps the Navbar, Hero, Footer, and Terminal in sync without a full page reload." },
  { label: "Known Bugs Page in Navigation", detail: "The /bugs Known Bugs transparency page is now directly accessible from the Navbar Resources dropdown and the mobile menu, with a distinct red accent to signal its importance." },
  { label: "Terminal lang Command", detail: "Added a new 'lang' command to the interactive terminal that lists all 5 supported languages with their native names and directionality." },
]

const v40Fixed = [
  { label: "[TRM-003] Terminal Scrolls Entire Page on Load", detail: "Removed autoFocus from the terminal input — this was causing the browser to scroll the full page down to the terminal on initial render, hiding the hero section. The scrollIntoView call was also replaced with direct container.scrollTop manipulation to prevent page-level scroll hijacking when users type commands." },
  { label: "[LDG-004] Landing Page Top Not Visible on Load", detail: "Root cause traced to autoFocus on the terminal input combined with scrollIntoView. Removing both and scoping the scroll to the terminal's own container div fixes the issue permanently." },
  { label: "Discord Link Audit", detail: "Performed a full codebase audit for any remaining discord.com or discord.gg links. All community-facing links now correctly point to the platform's Instagram profile (@http.sejed.official)." },
]

const v4Planned = [
  "User authentication & persistent accounts (Cloud sync)",
  "Community lesson submissions & review workflow",
  "Comment threads on individual lessons",
  "Auto-detect browser language for initial locale selection",
]

const v3Added = [
  { label: "Certificates System", detail: "New /certificates page for unlocking and generating digital, beautifully crafted, cryptographic-style completion certificates using SVG for all 13 courses. Features real-time local state syncing and a dashboard integration to \"View Awards\"." },
  { label: "Dashboard Synchronization", detail: "Upgraded /dashboard so all 13 courses (including System Design, Rust) seamlessly fetch user completion stats from active browser localStorage with corrected storage key mapping." },
  { label: "Testimonials Section", detail: "New social proof section on the homepage with developer testimonials from 6 different personas (Full-Stack, ML, DevOps, Security, Blockchain engineers). Framer Motion scroll animations and accent-colored avatar cards." },
  { label: "Reading Progress Bar", detail: "Thin accent-colored gradient progress bar at the top of the lesson player that fills as users scroll through lesson content, improving UX for long lessons." },
  { label: "Scroll-to-Top Button", detail: "Global floating button appears after 400px of scroll on any page, with smooth Framer Motion animations matching the platform design language." },
  { label: "Enhanced Interactive Terminal", detail: "Added stats, about, latest, and version commands to the homepage terminal. Updated course list to show all 13 paths. Version bumped to v3.0.0." },
  { label: "Rust & Systems Programming Course", detail: "Added a comprehensive Rust course covering memory safety, the ownership model, fearless concurrency, async programming with Tokio, and compiling high-performance WebAssembly (WASM) modules." },
  { label: "System Design Course", detail: "Added a highly requested, brand new 3-module System Design course. Covers Load Balancing, Database Sharding, Caching Strategies, Message Queues (Kafka), Rate Limiting algorithms, and real-world system design case studies (URL Shortener, Notification System)." },
  { label: "Beautiful 404 Page", detail: "Designed a modern, branded 404 Not Found page with a massive glowing gradient background, animated elements, and quick links back to home and popular courses." },
  { label: "System Status Page", detail: "New /status page with real-time service health monitoring. Checks Website, API, CDN, Auth, Database, and GitHub Sync status live." },
  { label: "Navbar Enhancements", detail: "Added System Design and Rust courses to the dropdown. Resources dropdown with Platform Status, Changelog, Contributing, Terms, and Privacy. Certificates link added to footer." },
  { label: "Course Content Overhaul", detail: "Massively expanded the Cybersecurity and Blockchain courses with comprehensive content, including XSS deep-dives, Zero Trust frameworks, ZK-Rollups, and MEV." },
  { label: "Page-Level SEO Metadata", detail: "Exported contextual metadata tags on all 13 course pages, targeting high-intent SERP queries." },
  { label: "Global Search Palette", detail: "Blazing-fast command palette (Ctrl+K or Cmd+K) to search across all 250+ lessons with query highlighting and keyboard navigation." },
  { label: "Student Progress Dashboard", detail: "New /dashboard page that aggregates localStorage completion data from all 13 course paths into a unified visual overview with XP tracking." },
]

const v3Fixed = [
  { label: "[DSB-001] Dashboard Progress Desync", detail: "Fixed the critical dashboard sync bug by aligning localStorage key lookup (storageTitle) with the exact keys written by LessonPlayer. Dashboard now correctly reads completion progress from all 13 courses." },
  { label: "Mobile Sidebar Overlap", detail: "Fixed LessonPlayer mobile layout so the sidebar appears as an overlay with a backdrop rather than squishing the main reading content." },
  { label: "Instagram Popup Bounds", detail: "Refactored prompts.tsx notification to stay perfectly bounded within the screen width on mobile devices without causing horizontal overflow." },
  { label: "Empty Category States", detail: "Added a gracefully styled \"Course in Development\" empty state fallback in the Course Catalog for categories that have no active courses." },
  { label: "Instagram Popup Persistence", detail: "Prompt popups now persist dismiss state in localStorage. Once dismissed, they stay dismissed across page reloads and navigation." },
  { label: "Stale Platform Stats", detail: "Updated hero section (13 courses, 250+ lessons), community CTA, and footer to reflect the correct course count. Changed misleading Watch Trailer button to Join Community." },
]

const v3Planned = [
  "User authentication & persistent accounts (Cloud sync)",
  "Community lesson submissions & review workflow",
  "Comment threads on individual lessons"
]

const v2Added = [
  { label: "Interactive Knowledge Checks", detail: "End-of-lesson quizzes with instant feedback, answer highlighting, and explanations on Web, Discord, and Python tracks." },
  { label: "Cinematic Lesson Transitions", detail: "Framer Motion AnimatePresence slide animations when switching lessons, eliminating jarring content snaps." },
  { label: "Persistent Progress", detail: "Lesson completion saved to localStorage per-course. Progress bar survives page refreshes — fully client-side, zero tracking." },
  { label: "3D Hero Scene", detail: "Immersive WebGL icosahedron powered by @react-three/fiber with optimized DPR limits for mobile performance." },
  { label: "Premium Bento Catalog", detail: "The /courses page redesigned as a reactive, filterable Bento-box grid with category tags and stagger animations." },
  { label: "50+ Lesson Modules", detail: "Massive content injection across all 11 disciplines: Web, Discord, Python, AI/ML, TypeScript, DevOps, Databases, React, Cybersecurity, Blockchain, Mobile." },
  { label: "SEO Layer", detail: "sitemap.xml, robots.txt, JSON-LD Schema.org structured data, and metadataBase for Google, Bing, and AI crawlers." },
  { label: "Rich Social Presence", detail: "OpenGraph and Twitter card metadata for premium link previews on Discord, X, and LinkedIn." },
  { label: "Contributing Page", detail: "Formatted /contributing page with code examples, commit type tables, and PR checklist." },
  { label: "Changelog Page", detail: "This page — tracking all platform version history." },
]

const v2Changed = [
  { label: "Forced Light Mode", detail: "Transitioned the entire platform to a permanent OKLCH light mode palette for vibrant, high-contrast readability." },
  { label: "Performance", detail: "3D hero geometry reduced (12 → 4 segments) and DPR capped. Deno-compatible code: window → globalThis throughout." },
  { label: "Terms of Service", detail: "Updated to reflect course rating aggregation and community metadata." },
  { label: "Privacy Policy", detail: "Clarified that all interactive 3D and animation features are client-side with no remote tracking." },
]

const v2Removed = [
  "Legacy next-themes dark mode integrations",
  "Generic placeholder lesson content in favor of full course syllabi",
]

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 pt-28 pb-20">
        <div className="mb-14">
          <p className="text-xs text-accent font-semibold uppercase tracking-widest mb-3">Platform Updates</p>
          <h1 className="text-4xl font-bold text-foreground text-balance mb-4">Changelog</h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            We iterate constantly. Every significant architectural change, feature drop, and content expansion is documented here.
          </p>
        </div>

        <div className="space-y-20">

          {/* ── v5.0 Released ── */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse" />
              <h2 className="text-xl font-bold text-foreground">v5.0.0 — VS Code Glass Redesign</h2>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Calendar size={12} />
                <span>Released July 3, 2026</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 text-code-str mb-5">
                  <Plus size={18} />
                  <h3 className="font-semibold">Added</h3>
                </div>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  {v50Added.map((item, i) => (
                    <li key={i}>
                      <strong className="text-foreground">{item.label}:</strong> {item.detail}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 text-code-kw mb-5">
                  <Wrench size={18} />
                  <h3 className="font-semibold">Fixed</h3>
                </div>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  {v50Fixed.map((item, i) => (
                    <li key={i}>
                      <strong className="text-foreground">{item.label}:</strong> {item.detail}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 text-code-kw mb-5">
                  <Trash2 size={18} />
                  <h3 className="font-semibold">Removed</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                  {v50Removed.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </div>
          </section>

          {/* ── v4.3 Released ── */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse" />
              <h2 className="text-xl font-bold text-foreground">v4.3.0 — The "Minus Zero" & PWA Update</h2>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Calendar size={12} />
                <span>Released March 31, 2026</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 text-code-str mb-5">
                  <Plus size={18} />
                  <h3 className="font-semibold">Added</h3>
                </div>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  {v43Added.map((item, i) => (
                    <li key={i}>
                      <strong className="text-foreground">{item.label}:</strong> {item.detail}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 text-code-fn mb-5">
                  <RefreshCw size={18} />
                  <h3 className="font-semibold">Changed</h3>
                </div>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  {v43Changed.map((item, i) => (
                    <li key={i}>
                      <strong className="text-foreground">{item.label}:</strong> {item.detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ── v4.2 Released ── */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
              <h2 className="text-xl font-bold text-foreground">v4.2.0 — PWA Optimization</h2>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Calendar size={12} />
                <span>Released March 31, 2026</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 text-code-str mb-5">
                  <Plus size={18} />
                  <h3 className="font-semibold">Added</h3>
                </div>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  {v42Added.map((item, i) => (
                    <li key={i}>
                      <strong className="text-foreground">{item.label}:</strong> {item.detail}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 text-code-kw mb-5">
                  <Wrench size={18} />
                  <h3 className="font-semibold">Fixed</h3>
                </div>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  {v42Fixed.map((item, i) => (
                    <li key={i}>
                      <strong className="text-foreground">{item.label}:</strong> {item.detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ── v4.1 Released ── */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
              <h2 className="text-xl font-bold text-foreground">v4.1.0 — Architecture Pivot</h2>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Calendar size={12} />
                <span>Released March 31, 2026</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 text-code-str mb-5">
                  <Plus size={18} />
                  <h3 className="font-semibold">Added</h3>
                </div>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  {v41Added.map((item, i) => (
                    <li key={i}>
                      <strong className="text-foreground">{item.label}:</strong> {item.detail}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 text-code-kw mb-5">
                  <Wrench size={18} />
                  <h3 className="font-semibold">Fixed</h3>
                </div>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  {v41Fixed.map((item, i) => (
                    <li key={i}>
                      <strong className="text-foreground">{item.label}:</strong> {item.detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ── v4.0 Released ── */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
              <h2 className="text-xl font-bold text-foreground">v4.0.0 — Multi-Language Release</h2>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Calendar size={12} />
                <span>Released March 31, 2026</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 text-code-str mb-5">
                  <Plus size={18} />
                  <h3 className="font-semibold">Added</h3>
                </div>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  {v40Added.map((item, i) => (
                    <li key={i}>
                      <strong className="text-foreground">{item.label}:</strong> {item.detail}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 text-code-kw mb-5">
                  <Wrench size={18} />
                  <h3 className="font-semibold">Fixed</h3>
                </div>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  {v40Fixed.map((item, i) => (
                    <li key={i}>
                      <strong className="text-foreground">{item.label}:</strong> {item.detail}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass rounded-2xl p-6 border border-dashed border-accent/30">
                <div className="flex items-center gap-2 text-accent mb-4">
                  <Rocket size={16} />
                  <h3 className="font-semibold text-sm">Planned for v4.x</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground text-xs leading-relaxed">
                  {v4Planned.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/40 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ── v3.0 Released ── */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h2 className="text-xl font-bold text-foreground">v3.0.0 — Platform Intelligence</h2>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Calendar size={12} />
                <span>Released March 31, 2026</span>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Added to v3.0 so far */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 text-code-str mb-5">
                  <Plus size={18} />
                  <h3 className="font-semibold">Added</h3>
                </div>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  {v3Added.map((item, i) => (
                    <li key={i}>
                      <strong className="text-foreground">{item.label}:</strong> {item.detail}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 text-code-kw mb-5">
                  <Wrench size={18} />
                  <h3 className="font-semibold">Fixed</h3>
                </div>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  {v3Fixed.map((item, i) => (
                    <li key={i}>
                      <strong className="text-foreground">{item.label}:</strong> {item.detail}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass rounded-2xl p-6 border border-dashed border-accent/30">
                <div className="flex items-center gap-2 text-accent mb-4">
                  <Rocket size={16} />
                  <h3 className="font-semibold text-sm">Planned for v3.0</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground text-xs leading-relaxed">
                  {v3Planned.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/40 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>


            </div>
          </section>

          {/* ── v2.0 Released ── */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h2 className="text-xl font-bold text-foreground">v2.0.0 — Platform Expansion</h2>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Calendar size={12} />
                <span>Released March 29, 2026</span>
              </div>
            </div>

            <div className="space-y-6">
              {/* Added */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 text-code-str mb-5">
                  <Plus size={18} />
                  <h3 className="font-semibold">Added</h3>
                </div>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  {v2Added.map((item, i) => (
                    <li key={i}>
                      <strong className="text-foreground">{item.label}:</strong> {item.detail}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Changed */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 text-code-fn mb-5">
                  <RefreshCw size={18} />
                  <h3 className="font-semibold">Changed</h3>
                </div>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  {v2Changed.map((item, i) => (
                    <li key={i}>
                      <strong className="text-foreground">{item.label}:</strong> {item.detail}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Removed */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 text-code-kw mb-5">
                  <Trash2 size={18} />
                  <h3 className="font-semibold">Removed</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                  {v2Removed.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </div>
          </section>

          {/* ── v1.0 Released ── */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40" />
              <h2 className="text-xl font-bold text-foreground">v1.0.0 — Initial Launch</h2>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Calendar size={12} />
                <span>January 2026</span>
              </div>
            </div>
            <div className="glass rounded-2xl p-6 opacity-80">
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                <li>Initial platform launch with Discord Development and Full-Stack Web Engineering paths.</li>
                <li>Sidebar-driven lesson player with basic progress tracking.</li>
                <li>Community Instagram integration.</li>
                <li>Apache 2.0 open-source license.</li>
              </ul>
            </div>
          </section>

          <div className="flex items-center justify-center pt-8 border-t border-border">
            <a
              href="https://github.com/TSSEJED/opensyntax-academy/commits/main"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group"
            >
              <GitCommit size={14} className="group-hover:text-accent transition-colors" />
              View full commit history on GitHub
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
