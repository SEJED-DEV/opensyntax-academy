import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { LessonPlayer, type Module } from "@/components/lesson-player"

export const metadata: Metadata = {
  title: "System Design Course — Scalable Architecture & Distributed Systems",
  description: "Master system design for production-scale architecture and FAANG interviews. Load balancers, database sharding, caching strategies, message queues, rate limiting, microservices patterns (API gateways, service mesh, saga), and deep dives into YouTube, WhatsApp, Uber, and Twitter designs.",
  keywords: ["System Design Course", "Scalable Architecture", "Distributed Systems", "System Design Interview", "Microservices", "Load Balancer"],
}

const systemDesignModules: Module[] = [
  {
    id: "fundamentals", title: "Module 1 — Foundations of Scale",
    lessons: [
      {
        id: "load-balancing", title: "Load Balancing & Reverse Proxies", duration: "30 min",
        description: "Understand Layer 4 vs Layer 7 load balancing, consistent hashing, and health checks.",
        content: `<h2>Load Balancing Strategies</h2>
<p>When a single server can't handle millions of requests, we distribute traffic across a fleet. A <strong>Load Balancer</strong> sits between clients and backend servers, routing requests based on algorithms.</p>
<h3>Layer 4 vs Layer 7</h3>
<p><strong>Layer 4 (Transport)</strong> load balancers operate on TCP/UDP. They're extremely fast because they don't inspect HTTP headers or payloads — they just forward raw packets. <strong>Layer 7 (Application)</strong> balancers inspect HTTP requests and can route based on URL paths, cookies, or headers.</p>
<pre><code class="language-yaml"># NGINX L7 Load Balancer Configuration
upstream backend {
    # Weighted round-robin
    server api-1.internal:8080 weight=5;
    server api-2.internal:8080 weight=3;
    server api-3.internal:8080 weight=2;

    # Health checks
    server api-4.internal:8080 backup;
}

server {
    listen 443 ssl;
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # Connection pooling
        keepalive 32;
    }
}</code></pre>
<h3>Consistent Hashing</h3>
<p>Simple round-robin fails when you need session affinity or cache locality. <strong>Consistent hashing</strong> maps both servers and requests onto a virtual ring. When a server is added or removed, only 1/N of requests are remapped.</p>
<pre><code class="language-python">import hashlib

class ConsistentHash:
    def __init__(self, nodes, replicas=150):
        self.ring = {}
        self.sorted_keys = []
        for node in nodes:
            for i in range(replicas):
                key = self._hash(f"{node}:{i}")
                self.ring[key] = node
                self.sorted_keys.append(key)
        self.sorted_keys.sort()

    def _hash(self, key):
        return int(hashlib.md5(key.encode()).hexdigest(), 16)

    def get_node(self, item):
        h = self._hash(item)
        for key in self.sorted_keys:
            if h <= key:
                return self.ring[key]
        return self.ring[self.sorted_keys[0]]
</code></pre>`
      },
      {
        id: "database-sharding", title: "Database Sharding & Partitioning", duration: "35 min",
        description: "Horizontal partitioning strategies, shard key selection, and cross-shard queries.",
        content: `<h2>Horizontal Sharding</h2>
<p>When a single PostgreSQL instance can't handle the write volume (or the dataset exceeds RAM), we split the data across multiple database instances called <strong>shards</strong>.</p>
<h3>Shard Key Selection</h3>
<p>The shard key determines which shard a row lives on. A bad choice creates <strong>hot spots</strong> — one shard gets 90% of traffic while others idle.</p>
<pre><code class="language-python"># Bad shard key: created_at (all recent writes go to one shard)
# Good shard key: user_id (evenly distributed writes)

def get_shard(user_id: int, num_shards: int = 8) -> int:
    """Deterministic shard assignment via modulo"""
    return user_id % num_shards

# User 42 always goes to shard 2
shard = get_shard(42)  # 42 % 8 = 2
</code></pre>
<h3>Cross-Shard Queries</h3>
<p>The fundamental trade-off: queries that span multiple shards (scatter-gather) are expensive. If you frequently JOIN user data with order data, they must live on the same shard (co-located sharding).</p>
<pre><code class="language-sql">-- This query is FAST (single shard lookup)
SELECT * FROM orders WHERE user_id = 42;

-- This query is SLOW (must query ALL shards and merge)
SELECT COUNT(*) FROM orders WHERE created_at > '2026-01-01';
</code></pre>
<p>Production systems like Vitess (used by YouTube) and Citus (PostgreSQL extension) handle this routing transparently.</p>`
      },
      {
        id: "caching-strategies", title: "Caching at Every Layer", duration: "25 min",
        description: "Cache-aside, write-through, write-behind patterns with Redis and CDN edge caching.",
        content: `<h2>Multi-Layer Caching Architecture</h2>
<p>Caching is the single most impactful optimization in system design. But misapplying it causes stale data bugs, thundering herds, and cache stampedes.</p>
<h3>Cache-Aside (Lazy Loading)</h3>
<p>The application checks the cache first. On a miss, it fetches from the database and populates the cache.</p>
<pre><code class="language-python">import redis
import json

cache = redis.Redis(host='localhost', port=6379)

async def get_user(user_id: int):
    # 1. Check cache
    cached = cache.get(f"user:{user_id}")
    if cached:
        return json.loads(cached)
    
    # 2. Cache miss → query database
    user = await db.query("SELECT * FROM users WHERE id = $1", user_id)
    
    # 3. Populate cache with TTL
    cache.setex(f"user:{user_id}", 3600, json.dumps(user))
    
    return user
</code></pre>
<h3>Cache Stampede Prevention</h3>
<p>When 10,000 requests arrive simultaneously for an expired key, all of them miss the cache and slam the database. Solutions:</p>
<pre><code class="language-python"># Probabilistic early expiration (XFetch)
import random, time

def should_recompute(ttl_remaining, delta, beta=1.0):
    """Probabilistically recompute before expiration"""
    return ttl_remaining - delta * beta * math.log(random.random()) <= 0
</code></pre>
<p>This ensures that as the TTL approaches zero, there's an increasing probability that ONE request will refresh the cache before it actually expires.</p>`
      },
    ],
  },
  {
    id: "distributed-systems", title: "Module 2 — Distributed Systems",
    lessons: [
      {
        id: "message-queues", title: "Message Queues & Event-Driven Architecture", duration: "30 min",
        description: "Kafka, RabbitMQ, and SQS patterns for decoupling services and handling backpressure.",
        content: `<h2>Asynchronous Communication</h2>
<p>In a monolith, function calls are synchronous. In distributed systems, services communicate via <strong>message queues</strong> — producers push messages, consumers pull and process them independently.</p>
<h3>When to Use Queues</h3>
<p>Any operation that doesn't need to complete before the API responds: sending emails, processing images, generating reports, updating search indexes.</p>
<pre><code class="language-python"># Producer: API endpoint enqueues work
from kafka import KafkaProducer
import json

producer = KafkaProducer(
    bootstrap_servers='kafka:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

async def upload_image(request):
    image_url = await save_to_s3(request.file)
    
    # Don't process inline — enqueue it
    producer.send('image-processing', {
        'user_id': request.user_id,
        'image_url': image_url,
        'operations': ['resize', 'thumbnail', 'webp']
    })
    
    return {"status": "processing", "image_url": image_url}
</code></pre>
<h3>Consumer Groups & Backpressure</h3>
<p>Kafka partitions allow parallel consumers. If the queue grows faster than consumers process, you add more consumer instances. If producers overwhelm the system, implement <strong>backpressure</strong> by returning HTTP 429.</p>`
      },
      {
        id: "rate-limiting", title: "Rate Limiting & API Gateways", duration: "25 min",
        description: "Token bucket, sliding window, and distributed rate limiting with Redis.",
        content: `<h2>Protecting Services at Scale</h2>
<p>Without rate limiting, a single bad actor can DDoS your API, exhaust database connections, and take down the entire service. Rate limiters are the first line of defense.</p>
<h3>Token Bucket Algorithm</h3>
<p>Imagine a bucket that holds tokens. Each request costs one token. Tokens refill at a fixed rate. When the bucket is empty, requests are rejected.</p>
<pre><code class="language-python">import time
import redis

class TokenBucket:
    def __init__(self, redis_client, key, capacity, refill_rate):
        self.r = redis_client
        self.key = key
        self.capacity = capacity
        self.refill_rate = refill_rate  # tokens per second
    
    def allow_request(self) -> bool:
        now = time.time()
        pipe = self.r.pipeline()
        
        # Lua script for atomic token bucket
        lua = """
        local key = KEYS[1]
        local capacity = tonumber(ARGV[1])
        local refill_rate = tonumber(ARGV[2])
        local now = tonumber(ARGV[3])
        
        local data = redis.call('HMGET', key, 'tokens', 'last_refill')
        local tokens = tonumber(data[1]) or capacity
        local last = tonumber(data[2]) or now
        
        -- Refill tokens based on elapsed time
        local elapsed = now - last
        tokens = math.min(capacity, tokens + elapsed * refill_rate)
        
        if tokens >= 1 then
            tokens = tokens - 1
            redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
            redis.call('EXPIRE', key, 3600)
            return 1
        end
        return 0
        """
        return self.r.eval(lua, 1, self.key, 
                          self.capacity, self.refill_rate, now) == 1
</code></pre>
<p>This implementation is <strong>distributed</strong> — multiple API servers share the same Redis state, ensuring global rate limiting across the fleet.</p>`
      },
      {
        id: "cap-theorem", title: "CAP Theorem & Consensus", duration: "30 min",
        description: "Understanding the fundamental trade-offs in distributed data stores.",
        content: `<h2>The CAP Theorem</h2>
<p>In a distributed system, you can only guarantee two of three properties simultaneously:</p>
<p><strong>C</strong>onsistency — Every read receives the most recent write.<br>
<strong>A</strong>vailability — Every request receives a response (no timeouts).<br>
<strong>P</strong>artition tolerance — The system continues operating despite network partitions.</p>

<h3>Real-World Trade-offs</h3>
<pre><code>┌─────────────────────────────────────────┐
│           CP Systems (Strong)           │
│  PostgreSQL, MongoDB, HBase, Zookeeper  │
│  → Sacrifices availability on partition │
├─────────────────────────────────────────┤
│           AP Systems (Available)        │
│  Cassandra, DynamoDB, CouchDB, Riak    │
│  → Sacrifices consistency on partition  │
├─────────────────────────────────────────┤
│           CA Systems (Theoretical)      │
│  Single-node RDBMS (no distribution)    │
│  → Can't tolerate network partitions    │
└─────────────────────────────────────────┘</code></pre>
<h3>Raft Consensus</h3>
<p>When you need strong consistency in a distributed system (like etcd for Kubernetes), you use consensus algorithms like <strong>Raft</strong>. A leader is elected, and writes must be replicated to a majority of nodes before being committed.</p>
<p>If the leader dies, followers hold an election. The node with the most up-to-date log wins. This is how databases like CockroachDB achieve globally consistent transactions.</p>`
      },
    ],
  },
  {
    id: "case-studies", title: "Module 3 — Real-World Case Studies",
    lessons: [
      {
        id: "design-url-shortener", title: "Design: URL Shortener", duration: "35 min",
        description: "End-to-end system design for a service handling billions of redirects per day.",
        content: `<h2>Designing a URL Shortener (like bit.ly)</h2>
<p>This is one of the most common system design interview questions. Let's build it properly for 1 billion URLs and 100K redirects/second.</p>
<h3>Requirements</h3>
<p><strong>Functional:</strong> Shorten a long URL → short code. Redirect short code → original URL. Optional: analytics, custom aliases, expiration.<br>
<strong>Non-functional:</strong> Low latency redirects (<50ms). High availability. URL uniqueness guaranteed.</p>
<h3>Core Design</h3>
<pre><code>Client → API Gateway → URL Service → Database
                              ↓
                         Cache (Redis)

Short Code Generation:
  Option A: Counter + Base62 encoding
  Option B: MD5 hash → take first 7 chars
  Option C: Pre-generated ID pool (Snowflake)
</code></pre>
<h3>Base62 Encoding</h3>
<pre><code class="language-python">ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

def encode_base62(num: int) -> str:
    if num == 0:
        return ALPHABET[0]
    result = []
    while num:
        result.append(ALPHABET[num % 62])
        num //= 62
    return ''.join(reversed(result))

# 7-character base62 = 62^7 = 3.5 TRILLION unique URLs
encode_base62(123456789)  # → "8M0kX"
</code></pre>
<h3>Read Path (99.9% of traffic)</h3>
<p>1. Check Redis cache (hit rate ~95%). 2. On miss, query database. 3. Populate cache. 4. Return 301/302 redirect.</p>
<p>With 95% cache hit rate and Redis serving 100K ops/sec from a single instance, we handle massive scale with minimal database load.</p>`
      },
      {
        id: "design-notification-system", title: "Design: Notification System", duration: "30 min",
        description: "Multi-channel notification delivery with priority queues, deduplication, and rate limiting.",
        content: `<h2>Designing a Notification System</h2>
<p>A production notification system must handle push notifications, emails, SMS, and in-app messages — each with different delivery guarantees, rate limits, and user preferences.</p>
<h3>Architecture Overview</h3>
<pre><code>API Request → Validation Service → Priority Queue
                                        ↓
                              ┌─────────┼─────────┐
                              ↓         ↓         ↓
                         Push Queue  Email Queue  SMS Queue
                              ↓         ↓         ↓
                          APNs/FCM  SendGrid    Twilio
                              ↓         ↓         ↓
                         ────────── Analytics DB ──────────
</code></pre>
<h3>Deduplication</h3>
<p>Users should never receive the same notification twice. Use an idempotency key stored in Redis with a TTL.</p>
<pre><code class="language-python">async def send_notification(user_id, message, idempotency_key):
    dedup_key = f"notif:{user_id}:{idempotency_key}"
    
    # SET NX = only set if doesn't exist (atomic)
    if not await redis.set(dedup_key, 1, nx=True, ex=86400):
        return {"status": "duplicate", "skipped": True}
    
    # Check user preferences
    prefs = await get_user_preferences(user_id)
    
    channels = []
    if prefs.push_enabled:
        channels.append(push_queue.enqueue(user_id, message))
    if prefs.email_enabled and message.priority == "high":
        channels.append(email_queue.enqueue(user_id, message))
    
    await asyncio.gather(*channels)
    return {"status": "sent", "channels": len(channels)}
</code></pre>
<h3>Priority Queuing</h3>
<p>Security alerts must be delivered instantly. Marketing notifications can wait. Use separate queues with different consumer concurrency.</p>`
      },
      {
        id: "design-chat-system", title: "Design: Real-Time Chat System", duration: "40 min",
        description: "Architect a WhatsApp-scale chat system with WebSocket management, message persistence, and multi-device sync across millions of concurrent connections.",
        content: `<h2>Designing a Chat System</h2>
<p>A real-time chat system must handle millions of concurrent WebSocket connections, deliver messages with &lt;100ms latency, and persist chat history indefinitely. Think WhatsApp, Discord, or Slack.</p>
<h3>WebSocket Management</h3>
<p>Each user maintains a persistent WebSocket connection to a chat server. A <strong>Chat Service</strong> manages these connections via a pub/sub pattern. When user A sends a message to user B, the service publishes it to B's channel — their WebSocket delivers it instantly.</p>
<pre><code class="language-python"># WebSocket connection manager with Redis pub/sub
import asyncio
import json
import redis.asyncio as aioredis

class ChatService:
    def __init__(self):
        self.connections: dict[str, asyncio.Queue] = {}
        self.redis = aioredis.from_url("redis://chat-redis:6379")
        self.pubsub = self.redis.pubsub()

    async def connect_user(self, user_id: str, queue: asyncio.Queue):
        self.connections[user_id] = queue
        await self.pubsub.subscribe(f"user:{user_id}")

    async def send_message(self, sender: str, recipient: str, content: str):
        message = {
            "from": sender,
            "content": content,
            "timestamp": int(asyncio.get_event_loop().time()),
            "id": generate_uuid(),
        }
        # Persist to Cassandra/ ScyllaDB for history
        await db.insert_message(message)
        # Publish for real-time delivery
        await self.redis.publish(f"user:{recipient}", json.dumps(message))

    async def listen_for_messages(self, user_id: str):
        async for msg in self.pubsub.listen():
            if msg["type"] == "message":
                await self.connections[user_id].put(json.loads(msg["data"]))
</code></pre>
<h3>Multi-Device Sync</h3>
<p>Users expect messages to sync across phone, desktop, and web. Store a <strong>sync token</strong> (timestamp-based cursor) per device. On reconnection, each device fetches messages since its last sync token from the message store (Cassandra).</p>`,
        quiz: [
          {
            question: "Why is Redis pub/sub suitable for real-time chat delivery but not for message persistence?",
            options: ["Redis pub/sub is slower than Kafka", "Redis pub/sub does not store messages — if a consumer is offline, the message is lost", "Redis pub/sub only works with a single consumer", "Redis pub/sub requires polling"],
            correctIndex: 1,
            explanation: "Redis pub/sub is fire-and-forget — messages are delivered only to currently connected subscribers. If a user's WebSocket is disconnected, they miss the message. This is why chat systems persist messages in Cassandra and use sync tokens for catch-up."
          }
        ]
      },
      {
        id: "design-video-streaming", title: "Design: Video Streaming Platform", duration: "45 min",
        description: "Design a YouTube-scale video platform. Implement adaptive bitrate streaming (HLS/DASH), video transcoding pipeline, CDN edge caching, and recommendation engine architecture.",
        content: `<h2>Designing a Video Platform</h2>
<p>YouTube serves over 1 billion hours of video daily. The system must handle massive uploads, transcoding to multiple resolutions, global CDN delivery, and a ML-based recommendation engine — all with sub-second seek latency.</p>
<h3>Upload & Transcoding Pipeline</h3>
<p>When a user uploads a video, the API returns immediately with a unique video ID. An async worker picks up the raw video, splits it into 10-second chunks, transcodes each chunk to HLS format at multiple bitrates (360p, 720p, 1080p, 4K), and uploads the segments to object storage (GCS/S3).</p>
<pre><code class="language-python"># Video transcoding pipeline with ffmpeg
import subprocess
import boto3
import json
from celery import Celery

app = Celery("transcoder", broker="redis://transcoder-queue:6379")

s3 = boto3.client("s3")

@app.task(bind=True, max_retries=3)
def transcode_video(self, video_id: str, input_bucket: str, output_bucket: str):
    # Download raw video
    s3.download_file(input_bucket, f"raw/{video_id}.mp4", f"/tmp/{video_id}.mp4")

    resolutions = [
        {"name": "360p", "height": 360, "bitrate": "800k"},
        {"name": "720p", "height": 720, "bitrate": "2500k"},
        {"name": "1080p", "height": 1080, "bitrate": "5000k"},
    ]

    # Generate HLS segments for each resolution
    for res in resolutions:
        output_pattern = f"/tmp/{video_id}_{res['name']}_%05d.ts"
        subprocess.run([
            "ffmpeg", "-i", f"/tmp/{video_id}.mp4",
            "-vf", f"scale=-2:{res['height']}",
            "-c:v", "libx264", "-b:v", res["bitrate"],
            "-c:a", "aac", "-b:a", "128k",
            "-f", "segment", "-segment_time", "10",
            "-segment_format", "mpegts",
            output_pattern
        ], check=True)

        # Upload segments to CDN origin
        for seg_file in glob.glob(f"/tmp/{video_id}_{res['name']}_*.ts"):
            s3.upload_file(seg_file, output_bucket, f"hls/{video_id}/{res['name']}/{seg_file}")

    # Generate master playlist
    master_playlist = generate_master_playlist(video_id, resolutions)
    s3.put_object(Bucket=output_bucket, Key=f"hls/{video_id}/master.m3u8", Body=master_playlist)

    return {"status": "completed", "video_id": video_id}
</code></pre>
<h3>CDN & Edge Caching</h3>
<p>Video segments are served from <strong>CDN edge nodes</strong> (Cloudflare, Akamai). The most popular 1% of videos (long tail: cat videos, trending) are cached at the edge. Niche videos are served from regional caches or direct from origin. Use <strong>LRU eviction</strong> at each edge node with locality-aware routing.</p>`
      }
    ],
  },
  {
    id: "microservices", title: "Module 4 — Microservices Architecture",
    lessons: [
      {
        id: "api-gateways", title: "API Gateways & Kong", duration: "35 min",
        description: "Deploy API gateways for rate limiting, authentication, routing, and request transformation. Implement Kong or Envoy as the sole entry point for all microservices.",
        content: `<h2>The API Gateway Pattern</h2>
<p>In a microservices architecture, each service exposes its own API. But clients should not call services directly — that creates tight coupling, exposes internal services, and forces every client to handle authentication, rate limiting, and routing. An <strong>API Gateway</strong> sits in front of all services and handles cross-cutting concerns.</p>
<h3>Gateway Responsibilities</h3>
<p>An API Gateway handles: <strong>authentication</strong> (validate JWT/OAuth), <strong>rate limiting</strong> (token bucket per client), <strong>routing</strong> (path-based to appropriate service), <strong>request/response transformation</strong>, <strong>load balancing</strong>, <strong>caching</strong>, and <strong>circuit breaking</strong>. Kong, Envoy, and AWS API Gateway are the most popular implementations.</p>
<pre><code class="language-yaml"># Kong Declarative Configuration (decK)
_format_version: "3.0"
services:
  - name: user-service
    url: http://user-svc.internal:3000
    routes:
      - name: user-routes
        paths:
          - /api/users
        methods: [GET, POST, PUT, DELETE]
    plugins:
      - name: rate-limiting
        config:
          minute: 60
          policy: redis
      - name: jwt
        config:
          claims_to_verify: ["exp", "nbf"]
          secret_is_base64: false

  - name: order-service
    url: http://order-svc.internal:3001
    routes:
      - name: order-routes
        paths:
          - /api/orders
        methods: [GET, POST]
    plugins:
      - name: cors
        config:
          origins: ["https://app.opensyntax.com"]
          methods: ["GET", "POST", "PUT", "DELETE"]

  - name: payment-service
    url: http://payment-svc.internal:3002
    routes:
      - name: payment-routes
        paths:
          - /api/payments
    plugins:
      - name: ip-restriction
        config:
          allow: ["10.0.0.0/8", "172.16.0.0/12"]
</code></pre>
<h3>Backend for Frontend (BFF)</h3>
<p>For complex apps, use a <strong>BFF</strong> pattern — a separate gateway per client type (web, mobile, IoT). The web BFF might return HTML, the mobile BFF returns compact JSON, and the IoT BFF uses Protobuf. This prevents a single gateway from becoming a monolith.</p>`
      },
      {
        id: "service-mesh", title: "Service Mesh & Sidecar Proxy (Istio)", duration: "45 min",
        description: "Implement a service mesh with Istio and Envoy sidecars. Achieve mTLS, traffic splitting, circuit breaking, and observability without modifying application code.",
        content: `<h2>Service Mesh Fundamentals</h2>
<p>A <strong>service mesh</strong> moves network logic (retries, timeouts, load balancing, service discovery, mTLS) out of the application and into a <strong>sidecar proxy</strong> that runs alongside each service instance. Envoy is the most common sidecar.</p>
<h3>Istio Architecture</h3>
<p>Istio injects an Envoy sidecar into every pod. All incoming and outgoing traffic is routed through the sidecar. The <strong>control plane</strong> (istiod) distributes configuration to all sidecars, enabling fine-grained traffic management across the entire mesh.</p>
<pre><code class="language-yaml"># Istio VirtualService — traffic splitting for canary deployments
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: recommendation
spec:
  hosts:
  - recommendation
  http:
  - match:
    - headers:
        x-canary:
          exact: "true"
    route:
    - destination:
        host: recommendation
        subset: v2
      weight: 100
  - route:
    - destination:
        host: recommendation
        subset: v1
      weight: 90
    - destination:
        host: recommendation
        subset: v2
      weight: 10
---
# DestinationRule — circuit breaker and mTLS
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: recommendation-circuit-breaker
spec:
  host: recommendation
  trafficPolicy:
    tls:
      mode: ISTIO_MUTUAL
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        http1MaxPendingRequests: 10
        maxRequestsPerConnection: 10
    outlierDetection:
      consecutive5xxErrors: 5
      interval: 30s
      baseEjectionTime: 30s
</code></pre>
<h3>Observability</h3>
<p>Envoy sidecars automatically emit metrics (request count, latency, error rate), distributed traces (via Zipkin/Jaeger), and access logs. With zero application changes, you get a complete service dependency graph and per-request trace through every hop.</p>`,
        quiz: [
          {
            question: "What is the primary advantage of using a service mesh sidecar over embedding network logic in the application code?",
            options: ["Sidecars are faster than application code", "Sidecars handle network concerns (retries, mTLS, tracing) without modifying application code", "Sidecars reduce the number of containers needed", "Sidecars automatically fix application bugs"],
            correctIndex: 1,
            explanation: "The sidecar proxy handles all network-level concerns transparently. Developers write business logic without worrying about service discovery, retries, timeouts, mTLS, or distributed tracing — the mesh handles it uniformly across all services."
          }
        ]
      },
      {
        id: "event-driven-kafka", title: "Event-Driven Design with Kafka", duration: "40 min",
        description: "Design event-driven microservices using Kafka. Master partitioning, consumer groups, exactly-once semantics, and schema registry for data contract evolution.",
        content: `<h2>Event-Driven Architecture</h2>
<p>In event-driven architecture, services communicate through <strong>events</strong> rather than direct HTTP calls. When a service produces an event, it publishes to a message broker. Any interested service consumes that event asynchronously. This decouples producers from consumers and enables new consumers to be added without changing producers.</p>
<h3>Kafka Topics & Partitions</h3>
<p>Kafka organizes events into <strong>topics</strong>. Each topic is split into <strong>partitions</strong> for parallelism. Events with the same key (e.g., <code>user_id</code>) go to the same partition, preserving order. Consumers in a consumer group divide partitions among themselves for load-balanced consumption.</p>
<pre><code class="language-typescript">// Event Producer — Order Service
import { Kafka, Producer } from "kafkajs";

const kafka = new Kafka({ brokers: ["kafka-1:9092", "kafka-2:9092"] });
const producer: Producer = kafka.producer();

interface OrderCreatedEvent {
  eventType: "order.created";
  orderId: string;
  userId: string;
  items: Array<{ productId: string; quantity: number; price: number }>;
  total: number;
  timestamp: number;
}

async function publishOrderCreated(order: OrderCreatedEvent) {
  await producer.connect();
  await producer.send({
    topic: "orders",
    messages: [
      {
        key: order.userId, // Ensures all events for this user are ordered
        value: JSON.stringify(order),
        headers: { "event-type": "order.created", "version": "2" },
      },
    ],
  });
}

// Event Consumer — Inventory Service
import { Kafka, Consumer } from "kafkajs";

const consumer: Consumer = kafka.consumer({ groupId: "inventory-service" });

async function consumeOrders() {
  await consumer.connect();
  await consumer.subscribe({ topic: "orders", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value!.toString());

      if (event.eventType === "order.created") {
        // Deduct inventory for each item
        for (const item of event.items) {
          await inventoryDb.decrementStock(item.productId, item.quantity);
        }
        console.log("Inventory updated for order " + event.orderId);
      }
    },
  });
}
</code></pre>
<h3>Schema Registry</h3>
<p>Use <strong>Avro</strong> or <strong>Protobuf</strong> with a Schema Registry to enforce data contracts. When a producer changes the event schema, the registry validates compatibility (backward/forward/full) before allowing the new schema. Consumers are warned automatically.</p>`
      },
      {
        id: "saga-patterns", title: "Saga Patterns & Distributed Transactions", duration: "50 min",
        description: "Implement sagas for distributed transactions across microservices. Compare choreography (event-based) vs orchestration (command-based) sagas with practical examples using the Outbox pattern.",
        content: `<h2>The Saga Pattern</h2>
<p>In a distributed system, a single business operation spans multiple services. A <strong>saga</strong> is a sequence of local transactions where each step publishes an event or message triggering the next step. If a step fails, the saga runs <strong>compensating transactions</strong> to undo previous steps.</p>
<h3>Choreography vs Orchestration</h3>
<p><strong>Choreography</strong>: each service listens for events and decides what to do next. Decentralized, but business logic is spread across services. <strong>Orchestration</strong>: a central coordinator (the orchestrator) tells each service what to do. Centralized control, easier to reason about, but the orchestrator can become a bottleneck.</p>
<pre><code class="language-typescript">// Orchestration Saga — Order Fulfillment
// The orchestrator tells each service what to do and handles compensation

class OrderSagaOrchestrator {
  async execute(orderId: string): Promise<void> {
    try {
      // Step 1: Reserve inventory
      await this.inventoryService.reserve(orderId);

      // Step 2: Process payment
      await this.paymentService.charge(orderId);

      // Step 3: Ship the order
      await this.shippingService.ship(orderId);

      // Step 4: Send confirmation
      await this.notificationService.sendConfirmation(orderId);
    } catch (error) {
      // Compensation: undo completed steps in reverse order
      if (error.step >= 3) await this.shippingService.cancelShipment(orderId);
      if (error.step >= 2) await this.paymentService.refund(orderId);
      if (error.step >= 1) await this.inventoryService.release(orderId);

      await this.notificationService.sendFailure(orderId, error);
    }
  }
}

// Outbox Pattern — Reliable event publication without 2PC
// Instead of dual-writing to DB and Kafka (which can fail partially),
// write the event to an "outbox" table in the same DB transaction.
// A separate process polls the outbox and publishes to Kafka.

async function createOrder(order: Order, outboxRepo: OutboxRepository) {
  // Single database transaction
  await db.transaction(async (tx) => {
    // 1. Write order to orders table
    await tx.orders.insert(order);

    // 2. Write event to outbox table (same transaction!)
    await tx.outbox.insert({
      aggregateType: "order",
      aggregateId: order.id,
      eventType: "OrderCreated",
      payload: JSON.stringify(order),
      createdAt: new Date(),
    });
  });

  // Outbox publisher (separate process) will:
  // 1. Poll outbox table every 100ms
  // 2. Publish each event to Kafka
  // 3. Delete the outbox record on successful publish
  // Guarantee: at-least-once delivery with exactly-once DB semantics
}</code></pre>`
      }
    ]
  },
  {
    id: "case-studies-advanced", title: "Module 5 — Real-World Case Studies",
    lessons: [
      {
        id: "design-youtube", title: "Design: YouTube", duration: "55 min",
        description: "Reverse-engineer YouTube's architecture. Video ingestion pipeline, transcoding with DAG-based job scheduling, CDN edge caching strategy, and ML-powered recommendation system.",
        content: `<h2>YouTube Architecture Deep Dive</h2>
<p>YouTube serves 2.5 billion monthly active users, 500 hours of video uploaded every minute, and 1 billion hours watched daily. The architecture spans Google's global infrastructure — from custom hardware (Argos video encoder) to ML models (Ranking/Deep Neural Networks for recommendations).</p>
<h3>Video Processing Pipeline</h3>
<p>When a video is uploaded, YouTube's pipeline splits it into <strong>10-second chunks</strong> and transcodes each chunk to multiple resolutions (144p to 8K) simultaneously using a <strong>DAG-based job scheduler</strong>. Each chunk's transcoding is an independent task — if one fails, only that chunk is retried.</p>
<pre><code class="language-python"># Simplified YouTube video processing DAG
# Each chunk at each resolution is an independent task

dag = {
    "video_12345": {
        "chunks": ["chunk_001", "chunk_002", ..., "chunk_150"],
        "resolutions": ["360p", "720p", "1080p", "4K"],
        "tasks": [
            # Each task: transcode(chunk, resolution)
            # 150 chunks x 4 resolutions = 600 parallel tasks
            {"id": "transcode_001_360p", "depends_on": [], "retries": 3},
            {"id": "transcode_001_720p", "depends_on": [], "retries": 3},
            {"id": "transcode_002_360p", "depends_on": [], "retries": 3},
            ...
        ],
        "post_processing": [
            {"id": "generate_playlist", "depends_on": ["transcode_*"], "retries": 2},
            {"id": "generate_thumbnails", "depends_on": [], "retries": 2},
            {"id": "content_classification", "depends_on": ["generate_playlist"]},
        ]
    }
}

# Data flow:
# Upload → Object Store (GCS) → Transcoding Farm → CDN Origin
#                                                     ↓
#                                           Edge Cache (2000+ nodes)
#                                                     ↓
#                                             Client Device</code></pre>
<h3>Recommendation System</h3>
<p>YouTube's recommendation system uses a two-stage architecture. <strong>Candidate generation</strong> (Deep Neural Networks) retrieves hundreds of relevant videos from billions. <strong>Ranking</strong> (wide & deep model with cross-features) scores and orders them by expected watch time. Features include: watch history, search queries, device type, time of day, and demographic.</p>`,
        quiz: [
          {
            question: "Why does YouTube split videos into 10-second chunks before transcoding?",
            options: ["To reduce storage costs", "To enable parallel transcoding — each chunk is an independent task that can be retried individually", "To make videos load faster on slow connections", "To simplify the upload protocol"],
            correctIndex: 1,
            explanation: "Chunking enables massive parallelism. Each chunk at each resolution is an independent transcoding task (e.g., a 25-min video creates 150 chunks x 4 resolutions = 600 parallel tasks). If one transcoding fails, only that chunk is re-encoded, not the entire video."
          }
        ]
      },
      {
        id: "design-whatsapp", title: "Design: WhatsApp", duration: "45 min",
        description: "Architect a WhatsApp-scale messaging system. WebSocket connection management, end-to-end encryption (Signal Protocol), media CDN, and multi-device sync for 2 billion users.",
        content: `<h2>WhatsApp Architecture</h2>
<p>WhatsApp handles 100+ billion messages daily across 2 billion users with a lean team of ~50 engineers. The architecture emphasizes simplicity: Erlang on the server side (for hot-code swapping and fault tolerance), custom FreeBSD kernel optimizations, and the Signal Protocol for end-to-end encryption.</p>
<h3>Connection Management</h3>
<p>Each user maintains a persistent TCP connection to WhatsApp's servers. A <strong>session manager</strong> tracks which server a user is connected to. When user A sends a message to user B, server A looks up B's connection endpoint in the session DB and forwards the message internally. This prevents messages from being routed through multiple hops.</p>
<pre><code class="language-erlang">% Simplified WhatsApp message routing in Erlang
-module(chat_server).
-export([route_message/3, handle_connection/2]).

% Session table: maps user_id -> {server_pid, socket}
% Stores this in ETS (in-memory) for sub-millisecond lookup

route_message(FromUser, ToUser, MsgPayload) ->
    case ets:lookup(sessions, ToUser) of
        [{ToUser, {ServerPid, _Socket}}] ->
            % User is connected to THIS server
            ServerPid ! {deliver, ToUser, FromUser, MsgPayload};
        [] ->
            % User is on another server or offline
            % Look up in global session table (Cassandra)
            case global_session:lookup(ToUser) of
                {ok, {RemoteServer, RemoteEndpoint}} ->
                    % Forward to the correct server via internal RPC
                    rpc:call(RemoteServer, chat_server, 
                             deliver_message, [ToUser, FromUser, MsgPayload]);
                not_found ->
                    % Store for offline delivery
                    offline_store:save(ToUser, FromUser, MsgPayload)
            end
    end.

% End-to-end encryption: messages are encrypted client-side
% The server never has access to plaintext content
% Signal Protocol with X3DH key agreement + Double Ratchet</code></pre>
<h3>Multi-Device Architecture</h3>
<p>WhatsApp supports up to 4 linked devices per account. Each device has its own identity key pair. The Signal Protocol's <strong>sessions</strong> are established between each pair of devices. A message sent from phone to desktop goes: phone → server → desktop. The server stores <strong>encrypted message history</strong> for sync — it has the ciphertext but never the keys.</p>`
      },
      {
        id: "design-uber", title: "Design: Uber", duration: "50 min",
        description: "Build a ride-hailing platform at Uber scale. Real-time geospatial indexing with H3 hex grids, driver dispatch with the economic dispatch problem, surge pricing, and eta prediction.",
        content: `<h2>Uber Architecture Deep Dive</h2>
<p>Uber connects millions of riders with drivers in real-time across 10,000+ cities. The core technical challenges: real-time geospatial queries (find nearby drivers), the economic dispatch problem (which driver to assign), surge pricing (dynamic pricing based on supply/demand), and accurate ETA prediction.</p>
<h3>Geospatial Indexing with H3</h3>
<p>Uber internally developed <strong>H3</strong>, a hexagonal hierarchical geospatial indexing system. The world is divided into hexagons at 16 resolution levels (each level covers 1/7th the area of the parent). Hexagons are superior to squares because they have uniform neighbor distances — every hexagon has exactly 6 neighbors, all equidistant.</p>
<pre><code class="language-python">import h3
from geopy.distance import distance

# Find all drivers within a 2km radius
def find_nearby_drivers(lat: float, lng: float, radius_km: float = 2.0):
    # Step 1: Get the hexagon at resolution 10 (~0.07 km² per hex)
    rider_hex = h3.latlng_to_cell(lat, lng, 10)

    # Step 2: Get all hexagons within the search radius
    search_hexes = h3.grid_disk(rider_hex, k=6)  # ~2km radius at res 10

    # Step 3: Query drivers indexed by hex in Redis
    pipeline = redis.pipeline()
    for hex_id in search_hexes:
        pipeline.smembers(f"drivers:hex:{hex_id}")
    driver_ids = set()
    for members in pipeline.execute():
        driver_ids.update(members)

    return driver_ids

# Driver dispatch: economic dispatch problem
# Given N available drivers and M rider requests, minimize:
#   total_wait_time + surge_adjustment + fairness_penalty
# Solved with the Hungarian algorithm (min-cost bipartite matching)</code></pre>
<h3>Surge Pricing Algorithm</h3>
<p>Surge pricing is a real-time supply/demand balancing mechanism. When demand exceeds supply in a geospatial area, prices increase to incentivize more drivers to move into that area. The algorithm considers: current rider requests in area, available drivers, time of day, weather events, and historical demand patterns. Prices are recalculated every 2-3 minutes.</p>`
      },
      {
        id: "design-twitter", title: "Design: Twitter/X", duration: "40 min",
        description: "Design Twitter's timeline system. Fan-out on write vs fan-out on read, timeline caching with Redis, the tweet storage with snowflake IDs, and the anti-abuse system.",
        content: `<h2>Twitter Architecture</h2>
<p>Twitter serves 500M+ tweets per day with a unique challenge: the <strong>timeline</strong> must be personalized for each user, combining tweets from followed accounts with ranking (chronological vs algorithmic). The core architectural decision is the <strong>fan-out strategy</strong>.</p>
<h3>Fan-Out on Write vs Fan-Out on Read</h3>
<p><strong>Fan-out on write</strong>: when a celebrity tweets, pre-insert the tweet into the timelines of all followers. Pro: reads are instant (just query timeline cache). Con: celebrities with millions of followers cause huge write amplification. <strong>Fan-out on read</strong>: on timeline load, query the tweets of followed users and merge. Pro: no write amplification. Con: slow reads for users following thousands of accounts.</p>
<p>Twitter uses a <strong>hybrid approach</strong>: fan-out on write for regular users (up to ~30K followers), fan-out on read for celebrities with millions of followers. The timeline cache is a Redis sorted set (<code>timeline:{user_id}</code>) with tweet ID as score.</p>
<pre><code class="language-python">import redis
import json

redis_client = redis.Redis(host="timeline-cache", port=6379)

def post_tweet(user_id: str, tweet: dict):
    tweet_id = snowflake_next_id()
    tweet["id"] = tweet_id

    # Persist tweet to Cassandra
    cassandra.insert("tweets", {"tweet_id": tweet_id, "user_id": user_id, "data": json.dumps(tweet)})

    # Get follower count
    follower_count = redis_client.scard(f"followers:{user_id}")

    FANOUT_THRESHOLD = 30000  # ~30K followers

    if follower_count <= FANOUT_THRESHOLD:
        # Fan-out on write: insert into all followers' timelines
        follower_ids = redis_client.smembers(f"followers:{user_id}")
        pipeline = redis_client.pipeline()
        for follower_id in follower_ids:
            pipeline.zadd(f"timeline:{follower_id}", {tweet_id: tweet_id})
        pipeline.execute()
    else:
        # Celebrity: store tweet for fan-out on read
        redis_client.zadd(f"celebrity_tweets:{user_id}", {tweet_id: tweet_id})

def get_timeline(user_id: str, page: int = 1, page_size: int = 20):
    # Get timeline from cache (fan-out on write tweets)
    start = (page - 1) * page_size
    end = start + page_size - 1
    tweet_ids = redis_client.zrevrange(f"timeline:{user_id}", start, end)

    # Additionally, fan-out on read for celebrities the user follows
    celeb_follows = redis_client.smembers(f"celebrity_follows:{user_id}")
    for celeb_id in celeb_follows:
        celeb_tweets = redis_client.zrevrange(f"celebrity_tweets:{celeb_id}", 0, page_size)
        tweet_ids.extend(celeb_tweets)

    # Fetch full tweet data from Cassandra
    tweets = cassandra.batch_get("tweets", tweet_ids)
    return sorted(tweets, key=lambda t: t["id"], reverse=True)[:page_size]
</code></pre>`,
        quiz: [
          {
            question: "Why does Twitter use a hybrid fan-out strategy instead of fan-out on write for all users?",
            options: ["Fan-out on write is slower", "Celebrities with millions of followers would cause massive write amplification — inserting the tweet into millions of timeline caches", "Fan-out on write does not work with Redis", "Twitter does not use Redis"],
            correctIndex: 1,
            explanation: "When a user with 100M followers tweets, fan-out on write would require 100M Redis ZADD operations. This is impractical. Instead, Twitter fan-out on write for users with <30K followers and fan-out on read for celebrities — the timeline is populated by querying the celebrity's recent tweets on demand."
          }
        ]
      }
    ]
  }
]

export default function SystemDesignPage() {
  return (
    <div className="bg-background text-foreground font-sans">
      <Navbar />
      <LessonPlayer
        title="System Design"
        description="Master the art of designing scalable distributed systems. Load balancers, database sharding, caching strategies, message queues, rate limiting, and real-world case studies from companies serving billions."
        category="Systems"
        accentColor="#E44D26"
        modules={systemDesignModules}
        instructor="Alex Xu"
        rating={4.9}
        reviewCount={5600}
        lastUpdated="Mar 2026"
      />
    </div>
  )
}
