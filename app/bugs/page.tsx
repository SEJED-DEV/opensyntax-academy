import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AlertCircle, Bug, Github, MessageSquare, ExternalLink, RefreshCw, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Known Bugs — OpenSyntax Academy",
  description: "Transparency report on current platform issues and planned fixes.",
}

const resolvedBugs = [
  {
    id: "CUR-430",
    title: "Curriculum Consistency Upgrade",
    severity: "Low",
    status: "Fixed",
    description: "Previous tracks lacked a unified progression structure, making it difficult for absolute beginners to find an entry point.",
    workaround: "Fixed in v4.3.0 — All 11 core tracks restructured into a 3-Tier model (Foundations, Intermediate, Production) and a new 'Foundations' track added.",
    plannedFix: "v4.3.0 ✓",
    resolvedIn: "v4.3.0",
  },
  {
    id: "PWA-430",
    title: "Functional PWA Installation Engine",
    severity: "Low",
    status: "Fixed",
    description: "The previous PWA prompt was only informational and did not trigger a native installation event.",
    workaround: "Fixed in v4.3.0 — Introduced usePwaInstall hook and connected it to the native 'beforeinstallprompt' event.",
    plannedFix: "v4.3.0 ✓",
    resolvedIn: "v4.3.0",
  },
  {
    id: "TRM-003",
    title: "Terminal Scrolls Entire Page on Load",
    severity: "Medium",
    status: "Fixed",
    description: "The interactive terminal on the landing page used `autoFocus` and `scrollIntoView`, which caused the browser to scroll the whole page down to the terminal input on initial load, hiding the hero section. Additionally, when users typed commands, the scrollIntoView call hijacked the page scroll container.",
    workaround: "Fixed in v4.0.0 — autoFocus removed; scroll is now contained within the terminal element.",
    plannedFix: "v4.0.0 ✓",
    resolvedIn: "v4.0.0",
  },
  {
    id: "LDG-005",
    title: "Mobile UI Lag Smoothing",
    severity: "Medium",
    status: "Fixed",
    description: "Heavy backdrop blurs on mobile sidebars caused extreme spikes in DOM repaints, lagging the device.",
    workaround: "Fixed in v4.2.0 — Conditionally removed backdrop-blur-sm on mobile viewports (<768px).",
    plannedFix: "v4.2.0 ✓",
    resolvedIn: "v4.2.0",
  },
  {
    id: "HRO-002",
    title: "3D Hero Stutter on Low-End Devices",
    severity: "Low",
    status: "Fixed",
    description: "On some older mobile devices, the 3D scene may cause frame drops despite existing DPR clamping.",
    workaround: "Fixed in v4.1.0 — The 3D Canvas is completely disabled on mobile viewports (<768px) to guarantee smooth 60FPS performance, falling back to a CSS-based blurred element.",
    plannedFix: "v4.1.0 ✓",
    resolvedIn: "v4.1.0",
  },
  {
    id: "BRD-001",
    title: "Discord Logo in Community CTA",
    severity: "Low",
    status: "Fixed",
    description: "The Community CTA button was using Discord's SVG icon instead of Instagram's camera icon.",
    workaround: "Fixed in v5.0.0 — Replaced with the correct Instagram icon path.",
    plannedFix: "v5.0.0 ✓",
    resolvedIn: "v5.0.0",
  },
  {
    id: "BRD-002",
    title: "Dashboard Removed",
    severity: "Medium",
    status: "Fixed",
    description: "The /dashboard page was removed entirely since localStorage progress was not persistent across browser sessions.",
    workaround: "Fixed in v5.0.0 — Dashboard page and all navigation references have been removed.",
    plannedFix: "v5.0.0 ✓",
    resolvedIn: "v5.0.0",
  },
  {
    id: "BRD-003",
    title: "Navbar Dropdown Hover Gap",
    severity: "Low",
    status: "Fixed",
    description: "An invisible gap between navbar dropdown buttons and their menus caused premature closing on hover. Touch devices also lacked proper support.",
    workaround: "Fixed in v5.0.0 — Hover gap eliminated and click-to-toggle support added for touch devices.",
    plannedFix: "v5.0.0 ✓",
    resolvedIn: "v5.0.0",
  },
  {
    id: "BRD-004",
    title: "Template Literal Escapes in Course Content",
    severity: "Medium",
    status: "Fixed",
    description: "5 course pages contained raw `${}` and backtick characters in code examples that broke the Next.js build.",
    workaround: "Fixed in v5.0.0 — All template literal syntax was properly escaped in cybersecurity, rust, mobile, system-design, and discord courses.",
    plannedFix: "v5.0.0 ✓",
    resolvedIn: "v5.0.0",
  },
  {
    id: "BRD-005",
    title: "i18n Nav Keys for Dashboard",
    severity: "Low",
    status: "Fixed",
    description: "Translation references to the dashboard navigation item remained in i18n locale files after the dashboard was removed.",
    workaround: "Fixed in v5.0.0 — All i18n references to the dashboard navigation key have been removed.",
    plannedFix: "v5.0.0 ✓",
    resolvedIn: "v5.0.0",
  },
]

const currentBugs = [
  {
    id: "LNG-001",
    title: "Language Selection Resets on Hard Refresh (Rare)",
    severity: "Low",
    status: "Investigating",
    description: "In some browser configurations with strict privacy settings or storage partitioning (e.g., Firefox strict mode), the selected language may not persist across full page reloads because access to localStorage is blocked.",
    workaround: "Use a browser that supports localStorage, or set your browser's privacy level to Standard. The language switcher functions correctly on first selection within the session.",
    plannedFix: "v4.0.x",
  },
  {
    id: "SYN-001",
    title: "Progress Not Synced Across Devices",
    severity: "Medium",
    status: "Acknowledged",
    description: "Since the dashboard was removed in v5.0.0, there is no cloud sync mechanism. Progress is stored locally in the browser and does not persist across different devices or browsers.",
    workaround: "Currently, progress is saved locally per browser. To access your progress on another device, you will need to complete lessons again. Cloud sync is planned for a future release.",
    plannedFix: "v6.0.0",
  },
]

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

function BugCard({ bug, resolved = false }: { bug: typeof currentBugs[0] & { resolvedIn?: string }, resolved?: boolean }) {
  return (
    <div className={cn(
      "group relative border rounded-2xl p-6 transition-all",
      resolved
        ? "glass border-emerald-500/20"
        : "glass"
    )}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-[10px] font-mono text-muted-foreground/50 font-bold">{bug.id}</span>
            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
              {bug.title}
              {resolved && <CheckCircle2 size={16} className="text-emerald-500" />}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn(
              "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest",
              bug.severity === "High" ? "bg-red-500/10 text-code-kw" :
              bug.severity === "Medium" ? "bg-amber-500/20 text-code-str" :
              "bg-green-500/20 text-code-num"
            )}>
              {bug.severity} Severity
            </span>
            <span className={cn(
              "text-[10px] flex items-center gap-1",
              resolved ? "text-emerald-600" : "text-muted-foreground"
            )}>
              {resolved ? <CheckCircle2 size={10} /> : <RefreshCw size={10} className="animate-spin-slow" />}
              Status: {bug.status}
            </span>
          </div>
        </div>
        <div className={cn(
          "rounded-xl px-4 py-2 border",
          resolved ? "glass border-emerald-500/20" : "glass"
        )}>
          <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Target Fix</p>
          <p className={cn("text-sm font-mono font-bold", resolved ? "text-emerald-600" : "text-foreground")}>{bug.plannedFix}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="glass rounded-xl p-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Description</h3>
          <p className="text-sm text-foreground/80 leading-relaxed">{bug.description}</p>
        </div>
        <div className={cn(
          "rounded-xl p-4 border",
          resolved ? "glass border-emerald-500/10" : "glass border-red-500/10"
        )}>
          <h3 className={cn("text-[10px] font-bold uppercase tracking-widest mb-2", resolved ? "text-emerald-600" : "text-red-600")}>
            {resolved ? "Resolution" : "Workaround"}
          </h3>
          <p className={cn("text-sm leading-relaxed italic", resolved ? "text-emerald-600/80" : "text-red-600/80")}>{bug.workaround}</p>
        </div>
      </div>
    </div>
  )
}

export default function BugsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 pt-28 pb-20">
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest mb-4">
            <AlertCircle size={12} />
            Transparency Report · v5.0.0
          </div>
          <h1 className="text-4xl font-bold text-foreground text-balance mb-4 tracking-tight">Known Bugs</h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            We prioritize transparency. Below are the current known issues on the platform, our timeline for resolving them, and a record of recently resolved issues.
          </p>
        </div>

        {/* Active Bugs */}
        <section className="mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Active Issues ({currentBugs.length})
          </h2>
          <div className="space-y-8">
            {currentBugs.map((bug) => (
              <BugCard key={bug.id} bug={bug} />
            ))}
          </div>
        </section>

        {/* Resolved Bugs */}
        <section className="mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-500" />
            Recently Resolved
          </h2>
          <div className="space-y-8">
            {resolvedBugs.map((bug) => (
              <BugCard key={bug.id} bug={bug} resolved />
            ))}
          </div>
        </section>

        {/* Support CTA */}
        <section className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://github.com/TSSEJED/opensyntax-academy/issues"
            target="_blank" rel="noopener noreferrer"
            className="flex items-start gap-4 p-6 glass rounded-2xl hover:border-accent/40 transition-all group"
          >
            <div className="p-3 glass rounded-xl group-hover:bg-accent/10 transition-colors">
              <Bug size={20} className="text-muted-foreground group-hover:text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-sm mb-1">Found something else?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Report new issues directly on our GitHub repository. We welcome community audits.</p>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-accent">
                Open Issue on GitHub <ExternalLink size={12} />
              </div>
            </div>
          </a>

          <a
            href="https://www.instagram.com/http.sejed.official/"
            target="_blank" rel="noopener noreferrer"
            className="flex items-start gap-4 p-6 glass rounded-2xl hover:border-accent/40 transition-all group"
          >
            <div className="p-3 glass rounded-xl group-hover:bg-accent/10 transition-colors">
              <MessageSquare size={20} className="text-muted-foreground group-hover:text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-sm mb-1">Need live support?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Follow our Instagram page and message us for immediate help.</p>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-accent">
                Message Us <ExternalLink size={12} />
              </div>
            </div>
          </a>
        </section>
      </main>
      <Footer />
    </div>
  )
}
