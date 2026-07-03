import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { LessonPlayer, type Module } from "@/components/lesson-player"

export const metadata: Metadata = {
  title: "DevOps & Cloud Engineering — Docker, Kubernetes & Terraform",
  description: "Design and operate production-grade infrastructure with Docker multi-stage builds, Kubernetes rolling deployments, Terraform IaC, GitHub Actions CI/CD, Prometheus observability, custom Kubernetes operators, and incident response runbooks.",
  keywords: ["DevOps Course", "Kubernetes Tutorial", "Docker Course", "Terraform", "CI/CD Pipeline", "Cloud Infrastructure", "Istio", "Observability", "SRE"],
}

const devopsModules: Module[] = [
  {
    id: "devops-tier-1", title: "Tier 1: Foundations — Systems & Shell",
    lessons: [
      {
        id: "linux-bash", title: "Linux Internals & Bash Scripting", duration: "35 min",
        description: "Master the root of the cloud. Processes, signals, and automating infrastructure with shell scripts.",
        content: `<h2>The Linux Root</h2>
<p>Cloud engineering is just Linux engineering at scale. You must understand <strong>Processes (PID)</strong>, <strong>Signals (SIGTERM/SIGKILL)</strong>, and the <strong>Filesystem Hierarchy</strong>.</p>
<h3>Bash Automation</h3>
<p>Professional DevOps involves automating repetitive tasks. We use <strong>Bash</strong> to glue together CLI tools, handling exit codes and environment variables for reliable execution.</p>
<pre><code class="language-bash">#!/bin/bash
set -euo pipefail

DEPLOY_DIR="/opt/myapp"
BACKUP_DIR="/tmp/backups"

echo "Deploying to $DEPLOY_DIR"
cp -r "$DEPLOY_DIR" "$BACKUP_DIR/$(date +%Y%m%d_%H%M%S)"
systemctl restart myapp
echo "Deployment complete"</code></pre>`
      },
      {
        id: "networking-fundamentals", title: "Networking Fundamentals & SSH", duration: "30 min",
        description: "Build a deep understanding of TCP/IP, DNS resolution, and secure remote access patterns used in cloud infrastructure.",
        content: `<h2>Networking for DevOps</h2>
<p>Every cloud service depends on reliable networking. Master <strong>TCP/IP</strong>, <strong>DNS resolution</strong>, and <strong>HTTP/HTTPS</strong> — the protocols that underpin all infrastructure communication.</p>
<pre><code class="language-bash"># Trace route to diagnose latency
traceroute api.example.com
# Check open ports with ss
ss -tlnp | grep ':443'
# DNS resolution debug
dig +short A github.com</code></pre>
<h3>SSH Tunneling</h3>
<p>Secure Shell is your Swiss Army knife for accessing cloud resources. We cover <strong>key-based auth</strong>, <strong>port forwarding</strong>, and <strong>bastion hosts</strong> for secure production access.</p>`
      },
      {
        id: "systemd-package-mgmt", title: "Package Management & Systemd", duration: "25 min",
        description: "Manage services, dependencies, and system state with systemd units and Linux package managers for production workloads.",
        content: `<h2>Systemd Deep Dive</h2>
<p>Modern Linux distributions use <strong>systemd</strong> as their init system. Understanding <strong>unit files</strong>, <strong>timers</strong>, and <strong>journald</strong> is essential for running reliable production services.</p>
<pre><code class="language-ini"># /etc/systemd/system/myapp.service
[Unit]
Description=MyApp Production Service
After=network.target postgresql.service
Requires=postgresql.service

[Service]
Type=simple
User=deploy
WorkingDirectory=/opt/myapp
ExecStart=/usr/bin/node /opt/myapp/server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target</code></pre>
<p>Use <code>systemctl daemon-reload</code> after creating units and <code>journalctl -u myapp.service -f</code> for real-time logs.</p>`
      }
    ]
  },
  {
    id: "devops-tier-2", title: "Tier 2: Intermediate — Containerization & IaC",
    lessons: [
      {
        id: "docker-terraform", title: "Docker Multi-stage & Terraform Basics", duration: "45 min",
        description: "Package applications for production and define cloud infrastructure as version-controlled code.",
        content: `<h2>Immutable Infrastructure</h2>
<p>We use <strong>Docker</strong> to package applications with their dependencies. By using <strong>Multi-stage builds</strong>, we keep production images small and secure.</p>
<pre><code class="language-dockerfile"># Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build
# Stage 2: Production
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
USER node
CMD ["node", "dist/server.js"]</code></pre>
<h3>Terraform (IaC)</h3>
<p>Don't click around the AWS console. Use <strong>Terraform</strong> to describe your infrastructure in HCL for version control, peer reviews, and automated rollbacks.</p>`,
        quiz: [
          {
            question: "What is the primary benefit of multi-stage Docker builds?",
            options: ["Faster network speeds", "Smaller and more secure production images", "Automatic container orchestration", "Built-in load balancing"],
            correctIndex: 1,
            explanation: "Multi-stage builds let you compile code in a build image, then copy only runtime artifacts to a minimal production image — drastically reducing size and attack surface."
          }
        ]
      },
      {
        id: "docker-compose-networking", title: "Docker Compose & Service Networking", duration: "35 min",
        description: "Orchestrate multi-service applications locally with Docker Compose, custom networks, and volume mounts for reproducible dev environments.",
        content: `<h2>Multi-Service Orchestration</h2>
<p><strong>Docker Compose</strong> lets you define and run multi-container applications with a single YAML file. Wire up web servers, databases, caches, and queues in a reproducible local environment.</p>
<pre><code class="language-yaml">version: "3.9"
services:
  api:
    build: ./api
    ports:
      - "4000:4000"
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/myapp
    depends_on:
      - db
      - redis
  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: pass
  redis:
    image: redis:7-alpine
volumes:
  pgdata:</code></pre>
<p>Use <code>docker compose up --scale api=3</code> to simulate production load testing locally.</p>`
      },
      {
        id: "terraform-state-backends", title: "Terraform State & Remote Backends", duration: "40 min",
        description: "Master Terraform state management, remote backends on S3, state locking with DynamoDB, and team collaboration workflows.",
        content: `<h2>State Management</h2>
<p>Terraform's <strong>state file</strong> maps real-world resources to your configuration. In production, you must store state remotely with <strong>locking</strong> to prevent concurrent modifications that corrupt infrastructure.</p>
<pre><code class="language-hcl"># backend.tf
terraform {
  backend "s3" {
    bucket         = "myorg-terraform-state"
    key            = "prod/network/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-state-lock"
    encrypt        = true
  }
}
provider "aws" {
  region = "us-east-1"
  default_tags {
    tags = {
      Environment = "production"
      ManagedBy   = "terraform"
    }
  }
}</code></pre>
<p>Always run <code>terraform plan</code> before <code>terraform apply</code> and integrate with CI/CD for peer-reviewed infrastructure changes.</p>`,
        quiz: [
          {
            question: "Why should you never store Terraform state files locally in a team environment?",
            options: ["Local files are slower to read", "Team members would overwrite each other's changes and lose state locking", "Terraform doesn't support local state", "It increases cloud costs"],
            correctIndex: 1,
            explanation: "Without remote state and locking, concurrent team members can corrupt the state file. Remote backends with locking prevent this."
          }
        ]
      }
    ]
  },
  {
    id: "devops-tier-3", title: "Tier 3: Production — Orchestration & Scaling",
    lessons: [
      {
        id: "k8s-observability", title: "Kubernetes Orchestration & OpenTelemetry", duration: "60 min",
        description: "Manage thousands of containers with rolling updates, health probes, and full-stack distributed observability.",
        content: `<h2>Kubernetes at Scale</h2>
<p>Kubernetes is the industry standard for container orchestration. We use <strong>Deployments</strong> for rolling updates and <strong>Services</strong> for internal load balancing.</p>
<pre><code class="language-yaml">apiVersion: apps/v1
kind: Deployment
metadata:
  name: payment-service
spec:
  replicas: 5
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
  selector:
    matchLabels:
      app: payment
  template:
    metadata:
      labels:
        app: payment
    spec:
      containers:
        - name: payment
          image: myregistry/payment:v2.1.0
          ports:
            - containerPort: 8080
          livenessProbe:
            httpGet:
              path: /healthz
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 10
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"</code></pre>
<h3>Full-stack Observability</h3>
<p>Production systems require deep monitoring. Use <strong>Prometheus</strong> for metrics and <strong>OpenTelemetry</strong> for distributed tracing to find bottlenecks across microservices instantly.</p>`
      },
      {
        id: "helm-kustomize", title: "Helm Charts & Kustomize", duration: "45 min",
        description: "Package and manage Kubernetes manifests with Helm charts and environment-specific overlays using Kustomize for GitOps workflows.",
        content: `<h2>Kubernetes Package Management</h2>
<p>Managing raw YAML doesn't scale. <strong>Helm</strong> packages manifests into reusable <strong>charts</strong> with templating, while <strong>Kustomize</strong> applies environment-specific overlays without touching base manifests.</p>
<pre><code class="language-yaml"># helm/templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-web
spec:
  replicas: {{ .Values.replicas }}
  template:
    spec:
      containers:
        - name: web
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          env:
            {{- range .Values.env }}
            - name: {{ .name }}
              value: {{ .value | quote }}
            {{- end }}</code></pre>
<pre><code class="language-yaml"># kustomize/overlays/production/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
bases:
  - ../../base
patches:
  - patch: |-
      - op: replace
        path: /spec/replicas
        value: 10
    target:
      kind: Deployment</code></pre>`
      },
      {
        id: "hpa-vpa-scaling", title: "Horizontal Pod Autoscaling & VPA", duration: "35 min",
        description: "Automatically scale workloads based on custom metrics and optimize resource requests with the Vertical Pod Autoscaler for cost efficiency.",
        content: `<h2>Intelligent Autoscaling</h2>
<p>Kubernetes <strong>HPA</strong> scales pods based on CPU, memory, or custom metrics like requests per second. The <strong>VPA</strong> automatically adjusts container resource requests to eliminate waste and prevent OOM kills.</p>
<pre><code class="language-yaml">apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-gateway-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-gateway
  minReplicas: 3
  maxReplicas: 30
  metrics:
    - type: Pods
      pods:
        metric:
          name: http_requests_per_second
        target:
          type: AverageValue
          averageValue: 1000
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 75</code></pre>
<p>Combine HPA with <strong>cluster-autoscaler</strong> at the node level to handle traffic spikes without overprovisioning.</p>`
      }
    ]
  },
  {
    id: "devops-tier-4", title: "Tier 4: Advanced Kubernetes",
    lessons: [
      {
        id: "custom-resource-definitions", title: "Custom Resource Definitions & Controllers", duration: "50 min",
        description: "Extend the Kubernetes API with CRDs and build controllers that reconcile custom resources to the desired state, powering tools like Prometheus Operator and Cert-Manager.",
        content: `<h2>Extending Kubernetes</h2>
<p><strong>Custom Resource Definitions (CRDs)</strong> let you define your own Kubernetes API objects. Paired with a <strong>controller</strong>, you automate complex operational logic — the pattern used by Prometheus Operator, Cert-Manager, and Istio.</p>
<pre><code class="language-yaml">apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: databases.example.com
spec:
  group: example.com
  scope: Namespaced
  names:
    plural: databases
    singular: database
    kind: Database
  versions:
    - name: v1
      served: true
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                engine:
                  type: string
                  enum: [postgres, mysql]
                version:
                  type: string
                replicas:
                  type: integer
                  minimum: 1</code></pre>
<p>Write controllers in Go using <strong>client-go</strong> to watch for resource events and reconcile actual state toward desired state.</p>`,
        quiz: [
          {
            question: "What is the primary purpose of a Kubernetes controller paired with a CRD?",
            options: ["To store secrets securely", "To reconcile actual cluster state toward the desired state defined by the custom resource", "To replace kubectl", "To provide a user interface for Kubernetes"],
            correctIndex: 1,
            explanation: "Controllers implement the core control loop pattern — they watch for changes to custom resources and take action to ensure real cluster state matches the spec."
          }
        ]
      },
      {
        id: "kubebuilder-operators", title: "Building Operators with Kubebuilder", duration: "60 min",
        description: "Production-grade Kubernetes operator development using the Kubebuilder framework — API scaffolding, reconciliation loops, and OLM deployment.",
        content: `<h2>Operator Development</h2>
<p><strong>Kubebuilder</strong> provides scaffolding for building Kubernetes operators with idiomatic Go patterns. Define the API (CRD) and the controller reconciliation logic using the <strong>controller-runtime</strong> library.</p>
<pre><code class="language-go">package controllers

import (
    "context"
    "k8s.io/apimachinery/pkg/runtime"
    ctrl "sigs.k8s.io/controller-runtime"
    "sigs.k8s.io/controller-runtime/pkg/client"
    "sigs.k8s.io/controller-runtime/pkg/log"
    examplev1 "github.com/myorg/database-operator/api/v1"
)

type DatabaseReconciler struct {
    client.Client
    Scheme *runtime.Scheme
}

func (r *DatabaseReconciler) Reconcile(
    ctx context.Context, req ctrl.Request,
) (ctrl.Result, error) {
    log := log.FromContext(ctx)
    var db examplev1.Database
    if err := r.Get(ctx, req.NamespacedName, &db); err != nil {
        return ctrl.Result{}, client.IgnoreNotFound(err)
    }
    log.Info("Reconciling Database",
        "engine", db.Spec.Engine, "version", db.Spec.Version)
    // Create StatefulSet, Service, and PVC based on spec...
    return ctrl.Result{}, nil
}</code></pre>
<p>Deploy operators using <strong>OLM (Operator Lifecycle Manager)</strong> for production-grade lifecycle management, updates, and RBAC configuration.</p>`
      },
      {
        id: "service-mesh-istio", title: "Service Mesh with Istio", duration: "55 min",
        description: "Production-grade traffic management, mutual TLS security, and deep observability using Istio service mesh across Kubernetes clusters.",
        content: `<h2>Service Mesh Architecture</h2>
<p>A <strong>service mesh</strong> handles communication between microservices at the infrastructure layer. <strong>Istio</strong> injects sidecar Envoy proxies that intercept all traffic, enabling fine-grained traffic routing, mTLS, and observability.</p>
<pre><code class="language-yaml">apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: reviews-route
spec:
  hosts:
    - reviews
  http:
    - match:
        - headers:
            end-user:
              exact: jason
      route:
        - destination:
            host: reviews
            subset: v2
    - route:
        - destination:
            host: reviews
            subset: v1
---
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: reviews-destination
spec:
  host: reviews
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
  trafficPolicy:
    tls:
      mode: ISTIO_MUTUAL</code></pre>
<p>Leverage <strong>Kiali</strong> for visualizing mesh topology and <strong>Jaeger</strong> for distributed tracing across services.</p>`,
        quiz: [
          {
            question: "How does Istio enforce mutual TLS between services without application changes?",
            options: ["By modifying application code at build time", "By injecting Envoy sidecar proxies that handle encryption transparently", "Through Kubernetes NetworkPolicies", "With a dedicated VPN tunnel"],
            correctIndex: 1,
            explanation: "Istio uses Envoy sidecar proxies to intercept all service traffic. mTLS is handled at the proxy layer, requiring zero changes to application code."
          }
        ]
      },
      {
        id: "gateway-api-ingress", title: "Gateway API & Ingress Controllers", duration: "40 min",
        description: "Next-generation Kubernetes networking with the Gateway API, HTTP routing, and multi-tenancy traffic policies for canary deployments and A/B testing.",
        content: `<h2>Kubernetes Gateway API</h2>
<p>The <strong>Gateway API</strong> is the evolution of Ingress, offering a role-oriented and extensible approach to service networking. It separates concerns of <strong>infrastructure providers</strong> from <strong>application developers</strong>.</p>
<pre><code class="language-yaml">apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: api-route
spec:
  parentRefs:
    - name: external-gateway
      namespace: infrastructure
  hostnames:
    - api.myorg.com
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /v1/
      backendRefs:
        - name: v1-api
          port: 8080
          weight: 90
        - name: v2-api
          port: 8080
          weight: 10</code></pre>
<p>Implement <strong>canary deployments</strong> and <strong>A/B testing</strong> at the gateway level without modifying your application code.</p>`
      }
    ]
  },
  {
    id: "devops-tier-5", title: "Tier 5: Incident Response & Observability",
    lessons: [
      {
        id: "oncall-best-practices", title: "On-Call Best Practices & SRE Culture", duration: "30 min",
        description: "Build a sustainable on-call rotation, define severity matrices, and establish escalation policies for 24/7 production reliability.",
        content: `<h2>Sustainable On-Call</h2>
<p>Great DevOps teams treat on-call as a design problem. Define <strong>severity levels</strong> (SEV1–SEV5), set up <strong>escalation policies</strong>, and use <strong>follow-the-sun rotations</strong> to avoid burnout.</p>
<pre><code class="language-yaml"># oncall-schedule.yaml
teams:
  - name: platform-engineering
    rotation: 7  # days
    members:
      - name: alice
        level: primary
        timezone: US/Eastern
      - name: bob
        level: secondary
        timezone: US/Pacific
    schedules:
      - day: weekday
        hours:
          - start: "09:00"
            end: "17:00"
        coverage: follow-the-sun</code></pre>
<p>Implement <strong>auto-escalation</strong> — if the primary hasn't acknowledged within 5 minutes for a SEV1, automatically escalate to secondary and then incident commander.</p>`,
        quiz: [
          {
            question: "What is the key benefit of a 'follow-the-sun' on-call rotation model?",
            options: ["Reduces the number of engineers needed on the team", "Ensures awake engineers handle incidents at all hours without exhausting any single team member", "Eliminates the need for incident response runbooks", "Automatically resolves all incidents"],
            correctIndex: 1,
            explanation: "Follow-the-sun distributes on-call duty across global time zones so engineers are never woken up at 3 AM, improving both reliability and team well-being."
          }
        ]
      },
      {
        id: "pagerduty-integration", title: "PagerDuty Integration & Alerting", duration: "35 min",
        description: "Configure PagerDuty alert rules, deduplication, suppression, and integration with Prometheus and Grafana for intelligent alert routing.",
        content: `<h2>Alerting Infrastructure</h2>
<p><strong>PagerDuty</strong> is the industry standard for incident alerting. Wire up <strong>Prometheus Alertmanager</strong> to PagerDuty, configure <strong>deduplication</strong> to prevent alert fatigue, and design <strong>notification rules</strong> based on severity.</p>
<pre><code class="language-yaml"># alertmanager.yml
route:
  group_by: ['alertname', 'cluster']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  receiver: pagerduty-critical
  routes:
    - match:
        severity: critical
      receiver: pagerduty-critical
    - match:
        severity: warning
      receiver: pagerduty-warning
receivers:
  - name: pagerduty-critical
    pagerduty_configs:
      - routing_key: "\${PAGERDUTY_ROUTING_KEY}"
        severity: critical
        description: '{{ template "custom.description" . }}'
        client: Prometheus</code></pre>
<p>Use <strong>alert deduplication</strong> to group related alerts into a single incident — when 10 pods crash simultaneously, your team gets one notification, not ten.</p>`
      },
      {
        id: "incident-runbooks", title: "Incident Runbooks & Automation", duration: "40 min",
        description: "Create and automate incident response runbooks to reduce Mean Time to Resolution (MTTR) with FireHydrant and custom automation bots.",
        content: `<h2>Runbook-Driven Operations</h2>
<p>When a SEV1 hits, engineers shouldn't guess. <strong>Runbooks</strong> provide step-by-step checklists for diagnosis, mitigation, and resolution. Automate runs with <strong>FireHydrant</strong> and <strong>custom bots</strong>.</p>
<pre><code class="language-markdown"># Runbook: Database Primary Failure

## Severity: SEV1
## Services affected: api-gateway, user-service

### Step 1: Verify the failure
\`\`\`bash
pg_isready -h $PRIMARY_HOST -p 5432
\`\`\`

### Step 2: Promote replica
\`\`\`bash
ssh $REPLICA_HOST -- pgctl promote
\`\`\`

### Step 3: Update DNS or load balancer target group
\`\`\`bash
aws elbv2 modify-target-group \
  --target-group-arn $TG_ARN \
  --targets Id=$REPLICA_IP,Port=5432
\`\`\`

### Step 4: Verify application connectivity
\`\`\`bash
curl -f https://api.myapp.com/healthz
\`\`\`</code></pre>
<p>Store runbooks in version control, link them from monitoring dashboards, and test them in <strong>game days</strong> every quarter.</p>`
      },
      {
        id: "postmortem-culture", title: "Postmortems & Blameless Culture", duration: "25 min",
        description: "Conduct effective incident postmortems, identify systemic root causes, and foster a blameless culture that drives continuous reliability improvement.",
        content: `<h2>The Blameless Postmortem</h2>
<p>Every incident is an opportunity to improve. A <strong>blameless postmortem</strong> focuses on systemic failures — not who made a mistake, but what processes, tools, or gaps allowed the incident to happen.</p>
<pre><code class="language-markdown"># Postmortem: Production Outage — 2026-06-15

## Summary
API latency increased by 6000% for 23 minutes due to connection pool exhaustion.

## Timeline
- 14:02 — Prometheus alert: p99 latency > 5s
- 14:05 — On-call acknowledged via PagerDuty
- 14:08 — Identified database connection errors in logs
- 14:12 — Detected PgBouncer max_pool exhaustion
- 14:18 — Increased pool size and restarted PgBouncer
- 14:25 — Latency returned to baseline

## Root Causes
1. PgBouncer default_pool_size was set to 25 (dev default)
2. No alerts on connection pool utilization
3. Failover triggered rapid reconnection from all services

## Action Items
- [ ] Set pool utilization alert at 70% threshold
- [ ] Increase default pool size to 100
- [ ] Add circuit breaker pattern in API gateway</code></pre>
<p>Share postmortems company-wide and track action items in sprint planning for systemic reliability improvements.</p>`
      }
    ]
  }
]

export default function DevopsPage() {
  return (
    <div className="bg-background text-foreground font-sans">
      <Navbar />
      <LessonPlayer
        title="DevOps & Cloud Engineering"
        description="Master the production infrastructure lifecycle. From Linux internals and Bash scripting to global Kubernetes orchestration and observability."
        category="DevOps"
        accentColor="#0DB7ED"
        modules={devopsModules}
        instructor="Kelsey Hightower"
        rating={4.8}
        reviewCount={1600}
        lastUpdated="Mar 2026"
      />
    </div>
  )
}
