"use client"

import { useState } from "react"
import Link from "next/link"
import { Clock, BookOpen, Star, User, Sparkles, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type Course = {
  href: string
  title: string
  subtitle: string
  description: string
  icon: string
  iconColor: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  modules: number
  lessons: number
  tags: string[]
  instructor: string
  rating: number
  reviewCount: number
  prerequisites: string[]
  lastUpdated: string
}

const COURSES: Course[] = [
  {
    href: "/courses/foundations",
    title: "Computing Foundations",
    subtitle: "Hardware Logic · TCP/IP · POSIX Terminal",
    description: "The 'Minus Zero' onboarding. Start from absolute zero: CPU architecture, memory management, how the internet routes packets, and mastering the professional terminal & Git internals.",
    icon: "⬡", iconColor: "#60A5FA",
    category: "Foundations", difficulty: "Beginner",
    duration: "4h 30m", modules: 3, lessons: 6,
    tags: ["Hardware", "Networking", "Terminal", "Git"],
    instructor: "OpenSyntax Academy", rating: 5.0, reviewCount: 450,
    prerequisites: ["None"], lastUpdated: "Mar 2026"
  },
  {
    href: "/courses/web",
    title: "Full-Stack Web Engineering",
    subtitle: "Next.js 16 · Server Actions · Edge · PWA",
    description: "Master the Next.js 16 App Router, advanced caching with 'use cache', Server Actions for progressive enhancement, Edge Middleware with geo-routing, and offline-first PWA architecture.",
    icon: "⬡", iconColor: "#00C6FF",
    category: "Web", difficulty: "Advanced",
    duration: "8h 40m", modules: 6, lessons: 18,
    tags: ["Next.js", "TypeScript", "React", "Edge", "PWA"],
    instructor: "Sarah Drasner", rating: 4.9, reviewCount: 1250,
    prerequisites: ["JavaScript", "HTML/CSS"], lastUpdated: "Mar 2026"
  },
  {
    href: "/courses/discord",
    title: "Discord Development",
    subtitle: "discord.py · AutoSharding · Modals",
    description: "Build production-scale Discord bots. Covering hybrid command trees, auto-sharding for 100k+ guilds, ephemeral modals, and advanced permission orchestration.",
    icon: "⬡", iconColor: "#7289DA",
    category: "Discord", difficulty: "Intermediate",
    duration: "9h 20m", modules: 6, lessons: 20,
    tags: ["discord.py", "Sharding", "Modals", "Cogs"],
    instructor: "Sejed", rating: 4.8, reviewCount: 980,
    prerequisites: ["Python fundamentals"], lastUpdated: "Feb 2026"
  },
  {
    href: "/courses/python",
    title: "Python & Data Science",
    subtitle: "Pandas · Visualization · ML Pipelines",
    description: "From data wrangling to production ML. Python ecosystem mastery including Pandas, NumPy, Matplotlib, scikit-learn, and automated ML pipelines with proper testing.",
    icon: "⬡", iconColor: "#FFD43B",
    category: "AI & Data", difficulty: "Intermediate",
    duration: "12h 40m", modules: 10, lessons: 24,
    tags: ["Python", "Pandas", "ML", "NumPy"],
    instructor: "OpenSyntax Academy", rating: 4.7, reviewCount: 1120,
    prerequisites: ["Basic Python"], lastUpdated: "Mar 2026"
  },
  {
    href: "/courses/ai-ml",
    title: "AI/ML Engineering",
    subtitle: "LLMs · RAG · Fine-tuning · MLOps",
    description: "Full-stack AI engineering. Instruction fine-tuning, RAG architectures with vector databases, RLHF basics, model serving with vLLM, and MLOps with MLflow & DVC.",
    icon: "⬡", iconColor: "#A259FF",
    category: "AI & Data", difficulty: "Advanced",
    duration: "11h 50m", modules: 9, lessons: 22,
    tags: ["LLMs", "RAG", "MLOps", "Fine-tuning"],
    instructor: "Andrej K.", rating: 4.9, reviewCount: 870,
    prerequisites: ["Python", "Statistics"], lastUpdated: "Mar 2026"
  },
  {
    href: "/courses/typescript",
    title: "TypeScript Mastery",
    subtitle: "Generics · Conditional Types · Zod · tRPC",
    description: "Deep TypeScript. Advanced generics, template literal types, conditional branching with infer, brand types for nominal typing, Zod schemas, and end-to-end tRPC patterns.",
    icon: "⬡", iconColor: "#3178C6",
    category: "Web", difficulty: "Advanced",
    duration: "8h 50m", modules: 6, lessons: 18,
    tags: ["TypeScript", "Zod", "tRPC", "Generics"],
    instructor: "Matt P.", rating: 4.8, reviewCount: 760,
    prerequisites: ["JavaScript", "Basic TS"], lastUpdated: "Feb 2026"
  },
  {
    href: "/courses/devops",
    title: "DevOps & Cloud",
    subtitle: "Kubernetes · Terraform · Prometheus",
    description: "Infrastructure as code with Terraform, Kubernetes cluster administration, Helm chart authoring, Prometheus monitoring, GitHub Actions CI/CD, and Vercel deployments.",
    icon: "⬡", iconColor: "#38BDF8",
    category: "DevOps", difficulty: "Advanced",
    duration: "9h 30m", modules: 7, lessons: 18,
    tags: ["Kubernetes", "Terraform", "GitHub Actions", "Docker"],
    instructor: "Kelsey H.", rating: 4.7, reviewCount: 1050,
    prerequisites: ["Linux basics", "Networking"], lastUpdated: "Mar 2026"
  },
  {
    href: "/courses/databases",
    title: "Database Engineering",
    subtitle: "PostgreSQL Internals · Indexing · ACID",
    description: "Master PostgreSQL from the inside out. B-tree internals, query planning, index strategies, ACID compliance, connection pooling, and normalization vs. denormalization trade-offs.",
    icon: "⬡", iconColor: "#336791",
    category: "Systems", difficulty: "Intermediate",
    duration: "7h 10m", modules: 5, lessons: 12,
    tags: ["PostgreSQL", "SQL", "Indexing", "ACID"],
    instructor: "OpenSyntax Academy", rating: 4.6, reviewCount: 690,
    prerequisites: ["Basic SQL"], lastUpdated: "Jan 2026"
  },
  {
    href: "/courses/react-patterns",
    title: "React Advanced Patterns",
    subtitle: "Hooks Deep · Concurrency · Virtualization",
    description: "Production React patterns. Compound components with context, render props vs. hooks, concurrent mode with useTransition, virtualization with react-window, and state machines with XState.",
    icon: "⬡", iconColor: "#61DAFB",
    category: "Web", difficulty: "Advanced",
    duration: "7h 40m", modules: 5, lessons: 16,
    tags: ["React", "Hooks", "Zustand", "XState"],
    instructor: "Dan A.", rating: 4.9, reviewCount: 1340,
    prerequisites: ["React basics", "TypeScript"], lastUpdated: "Mar 2026"
  },
  {
    href: "/courses/cybersecurity",
    title: "Cybersecurity",
    subtitle: "XSS · SQLi · JWT/OAuth · CSRF",
    description: "Offensive and defensive security. XSS vectors, SQL injection prevention, JWT signing algorithms, OAuth 2.0 flows, CSRF tokens, CSP headers, and OWASP Top 10 deep dive.",
    icon: "⬡", iconColor: "#FF4D4D",
    category: "Security", difficulty: "Intermediate",
    duration: "6h 30m", modules: 5, lessons: 14,
    tags: ["XSS", "SQLi", "OAuth", "OWASP"],
    instructor: "Tanya J.", rating: 4.8, reviewCount: 820,
    prerequisites: ["Web fundamentals"], lastUpdated: "Feb 2026"
  },
  {
    href: "/courses/blockchain",
    title: "Blockchain & Web3",
    subtitle: "Solidity · Smart Contracts · DeFi",
    description: "Ethereum development. Solidity patterns (Ownable, ReentrancyGuard), ERC-20/721 tokens, Hardhat testing, DeFi primitives, and smart contract security auditing.",
    icon: "⬡", iconColor: "#F6851B",
    category: "Blockchain", difficulty: "Advanced",
    duration: "8h 20m", modules: 6, lessons: 16,
    tags: ["Solidity", "Hardhat", "DeFi", "Ethers"],
    instructor: "OpenSyntax Academy", rating: 4.5, reviewCount: 540,
    prerequisites: ["JavaScript", "Basic crypto"], lastUpdated: "Jan 2026"
  },
  {
    href: "/courses/mobile",
    title: "Mobile Engineering",
    subtitle: "React Native · Expo · Reanimated",
    description: "Cross-platform mobile development with React Native & Expo. Shared navigation, Reanimated 3 gestures, Skia custom renders, offline-first with WatermelonDB, and app store deployment.",
    icon: "⬡", iconColor: "#FF6B6B",
    category: "Mobile", difficulty: "Intermediate",
    duration: "7h 50m", modules: 5, lessons: 14,
    tags: ["React Native", "Expo", "Reanimated", "Skia"],
    instructor: "OpenSyntax Academy", rating: 4.4, reviewCount: 420,
    prerequisites: ["React", "TypeScript"], lastUpdated: "Feb 2026"
  },
  {
    href: "/courses/system-design",
    title: "System Design",
    subtitle: "Kafka · Redis · Sharding · Rate Limiting",
    description: "Distributed systems design. Event-driven with Kafka, caching strategies with Redis, database sharding patterns, rate limiting algorithms, CDN architecture, and CAP theorem trade-offs.",
    icon: "⬡", iconColor: "#E44D26",
    category: "Systems", difficulty: "Advanced",
    duration: "6h 40m", modules: 4, lessons: 12,
    tags: ["Kafka", "Redis", "Design", "Distributed"],
    instructor: "OpenSyntax Academy", rating: 4.7, reviewCount: 580,
    prerequisites: ["Backend experience"], lastUpdated: "Mar 2026"
  },
  {
    href: "/courses/rust",
    title: "Rust & Systems Programming",
    subtitle: "WASM · Tokio · Ownership · Borrowing",
    description: "Systems programming with Rust. Ownership model, lifetimes, async/await with Tokio, WebAssembly compilation, FFI with C, and building CLI tools with clap.",
    icon: "⬡", iconColor: "#DEA584",
    category: "Systems", difficulty: "Advanced",
    duration: "4h 20m", modules: 3, lessons: 8,
    tags: ["Rust", "WASM", "Tokio", "CLI"],
    instructor: "OpenSyntax Academy", rating: 4.6, reviewCount: 310,
    prerequisites: ["Programming experience"], lastUpdated: "Feb 2026"
  },
]

const CATEGORIES = [
  { key: "All", label: "All Paths" },
  { key: "Foundations", label: "Foundations" },
  { key: "Web", label: "Web" },
  { key: "AI & Data", label: "AI & Data" },
  { key: "DevOps", label: "DevOps" },
  { key: "Systems", label: "Systems" },
  { key: "Security", label: "Security" },
  { key: "Blockchain", label: "Blockchain" },
  { key: "Mobile", label: "Mobile" },
  { key: "Discord", label: "Discord" },
]

export function CoursesCatalog() {
  const [filter, setFilter] = useState("All")

  const filtered = filter === "All" ? COURSES : COURSES.filter(c => c.category === filter)
  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <section id="courses" className="border-t border-border py-20 sm:py-28 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground mb-5">
            <Sparkles size={12} className="text-accent" />
            {COURSES.length} Courses · 250+ Lessons
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
            Master <span className="text-gradient">every layer</span> of the stack
          </h2>
          <p className="mt-4 text-sm text-muted-foreground/70 max-w-lg mx-auto">
            From bare-metal logic to AI orchestration — each path is tiered for progressive mastery.
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setFilter(cat.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === cat.key
                  ? "glass text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-20 text-muted-foreground">
                <BookOpen size={32} className="opacity-30" />
                <p className="text-sm">Course in Development</p>
                <p className="text-xs text-muted-foreground/60">Request it on{" "}
                  <a href="https://www.instagram.com/http.sejed.official/" target="_blank" rel="noopener noreferrer" className="text-accent underline">Instagram</a>
                </p>
              </div>
            ) : (
              <>
                {/* Featured card */}
                {featured && (
                  <Link href={featured.href} className="group block">
                    <motion.div
                      layout
                      className="glass rounded-3xl p-8 sm:p-10 relative overflow-hidden hover:shadow-xl transition-all duration-500"
                    >
                      <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-10"
                        style={{ background: `radial-gradient(circle, ${featured.iconColor}, transparent 70%)` }} />
                      <div className="relative z-10 flex flex-col sm:flex-row items-start gap-6">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl shrink-0 text-2xl"
                          style={{ background: featured.iconColor + "20", border: `1px solid ${featured.iconColor}30` }}>
                          {featured.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <span className="text-xs font-bold text-gradient">{featured.difficulty}</span>
                            <span className="text-[10px] text-muted-foreground/50">·</span>
                            {featured.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full glass text-muted-foreground">{tag}</span>
                            ))}
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-accent transition-colors">{featured.title}</h3>
                          <p className="text-xs text-muted-foreground/70 mt-1">{featured.subtitle}</p>
                          <p className="text-sm text-muted-foreground/60 mt-3 leading-relaxed max-w-2xl">{featured.description}</p>
                          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5"><Clock size={12} />{featured.duration}</span>
                            <span className="flex items-center gap-1.5"><BookOpen size={12} />{featured.lessons} lessons</span>
                            <span className="flex items-center gap-1.5"><User size={12} />{featured.instructor}</span>
                            <span className="flex items-center gap-1.5"><Star size={12} className="text-amber-400" />{featured.rating}</span>
                          </div>
                        </div>
                        <ArrowRight size={20} className="text-muted-foreground/30 group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0 hidden sm:block" />
                      </div>
                    </motion.div>
                  </Link>
                )}

                {/* Rest of courses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rest.map((course, i) => (
                    <Link key={course.href} href={course.href} className="group block">
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="glass rounded-2xl p-6 h-full relative overflow-hidden hover:shadow-xl transition-all duration-500 group"
                      >
                        <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full opacity-5"
                          style={{ background: `radial-gradient(circle, ${course.iconColor}, transparent 70%)` }} />
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                              style={{ background: course.iconColor + "20", border: `1px solid ${course.iconColor}25` }}>
                              {course.icon}
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              course.difficulty === "Beginner" ? "text-code-num bg-code-num/10" :
                              course.difficulty === "Intermediate" ? "text-code-str bg-code-str/10" :
                              "text-code-kw bg-code-kw/10"
                            }`}>
                              {course.difficulty}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-foreground group-hover:text-accent transition-colors mb-1">{course.title}</h3>
                          <p className="text-[11px] text-muted-foreground/60 mb-3">{course.subtitle}</p>
                          <p className="text-xs text-muted-foreground/50 leading-relaxed line-clamp-2 mb-4">{course.description}</p>
                          <div className="flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground/60">
                            <span className="flex items-center gap-1"><Clock size={10} />{course.duration}</span>
                            <span className="flex items-center gap-1"><BookOpen size={10} />{course.lessons}</span>
                            <span className="flex items-center gap-1 text-amber-400/80"><Star size={10} />{course.rating}</span>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
