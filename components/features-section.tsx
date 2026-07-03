"use client"

import { BookOpen, Layers, Shield, Zap, Code2, Globe, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { InteractiveIcon } from "./interactive-icon"

const features = [
  { icon: BookOpen, title: "Production-Grade Curriculum", description: "Every lesson covers real-world patterns used in production systems — not toy examples." },
  { icon: Layers,   title: "14 Learning Paths",           description: "Web, Discord, AI/ML, DevOps, Security, Blockchain, Mobile, and more — master what matters." },
  { icon: Zap,      title: "Zero Paywalls. Ever.",         description: "No subscriptions, no locked content. Community-funded and free forever by design." },
  { icon: Shield,   title: "Security-First Mindset",       description: "Security concepts woven into every track — from SQL injection to smart contract auditing." },
  { icon: Code2,    title: "Deep Code Examples",           description: "Real, runnable code in every lesson. Copy-paste patterns you can use immediately." },
  { icon: Globe,    title: "Open Source & Forkable",       description: "Every lesson is MIT-licensed. Fork it, translate it, extend it — it's yours." },
]

export function FeaturesSection() {
  return (
    <section className="border-t border-border py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.03] dark:opacity-[0.05]"
          style={{ background: "radial-gradient(circle, var(--glow-cyan), transparent 60%)" }} />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground mb-5"
          >
            <Sparkles size={12} className="text-accent" />
            Why OpenSyntax
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-foreground tracking-tight"
          >
            Premium learning,<br />permanently <span className="text-gradient">free</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-sm leading-relaxed text-muted-foreground/70 max-w-lg mx-auto"
          >
            A modern bento-style curriculum engineered for developers who demand the highest quality education without the paywall.
          </motion.p>
        </div>

        <div className="mx-auto max-w-2xl sm:mt-20 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-4 lg:max-w-none lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 100 }}
                className="group relative flex flex-col rounded-2xl glass p-6 hover:shadow-xl transition-all duration-300"
              >
                <dt className="flex items-center gap-3 font-bold text-base text-foreground mb-3">
                  <InteractiveIcon>
                    <f.icon className="h-5 w-5 text-accent" aria-hidden="true" />
                  </InteractiveIcon>
                  {f.title}
                </dt>
                <dd className="flex flex-auto flex-col text-xs leading-relaxed text-muted-foreground/70">
                  <p className="flex-auto">{f.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
