import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Contributing — OpenSyntax Academy",
  description: "Learn how to contribute courses, modules, and code to the platform.",
}

export default function ContributingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 pt-28 pb-20">
        <div className="mb-14">
          <p className="text-xs text-accent font-semibold uppercase tracking-widest mb-3">Open Source</p>
          <h1 className="text-4xl font-bold text-foreground text-balance mb-4">Contributing to OpenSyntax</h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Thank you for your interest in contributing. This platform is 100% community-driven, and every contribution — whether it is a new lesson, a bug fix, or a typo correction — makes a real difference to developers learning around the world.
          </p>
        </div>

        <div className="space-y-12 text-sm text-muted-foreground leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">Code of Conduct</h2>
            <div className="glass rounded-xl p-6">
              <p>
                By participating in this project, you agree to uphold a respectful and inclusive environment. Harassment, discrimination, or abusive behavior will not be tolerated and will result in removal from the community.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">How to Add a Lesson</h2>
            <p className="mb-4">
              Each learning path has its lesson data defined in its specific page file (e.g., <code>app/courses/discord/page.tsx</code>).
              To add a lesson, append a new entry to the <code>lessons</code> array inside the appropriate module:
            </p>
            <div className="glass rounded-xl overflow-hidden mb-6">
              <div className="glass px-4 py-2 border-b border-border flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
                <span className="ml-2 text-[10px] font-mono text-muted-foreground">page.tsx</span>
              </div>
              <pre className="p-4 text-xs font-mono text-foreground overflow-auto">
                <code dangerouslySetInnerHTML={{ __html: `{
  id: "my-unique-lesson-id",           // kebab-case, must be unique
  title: "Your Lesson Title",
  description: "A one-line summary.",
  duration: "15 min",                  // estimated read/watch time
  content: \`
    &lt;h2&gt;Section Heading&lt;/h2&gt;
    &lt;p&gt;Lesson body content in HTML...&lt;/p&gt;
    &lt;pre&gt;&lt;code&gt;// code example&lt;/code&gt;&lt;/pre&gt;
  \`,
}` }} />
              </pre>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Content Guidelines:</h3>
            <ul className="list-disc list-inside space-y-2 mb-4 pl-2">
              <li>Use semantic HTML inside the <code>content</code> string.</li>
              <li>Keep lessons focused — one core concept per lesson.</li>
              <li>Include practical, runnable code examples.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">How to Add a Module</h2>
            <p className="mb-4">
              To add a new overarching module to a learning path, add a new object to the <code>modules</code> array:
            </p>
            <div className="glass rounded-xl overflow-hidden">
              <pre className="p-4 text-xs font-mono text-foreground overflow-auto">
                <code dangerouslySetInnerHTML={{ __html: `{
  id: "my-module-id",
  title: "Module N — Short Title",
  lessons: [
    // ... lesson objects
  ],
}` }} />
              </pre>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">Development Setup</h2>
            <p className="mb-4">Follow these steps to run the OpenSyntax Academy interface locally on your machine:</p>
            <div className="glass rounded-xl overflow-hidden">
              <pre className="p-4 text-xs font-mono text-foreground overflow-auto">
                <code>
<span className="text-muted-foreground"># Fork the repository on GitHub, then clone your fork</span>{'\n'}
git clone https://github.com/YOUR_USERNAME/opensyntax-academy.git{'\n'}
cd opensyntax-academy{'\n\n'}
<span className="text-muted-foreground"># Install dependencies</span>{'\n'}
npm install{'\n\n'}
<span className="text-muted-foreground"># Start the dev server on localhost:3000</span>{'\n'}
npm run dev
                </code>
              </pre>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">Commit Guidelines</h2>
            <p className="mb-4">
              We strictly follow <a href="https://www.conventionalcommits.org/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Conventional Commits</a> to ensure automated changelog generation.
            </p>
            <div className="border border-border rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary/50 text-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">When to use</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border glass">
                  <tr>
                    <td className="px-4 py-3 font-mono text-accent">feat:</td>
                    <td className="px-4 py-3">Adding a new lesson, module, or feature</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-accent">fix:</td>
                    <td className="px-4 py-3">Fixing a bug or incorrect information</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-accent">docs:</td>
                    <td className="px-4 py-3">Changes to documentation only</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-accent">style:</td>
                    <td className="px-4 py-3">Formatting and UI tweaks</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">Pull Request Process</h2>
            <ol className="list-decimal list-inside space-y-3 pl-2">
              <li>Fork the repository and create a new isolated branch (e.g. <code>feat/your-lesson-name</code>).</li>
              <li>Make your changes following the aesthetic and content guidelines above.</li>
              <li>Ensure the project builds without errors: <code>npm run build</code></li>
              <li>Open a pull request against the <code>main</code> branch with a clear description of the impact.</li>
              <li>A core maintainer will review your PR. Please be patient — this is an open-source community project!</li>
            </ol>
          </section>

          <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              Questions? Chat with us directly in the community.
            </p>
            <a href="https://www.instagram.com/http.sejed.official/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 glass rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:border-accent hover:text-accent transition-all shadow-sm">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.042.033.055a19.854 19.854 0 0 0 5.993 3.03.077.077 0 0 0 .084-.026c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
              Follow on Instagram
            </a>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
