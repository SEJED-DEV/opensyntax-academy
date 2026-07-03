# OpenSyntax Academy

> A premium, open-source learning platform for advanced developer education. 100% free, community-funded, and forever open-source.

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Instagram](https://img.shields.io/badge/Instagram-Join_Community-E4405F?logo=instagram&logoColor=white)](https://www.instagram.com/http.sejed.official/)
[![Version](https://img.shields.io/badge/version-5.0.0-violet)](https://opensyntax-academy.vercel.app/changelog)

---

## About Version 4.3.0 — The "Minus Zero" & PWA Install Engine

OpenSyntax 4.3.0 marks a milestone in platform usability and onboarding. We have introduced the **"Minus Zero" Foundations** track — a mandatory onboarding layer for absolute beginners covering hardware logic, internet protocols, and terminal internals. 

This release also features a **Functional PWA Installation Engine**. Users can now install the OpenSyntax Academy app directly from the platform via a native browser prompt. Furthermore, all 11 core domain tracks have been fully restructured into a synchronized **3-Tier Architecture** (Foundations, Intermediate, Production), ensuring a consistent pedagogical journey from syntax to scaling.

*(Previously in v4.2.0: Mobile lag optimization and initial 3-Tier structuring for Python).*

---

## Features

- **14 Extensive Learning Paths** — Computing Foundations (Minus Zero), Web, Discord, Python, AI/ML, TypeScript, DevOps, Databases, React Patterns, Cybersecurity, Blockchain, Mobile, System Design, and Rust.
- **Multi-Language UI** — EN · AR (RTL) · TN (RTL) · FR · DE with localStorage persistence.
- **Premium Bento-box UI** — powered by `framer-motion` for stagger animations and layout transitions.
- **WebGL Hero Scene** — driven by `@react-three/fiber` for an immersive, zero-lag 3D physics interaction.
- **Sidebar-driven Lesson Player** — with deeply integrated course metadata (instructors, ratings, prerequisites).
- **Student Dashboard** — aggregates localStorage progress from all 13 courses with XP tracking.
- **Certificates System** — SVG-rendered completion certificates for each course.
- **Global Search Palette** — `Ctrl+K` / `Cmd+K` command palette searching all 250+ lessons.
- **Known Bugs Transparency Page** — `/bugs` accessible from the navbar Resources menu.
- **GDPR-compliant** — Zero-tracking architecture. All interactions are client-side only.
- **Apache 2.0 licensed** — clone, deploy, and distribute freely.

---

## The Curriculum Paths

Our courses are organized directly in the filesystem (`app/courses/[category]/page.tsx`). Each path is strictly structured into **Tier 1 (Foundations)**, **Tier 2 (Intermediate)**, and **Tier 3 (Production)**:

0. **Computing Foundations (The 'Minus Zero' Track)**
1. **Web Engineering (Next.js 16)**
2. **Discord Development (discord.py / AutoSharding)**
3. **Python & Data Science (Pandas, ML Pipelines)**
4. **AI/ML Engineering (LLMs, RAG Architectures)**
5. **TypeScript Mastery (Generics, Conditional Types, Zod, tRPC)**
6. **DevOps & Cloud (Kubernetes, Terraform, Prometheus)**
7. **Database Engineering (PostgreSQL internals, Indexing, Normalization)**
8. **React Advanced Patterns (Hooks, Concurrency, Virtualization)**
9. **Cybersecurity (XSS, SQLi, JWT/OAuth, CSRF)**
10. **Blockchain & Web3 (Solidity, Smart Contracts, DeFi)**
11. **Mobile Engineering (React Native, Expo, Reanimated)**
12. **System Design (Kafka, Redis, Sharding, Rate Limiting)**
13. **Rust & Systems Programming (WASM, Tokio, Ownership)**

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + OKLCH Colors
- **Animation:** Framer Motion + React Three Fiber
- **Typography:** Geist Sans / Geist Mono
- **i18n:** Custom lightweight localStorage-based i18n system (no heavy library)
- **Hosting:** Vercel

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/TSSEJED/opensyntax-academy.git
cd opensyntax-academy

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Contributing

We welcome contributions from the community. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) to learn how to inject new lessons, paths, and modules into the ecosystem.

---

## Community

Join the community: [@http.sejed.official](https://www.instagram.com/http.sejed.official/)

---

## License

Apache License 2.0 — see [LICENSE](./LICENSE) for details.
