import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { ArrowLeft, Home, Search, BookOpen } from "lucide-react"

export default function NotFound() {
  return (
    <div className="bg-background text-foreground font-sans min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 pt-40 pb-24 text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1 className="text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(135deg, oklch(0.55 0.22 260), oklch(0.72 0.17 196))" }}>
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-32 h-32 rounded-full blur-[80px] opacity-20"
              style={{ background: "linear-gradient(135deg, oklch(0.55 0.22 260), oklch(0.72 0.17 196))" }} />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold mb-3">
          Page Not Found
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto mb-10">
          The page you're looking for doesn't exist or has been moved. 
          But don't worry — there are plenty of lessons waiting for you.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <Link href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            <Home size={16} />
            Back to Home
          </Link>
          <Link href="/courses"
            className="inline-flex items-center gap-2 glass rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-colors">
            <BookOpen size={16} />
            Browse Courses
          </Link>
        </div>

        {/* Quick Course Links */}
        <div className="border-t border-border pt-8">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-4">Popular Courses</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { href: "/courses/web", label: "Web Engineering" },
              { href: "/courses/system-design", label: "System Design" },
              { href: "/courses/python", label: "Python & Data" },
              { href: "/courses/cybersecurity", label: "Cybersecurity" },
              { href: "/courses/ai-ml", label: "AI/ML" },
            ].map((c) => (
              <Link key={c.href} href={c.href}
                className="text-xs glass rounded-full border border-border px-4 py-2 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
