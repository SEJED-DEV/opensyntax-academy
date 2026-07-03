"use client"

import { motion } from "framer-motion"
import { Quote, Sparkles } from "lucide-react"

const TESTIMONIALS = [
  {
    name: "Alex Chen",
    role: "Full-Stack Engineer at Stripe",
    quote: "OpenSyntax's Next.js course is the best free resource I've found. The 'use cache' and Server Actions lessons are production-grade. I got promoted months after completing the web track.",
    avatar: "AC",
    accentColor: "#00C6FF",
  },
  {
    name: "Priya Sharma",
    role: "ML Engineer at DeepMind",
    quote: "The AI/ML Engineering path covers RAG, fine-tuning, and MLOps better than paid platforms I've tried. The quiz sections really test your understanding.",
    avatar: "PS",
    accentColor: "#A259FF",
  },
  {
    name: "Marcus Johnson",
    role: "Discord Bot Developer",
    quote: "I went from basic discord.py scripts to a sharded, production-ready bot serving 50k users. The PostgreSQL + Redis lessons were game-changing.",
    avatar: "MJ",
    accentColor: "#7289DA",
  },
  {
    name: "Sarah Nakamura",
    role: "Security Researcher",
    quote: "The Cybersecurity course doesn't just teach theory — it shows you real exploit patterns and how to defend against them. OWASP Top 10 done right.",
    avatar: "SN",
    accentColor: "#FF4D4D",
  },
  {
    name: "David Park",
    role: "DevOps Lead at Cloudflare",
    quote: "Kubernetes, Terraform, and GitHub Actions all in one course? And it's free? This is what open-source education should look like.",
    avatar: "DP",
    accentColor: "#0DB7ED",
  },
  {
    name: "Luna Torres",
    role: "Blockchain Developer",
    quote: "The Solidity security patterns section alone saved me from a reentrancy vulnerability in production. OpenSyntax teaches what matters for real-world Web3.",
    avatar: "LT",
    accentColor: "#F6851B",
  },
]

export function TestimonialsSection() {
  return (
    <section className="border-t border-border py-24 sm:py-32 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.03] dark:opacity-[0.05]"
          style={{ background: "radial-gradient(circle, var(--glow-violet), transparent 60%)" }} />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground mb-5"
          >
            <Sparkles size={12} className="text-accent" />
            Community Voices
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-foreground tracking-tight"
          >
            Trusted by developers<br />at <span className="text-gradient">every level</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, type: "spring", stiffness: 100 }}
              className="group relative flex flex-col rounded-2xl glass p-6 hover:shadow-xl transition-all duration-300"
            >
              <Quote size={22} className="text-accent/20 mb-3 group-hover:text-accent/40 transition-colors" />
              <p className="text-xs text-muted-foreground/70 leading-relaxed flex-1 mb-5 group-hover:text-foreground/80 transition-colors">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${t.accentColor}, ${t.accentColor}99)` }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground/60">{t.role}</p>
                </div>
              </div>
              <div
                className="absolute -right-4 -bottom-4 h-16 w-16 rounded-full blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none"
                style={{ background: t.accentColor }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
