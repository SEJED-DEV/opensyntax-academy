import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Terms of Service — OpenSyntax",
  description: "OpenSyntax Terms of Service. Read our terms before using the platform.",
}

export default function TermsPage() {
  const lastUpdated = "March 31, 2026"
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pt-28 pb-20">
        <div className="mb-10">
          <p className="text-xs text-accent font-semibold uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl font-bold text-foreground text-balance mb-4">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>

        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section className="glass rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the OpenSyntax platform (&quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you may not use the Service. OpenSyntax reserves the right to modify these Terms at any time, with notice provided via the platform or our Instagram page.
            </p>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-3">2. Description of Service</h2>
            <p>
              OpenSyntax is a free, open-source learning platform built around a &quot;Minus Zero&quot; 3-Tier architecture. The Service provides structured educational content starting from absolute computing fundamentals (Tier 1) through specialized framework mastery (Tier 2) to production-grade engineering (Tier 3), including local AI processing and professional environment setup. The Service includes a Progressive Web App (PWA) installation feature to enable offline access and a centralized student dashboard to track progress across 14 distinct learning paths. All content is provided &quot;as is&quot; for educational purposes only. OpenSyntax is community-funded and does not charge for access.
            </p>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-3">3. Open Source License</h2>
            <p>
              The OpenSyntax source code is licensed under the <strong className="text-foreground">Apache License, Version 2.0</strong>. You may use, reproduce, and distribute the code in accordance with the Apache 2.0 license terms. The license is available in full at{" "}
              <a href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2 hover:no-underline">
                apache.org/licenses/LICENSE-2.0
              </a>.
            </p>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-3">4. User Conduct</h2>
            <p>When using the Service and associated community spaces (Instagram profile), you agree to:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>Treat all community members with respect and courtesy.</li>
              <li>Not engage in harassment, hate speech, discrimination, or targeted abuse.</li>
              <li>Not distribute malicious code, exploits, or unauthorized software.</li>
              <li>Not attempt to reverse-engineer, scrape, or automate access to the platform in unauthorized ways.</li>
              <li>Comply with Instagram&apos;s Terms of Service when participating in the Instagram page.</li>
            </ul>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-3">5. Intellectual Property</h2>
            <p>
              Course content, lesson text, and documentation authored by OpenSyntax contributors are licensed under <strong className="text-foreground">Creative Commons Attribution 4.0 International (CC BY 4.0)</strong>. You are free to share and adapt the material for any purpose, provided appropriate credit is given to OpenSyntax.
            </p>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-3">6. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. OPENSYNTAX DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
            </p>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-3">7. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, OPENSYNTAX AND ITS CONTRIBUTORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF YOUR ACCESS TO OR USE OF THE SERVICE.
            </p>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-3">8. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with internationally recognized principles of software licensing and open-source governance. Where applicable, GDPR (EU Regulation 2016/679) provisions apply to users in the European Economic Area.
            </p>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-3">9. Contact</h2>
            <p>
              For questions about these Terms, please join our{" "}
              <a href="https://www.instagram.com/http.sejed.official/" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2 hover:no-underline">
                Instagram page
              </a>{" "}
              and reach out to the moderation team.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
