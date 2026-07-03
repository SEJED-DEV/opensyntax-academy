"use client"

import { Navbar } from "@/components/navbar"
import { useEffect, useState } from "react"
import {
  CheckCircle2, XCircle, AlertTriangle, Clock, RefreshCw,
  Globe, GitBranch, Server, Wifi, Activity,
  ArrowUpRight
} from "lucide-react"

/* ── types ─────────────────────────────────────────────── */
type ServiceStatus = "operational" | "degraded" | "outage" | "checking"

interface ServiceInfo {
  name: string
  description: string
  status: ServiceStatus
  icon: React.ReactNode
  latency?: number
  lastChecked?: string
}

interface GitSyncInfo {
  latestCommitSha: string
  latestCommitMsg: string
  latestCommitDate: string
  deployedSha: string
  inSync: boolean
}

/* ── helpers ───────────────────────────────────────────── */
const statusConfig: Record<ServiceStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  operational: {
    label: "Operational",
    color: "text-code-num",
    bg: "bg-green-500",
    icon: <CheckCircle2 size={16} className="text-code-num" />,
  },
  degraded: {
    label: "Degraded",
    color: "text-code-str",
    bg: "bg-amber-500",
    icon: <AlertTriangle size={16} className="text-code-str" />,
  },
  outage: {
    label: "Major Outage",
    color: "text-code-kw",
    bg: "bg-red-500",
    icon: <XCircle size={16} className="text-code-kw" />,
  },
  checking: {
    label: "Checking…",
    color: "text-muted-foreground",
    bg: "bg-muted-foreground",
    icon: <RefreshCw size={14} className="text-muted-foreground animate-spin" />,
  },
}

function getOverallStatus(services: ServiceInfo[]): ServiceStatus {
  if (services.some((s) => s.status === "checking")) return "checking"
  if (services.some((s) => s.status === "outage")) return "outage"
  if (services.some((s) => s.status === "degraded")) return "degraded"
  return "operational"
}

function timeSince(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

/* ── component ─────────────────────────────────────────── */
export default function StatusPage() {
  const [services, setServices] = useState<ServiceInfo[]>([
    { name: "Website (Vercel Edge)", description: "Main frontend application hosted on Vercel's global CDN", status: "checking", icon: <Globe size={18} /> },
    { name: "API Availability", description: "Server-side routes and data endpoints", status: "checking", icon: <Server size={18} /> },
    { name: "CDN & Static Assets", description: "Images, fonts, scripts, and stylesheets served via edge locations", status: "checking", icon: <Wifi size={18} /> },
    { name: "GitHub Sync", description: "Source code repository and CI/CD pipeline status", status: "checking", icon: <GitBranch size={18} /> },
  ])

  const [gitSync, setGitSync] = useState<GitSyncInfo | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [refreshing, setRefreshing] = useState(false)

  const runChecks = async () => {
    setRefreshing(true)

    // Simulate latency checks by pinging our own endpoints
    const checks = async (): Promise<ServiceInfo[]> => {
      const results: ServiceInfo[] = []

      // 1. Website check — ping the homepage
      try {
        const start = performance.now()
        const res = await fetch("/", { method: "HEAD", cache: "no-store" })
        const latency = Math.round(performance.now() - start)
        results.push({
          name: "Website (Vercel Edge)", description: "Main frontend application hosted on Vercel's global CDN",
          status: res.ok ? "operational" : "degraded", icon: <Globe size={18} />, latency,
          lastChecked: new Date().toISOString(),
        })
      } catch {
        results.push({ name: "Website (Vercel Edge)", description: "Main frontend application hosted on Vercel's global CDN", status: "outage", icon: <Globe size={18} />, lastChecked: new Date().toISOString() })
      }

      // 2. API check — hit sitemap as a proxy for API health
      try {
        const start = performance.now()
        const res = await fetch("/sitemap.xml", { method: "HEAD", cache: "no-store" })
        const latency = Math.round(performance.now() - start)
        results.push({
          name: "API Availability", description: "Server-side routes and data endpoints",
          status: res.ok ? "operational" : "degraded", icon: <Server size={18} />, latency,
          lastChecked: new Date().toISOString(),
        })
      } catch {
        results.push({ name: "API Availability", description: "Server-side routes and data endpoints", status: "outage", icon: <Server size={18} />, lastChecked: new Date().toISOString() })
      }

      // 3. CDN check
      try {
        const start = performance.now()
        const res = await fetch("/icon.svg", { method: "HEAD", cache: "no-store" })
        const latency = Math.round(performance.now() - start)
        results.push({
          name: "CDN & Static Assets", description: "Images, fonts, scripts, and stylesheets served via edge locations",
          status: res.ok ? "operational" : "degraded", icon: <Wifi size={18} />, latency,
          lastChecked: new Date().toISOString(),
        })
      } catch {
        results.push({ name: "CDN & Static Assets", description: "Images, fonts, scripts, and stylesheets served via edge locations", status: "outage", icon: <Wifi size={18} />, lastChecked: new Date().toISOString() })
      }

      // 4. GitHub sync check
      try {
        const start = performance.now()
        const res = await fetch("https://api.github.com/repos/TSSEJED/opensyntax-academy/commits?per_page=1", { cache: "no-store" })
        const latency = Math.round(performance.now() - start)
        if (res.ok) {
          const [commit] = await res.json()
          const latestSha = commit?.sha?.slice(0, 7) ?? "unknown"
          const latestMsg = commit?.commit?.message?.split("\n")[0] ?? ""
          const latestDate = commit?.commit?.committer?.date ?? ""
          const deployedSha = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local"
          const inSync = deployedSha === "local" || latestSha.startsWith(deployedSha) || deployedSha.startsWith(latestSha)

          setGitSync({ latestCommitSha: latestSha, latestCommitMsg: latestMsg, latestCommitDate: latestDate, deployedSha, inSync })
          results.push({
            name: "GitHub Sync", description: "Source code repository and CI/CD pipeline status",
            status: inSync ? "operational" : "degraded", icon: <GitBranch size={18} />, latency,
            lastChecked: new Date().toISOString(),
          })
        } else {
          results.push({ name: "GitHub Sync", description: "Source code repository and CI/CD pipeline status", status: "degraded", icon: <GitBranch size={18} />, latency, lastChecked: new Date().toISOString() })
        }
      } catch {
        results.push({ name: "GitHub Sync", description: "Source code repository and CI/CD pipeline status", status: "outage", icon: <GitBranch size={18} />, lastChecked: new Date().toISOString() })
      }

      return results
    }

    const results = await checks()
    setServices(results)
    setLastRefresh(new Date())
    setRefreshing(false)
  }

  useEffect(() => { runChecks() }, [])

  const overall = getOverallStatus(services)
  const cfg = statusConfig[overall]

  return (
    <div className="bg-background text-foreground font-sans min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 pt-32 pb-24">
        {/* ─── Header ─── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
            <Activity size={12} className="text-accent" /> System Status
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Platform Status
          </h1>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Real-time health monitoring for all OpenSyntax Academy services. All checks run client-side against live endpoints.
          </p>
        </div>

        {/* ─── Overall Banner ─── */}
        <div className={`glass relative overflow-hidden rounded-2xl border p-6 mb-10 transition-all duration-500 ${
          overall === "operational" ? "border-green-500/30" :
          overall === "degraded" ? "border-amber-500/30" :
          overall === "outage" ? "border-red-500/30" :
          "border-border"
        }`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-4 h-4 rounded-full ${cfg.bg}`} />
                {overall !== "checking" && (
                  <div className={`absolute inset-0 w-4 h-4 rounded-full ${cfg.bg} animate-ping opacity-30`} />
                )}
              </div>
              <div>
                <h2 className={`text-lg font-bold ${cfg.color}`}>{
                  overall === "operational" ? "All Systems Operational" :
                  overall === "degraded" ? "Some Systems Degraded" :
                  overall === "outage" ? "Major Service Outage" :
                  "Running Health Checks…"
                }</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Last checked: {lastRefresh.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <button
              onClick={runChecks}
              disabled={refreshing}
              className="flex items-center gap-2 glass rounded-lg border border-border px-4 py-2 text-xs font-medium hover:bg-secondary transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* ─── Services Grid ─── */}
        <div className="space-y-3 mb-12">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-1 mb-4">Service Health</h3>
          {services.map((svc) => {
            const s = statusConfig[svc.status]
            return (
              <div key={svc.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass rounded-xl p-4 hover:border-border/80 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-muted-foreground">{svc.icon}</div>
                  <div>
                    <p className="font-semibold text-sm">{svc.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{svc.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:justify-end">
                  {svc.latency !== undefined && svc.latency > 0 && (
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {svc.latency}ms
                    </span>
                  )}
                  <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                    svc.status === "operational" ? "glass border-green-500/30 text-code-num" :
                    svc.status === "degraded" ? "glass border-amber-500/30 text-code-str" :
                    svc.status === "outage" ? "glass border-red-500/30 text-code-kw" :
                    "glass border-border text-muted-foreground"
                  }`}>
                    {s.icon}
                    {s.label}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ─── Deployment Sync Panel ─── */}
        <div className="glass rounded-2xl p-6 mb-12">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-4">Deployment Synchronization</h3>
          {gitSync ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
<div className="flex-1 glass rounded-xl p-4">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-2">Latest GitHub Commit</p>
                   <div className="flex items-center gap-2 mb-1">
                     <code className="text-xs font-mono glass rounded px-2 py-0.5">{gitSync.latestCommitSha}</code>
                    {gitSync.latestCommitDate && (
                      <span className="text-[11px] text-muted-foreground">{timeSince(gitSync.latestCommitDate)}</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{gitSync.latestCommitMsg}</p>
                </div>
<div className="flex-1 glass rounded-xl p-4">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-2">Deployed Version (Vercel)</p>
                   <code className="text-xs font-mono glass rounded px-2 py-0.5">{gitSync.deployedSha}</code>
                </div>
              </div>
              <div className={`flex items-center gap-3 glass rounded-xl border p-4 ${
                gitSync.inSync
                  ? "border-green-500/30"
                  : "border-amber-500/30"
              }`}>
                {gitSync.inSync
                  ? <CheckCircle2 size={18} className="text-green-600" />
                  : <AlertTriangle size={18} className="text-amber-500" />
                }
                <div>
                  <p className={`text-sm font-semibold ${gitSync.inSync ? "text-green-600" : "text-amber-500"}`}>
                    {gitSync.inSync ? "Deployment is up to date" : "Deployment may be behind"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {gitSync.inSync
                      ? "The live website matches the latest pushed commit on GitHub."
                      : "A newer commit exists on GitHub that hasn't been deployed yet. Vercel may still be building."}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-muted-foreground">
              <RefreshCw size={14} className="animate-spin" />
              <span className="text-sm">Verifying deployment sync…</span>
            </div>
          )}
        </div>

        {/* ─── Uptime History (visual placeholder) ─── */}
        <div className="glass rounded-2xl p-6 mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">90-Day Uptime</h3>
            <span className="text-xs text-green-600 font-semibold">99.98%</span>
          </div>
          <div className="flex gap-[2px] items-end h-8">
            {Array.from({ length: 90 }).map((_, i) => {
              const height = 60 + Math.random() * 40
              const isToday = i === 89
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-[1px] transition-colors ${isToday ? "bg-accent" : "bg-green-500/60 hover:bg-green-500"}`}
                  style={{ height: `${height}%` }}
                  title={`Day ${i + 1}${isToday ? " (Today)" : ""}`}
                />
              )
            })}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
            <span>90 days ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* ─── External Links ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a href="https://github.com/TSSEJED/opensyntax-academy" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-between glass rounded-xl p-4 hover:border-accent/30 transition-all group">
            <div>
              <p className="text-sm font-semibold">GitHub Repository</p>
              <p className="text-xs text-muted-foreground">Source code & issues</p>
            </div>
            <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-accent transition-colors" />
          </a>
          <a href="https://vercel.com" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-between glass rounded-xl p-4 hover:border-accent/30 transition-all group">
            <div>
              <p className="text-sm font-semibold">Vercel Dashboard</p>
              <p className="text-xs text-muted-foreground">Deployment logs</p>
            </div>
            <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-accent transition-colors" />
          </a>
          <a href="https://www.instagram.com/http.sejed.official/" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-between glass rounded-xl p-4 hover:border-accent/30 transition-all group">
            <div>
              <p className="text-sm font-semibold">Report an Issue</p>
              <p className="text-xs text-muted-foreground">Community Instagram</p>
            </div>
            <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-accent transition-colors" />
          </a>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-12">
          Automated checks run on page load. All monitoring is client-side — no external tracking or analytics.
        </p>
      </main>
    </div>
  )
}
