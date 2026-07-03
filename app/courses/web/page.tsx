import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { LessonPlayer, type Module } from "@/components/lesson-player"

export const metadata: Metadata = {
  title: "Full-Stack Web Engineering — Next.js 16, Server Actions & PWA",
  description: "Master Next.js 16 App Router, Server Actions, Edge Middleware, PWA, offline sync, real-time CRDT collaboration, and production-grade performance monitoring with RUM data. The complete modern web engineering curriculum.",
  keywords: ["Next.js Course", "Full-Stack Web Engineering", "Server Actions", "App Router", "React Course", "PWA Tutorial", "Web Performance", "CRDT", "Real-Time Collaboration"],
}

const webModules: Module[] = [
  {
    id: "web-tier-1", title: "Tier 1: Foundations — Core Architecture",
    lessons: [
      {
        id: "html-css-semantics", title: "Semantic HTML5 & Modern CSS Layouts", duration: "30 min",
        description: "Master the structure of the web. Semantic tags, Flexbox vs Grid, and CSS Variable architecture.",
        content: `<h2>Semantic Foundations</h2>
<p>HTML is the skeleton of your application. Using semantic tags like <code>&lt;main&gt;</code>, <code>&lt;article&gt;</code>, and <code>&lt;section&gt;</code> isn't just for SEO — it's for accessibility (A11y) and machine readability.</p>
<h3>Modern Layout Engine</h3>
<p>Modern CSS has moved beyond floats. We use <strong>Flexbox</strong> for 1D alignment and <strong>CSS Grid</strong> for 2D layouts. By combining these with <strong>CSS Custom Properties</strong> (variables), you create maintainable design systems.</p>`
      },
      {
        id: "js-logic", title: "JavaScript ES6+ Deep Dive", duration: "40 min",
        description: "Closures, Promises, and the Event Loop. Understand how JavaScript executes in the browser.",
        content: `<h2>Mastering JavaScript Internals</h2>
<p>To be a senior web engineer, you must understand the <strong>Event Loop</strong>. JavaScript is single-threaded, but it achieves concurrency through a callback queue and the web API stack.</p>
<pre><code class="language-javascript">// Understanding Promises
const data = await fetch('/api')
  .then(res => res.json())
  .catch(err => console.error(err));
</code></pre>`
      },
      {
        id: "responsive-design-patterns", title: "Responsive Design Patterns & CSS Architecture", duration: "35 min",
        description: "Build production-grade responsive layouts. Master Container Queries, logical properties, and design token systems.",
        content: `<h2>Modern Responsive Design</h2>
<p>Modern responsive engineering uses <strong>Container Queries</strong> to let components adapt to their parent's width rather than the viewport. Combined with <strong>CSS logical properties</strong>, layouts work in both LTR and RTL writing modes without duplication.</p>
<pre><code class="language-css">/* Container Query Pattern */
.card-container { container-type: inline-size; }
@container (min-width: 400px) {
  .card { display: grid; grid-template-columns: 1fr 2fr; }
}
/* Design Token System */
:root {
  --space-xs: 0.25rem;  --space-md: 1rem;
  --space-lg: 1.5rem;   --space-xl: 2.5rem;
}</code></pre>`,
        quiz: [
          {
            question: "Which CSS feature allows a component to respond to its parent container's width rather than the viewport?",
            options: ["Media Queries", "Container Queries", "Flexbox", "CSS Grid"],
            correctIndex: 1,
            explanation: "Container Queries (@container) allow components to adapt based on their container's size, enabling truly reusable responsive components."
          }
        ]
      },
      {
        id: "build-tools-bundlers", title: "Build Tools & Module Bundlers", duration: "30 min",
        description: "Master Turbopack, Webpack, and Vite internals. Understand tree-shaking, code splitting, and dependency resolution at scale.",
        content: `<h2>Modern Build Pipeline</h2>
<p>Next.js 16 leverages <strong>Turbopack</strong>, an incremental bundler written in Rust, for sub-second Hot Module Replacement. Understanding the build pipeline is essential for production optimization.</p>
<pre><code class="language-javascript">// Advanced Bundle Splitting
const nextConfig = {
  experimental: { turbo: { resolveAlias: { react: 'preact/compat' } } },
  webpack: (config) => {
    config.optimization.splitChunks.cacheGroups.vendor = {
      test: /[\\/]node_modules[\\/]/,
      chunks: 'all',
      priority: 10,
    }
    return config
  },
}
export default nextConfig</code></pre>`
      }
    ]
  },
  {
    id: "web-tier-2", title: "Tier 2: Intermediate — Framework Mastery",
    lessons: [
      {
        id: "react-19-hooks", title: "React 19 & Server Components", duration: "45 min",
        description: "The return of server-side logic in the UI. Next.js App Router, hooks, and data fetching.",
        content: `<h2>React Server Components (RSC)</h2>
<p>React 19 marks a paradigm shift. We no longer ship entire libraries to the client. With Server Components, the heavy lifting stays on the server, sending only the resulting HTML/UI to the user.</p>
<h3>The App Router</h3>
<p>Next.js 16 leverages the App Router to provide file-based routing, layout persistence, and built-in loading/error boundaries.</p>`
      },
      {
        id: "server-actions-mutations", title: "Server Actions & Data Mutations", duration: "40 min",
        description: "Build production-grade forms and mutations using Next.js Server Actions with revalidation and optimistic updates.",
        content: `<h2>Server Actions in Depth</h2>
<p>Server Actions allow you to run server-side code directly from client components without building a separate API route. Combined with <strong>revalidation</strong>, you get instant UI updates after mutations.</p>
<pre><code class="language-typescript">// Server Action for form handling
async function createPost(formData: FormData) {
  'use server'
  const title = formData.get('title') as string
  const post = await db.post.create({ data: { title } })
  revalidatePath('/posts')
  return { success: true, post }
}</code></pre>`,
        quiz: [
          {
            question: "What directive must be at the top of a Server Action function?",
            options: ["'use client'", "'use server'", "'use action'", "'use async'"],
            correctIndex: 1,
            explanation: "The 'use server' directive tells Next.js this function should only execute on the server, never shipped to the client bundle."
          }
        ]
      },
      {
        id: "auth-middleware", title: "Authentication & Edge Middleware", duration: "35 min",
        description: "Implement session-based auth with NextAuth.js, protected routes via Edge Middleware, and role-based access control.",
        content: `<h2>Authentication Architecture</h2>
<p>Modern Next.js apps use <strong>Edge Middleware</strong> to check authentication at the CDN level before the request reaches your server. This enables instant redirects for unauthenticated users.</p>
<pre><code class="language-typescript">// middleware.ts — Edge-level auth guard
import { withAuth } from 'next-auth/middleware'
export default withAuth({
  callbacks: { authorized: ({ token }) => !!token },
  pages: { signIn: '/login' },
})
export const config = { matcher: ['/dashboard/:path*', '/admin/:path*'] }</code></pre>`
      },
      {
        id: "data-fetching-patterns", title: "Data Fetching & Caching Strategies", duration: "30 min",
        description: "Master React Query, incremental Static Regeneration, and the Next.js Data Cache for optimal performance.",
        content: `<h2>Data Fetching at Scale</h2>
<p>Choosing the right data-fetching strategy is critical. Use <strong>static generation</strong> for marketing pages, <strong>ISR</strong> for content that changes occasionally, and <strong>dynamic fetching</strong> for personalized data.</p>
<pre><code class="language-typescript">// ISR with on-demand revalidation
export async function generateStaticParams() {
  return db.post.findMany({ select: { slug: true } })
}
// Incremental Static Regeneration
const post = await db.post.findUnique({ where: { slug } })
revalidateTag('posts')
return <PostPage post={post} /> // Stale-while-revalidate</code></pre>`
      }
    ]
  },
  {
    id: "web-tier-3", title: "Tier 3: Production — Bleeding Edge",
    lessons: [
      {
        id: "edge-slm", title: "Edge Caching & Local SLMs", duration: "50 min",
        description: "Zero-latency deployments using Vercel Edge and client-side AI processing via WebAssembly.",
        content: `<h2>High-Performance Edge Architecture</h2>
<p>Tier 3 engineering involves moving logic as close to the user as possible. <strong>Next.js Edge Middleware</strong> runs at the CDN level, allowing for instant A/B testing and geolocation redirects.</p>
<h3>Local AI Processing</h3>
<p>Using <strong>Transformers.js</strong>, we can execute Small Language Models (SLMs) directly in the browser via WebAssembly. This ensures user data never leaves the device while providing rich AI features like semantic search or text analysis.</p>`
      },
      {
        id: "pwa-service-workers", title: "PWA & Service Worker Lifecycle", duration: "40 min",
        description: "Build installable Progressive Web Apps with custom service workers, push notifications, and background sync.",
        content: `<h2>Progressive Web Apps</h2>
<p>PWAs bridge the gap between web and native apps. The <strong>service worker</strong> acts as a programmable network proxy, intercepting fetch events and serving cached responses when offline.</p>
<pre><code class="language-javascript">// Service Worker with Cache-First Strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        return caches.open('v1').then(cache => {
          cache.put(event.request, response.clone())
          return response
        })
      })
    })
  )
})</code></pre>`,
        quiz: [
          {
            question: "What does a service worker act as in a PWA?",
            options: ["A database engine", "A programmable network proxy", "A React renderer", "A CSS preprocessor"],
            correctIndex: 1,
            explanation: "Service workers intercept and handle network requests, acting as a proxy between the browser and the network."
          }
        ]
      },
      {
        id: "offline-first-indexeddb", title: "Offline-First Architecture with IndexedDB", duration: "35 min",
        description: "Implement offline data persistence using IndexedDB with Dexie.js, conflict resolution, and background sync queues.",
        content: `<h2>Offline-First Data Layer</h2>
<p>For applications that must work without connectivity, an <strong>offline-first</strong> approach writes to a local database first, then syncs to the server when the network is available.</p>
<pre><code class="language-javascript">// Dexie.js — IndexedDB made easy
import Dexie from 'dexie'
const db = new Dexie('TaskManager')
db.version(1).stores({ tasks: '++id, title, done, synced' })
async function addTask(title: string) {
  await db.tasks.add({ title, done: false, synced: false })
  navigator.serviceWorker.controller?.postMessage({ type: 'SYNC_TASKS' })
}</code></pre>`
      },
      {
        id: "streams-server-sent-events", title: "Streams, SSE & Real-Time Data", duration: "30 min",
        description: "Build real-time features using Web Streams API, Server-Sent Events, and the ReadableStream primitive.",
        content: `<h2>Streaming Data to the Client</h2>
<p>The <strong>Web Streams API</strong> lets you process data incrementally as it arrives. Combined with <strong>Server-Sent Events (SSE)</strong>, you can push real-time updates without WebSocket overhead.</p>
<pre><code class="language-typescript">// Next.js Route Handler with streaming
export async function GET(req: Request) {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      for await (const chunk of processData()) {
        controller.enqueue(encoder.encode(\`data: \${JSON.stringify(chunk)}\n\n\`))
      }
      controller.close()
    },
  })
  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } })
}</code></pre>`
      }
    ]
  },
  {
    id: "web-tier-4", title: "Tier 4: Performance & Monitoring",
    lessons: [
      {
        id: "core-web-vitals", title: "Core Web Vitals & Lighthouse CI", duration: "35 min",
        description: "Master LCP, FID, CLS optimization. Automate performance budgets with Lighthouse CI in your GitHub Actions pipeline.",
        content: `<h2>Core Web Vitals</h2>
<p>Google's <strong>Core Web Vitals</strong> — Largest Contentful Paint (LCP), First Input Delay (FID), and Cumulative Layout Shift (CLS) — are the gold standard for user experience measurement.</p>
<pre><code class="language-javascript">// Lighthouse CI config for GitHub Actions
module.exports = {
  ci: {
    collect: { url: ['https://your-app.com'], numberOfRuns: 3 },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
      },
    },
    upload: { target: 'temporary-public-storage' },
  },
}</code></pre>`,
        quiz: [
          {
            question: "Which Core Web Vital measures visual stability by quantifying unexpected layout shifts?",
            options: ["LCP", "FID", "CLS", "TTFB"],
            correctIndex: 2,
            explanation: "Cumulative Layout Shift (CLS) measures visual stability by summing all unexpected layout shifts during the page's lifetime."
          }
        ]
      },
      {
        id: "sentry-error-tracking", title: "Sentry Error Tracking & RUM Data", duration: "30 min",
        description: "Implement production error tracking with Sentry and Real User Monitoring for performance insights from actual users.",
        content: `<h2>Real User Monitoring</h2>
<p>Lab data (Lighthouse) is useful, but <strong>Real User Monitoring (RUM)</strong> captures the actual experience of your users across different devices, networks, and geographies.</p>
<pre><code class="language-typescript">// Sentry setup for Next.js
import * as Sentry from '@sentry/nextjs'
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})</code></pre>`
      },
      {
        id: "bundle-analysis", title: "Bundle Analysis & Code Splitting", duration: "25 min",
        description: "Analyze and optimize your JavaScript bundles. Reduce time-to-interactive by 50% with strategic code splitting.",
        content: `<h2>Bundle Optimization</h2>
<p>Large JavaScript bundles are the #1 cause of slow <strong>Time to Interactive (TTI)</strong>. Use <code>@next/bundle-analyzer</code> to visualize what's in your bundles and identify optimization opportunities.</p>
<pre><code class="language-javascript">// Dynamic import for route-level code splitting
const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false, // Only load on client
})
// Import on interaction for critical resources
const Editor = dynamic(() => import('@/components/Editor'), {
  loading: () => <EditorSkeleton />,
})</code></pre>`
      },
      {
        id: "apm-distributed-tracing", title: "APM & Distributed Tracing", duration: "30 min",
        description: "Trace requests across your entire stack — from CDN edge to database — using OpenTelemetry and Datadog.",
        content: `<h2>Observability in Production</h2>
<p><strong>Distributed tracing</strong> lets you follow a single request as it travels through middleware, serverless functions, APIs, and database queries — pinpointing where latency is introduced.</p>
<pre><code class="language-typescript">// OpenTelemetry instrumentation
import { trace } from '@opentelemetry/api'
const tracer = trace.getTracer('web-app')
export async function fetchData(id: string) {
  return await tracer.startActiveSpan('fetchData', async (span) => {
    span.setAttribute('record.id', id)
    const data = await db.query('SELECT * FROM records WHERE id = $1', [id])
    span.end()
    return data
  })
}</code></pre>`
      }
    ]
  },
  {
    id: "web-tier-5", title: "Tier 5: Advanced Project — Real-Time Collaborative Editor",
    lessons: [
      {
        id: "collaborative-editor-architecture", title: "Collaborative Editor Architecture", duration: "40 min",
        description: "Design the architecture for a real-time collaborative text editor. Understand OT vs CRDT approaches and WebSocket transport.",
        content: `<h2>Real-Time Collaboration Architecture</h2>
<p>Building a collaborative editor requires solving distributed systems problems — <strong>concurrent edits</strong>, <strong>conflict resolution</strong>, and <strong>state synchronization</strong> across multiple users.</p>
<pre><code class="language-typescript">// WebSocket server with shared document handling
import { WebSocketServer } from 'ws'
const wss = new WebSocketServer({ port: 8080 })
const documents = new Map<string, Set<WebSocket>>()
wss.on('connection', (ws, req) => {
  const docId = new URL(req.url!, 'http://localhost').searchParams.get('doc')!
  if (!documents.has(docId)) documents.set(docId, new Set())
  documents.get(docId)!.add(ws)
  ws.on('message', (data) => {
    documents.get(docId)?.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN)
        client.send(data.toString())
    })
  })
})</code></pre>`
      },
      {
        id: "yjs-crdt-sync", title: "Yjs CRDT & Real-Time Sync Engine", duration: "45 min",
        description: "Implement Conflict-free Replicated Data Types with Yjs. Understand vector clocks, merge logic, and awareness protocols.",
        content: `<h2>CRDTs with Yjs</h2>
<p><strong>Yjs</strong> is a high-performance CRDT implementation that uses a <strong>state vector</strong> to determine which operations each peer is missing. It resolves conflicts without a central server — edits always converge.</p>
<pre><code class="language-javascript">// Yjs document with WebSocket provider
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
const doc = new Y.Doc()
const provider = new WebsocketProvider('ws://localhost:8080', 'my-doc', doc)
const yText = doc.getText('content')
// Subscribe to changes
yText.observe(event => {
  console.log('Remote edit received:', event.delta)
})
// Apply local changes
yText.insert(0, 'Hello from Yjs!')</code></pre>`,
        quiz: [
          {
            question: "What does CRDT stand for?",
            options: ["Conflict Resolution Distributed Tree", "Conflict-free Replicated Data Type", "Concurrent Reliable Data Transfer", "Causal Replicated Document Type"],
            correctIndex: 1,
            explanation: "CRDT stands for Conflict-free Replicated Data Type — data structures that can be modified concurrently by multiple users and automatically merge without conflicts."
          }
        ]
      },
      {
        id: "cursor-presence", title: "Cursor Awareness & Presence Indicators", duration: "30 min",
        description: "Build live cursors, selection highlighting, and user presence avatars using Yjs awareness protocol.",
        content: `<h2>Collaborative Presence</h2>
<p>Beyond text sync, collaborative editors need <strong>presence awareness</strong> — showing each user's cursor position, text selection, and active state. Yjs provides a built-in awareness protocol for this.</p>
<pre><code class="language-javascript">// Cursor awareness with Yjs
provider.awareness.setLocalStateField('user', {
  name: 'Alice',
  color: '#ff6b6b',
  cursor: { anchor: null, head: null },
})
provider.awareness.on('change', ({ added, removed, updated }) => {
  const states = Array.from(provider.awareness.getStates().entries())
  states.forEach(([clientId, state]) => {
    if (state.user?.cursor) {
      renderCursor(clientId, state.user)
    }
  })
})</code></pre>`
      },
      {
        id: "production-deployment", title: "Deployment & Scaling the Editor", duration: "35 min",
        description: "Deploy the collaborative editor to production. WebSocket scaling with Redis pub/sub, rate limiting, and connection pooling.",
        content: `<h2>Production Scaling</h2>
<p>For horizontal scaling of WebSocket connections, use <strong>Redis pub/sub</strong> to broadcast document updates across all server instances. Each server subscribes to document channels and relays updates to connected clients.</p>
<pre><code class="language-javascript">// Redis pub/sub for multi-instance broadcast
import { createClient } from 'redis'
const pub = createClient(), sub = createClient()
sub.subscribe('doc-updates', (message) => {
  const { docId, update } = JSON.parse(message)
  localDocs.get(docId)?.clients.forEach(ws => ws.send(update))
})
function broadcast(docId: string, update: Uint8Array) {
  pub.publish('doc-updates', JSON.stringify({ docId, update: Array.from(update) }))
}</code></pre>`
      }
    ]
  }
]

export default function WebCoursePage() {
  return (
    <div className="bg-background text-foreground font-sans">
      <Navbar />
      <LessonPlayer
        title="Full-Stack Web Engineering"
        description="Next.js 16, Server Actions, Edge Middleware, PWA, and offline sync — the complete modern web track."
        category="Web"
        accentColor="oklch(0.72 0.17 196)"
        modules={webModules}
      />
    </div>
  )
}
