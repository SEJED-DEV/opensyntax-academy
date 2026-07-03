"use client"

import { Bot, Shield, Code2, ExternalLink, Sparkles, Server, Wrench } from "lucide-react"

const features = [
  "Leveling & Economy",
  "Advanced Logging",
  "Welcome & Farewell",
  "Ticket System",
  "Giveaways",
  "Advanced Moderation",
  "AutoMod",
]

const freeBots = [
  { icon: Shield, name: "Vanguard Moderation", desc: "Advanced auto-moderation & protection suite" },
  { icon: Server, name: "Nova ER:LC Manager", desc: "Full ER:LC server management & statistics" },
  { icon: Wrench, name: "ER:LC Utility Engine", desc: "Utility commands and automation tools" },
]

const openSource = [
  { icon: Code2, name: "Cortex Core", desc: "Monorepo foundation for modern Discord bots" },
  { icon: Code2, name: "Pickle Infrastructure", desc: "Type-safe bot framework & CLI toolkit" },
  { icon: Code2, name: "Nexus Transcripts", desc: "Beautiful HTML ticket transcripts" },
]

export function AdSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="relative rounded-3xl glass overflow-hidden p-10 md:p-16">
          <div className="absolute inset-0 -z-0"
            style={{ background: "radial-gradient(ellipse 60% 50% at 50% 100%, oklch(0.72 0.17 196 / 0.08), transparent)" }}
            aria-hidden="true" />
          <div className="absolute top-0 inset-x-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, oklch(0.72 0.17 196 / 0.3), transparent)" }}
            aria-hidden="true" />

          <div className="relative z-10 flex flex-col gap-12">
            {/* Header */}
            <div className="flex flex-col gap-5 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground w-fit">
                <Bot className="w-3.5 h-3.5 text-accent" />
                Sponsored
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                Cortex HQ — <span className="text-gradient">Infrastructure for modern Discord communities</span>
              </h2>

              <p className="text-sm text-muted-foreground/70 leading-relaxed max-w-lg">
                Reach thousands of developers monthly. Add your own ad by visiting our support page
                and claim a premium placement on OpenSyntax Academy.
              </p>
            </div>

            {/* Featured Bot Card — Cortex Bot */}
            <div className="relative group">
              <div className="rounded-2xl glass p-8 flex flex-col gap-6 glow-cyan transition-all duration-300 group-hover:scale-[1.01] border border-accent/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                    <Bot className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground">Cortex Bot</p>
                    <p className="text-xs text-muted-foreground">All-in-One Discord Infrastructure</p>
                  </div>
                </div>

                <p className="text-sm text-foreground/80 leading-relaxed font-mono">
                  <span className="text-code-kw">new</span>{" "}
                  <span className="text-code-fn">CortexBot</span>
                  <span className="text-muted-foreground">.</span>
                  <span className="text-code-fn">build</span>
                  <span className="text-muted-foreground">({}</span>
                  <br />
                  <span className="text-muted-foreground">  </span>
                  <span className="text-code-str">"leveling"</span>
                  <span className="text-muted-foreground">,</span>{" "}
                  <span className="text-code-str">"economy"</span>
                  <span className="text-muted-foreground">,</span>
                  <br />
                  <span className="text-muted-foreground">  </span>
                  <span className="text-code-str">"logging"</span>
                  <span className="text-muted-foreground">,</span>{" "}
                  <span className="text-code-str">"ticketing"</span>
                  <span className="text-muted-foreground">,</span>
                  <br />
                  <span className="text-muted-foreground">  </span>
                  <span className="text-code-str">"moderation"</span>
                  <span className="text-muted-foreground">,</span>{" "}
                  <span className="text-code-str">"automod"</span>
                  <span className="text-muted-foreground">,</span>
                  <br />
                  <span className="text-muted-foreground">  </span>
                  <span className="text-code-num">true</span>
                  <span className="text-muted-foreground">, // giveaways</span>
                  <br />
                  <span className="text-muted-foreground">  </span>
                  <span className="text-code-num">true</span>
                  <span className="text-muted-foreground">, // welcoming</span>
                  <br />
                  <span className="text-muted-foreground">)</span>
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {features.map((f) => (
                    <div key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Sparkles className="w-3 h-3 text-accent shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Free Bots */}
            <div className="flex flex-col gap-5">
              <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">
                Free Bots
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {freeBots.map((bot) => (
                  <div key={bot.name} className="rounded-xl glass p-5 flex flex-col gap-3 transition-all duration-300 hover:scale-[1.02] border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center">
                        <bot.icon className="w-4.5 h-4.5 text-accent" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">{bot.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{bot.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Open Source */}
            <div className="flex flex-col gap-5">
              <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">
                Open Source
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {openSource.map((project) => (
                  <div key={project.name} className="rounded-xl glass p-5 flex flex-col gap-3 transition-all duration-300 hover:scale-[1.02] border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center">
                        <project.icon className="w-4.5 h-4.5 text-accent" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">{project.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{project.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex justify-center pt-4">
              <a
                href="https://www.cortexhq.net/support"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg"
              >
                <ExternalLink className="w-4 h-4" />
                Request Your Ad →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
