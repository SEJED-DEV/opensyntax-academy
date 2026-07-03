export function CommunityCTA() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="relative rounded-3xl glass overflow-hidden p-10 md:p-16 flex flex-col items-center text-center gap-6">
          <div className="absolute inset-0 -z-0"
            style={{ background: "radial-gradient(ellipse 60% 50% at 50% 100%, oklch(0.72 0.17 196 / 0.08), transparent)" }}
            aria-hidden="true" />
          <div className="absolute top-0 inset-x-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, oklch(0.72 0.17 196 / 0.3), transparent)" }}
            aria-hidden="true" />

          <div className="relative z-10 flex flex-col items-center gap-5 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" style={{ animation: "pulse-dot 2s infinite" }} aria-hidden="true" />
              Community Hub · 14 Courses · Always Free
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              Learn with a community of <span className="text-gradient">builders</span>
            </h2>

            <p className="text-sm text-muted-foreground/70 leading-relaxed max-w-md">
              Join the OpenSyntax Instagram to get help, share your projects, and connect with developers building real things.
            </p>

            <a
              href="https://www.instagram.com/http.sejed.official/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              Join @http.sejed.official
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
