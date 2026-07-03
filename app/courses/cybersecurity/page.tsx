import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { LessonPlayer, type Module } from "@/components/lesson-player"

export const metadata: Metadata = {
  title: "Cybersecurity Fundamentals — Learn Ethical Hacking",
  description: "Master production-grade cybersecurity from an attacker's perspective. Build expertise in network reconnaissance, OWASP mitigation, JWT security, Zero Trust architecture, WAF deployment, IDS/IPS, cloud hardening on AWS, and DevSecOps CI/CD pipelines.",
  keywords: ["Cybersecurity Course", "Ethical Hacking", "OWASP Top 10", "Web Security", "XSS", "SQL Injection", "Zero Trust", "Cloud Security", "Network Security", "AWS IAM", "WAF"],
}

const cybersecurityModules: Module[] = [
  {
    id: "security-tier-1", title: "Tier 1: Foundations — Network & Protocol Security",
    lessons: [
      {
        id: "http-ssl", title: "HTTP/S, SSL & TLS Internals", duration: "35 min",
        description: "Securing the transport layer. Understanding handshakes, certificates, and encryption at rest vs. transit.",
        content: `<h2>The Secure Transport</h2>
<p>Security starts at the transport layer. <strong>HTTPS</strong> adds a layer of encryption (TLS) over HTTP, ensuring that data cannot be sniffed by man-in-the-middle attacks.</p>
<h3>Certificates & CAs</h3>
<p>We trust websites because of <strong>Certificate Authorities (CAs)</strong>. A certificate proves that the server you are talking to is indeed who they claim to be, using asymmetric cryptography.</p>`
      },
      {
        id: "port-scanning-nmap", title: "Port Scanning & Reconnaissance with Nmap", duration: "30 min",
        description: "Master network reconnaissance techniques. Learn to map attack surfaces using SYN scans, service detection, and OS fingerprinting with Nmap.",
        content: `<h2>Network Reconnaissance</h2>
<p>Before exploiting a target, you must understand what's running. <strong>Nmap</strong> is the industry-standard tool for port scanning, service discovery, and operating system fingerprinting.</p>
<h3>Scan Types</h3>
<p>A <strong>SYN scan (-sS)</strong> sends a TCP SYN packet. If the port is open, the target responds with SYN-ACK; if closed, with RST. This is the default and fastest scan because it never completes the TCP handshake.</p>
<pre><code class="language-bash"># Basic SYN scan of common ports
nmap -sS -p 1-10000 target.com

# Service version detection
nmap -sV -p 80,443,22 target.com

# OS fingerprinting (requires root)
sudo nmap -O target.com

# Aggressive scan with all features
nmap -A -T4 target.com</code></pre>
<h3>Defending Against Recon</h3>
<p>Production servers should <strong>not</strong> respond to ICMP (ping) from the Internet. Use <strong>iptables</strong> to drop inbound pings and rate-limit connection attempts via <strong>fail2ban</strong>.</p>`
      },
      {
        id: "firewall-iptables", title: "Firewall Rules & Packet Filtering", duration: "40 min",
        description: "Build hardened network perimeters with iptables, nftables, and stateful packet inspection for production-grade traffic filtering.",
        content: `<h2>Packet Filtering Fundamentals</h2>
<p>A <strong>firewall</strong> is a network security device that monitors and controls incoming and outgoing network traffic based on predetermined security rules. The Linux kernel's <strong>netfilter</strong> framework powers iptables and its successor nftables.</p>
<h3>Iptables Chains</h3>
<p>Traffic flows through three built-in chains: <strong>INPUT</strong> (incoming to local process), <strong>OUTPUT</strong> (outgoing from local process), and <strong>FORWARD</strong> (traffic routed through the machine).</p>
<pre><code class="language-bash"># Default deny-all policy
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Allow established connections
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Allow SSH from management subnet only
iptables -A INPUT -p tcp --dport 22 -s 10.0.0.0/8 -j ACCEPT

# Allow HTTP/HTTPS from anywhere
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Rate limit connection attempts (anti-brute-force)
iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --set
iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --update --seconds 60 --hitcount 4 -j DROP</code></pre>
<h3>Stateful vs Stateless</h3>
<p><strong>Stateful firewalls</strong> track the state of active connections. When you allow inbound traffic for an established connection, the return traffic is automatically allowed — even if no explicit rule exists.</p>`
      }
    ]
  },
  {
    id: "security-tier-2", title: "Tier 2: Intermediate — Application Security (OWASP)",
    lessons: [
      {
        id: "owasp-top-10", title: "OWASP Top 10: XSS, SQLi & Broken Auth", duration: "50 min",
        description: "Deconstructing the most common web vulnerabilities and how to mitigate them at the source code level.",
        content: `<h2>Common Attack Vectors</h2>
<p>The <strong>OWASP Top 10</strong> is the definitive list of web security risks. We focus on <strong>Injection (SQLi)</strong> and <strong>Cross-Site Scripting (XSS)</strong>.</p>
<h3>Secure Authentication</h3>
<p>Stop rolling your own auth. We use <strong>OAuth 2.0</strong> and <strong>OIDC</strong> to delegate identity to trusted providers, and use <strong>JWTs</strong> with asymmetric signing (RS256) for secure, stateless sessions.</p>`
      },
      {
        id: "csrf-session-security", title: "CSRF & Session Hijacking Prevention", duration: "35 min",
        description: "Defend against cross-site request forgery, session fixation, and cookie theft with SameSite flags and anti-CSRF token patterns.",
        content: `<h2>Cross-Site Request Forgery</h2>
<p><strong>CSRF</strong> tricks an authenticated user into executing unintended actions. An attacker crafts a malicious page that submits a form to your bank's transfer endpoint — and because the victim's browser automatically includes cookies, the request appears legitimate.</p>
<h3>Anti-CSRF Tokens</h3>
<p>The standard defense: embed a cryptographically random token in every form. The server validates it on submission. The attacker's page cannot read this token due to <strong>same-origin policy</strong>.</p>
<pre><code class="language-typescript">// Next.js API route with CSRF protection
import { generateCSRFToken, validateCSRFToken } from '@/lib/csrf';

export async function POST(request: Request) {
  const formData = await request.formData();
  const token = formData.get('csrf_token') as string;

  if (!validateCSRFToken(token)) {
    return Response.json(
      { error: 'Invalid CSRF token' },
      { status: 403 }
    );
  }

  await transferFunds(formData.get('amount'));
  return Response.json({ success: true });
}</code></pre>
<h3>SameSite Cookies</h3>
<p>Modern browsers support the <strong>SameSite</strong> cookie attribute. Setting <code>SameSite=Strict</code> prevents the cookie from being sent on cross-site requests entirely — defeating CSRF without tokens.</p>
<pre><code class="language-http">Set-Cookie: session_id=abc123; SameSite=Strict; HttpOnly; Secure</code></pre>`
      },
      {
        id: "jwt-oauth-security", title: "JWT Security & OAuth 2.0 Flows", duration: "45 min",
        description: "Implement production-grade authentication with RS256-signed JWTs, refresh token rotation, and OAuth 2.0 authorization code flow with PKCE.",
        content: `<h2>JWT: The Stateless Session</h2>
<p><strong>JSON Web Tokens (JWTs)</strong> encode user identity and claims in a self-contained, cryptographically signed token. Unlike session IDs stored in a database, JWTs are stateless — the server can verify them without any storage lookup.</p>
<h3>Signing Algorithms</h3>
<p>Never use <code>HS256</code> (symmetric) in production — anyone with the public key cannot verify. Always use <code>RS256</code> (asymmetric RSA) so services verify with a public key while only the issuer holds the private signing key.</p>
<pre><code class="language-typescript">import jwt from 'jsonwebtoken';

function signAccessToken(userId: string): string {
  return jwt.sign(
    { sub: userId, role: 'user', iat: Math.floor(Date.now() / 1000) },
    process.env.JWT_PRIVATE_KEY!,
    { algorithm: 'RS256', expiresIn: '15m' }
  );
}

function verifyToken(token: string): jwt.JwtPayload {
  return jwt.verify(token, process.env.JWT_PUBLIC_KEY!, {
    algorithms: ['RS256']
  }) as jwt.JwtPayload;
}</code></pre>
<h3>Refresh Token Rotation</h3>
<p>Access tokens are short-lived (15 min). <strong>Refresh tokens</strong> live longer but must be rotated: every time a refresh token is used, issue a new one and invalidate the old. If a stolen refresh token is used after you've already rotated it, the attacker is immediately detected.</p>`,
        quiz: [
          {
            question: "Why should you use RS256 instead of HS256 for signing JWTs in a microservices architecture?",
            options: ["RS256 tokens are smaller", "HS256 requires sharing a secret key across all services", "RS256 is faster to verify", "HS256 is deprecated"],
            correctIndex: 1,
            explanation: "HS256 is symmetric — the same secret signs and verifies. Every service would need the secret, widening the attack surface. RS256 uses a private key to sign and public keys to verify, so only the issuer holds the secret."
          },
          {
            question: "What is the primary purpose of PKCE in OAuth 2.0?",
            options: ["Encrypting the access token", "Preventing authorization code interception attacks", "Speeding up the token exchange", "Eliminating the need for client secrets in mobile apps"],
            correctIndex: 3,
            explanation: "PKCE (Proof Key for Code Exchange) was designed for public clients that cannot securely store a client secret. It uses a cryptographic challenge to prevent intercepted authorization codes from being exchanged for tokens."
          }
        ]
      }
    ]
  },
  {
    id: "security-tier-3", title: "Tier 3: Production — Advanced Defense & Zero Trust",
    lessons: [
      {
        id: "zero-trust-mtls", title: "Zero Trust Architecture & mTLS", duration: "60 min",
        description: "Securing microservices in a post-perimeter world. Implementing mutual TLS (mTLS) and DevSecOps pipelines.",
        content: `<h2>The Zero Trust Mindset</h2>
<p>In a <strong>Zero Trust</strong> world, we assume the network is already breached. No service or user is 'trusted' just because they are on the internal network.</p>
<h3>mTLS & Service Mesh</h3>
<p>We use <strong>mutual TLS (mTLS)</strong> to ensure that every service-to-service communication is encrypted and authenticated at <em>both</em> ends. This drastically shrinks the blast radius of a single compromised container.</p>
<p><strong>Defense Tip:</strong> Implement <strong>Content Security Policy (CSP)</strong> headers to prevent any untrusted scripts from running in your users' browsers, creating a final fallback layer of defense.</p>`
      },
      {
        id: "security-headers-csp", title: "Security Headers & Content Security Policy", duration: "30 min",
        description: "Harden your web application with CSP, HSTS, X-Frame-Options, and other HTTP security headers that block entire classes of attacks at the browser level.",
        content: `<h2>HTTP Security Headers</h2>
<p>Security headers are your application's last line of defense. Even if your code has zero vulnerabilities, missing headers can expose users to attacks. <strong>CSP</strong> is the single most impactful header you can add.</p>
<h3>Content Security Policy</h3>
<p>CSP allows you to define a whitelist of sources that the browser is allowed to load scripts, styles, fonts, and images from. This completely prevents XSS and data injection attacks — even if an attacker injects a <code>&lt;script&gt;</code> tag, the browser refuses to execute it.</p>
<pre><code class="language-typescript">export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'nonce-\${generateNonce()}' https://analytics.example.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' https: data:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  );

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');

  return response;
}</code></pre>
<h3>HSTS & Preload</h3>
<p><strong>HTTP Strict Transport Security (HSTS)</strong> tells browsers to always connect via HTTPS. Once a browser sees this header, it will refuse plain HTTP connections to your domain, preventing SSL-stripping attacks.</p>
<pre><code class="language-http">Strict-Transport-Security: max-age=63072000; includeSubDomains; preload</code></pre>`
      },
      {
        id: "devsecops-sast", title: "DevSecOps: SAST, DAST & CI/CD Security Gates", duration: "45 min",
        description: "Integrate security scanning into your pipeline. Automate vulnerability detection with SAST, DAST, dependency scanning, and container image analysis in CI/CD.",
        content: `<h2>Shifting Security Left</h2>
<p><strong>DevSecOps</strong> means integrating security into every stage of the development lifecycle — not bolting it on at the end. We use automated tools in CI/CD to catch vulnerabilities before they reach production.</p>
<h3>SAST vs DAST</h3>
<p><strong>Static Application Security Testing (SAST)</strong> analyzes source code for vulnerabilities without executing it. Tools like <strong>Semgrep</strong> and <strong>SonarQube</strong> find SQL injection, XSS, and hardcoded secrets in your pull requests.</p>
<pre><code class="language-yaml">name: DevSecOps Pipeline
on: [pull_request]

jobs:
  sast:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Semgrep SAST Scan
        uses: semgrep/semgrep-action@v1
        with:
          config: p/owasp-top-ten
      - name: Dependency Vulnerability Check
        run: npm audit --audit-level=high
  dast:
    needs: sast
    runs-on: ubuntu-latest
    steps:
      - name: OWASP ZAP DAST Scan
        uses: zaproxy/action-full-scan@v0.12.0
        with:
          target: https://preview-\${{ github.event.number }}.example.com</code></pre>
<h3>Container Security</h3>
<p>Scan all container images for known CVEs using <strong>Trivy</strong> or <strong>Grype</strong>. Never run containers as root. Use <strong>distroless</strong> base images to minimize the attack surface.</p>
<pre><code class="language-dockerfile">FROM gcr.io/distroless/nodejs20-debian12:latest AS runtime
USER nonroot
COPY --from=build /app/dist /app
EXPOSE 3000
CMD ["/app/server.js"]</code></pre>`,
        quiz: [
          {
            question: "What is the difference between SAST and DAST?",
            options: ["SAST tests running applications, DAST tests source code", "SAST analyzes source code without execution, DAST tests running applications", "They are the same thing", "SAST is for web apps, DAST is for mobile apps"],
            correctIndex: 1,
            explanation: "SAST (Static Analysis) scans source code at rest — finding vulnerabilities before compilation. DAST (Dynamic Analysis) attacks a running application to find runtime vulnerabilities like authentication bypasses."
          }
        ]
      }
    ]
  },
  {
    id: "network-security", title: "Module 4: Network Security — Perimeter & Internal Defense",
    lessons: [
      {
        id: "waf-modsecurity", title: "Web Application Firewalls & ModSecurity", duration: "40 min",
        description: "Build a virtual patch layer with WAF rules using ModSecurity and OWASP CRS to block SQLi, XSS, and RFI attacks at the edge before they reach your application.",
        content: `<h2>Web Application Firewalls</h2>
<p>A <strong>Web Application Firewall (WAF)</strong> sits in front of your application and inspects every HTTP request for malicious payloads. Unlike a network firewall that filters by IP/port, a WAF understands HTTP semantics and can detect SQL injection, XSS, and path traversal attempts.</p>
<h3>ModSecurity & OWASP CRS</h3>
<p><strong>ModSecurity</strong> is the industry-standard open-source WAF engine. Paired with the <strong>OWASP Core Rule Set (CRS)</strong>, it blocks thousands of attack patterns out of the box.</p>
<pre><code class="language-apache"># ModSecurity Rule: Block SQL Injection attempts
SecRule REQUEST_COOKIES|!REQUEST_COOKIES:/__utm/|REQUEST_COOKIES_NAMES|ARGS_NAMES|ARGS|XML:/* \
  "@detectSQLi" \
  "id:942100,\
   phase:2,\
   block,\
   capture,\
   t:urlDecodeUni,\
   msg:'SQL Injection Attack Detected',\
   tag:'attack-sqli',\
   ver:'OWASP_CRS/4.0',\
   severity:'CRITICAL'"

# Custom rule: Block requests with suspicious User-Agent
SecRule REQUEST_HEADERS:User-Agent "@pmf sqlmap nikto gobuster" \
  "id:100001,\
   phase:1,\
   deny,\
   status:403,\
   msg:'Blocked automated attack tool'"</code></pre>
<h3>WAF Deployment Strategies</h3>
<p>Deploy WAF at the <strong>edge</strong> (Cloudflare, AWS WAF, Fastly) before traffic reaches your origin. For on-premise deployments, run ModSecurity in <strong>reverse proxy mode</strong> with NGINX. Start in <strong>Detection-Only</strong> mode to tune rules before enforcing them.</p>`
      },
      {
        id: "ids-ips-snort", title: "Intrusion Detection & Prevention with Snort/Suricata", duration: "45 min",
        description: "Deploy network-based IDS/IPS using Snort and Suricata. Create custom signatures, analyze PCAPs, and automate threat response against known CVEs.",
        content: `<h2>Network Intrusion Detection</h2>
<p><strong>Intrusion Detection Systems (IDS)</strong> monitor network traffic for suspicious signatures and anomalies. <strong>Intrusion Prevention Systems (IPS)</strong> go further — they actively block malicious traffic in real-time. <strong>Snort</strong> and <strong>Suricata</strong> are the dominant open-source solutions.</p>
<h3>Signature-Based Detection</h3>
<p>Rules define patterns of known attacks. When a packet matches a rule, the engine generates an alert (IDS) or drops the packet (IPS).</p>
<pre><code class="language-bash"># Suricata rule: Detect EternalBlue (MS17-010) exploit
alert tcp $EXTERNAL_NET any -> $HOME_NET 445 \
  (msg:"ET EXPLOIT Possible EternalBlue MS17-010 Exploit Attempt"; \
   flow:to_server,established; \
   content:"|00 00 00 31 ff 53 4d 42|"; \
   content:"|50 00|"; distance:2; within:2; \
   reference:cve,2017-0144; \
   classtype:attempted-admin; \
   sid:2024211; rev:4;)

# Run Suricata in IPS mode
sudo suricata -c /etc/suricata/suricata.yaml \
  --af-packet \
  -i eth0</code></pre>
<h3>Anomaly Detection</h3>
<p>Beyond signatures, modern IDS uses behavioral analysis to detect <strong>anomalies</strong>. Sudden spikes in DNS queries, data exfiltration via DNS tunneling, or unusual outbound connections to known-bad IPs trigger alerts. Feed these into a <strong>SIEM</strong> (like Wazuh or Splunk) for correlation and incident response.</p>`
      },
      {
        id: "zero-trust-network", title: "Zero Trust Network Access (ZTNA)", duration: "50 min",
        description: "Replace VPNs with ZTNA. Implement device identity verification, microsegmentation, and just-in-time access with BeyondCorp-style architecture.",
        content: `<h2>Beyond Traditional Perimeters</h2>
<p>In a Zero Trust model, there is no 'trusted internal network.' Every access request — regardless of origin — must be authenticated, authorized, and encrypted. <strong>ZTNA</strong> (Zero Trust Network Access) implements this by treating every user, device, and application as untrusted until proven otherwise.</p>
<h3>Microsegmentation</h3>
<p>Instead of a flat network where any service can reach any other service, <strong>microsegmentation</strong> divides the network into isolated zones with strict access controls between them. Even if an attacker compromises a web server, they cannot reach the database server directly.</p>
<pre><code class="language-hcl">resource "aws_security_group" "app_tier" {
  name        = "app-tier"
  description = "Allow traffic only from ALB"
  vpc_id      = aws_vpc.main.id
}

resource "aws_security_group" "db_tier" {
  name        = "db-tier"
  description = "Allow traffic only from app tier"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "PostgreSQL from app tier"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app_tier.id]
  }
}</code></pre>
<h3>Just-In-Time Access</h3>
<p>Don't grant standing access. Integrate with Okta/Azure AD to generate ephemeral credentials that expire after each session. Tools like <strong>Teleport</strong> and <strong>Tailscale</strong> provide JIT SSH and database access with full audit trails.</p>`
      },
      {
        id: "vpn-wireguard", title: "VPNs & Secure Tunneling with WireGuard", duration: "35 min",
        description: "Build high-performance encrypted tunnels. Compare WireGuard vs IPsec vs OpenVPN, and deploy a site-to-site VPN with modern cryptographic protocols.",
        content: `<h2>Modern VPN Protocols</h2>
<p><strong>WireGuard</strong> is the newest and most secure VPN protocol. Unlike IPsec (complex, bloated) and OpenVPN (slow due to userspace processing), WireGuard is a mere 4,000 lines of kernel code — making it auditable, fast, and secure by default.</p>
<h3>WireGuard Configuration</h3>
<p>WireGuard uses a simple <strong>peer-to-peer</strong> model. Each peer has a private key and shares its public key with authorized peers. Traffic is encrypted with the <strong>Noise protocol</strong> using Curve25519, ChaCha20, and Poly1305.</p>
<pre><code class="language-ini"># /etc/wireguard/wg0.conf — Server configuration
[Interface]
Address = 10.0.0.1/24
PrivateKey = [SERVER_PRIVATE_KEY]
ListenPort = 51820

# Client 1 — Laptop
[Peer]
PublicKey = [CLIENT1_PUBLIC_KEY]
AllowedIPs = 10.0.0.2/32</code></pre>
<pre><code class="language-bash"># Start WireGuard interface
sudo wg-quick up wg0

# Show connection status
sudo wg show</code></pre>
<h3>When Not to Use a VPN</h3>
<p>For cloud-native applications, avoid VPNs entirely. Use <strong>Cloudflare Access</strong> or <strong>AWS PrivateLink</strong> — they provide zero-trust access without the complexity of routing all traffic through a VPN concentrator.</p>`,
        quiz: [
          {
            question: "What is the primary advantage of WireGuard over OpenVPN?",
            options: ["WireGuard supports more encryption algorithms", "WireGuard has a smaller codebase (~4,000 lines) making it auditable and faster", "WireGuard is only available on Linux", "WireGuard uses TCP for reliable transport"],
            correctIndex: 1,
            explanation: "WireGuard's ~4,000 lines of kernel code vs OpenVPN's ~600,000 lines means a dramatically smaller attack surface, better performance (kernel-level processing), and an auditable codebase."
          }
        ]
      }
    ]
  },
  {
    id: "cloud-security", title: "Module 5: Cloud Security — AWS & GCP Hardening",
    lessons: [
      {
        id: "aws-iam", title: "AWS IAM Policies & Least Privilege", duration: "45 min",
        description: "Master AWS Identity and Access Management. Write fine-grained policies with condition keys, set up permission boundaries, and enforce least privilege at scale across your organization.",
        content: `<h2>Identity & Access Management</h2>
<p><strong>AWS IAM</strong> is the gatekeeper of all AWS resources. A misconfigured IAM policy is the #1 cause of cloud breaches. We'll learn to write <strong>least-privilege</strong> policies using condition keys, permission boundaries, and service control policies (SCPs).</p>
<h3>Policy Evaluation Logic</h3>
<p>AWS evaluates every request against all applicable policies. The default is <strong>implicit deny</strong> — if no policy explicitly allows an action, it is denied. An <strong>explicit deny</strong> always overrides any allow.</p>
<pre><code class="language-json">{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::production-assets",
        "arn:aws:s3:::production-assets/*"
      ],
      "Condition": {
        "IpAddress": { "aws:SourceIp": "203.0.113.0/24" },
        "Bool": { "aws:SecureTransport": "true" }
      }
    }
  ]
}</code></pre>
<h3>Permission Boundaries</h3>
<p>Use <strong>permission boundaries</strong> to set the maximum permissions a user or role can have. Even if a developer attaches <code>AdministratorAccess</code> to their role, the boundary prevents privilege escalation beyond what you define.</p>
<pre><code class="language-typescript">import * as iam from 'aws-cdk-lib/aws-iam';

new iam.Role(this, 'DeveloperRole', {
  assumedBy: new iam.AccountPrincipal(this.account),
  managedPolicies: [
    iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')
  ],
  permissionsBoundary: new iam.ManagedPolicy(this, 'DevBoundary', {
    statements: [
      new iam.PolicyStatement({
        effect: iam.Effect.DENY,
        actions: ['iam:*', 'organizations:*'],
        resources: ['*']
      })
    ]
  })
});</code></pre>`
      },
      {
        id: "s3-hardening", title: "S3 Bucket Hardening & Data Protection", duration: "40 min",
        description: "Secure S3 buckets against data leaks and ransomware. Implement block public access, bucket policies, server-side encryption, versioning, and Object Lock for immutable backups.",
        content: `<h2>S3: The Most Exploited Cloud Service</h2>
<p>Misconfigured S3 buckets have caused some of the largest data breaches in history (Accenture, Verizon, US Army). The default is now <strong>block all public access</strong>, but misconfigurations in bucket policies and ACLs still leak terabytes of data daily.</p>
<h3>Defense in Depth for S3</h3>
<p>Layer your defenses: block public access at the account level, enforce encryption at rest (SSE-KMS or SSE-S3), enable versioning, and use S3 Object Lock for immutable write-once-read-many (WORM) storage.</p>
<pre><code class="language-typescript">import * as s3 from 'aws-cdk-lib/aws-s3';
import * as kms from 'aws-cdk-lib/aws-kms';

new s3.Bucket(this, 'ProductionData', {
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
  encryption: s3.BucketEncryption.KMS,
  encryptionKey: new kms.Key(this, 'BucketKey'),
  versioned: true,
  enforceSSL: true,
  objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
  removalPolicy: cdk.RemovalPolicy.RETAIN,
  lifecycleRules: [
    {
      transitions: [
        { storageClass: s3.StorageClass.INFREQUENT_ACCESS, transitionAfter: cdk.Duration.days(30) },
        { storageClass: s3.StorageClass.GLACIER, transitionAfter: cdk.Duration.days(90) }
      ]
    }
  ]
});</code></pre>`
      },
      {
        id: "kms-encryption", title: "KMS & Encryption Key Management", duration: "35 min",
        description: "Manage cryptographic keys across AWS services. Implement envelope encryption, automatic key rotation, and restrict key usage with resource policies.",
        content: `<h2>AWS Key Management Service</h2>
<p><strong>AWS KMS</strong> is a managed service for creating and controlling encryption keys used across AWS services. It uses <strong>Hardware Security Modules (HSMs)</strong> to protect your keys, and integrates with every AWS service for transparent encryption.</p>
<h3>Envelope Encryption</h3>
<p>KMS never encrypts your data directly (it has a 1 KB limit). Instead, it encrypts <strong>Data Keys</strong> and you use those to encrypt your data. This pattern is called <strong>envelope encryption</strong> and enables scalable, performant encryption.</p>
<pre><code class="language-typescript">import { KMSClient, GenerateDataKeyCommand, DecryptCommand } from '@aws-sdk/client-kms';

const client = new KMSClient({ region: 'us-east-1' });

async function encryptFile(buffer: Buffer, keyId: string): Promise<Buffer> {
  const { CiphertextBlob, Plaintext } = await client.send(
    new GenerateDataKeyCommand({ KeyId: keyId, KeySpec: 'AES_256' })
  );

  const encrypted = await symmetricEncrypt(buffer, Plaintext!);
  return Buffer.concat([CiphertextBlob!, encrypted]);
}

async function decryptFile(encrypted: Buffer, keyId: string): Promise<Buffer> {
  const encryptedKey = encrypted.subarray(0, 200);
  const encryptedData = encrypted.subarray(200);

  const { Plaintext } = await client.send(
    new DecryptCommand({ CiphertextBlob: encryptedKey, KeyId: keyId })
  );

  return symmetricDecrypt(encryptedData, Plaintext!);
}</code></pre>
<h3>Key Policies vs IAM Policies</h3>
<p>KMS has a separate authorization system. Even if an IAM policy allows <code>kms:Decrypt</code>, the key's <strong>resource policy</strong> must also grant access. This defense-in-depth prevents accidental key exposure.</p>`,
        quiz: [
          {
            question: "What is the primary purpose of AWS KMS's envelope encryption pattern?",
            options: ["To reduce the cost of encryption", "To encrypt data larger than 1 KB with scalable performance", "To avoid using IAM policies for encryption", "To make encryption slower and more secure"],
            correctIndex: 1,
            explanation: "KMS has a 1 KB limit per API call. Envelope encryption generates a local data key to encrypt arbitrarily large data, while only the data key is encrypted by KMS — enabling scalable, high-throughput encryption."
          }
        ]
      },
      {
        id: "security-groups-vpc", title: "Security Groups, NACLs & VPC Design", duration: "40 min",
        description: "Design a secure AWS VPC architecture with public/private subnets, NAT gateways, security groups, and network ACLs for defense-in-depth networking.",
        content: `<h2>VPC: Your Virtual Data Center</h2>
<p>Every AWS resource lives inside a <strong>Virtual Private Cloud (VPC)</strong>. A well-architected VPC segments traffic into tiers — public subnets for load balancers, private subnets for application servers, and isolated subnets for databases.</p>
<h3>Security Groups vs NACLs</h3>
<p><strong>Security Groups</strong> are stateful firewalls at the instance level. If you allow inbound on port 443, outbound response traffic is automatically allowed. <strong>Network ACLs (NACLs)</strong> are stateless firewalls at the subnet level — you must explicitly define both inbound and outbound rules.</p>
<pre><code class="language-hcl">resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = { Name = "production-vpc" }
}

resource "aws_subnet" "public" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.1.0/24"
  map_public_ip_on_launch = true
}

resource "aws_subnet" "private" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.10.0/24"
  map_public_ip_on_launch = false
}

resource "aws_security_group" "app" {
  vpc_id = aws_vpc.main.id
  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}</code></pre>
<p>This three-tier architecture ensures that even if the application server is compromised, the attacker cannot directly access the database — there's simply no network path.</p>`
      }
    ]
  }
]

export default function CybersecurityPage() {
  return (
    <div className="bg-background text-foreground font-sans">
      <Navbar />
      <LessonPlayer
        title="Cybersecurity Fundamentals"
        description="Think like an attacker to defend like an expert. From network protocol security and OWASP mitigation to advanced Zero Trust architectures and mTLS."
        category="Security"
        accentColor="#FF4D4D"
        modules={cybersecurityModules}
        instructor="Tanya Janca"
        rating={4.8}
        reviewCount={890}
        lastUpdated="Mar 2026"
      />
    </div>
  )
}
