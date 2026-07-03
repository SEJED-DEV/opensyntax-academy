import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Privacy Policy — OpenSyntax",
  description: "OpenSyntax Privacy Policy. GDPR-compliant privacy practices for our platform.",
}

export default function PrivacyPage() {
  const lastUpdated = "March 31, 2026"
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pt-28 pb-20">
        <div className="mb-10">
          <p className="text-xs text-accent font-semibold uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl font-bold text-foreground text-balance mb-4">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: {lastUpdated} &mdash; GDPR compliant</p>
        </div>

        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section className="glass rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-3">1. Introduction</h2>
            <p>
              OpenSyntax (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your personal data and your right to privacy. This Privacy Policy explains what information we collect, how we use it, and your rights under applicable data protection laws including the General Data Protection Regulation (GDPR — EU 2016/679) and comparable international frameworks.
            </p>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-3">2. Data We Collect</h2>
            <p>OpenSyntax collects minimal data. As an open-source, client-side learning platform:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li><strong className="text-foreground">Usage Analytics:</strong> Anonymous, aggregated page view data via Vercel Analytics. No personally identifiable information is collected.</li>
              <li><strong className="text-foreground">Interactive Features:</strong> We do not track individual interactions (clicks, hovers) with our 3D assets, animated bento-box layouts, or course catalog filters. These are rendered purely on your local device.</li>
              <li><strong className="text-foreground">Cookies:</strong> We do not set any first-party tracking cookies. Third-party services (e.g., Vercel) may set technical cookies necessary for platform operation.</li>
              <li><strong className="text-foreground">No Account System:</strong> OpenSyntax currently has no user registration. Your lesson progress is stored locally in your browser&apos;s localStorage only.</li>
              <li><strong className="text-foreground">Language Preference:</strong> Starting from v4.0.0, your selected UI language (English, Arabic, Tunisian, French, or German) is stored in <code className="text-accent text-xs">localStorage</code> under the key <code className="text-accent text-xs">opensyntax_locale</code>. This data never leaves your device and is not transmitted to any server.</li>
              <li><strong className="text-foreground">PWA Installation:</strong> As of v4.3.0, the "Download the App" prompt uses standard browser APIs for Progressive Web App installation. No installation telemetry or device-specific identifiers are collected by OpenSyntax.</li>
              <li><strong className="text-foreground">Hierarchical Progress:</strong> Your progress through the Tier 1, Tier 2, and Tier 3 modules is stored using prefixed keys in <code className="text-accent text-xs">localStorage</code>. This data is used solely to render your student dashboard and completion certificates locally.</li>
              <li><strong className="text-foreground">AI & Local Models:</strong> Features involving AI integration and Small Language Models (SLMs) execute entirely locally on your device or via WebAssembly. No prompts or code telemetry are sent to external servers.</li>
            </ul>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-3">3. Legal Basis for Processing (GDPR)</h2>
            <p>
              Where GDPR applies, our legal basis for any processing of personal data is <strong className="text-foreground">Legitimate Interests</strong> (Article 6(1)(f)) — specifically, the interest of maintaining platform security and improving service quality through aggregated, anonymous analytics. We do not process special category data.
            </p>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-3">4. Third-Party Services</h2>
            <p>OpenSyntax is hosted on <strong className="text-foreground">Vercel</strong>. By using the platform, you are subject to Vercel&apos;s{" "}
              <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2">Privacy Policy</a>.
              Our Instagram page is governed by <strong className="text-foreground">Instagram&apos;s{" "}
              <a href="https://privacycenter.instagram.com/policy/" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2">Privacy Policy</a></strong>.
              We are not responsible for data practices of third-party services.
            </p>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-3">5. Data Retention</h2>
            <p>
              As we do not collect personal data, there is no personal data to retain or delete. Anonymous analytics data is retained in aggregated form for up to 12 months to understand platform usage trends.
            </p>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-3">6. Your Rights (GDPR & International)</h2>
            <p>Depending on your jurisdiction, you may have the following rights:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li><strong className="text-foreground">Right of Access</strong> — Request confirmation of what personal data we hold about you.</li>
              <li><strong className="text-foreground">Right to Erasure</strong> — Request deletion of your personal data (&quot;right to be forgotten&quot;).</li>
              <li><strong className="text-foreground">Right to Rectification</strong> — Request correction of inaccurate data.</li>
              <li><strong className="text-foreground">Right to Object</strong> — Object to processing based on legitimate interests.</li>
              <li><strong className="text-foreground">Right to Data Portability</strong> — Receive your data in a machine-readable format.</li>
            </ul>
            <p className="mt-3">
              As we collect no personal data, exercising these rights will typically result in confirmation that no data is held. To submit a request, contact us via Instagram.
            </p>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-3">7. International Transfers</h2>
            <p>
              Our platform is served globally via Vercel&apos;s edge network. By using the Service, your requests may be processed in data centers outside your country of residence. Vercel maintains Standard Contractual Clauses (SCCs) for cross-border data transfers in compliance with GDPR.
            </p>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-3">8. Children&apos;s Privacy</h2>
            <p>
              OpenSyntax is not directed at children under the age of 13 (or 16 in the EEA). We do not knowingly collect personal information from minors. If you believe a minor has provided personal information, please contact us immediately.
            </p>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. Significant changes will be announced in our Instagram page. Continued use of the Service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-3">10. Contact & Data Controller</h2>
            <p>
              OpenSyntax is an open-source community project. For privacy-related inquiries, please contact the project maintainers via our{" "}
              <a href="https://www.instagram.com/http.sejed.official/" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2 hover:no-underline">
                Instagram profile (@http.sejed.official)
              </a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
