import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { LessonPlayer, type Module } from "@/components/lesson-player"

export const metadata: Metadata = {
  title: "Computing Foundations — The 'Minus Zero' Onboarding",
  description: "Master computing from the silicon up — CPU architecture, network protocols, terminal mastery, Git internals, security fundamentals, and your career launchpad. The complete zero-to-engineer foundations curriculum.",
  keywords: ["Computing Architecture", "How the Internet Works", "Terminal Basics", "Git Fundamentals", "Security Fundamentals", "Career Prep", "Programming for Beginners"],
}

const foundationModules: Module[] = [
  {
    id: "hardware-logic", title: "Module 1 — Hardware Logic & Memory",
    lessons: [
      {
        id: "cpu-architecture", title: "CPU Architecture & Instruction Sets", duration: "20 min",
        description: "Demystifying the silicon. Learn how registers, the ALU, and clock cycles combine to execute code.",
        content: `<h2>How a CPU Actually Works</h2>
<p>At the lowest level, every program you write is translated into a series of binary instructions. The <strong>Central Processing Unit (CPU)</strong> is the engine that fetches, decodes, and executes these instructions.</p>
<h3>The Fetch-Decode-Execute Cycle</h3>
<ol>
  <li><strong>Fetch:</strong> The Control Unit gets the next instruction from RAM.</li>
  <li><strong>Decode:</strong> The instruction is broken down into an opcode (command) and operands (data).</li>
  <li><strong>Execute:</strong> The Arithmetic Logic Unit (ALU) performs the operation.</li>
</ol>
<p>Modern CPUs handle billions of these cycles per second (GHz), using <strong>pipelines</strong> to start the next instruction before the current one finishes.</p>`,
        quiz: [
          {
            question: "Which component of the CPU is responsible for performing mathematical and logical operations?",
            options: ["Control Unit", "Arithmetic Logic Unit (ALU)", "Registers", "Instruction Pointer"],
            correctIndex: 1,
            explanation: "The ALU is the calculator of the CPU, handling all binary math and logic gates."
          }
        ]
      },
      {
        id: "memory-hierarchy", title: "RAM, Cache & The Stack/Heap", duration: "25 min",
        description: "Understand why memory speed matters. From L1 cache hits to dynamic heap allocation.",
        content: `<h2>The Memory Hierarchy</h2>
<p>Not all memory is created equal. Developers must balance <strong>speed</strong> vs. <strong>capacity</strong>.</p>
<ul>
  <li><strong>Registers:</strong> Instant access, located inside the CPU core.</li>
  <li><strong>L1/L2/L3 Cache:</strong> Extremely fast, storing frequently used data.</li>
  <li><strong>RAM:</strong> Main memory, where active programs live.</li>
  <li><strong>SSD/HDD:</strong> High capacity, but thousands of times slower than RAM.</li>
</ul>
<h3>Stack vs. Heap</h3>
<p>The <strong>Stack</strong> is used for temporary, local variables with a fixed size (last-in, first-out). The <strong>Heap</strong> is for dynamic data that can grow or shrink, requiring manual or automated (Garbage Collection) management.</p>`
      },
      {
        id: "binary-boolean-logic", title: "Binary, Boolean Logic & Bitwise Operations", duration: "30 min",
        description: "Master how computers represent and manipulate data at the bit level. Truth tables, logic gates, and bitwise tricks for performance.",
        content: `<h2>Binary Representation</h2>
<p>At the hardware level, everything is binary — ones and zeros. A single <strong>bit</strong> represents a state (0 or 1), eight bits form a <strong>byte</strong>, and bytes combine into words, integers, and all higher data structures.</p>
<pre><code class="language-python"># Bitwise operations for flags
READ   = 0b001  # 1
WRITE  = 0b010  # 2
EXECUTE = 0b100 # 4
permissions = READ | WRITE  # 0b011 (3)
has_write = permissions & WRITE  # True
has_execute = permissions & EXECUTE  # False
print(f"Can write: {bool(has_write)}")  # Can write: True</code></pre>`,
        quiz: [
          {
            question: "What is the result of the bitwise AND operation between 0b110 and 0b011?",
            options: ["0b001", "0b010", "0b110", "0b111"],
            correctIndex: 1,
            explanation: "0b110 & 0b011 = 0b010 (2 in decimal) because only the second bit is set in both operands."
          }
        ]
      },
      {
        id: "compilers-interpreters", title: "How Compilers & Interpreters Work", duration: "35 min",
        description: "Build a mental model of the compilation pipeline — lexing, parsing, AST generation, and code emission.",
        content: `<h2>The Compilation Pipeline</h2>
<p>High-level code doesn't run directly on the CPU. It must be transformed through multiple stages: <strong>lexical analysis</strong>, <strong>parsing</strong>, <strong>semantic analysis</strong>, and <strong>code generation</strong>.</p>
<pre><code class="language-python"># A tiny expression evaluator (lexer + parser)
def evaluate(expr: str) -> float:
    tokens = expr.replace('(', ' ( ').replace(')', ' ) ').split()
    def parse():
        tok = tokens.pop(0)
        if tok == '(':
            op = tokens.pop(0)
            left, right = parse(), parse()
            tokens.pop(0)  # closing ')'
            if op == '+': return left + right
            if op == '*': return left * right
        return float(tok)
    return parse()
print(evaluate('(+ (* 3 4) 5)'))  # 17.0</code></pre>`
      }
    ]
  },
  {
    id: "networking-protocols", title: "Module 2 — Internet Protocols & HTTP",
    lessons: [
      {
        id: "tcp-ip-model", title: "The TCP/IP Model & Packet Switching", duration: "30 min",
        description: "How data travels across the world. Routing, DNS, and the reliable transport layer.",
        content: `<h2>The Backbone of the Internet</h2>
<p>The internet isn't a single entity; it's a massive network of interconnected computers communicating via the <strong>TCP/IP Protocol Suite</strong>.</p>
<h3>Packet Switching</h3>
<p>When you send a request, the data is broken into small <strong>packets</strong>. Each packet contains a destination IP address and can take a different physical path to reach the target, where it is reassembled.</p>
<p><strong>DNS (Domain Name System)</strong> acts as the phonebook, translating human-friendly names (google.com) into machine-readable IP addresses (142.250.190.46).</p>`
      },
      {
        id: "http-evolution", title: "HTTP/1.1 vs HTTP/2 vs HTTP/3", duration: "20 min",
        description: "The protocol of the web. Understanding headers, verbs, and the shift to QUIC and UDP.",
        content: `<h2>The Hypertext Transfer Protocol</h2>
<p>HTTP is the application-layer protocol we use to browse the web. It has evolved significantly to handle modern rich media.</p>
<ul>
  <li><strong>HTTP/1.1:</strong> Simple text-based requests; one request per connection (head-of-line blocking).</li>
  <li><strong>HTTP/2:</strong> Binary framing; multiplexing multiple requests over one connection.</li>
  <li><strong>HTTP/3:</strong> Built on QUIC (UDP) to eliminate packet loss delays in noisy networks.</li>
</ul>`
      },
      {
        id: "rest-apis-websockets", title: "REST APIs & WebSocket Protocol", duration: "35 min",
        description: "Build and consume RESTful APIs. Understand status codes, HATEOAS, and when WebSockets outperform HTTP polling.",
        content: `<h2>RESTful API Design</h2>
<p>REST (Representational State Transfer) is an architectural style that uses <strong>HTTP verbs</strong> to perform CRUD operations on <strong>resources</strong>. A well-designed API is intuitive, stateless, and uses proper status codes.</p>
<pre><code class="language-python"># Flask REST API example
from flask import Flask, jsonify, request
app = Flask(__name__)
tasks = [{'id': 1, 'title': 'Learn REST', 'done': False}]
@app.route('/api/tasks', methods=['GET'])
def list_tasks():
    return jsonify(tasks)
@app.route('/api/tasks', methods=['POST'])
def create_task():
    task = {'id': len(tasks)+1, 'title': request.json['title'], 'done': False}
    tasks.append(task)
    return jsonify(task), 201</code></pre>`,
        quiz: [
          {
            question: "Which HTTP status code should a REST API return when a new resource is created?",
            options: ["200 OK", "201 Created", "204 No Content", "301 Moved Permanently"],
            correctIndex: 1,
            explanation: "201 Created is the standard response for successful resource creation in RESTful APIs."
          }
        ]
      },
      {
        id: "tls-ssl-https", title: "TLS/SSL & HTTPS in Depth", duration: "25 min",
        description: "Understand how TLS handshake works, certificate chains, and why HTTPS is non-negotiable for modern web apps.",
        content: `<h2>Transport Layer Security</h2>
<p><strong>TLS</strong> (Transport Layer Security) encrypts data in transit between client and server. The handshake establishes a shared secret using asymmetric encryption, then switches to symmetric encryption for performance.</p>
<pre><code class="language-bash"># Inspecting TLS certificates with OpenSSL
echo | openssl s_client -connect github.com:443 -servername github.com 2>/dev/null | \
  openssl x509 -noout -text | grep -E "Subject:|Issuer:|Not Before|Not After"

# Testing HTTPS headers
curl -sI https://api.github.com | grep -i "strict-transport-security"</code></pre>`
      }
    ]
  },
  {
    id: "environment-tooling", title: "Module 3 — POSIX Terminal & Git DAGs",
    lessons: [
      {
        id: "terminal-magic", title: "POSIX Shell & Navigation", duration: "25 min",
        description: "Master the command line. Pipes, redirects, and a professional terminal workflow.",
        content: `<h2>Mastering the Terminal</h2>
<p>Professional engineering happens in the shell. While GUIs are comfortable, the terminal is <strong>scriptable, reproducible, and fast</strong>.</p>
<pre><code class="language-bash"># The Big 3 of Navigation
ls -la      # List all files with permissions
cd path/    # Change directory
pwd         # Print working directory

# Power User Tools
grep "error" server.log  # Search for text
cat file.txt | sort      # Piping output between tools
chmod +x script.sh       # Modify permissions</code></pre>`
      },
      {
        id: "git-internals", title: "Git Internals & Branching", duration: "35 min",
        description: "Git is not just for backup. Understand the Directed Acyclic Graph (DAG) and how blobs, trees, and commits work.",
        content: `<h2>Git: The Engine of Collaboration</h2>
<p>Git is a <strong>content-addressable filesystem</strong>. It doesn't store diffs; it stores snapshots of your entire project state.</p>
<h3>The DAG (Directed Acyclic Graph)</h3>
<p>Every commit points to its parent(s). This creates a graph. <strong>Branching</strong> is simply creating a new pointer to a specific commit. <strong>Merging</strong> is combining two paths of the graph back together.</p>
<p>Mastering <code>git rebase</code> and <code>git cherry-pick</code> allows you to rewrite history and maintain a clean project timeline.</p>`
      },
      {
        id: "shell-scripting-automation", title: "Shell Scripting & Task Automation", duration: "30 min",
        description: "Write production-grade shell scripts. Variables, conditionals, loops, and cron jobs for everyday automation.",
        content: `<h2>Shell Scripting</h2>
<p>Shell scripts automate repetitive tasks. A well-written script follows the <strong>Unix philosophy</strong> — do one thing well, read from stdin, write to stdout, and handle errors gracefully.</p>
<pre><code class="language-bash">#!/bin/bash
# Automated backup script with rotation
set -euo pipefail
BACKUP_DIR="/backups/$(date +%Y-%m-%d)"
mkdir -p "$BACKUP_DIR"
pg_dump mydb | gzip > "$BACKUP_DIR/db.sql.gz"
# Rotate: keep last 7 days
find /backups -type d -mtime +7 -exec rm -rf {} +
echo "Backup complete: $BACKUP_DIR"</code></pre>`,
        quiz: [
          {
            question: "What does 'set -euo pipefail' do in a shell script?",
            options: ["Enables debug mode", "Exits on errors, undefined variables, and pipe failures", "Sets environment variables", "Configures logging level"],
            correctIndex: 1,
            explanation: "set -e (exit on error), -u (treat unset variables as error), -o pipefail (fail if any command in a pipe fails)."
          }
        ]
      },
      {
        id: "advanced-git-workflows", title: "Advanced Git Workflows & CI/CD", duration: "40 min",
        description: "Master Git workflows for teams — GitFlow, trunk-based development, interactive rebase, and GitHub Actions CI/CD.",
        content: `<h2>Team Git Workflows</h2>
<p>Different teams use different branching strategies. <strong>Trunk-based development</strong> keeps a main branch with short-lived feature branches, while <strong>GitFlow</strong> uses dedicated develop, release, and hotfix branches for larger releases.</p>
<pre><code class="language-yaml"># GitHub Actions CI/CD pipeline
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm test
      - run: npm run build</code></pre>`
      }
    ]
  },
  {
    id: "security-fundamentals", title: "Module 4 — Security Fundamentals",
    lessons: [
      {
        id: "symmetric-asymmetric-encryption", title: "Symmetric & Asymmetric Encryption", duration: "30 min",
        description: "Master encryption fundamentals — AES, RSA, and hybrid cryptosystems. Understand key exchange and digital signatures.",
        content: `<h2>Encryption Models</h2>
<p><strong>Symmetric encryption</strong> (AES, ChaCha20) uses one shared key for both encryption and decryption — fast but requires secure key exchange. <strong>Asymmetric encryption</strong> (RSA, ECDSA) uses a public/private key pair — slower but enables secure key exchange.</p>
<pre><code class="language-python">from cryptography.fernet import Fernet
# Symmetric encryption with AES
key = Fernet.generate_key()
cipher = Fernet(key)
message = b"Secret data"
token = cipher.encrypt(message)
print(f"Encrypted: {token}")
decrypted = cipher.decrypt(token)
print(f"Decrypted: {decrypted.decode()}")</code></pre>`,
        quiz: [
          {
            question: "Which type of encryption uses the same key for both encryption and decryption?",
            options: ["Asymmetric encryption", "Symmetric encryption", "Hashing", "Digital signatures"],
            correctIndex: 1,
            explanation: "Symmetric encryption (like AES) uses a single shared key for both encrypting and decrypting data."
          }
        ]
      },
      {
        id: "password-hashing-salting", title: "Password Hashing & Salting", duration: "25 min",
        description: "Never store plaintext passwords. Implement bcrypt, Argon2, and understand rainbow table attacks.",
        content: `<h2>Secure Password Storage</h2>
<p>Storing passwords in plaintext is the #1 security sin. Use <strong>key derivation functions</strong> like bcrypt or Argon2 that are deliberately slow and include a unique <strong>salt</strong> per password to prevent rainbow table attacks.</p>
<pre><code class="language-python">import bcrypt
# Hashing a password with bcrypt
password = b"SuperSecret123!"
salt = bcrypt.gensalt(rounds=12)  # Cost factor
hashed = bcrypt.hashpw(password, salt)
print(f"Hash: {hashed.decode()}")
# Verification
assert bcrypt.checkpw(password, hashed)
print("Password verified securely")</code></pre>`
      },
      {
        id: "auth-protocols-jwt", title: "Authentication Protocols — OAuth & JWT", duration: "35 min",
        description: "Implement stateless authentication with JSON Web Tokens and understand the OAuth 2.0 authorization flow.",
        content: `<h2>Modern Authentication</h2>
<p><strong>JWT (JSON Web Tokens)</strong> enable stateless authentication — the server doesn't need to store session data. The token itself contains claims signed with a secret or private key.</p>
<pre><code class="language-python">import jwt
from datetime import datetime, timedelta
# Creating a JWT
payload = {
    'user_id': 42,
    'role': 'admin',
    'exp': datetime.utcnow() + timedelta(hours=1)
}
secret = 'your-secret-key'
token = jwt.encode(payload, secret, algorithm='HS256')
print(f"JWT: {token}")
# Verification
decoded = jwt.decode(token, secret, algorithms=['HS256'])
print(f"User: {decoded['user_id']}, Role: {decoded['role']}")</code></pre>`
      },
      {
        id: "network-security-basics", title: "Network Security & Firewalls", duration: "25 min",
        description: "Understand firewalls, VPNs, rate limiting, and common attack vectors like SQL injection and XSS.",
        content: `<h2>Defense in Depth</h2>
<p>Network security operates on the principle of <strong>defense in depth</strong> — multiple layers of protection so that if one fails, others still protect the system. Firewalls, WAFs, and rate limiters each serve a distinct role.</p>
<pre><code class="language-python"># Rate limiting with Redis
import redis, time
r = redis.Redis()
def rate_limit(user_id: str, max_requests: int = 100, window: int = 60) -> bool:
    key = f"rate_limit:{user_id}"
    current = r.get(key)
    if current and int(current) >= max_requests:
        return False  # Rate limited
    r.incr(key)
    r.expire(key, window, nx=True)  # Set expiry only on first increment
    return True
# Usage
if rate_limit("user_123"):
    print("Request allowed")
else:
    print("Rate limited — try again later")</code></pre>`
      }
    ]
  },
  {
    id: "career-next-steps", title: "Module 5 — Career & Next Steps",
    lessons: [
      {
        id: "building-portfolio", title: "Building Your Developer Portfolio", duration: "25 min",
        description: "Create a standout portfolio. Project selection, documentation, README writing, and deployment to showcase your skills.",
        content: `<h2>Your Engineering Portfolio</h2>
<p>A strong portfolio demonstrates <strong>technical depth</strong> and <strong>communication skills</strong>. Choose 3-5 projects that show progression from basic competency to advanced system design.</p>
<pre><code class="language-markdown"># Project: Real-Time Chat Application
## Architecture
- WebSocket server (Node.js) handling 10k concurrent connections
- Redis pub/sub for horizontal scaling across 3 instances
- PostgreSQL with connection pooling for message persistence
## Key Challenges Solved
- Implemented backpressure handling for flood protection
- Reduced message latency by 60% using connection pooling
- Zero-downtime deployment with rolling updates</code></pre>`
      },
      {
        id: "technical-interview-prep", title: "Technical Interview Preparation", duration: "40 min",
        description: "Master the interview process. Data structures, algorithms, system design, and behavioral frameworks.",
        content: `<h2>Interview Fundamentals</h2>
<p>Technical interviews typically cover three areas: <strong>algorithms</strong> (LeetCode-style), <strong>system design</strong> (architecting at scale), and <strong>behavioral</strong> (STAR method).</p>
<pre><code class="language-python"># Common interview problem: Two Sum
def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
# O(n) time, O(n) space — hash map approach
print(two_sum([2, 7, 11, 15], 9))  # [0, 1]</code></pre>`,
        quiz: [
          {
            question: "What is the time complexity of the two-sum solution using a hash map?",
            options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"],
            correctIndex: 2,
            explanation: "The hash map approach processes each element once with O(1) lookups, giving O(n) overall time complexity."
          }
        ]
      },
      {
        id: "open-source-contribution", title: "Open Source Contribution Strategy", duration: "30 min",
        description: "Learn how to contribute to open source effectively — finding issues, writing good PRs, and building your network.",
        content: `<h2>Contributing to Open Source</h2>
<p>Open source contributions are the best way to build real-world experience and a professional network. Start with <strong>documentation</strong> and <strong>bug fixes</strong>, then work up to feature implementations.</p>
<pre><code class="language-bash"># Effective open source workflow
# 1. Find a project and read CONTRIBUTING.md
# 2. Fork and clone
git clone https://github.com/YOUR_USER/project.git
cd project
# 3. Create a feature branch
git checkout -b fix/typo-in-readme
# 4. Make changes and commit with conventional commit message
git commit -m "docs(readme): fix typo in installation section"
# 5. Push and create PR
git push origin fix/typo-in-readme
gh pr create --title "docs: fix typo in README" --body "Fixed a small typo in step 3"</code></pre>`
      },
      {
        id: "learning-roadmap", title: "Continuous Learning Roadmap", duration: "20 min",
        description: "Plan your engineering growth. Specialization paths, certification roadmaps, and staying current with industry trends.",
        content: `<h2>Your Learning Journey</h2>
<p>Technology changes fast, but <strong>fundamentals endure</strong>. Build a T-shaped skill set — deep expertise in one area (your specialty) with broad knowledge across adjacent domains.</p>
<pre><code class="language-python"># Personal learning tracker
skills = {
    "core": ["Data Structures", "Algorithms", "System Design", "Networking"],
    "specialization": "Full-Stack Web Engineering",
    "roadmap": [
        {"quarter": "Q1", "focus": "Next.js & React 19", "project": "E-commerce platform"},
        {"quarter": "Q2", "focus": "Distributed Systems", "project": "Real-time chat app"},
        {"quarter": "Q3", "focus": "Cloud & DevOps", "project": "Kubernetes deployment"},
        {"quarter": "Q4", "focus": "Performance", "project": "Production monitoring stack"},
    ]
}</code></pre>`
      }
    ]
  }
]

export default function FoundationsPage() {
  return (
    <div className="bg-background text-foreground font-sans">
      <Navbar />
      <LessonPlayer
        title="Computing Foundations"
        description="The 'Minus Zero' onboarding. Bridge the gap from absolute beginner to production-ready developer with core computer science concepts."
        category="Foundations"
        accentColor="oklch(0.60 0.15 250)"
        modules={foundationModules}
        instructor="OpenSyntax Academy"
        rating={5.0}
        reviewCount={450}
        lastUpdated="Mar 2026"
      />
    </div>
  )
}
