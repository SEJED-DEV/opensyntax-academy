import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { LessonPlayer, type Module } from "@/components/lesson-player"

export const metadata: Metadata = {
  title: "Advanced Discord Development — discord.py, Sharding & asyncpg",
  description: "Build production-grade Discord bots from events to economy systems. Master Cogs, slash commands, asyncpg, horizontal sharding, Redis IPC, gamification, and Docker/Kubernetes deployment.",
  keywords: ["Discord Bot Course", "discord.py Tutorial", "Discord Bot Development", "Python Bot", "Slash Commands", "Bot Sharding", "Discord Economy", "Docker Deployment"],
}

const discordModules: Module[] = [
  {
    id: "discord-tier-1", title: "Tier 1: Foundations — Bot Architecture",
    lessons: [
      {
        id: "intro-discord-py", title: "Python Setup & Bot Instantiation", duration: "25 min",
        description: "Set up your environment (PyPI, venv) and establish bird-eye connectivity with the Discord Gateway.",
        content: `<h2>Bot Initialization</h2>
<p>Modern Discord bot development relies on asynchronous Python. The <code>discord.py</code> library provides a comprehensive async API wrapping the Discord Gateway.</p>
<h3>Simple Event Listening</h3>
<pre><code class="language-python">import discord
from discord.ext import commands

class MyBot(commands.Bot):
    async def setup_hook(self):
        print(f'Logged in as {self.user}')

bot = MyBot(command_prefix='!', intents=discord.Intents.all())
bot.run('TOKEN')</code></pre>`
      },
      {
        id: "gateway-intents", title: "Gateway Intents & Privileged Intents", duration: "30 min",
        description: "Master Discord's Gateway Intents system. Understand privileged intents, caching, and event dispatch optimization.",
        content: `<h2>Gateway Intents</h2>
<p>Discord's <strong>Gateway Intents</strong> system allows bots to subscribe to specific event types. This reduces bandwidth and improves performance by only receiving the events your bot actually needs.</p>
<pre><code class="language-python">import discord
from discord.ext import commands

# Selective intents for performance
intents = discord.Intents.default()
intents.message_content = True   # Privileged — needed for message content
intents.members = True          # Privileged — needed for member events
intents.guilds = True

bot = commands.Bot(command_prefix='!', intents=intents)
bot.run('TOKEN')

# Verify which intents are active
print(f"Active intents: {bot.intents}")</code></pre>`,
        quiz: [
          {
            question: "Why should you only enable the intents your bot actually needs?",
            options: ["To reduce API latency", "To pass Discord verification requirements and reduce bandwidth", "To lower hosting costs", "All of the above"],
            correctIndex: 3,
            explanation: "Selective intents improve performance, reduce bandwidth, and are required by Discord's verification process for privileged intents."
          }
        ]
      },
      {
        id: "commands-parameters", title: "Commands & Advanced Parameter Parsing", duration: "35 min",
        description: "Build rich command interfaces with type hints, converters, autocomplete, and custom validators.",
        content: `<h2>Command Parameters</h2>
<p>discord.py provides powerful <strong>type converters</strong> that automatically transform string arguments into Python types like <code>discord.Member</code>, <code>discord.TextChannel</code>, or custom converters.</p>
<pre><code class="language-python">from discord.ext import commands

@bot.command(name="warn")
@commands.has_permissions(manage_messages=True)
async def warn(ctx, member: discord.Member, *, reason: str = "No reason provided"):
    """Warn a user with an optional reason."""
    await member.send(f"You were warned in {ctx.guild.name}: {reason}")
    await ctx.send(f"✅ Warned {member.mention} | Reason: {reason}")

@warn.error
async def warn_error(ctx, error):
    if isinstance(error, commands.MissingPermissions):
        await ctx.send("❌ You need Manage Messages permission to use this.")
    elif isinstance(error, commands.MemberNotFound):
        await ctx.send("❌ Member not found.")</code></pre>`
      }
    ]
  },
  {
    id: "discord-tier-2", title: "Tier 2: Intermediate — Feature Scaling",
    lessons: [
      {
        id: "cogs-slash", title: "Cogs & Slash Command Trees", duration: "40 min",
        description: "Modularize your bot into classes and implement native UI components like buttons and dropdowns.",
        content: `<h2>Modular Architecture with Cogs</h2>
<p>Cogs allow you to group related commands and listeners into separate modules. This is essential for large-scale bots.</p>
<pre><code class="language-python">class Moderation(commands.Cog):
    @app_commands.command(name="kick")
    async def kick(self, interaction: discord.Interaction, user: discord.Member):
        await user.kick()
        await interaction.response.send_message(f"Kicked {user}")</code></pre>
<h3>PostgreSQL Consistency</h3>
<p>In Tier 2, we integrate <strong>asyncpg</strong> to manage persistent data (prefixes, user profiles, etc.) with high-performance connection pooling.</p>`
      },
      {
        id: "modals-forms", title: "Modals & Interactive Forms", duration: "30 min",
        description: "Build rich modal dialogs for user input — feedback forms, configuration wizards, and ticket creation.",
        content: `<h2>Modal Dialogs</h2>
<p><strong>Modals</strong> are pop-up forms that allow your bot to collect structured data from users. They support text inputs with validation, labels, and placeholders.</p>
<pre><code class="language-python">class FeedbackModal(discord.ui.Modal, title="Submit Feedback"):
    name = discord.ui.TextInput(label="Your Name", placeholder="John Doe")
    rating = discord.ui.TextInput(
        label="Rating (1-5)", placeholder="5", min_length=1, max_length=1
    )
    comments = discord.ui.TextInput(
        label="Comments", style=discord.TextStyle.long,
        placeholder="Share your feedback...", required=False
    )

    async def on_submit(self, interaction: discord.Interaction):
        await interaction.response.send_message(
            f"Thanks {self.name.value}! Rating: {self.rating.value}/5", ephemeral=True
        )

@bot.tree.command(name="feedback")
async def feedback(interaction: discord.Interaction):
    await interaction.response.send_modal(FeedbackModal())</code></pre>`,
        quiz: [
          {
            question: "What UI component does Discord provide for collecting structured data from users?",
            options: ["Embeds", "Modals", "Buttons", "Select Menus"],
            correctIndex: 1,
            explanation: "Modals are pop-up form dialogs that support multiple text input fields with validation."
          }
        ]
      },
      {
        id: "context-menus-permissions", title: "Context Menus & Permission Systems", duration: "25 min",
        description: "Implement user and message context menus with granular permission checks and role hierarchies.",
        content: `<h2>Context Menu Commands</h2>
<p>Discord supports <strong>context menu commands</strong> that appear when right-clicking a user or message. These provide intuitive access to bot functionality without typing slash commands.</p>
<pre><code class="language-python">@bot.tree.context_menu(name="Report Message")
async def report_message(interaction: discord.Interaction, message: discord.Message):
    await interaction.response.defer(ephemeral=True)
    # Log the report
    log_channel = interaction.guild.get_channel(REPORT_CHANNEL_ID)
    embed = discord.Embed(
        title="Message Reported",
        description=f"**Content:** {message.content}\n**Author:** {message.author}",
        color=discord.Color.red()
    )
    await log_channel.send(embed=embed)
    await interaction.followup.send("✅ Report submitted.", ephemeral=True)</code></pre>`
      },
      {
        id: "audit-logging-moderation", title: "Audit Logging & Moderation Suite", duration: "35 min",
        description: "Build a complete moderation system with audit log integration, case management, and automated enforcement.",
        content: `<h2>Moderation Automation</h2>
<p>A production moderation system requires <strong>case tracking</strong>, <strong>appeal workflows</strong>, and <strong>automated enforcement</strong> (mute, warn, kick, ban). Store all actions in PostgreSQL for audit trails.</p>
<pre><code class="language-python">import asyncpg
from datetime import timedelta

class ModerationService:
    def __init__(self, pool: asyncpg.Pool):
        self.pool = pool

    async def create_case(self, guild_id: int, user_id: int,
                          moderator_id: int, action: str, reason: str) -> int:
        async with self.pool.acquire() as conn:
            case_id = await conn.fetchval("""
                INSERT INTO mod_cases (guild_id, user_id, moderator_id, action, reason)
                VALUES ($1, $2, $3, $4, $5) RETURNING id
            """, guild_id, user_id, moderator_id, action, reason)
            return case_id</code></pre>`
      }
    ]
  },
  {
    id: "discord-tier-3", title: "Tier 3: Production — Systems Engineering",
    lessons: [
      {
        id: "sharding-redis", title: "Dynamic Sharding & Distributed Caching", duration: "50 min",
        description: "Scale beyond 2,500 servers. Implementing cross-shard IPC and offloading compute to Celery.",
        content: `<h2>Scaling Architecture</h2>
<p>At production scale, a single instance cannot handle the gateway load. We use <strong>AutoShardedClient</strong> to distribute the WebSocket connection across multiple processes.</p>
<h3>Redis & IPC</h3>
<p>Use <strong>Redis</strong> for distributed caching and Inter-Process Communication (IPC). This allows shards running in different containers to sync state and share message queues efficiently.</p>
<p><strong>Performance Tip:</strong> Use Celery or Dramatiq to offload heavy compute tasks (like image generation) away from the bot's main async loop to prevent gateway timeouts.</p>`
      },
      {
        id: "task-queues-background", title: "Task Queues & Background Workers", duration: "35 min",
        description: "Offload blocking operations to Celery workers. Implement periodic tasks, scheduled cleanups, and delayed message processing.",
        content: `<h2>Background Task Processing</h2>
<p>Discord requires bot responses within 3 seconds. For longer operations, use a <strong>task queue</strong> like Celery to process work asynchronously in separate worker processes.</p>
<pre><code class="language-python">from celery import Celery
from discord.ext import tasks

app = Celery('bot_tasks', broker='redis://localhost:6379/0')

@app.task
def generate_leaderboard_image(guild_id: int):
    """Heavy image generation offloaded from bot process."""
    chart = create_chart(get_scores(guild_id))
    path = f"/tmp/leaderboard_{guild_id}.png"
    chart.savefig(path)
    return path

@tasks.loop(hours=1)
async def cleanup_expired_mutes():
    pool = await asyncpg.create_pool(DATABASE_URL)
    async with pool.acquire() as conn:
        await conn.execute("DELETE FROM mutes WHERE expires_at < NOW()")
    await pool.close()</code></pre>`,
        quiz: [
          {
            question: "Why should heavy compute tasks be offloaded from the main bot process?",
            options: ["To reduce memory usage", "To prevent Discord API timeouts (3-second limit)", "To use multiple cores", "To simplify code"],
            correctIndex: 1,
            explanation: "Discord expects a response within 3 seconds. Blocking the async event loop with heavy computation will cause gateway timeouts and disconnections."
          }
        ]
      },
      {
        id: "error-monitoring-alerting", title: "Error Monitoring & Alerting", duration: "25 min",
        description: "Implement Sentry crash reporting, Discord webhook alerts, and structured logging with loguru.",
        content: `<h2>Production Observability</h2>
<p>A production bot needs <strong>error tracking</strong>, <strong>structured logging</strong>, and <strong>real-time alerts</strong>. Use Sentry for crash reporting and Discord webhooks for operational alerts.</p>
<pre><code class="language-python">import sentry_sdk
from loguru import logger

sentry_sdk.init(dsn=os.environ['SENTRY_DSN'], traces_sample_rate=1.0)

@bot.event
async def on_command_error(ctx, error):
    logger.error(f"Command {ctx.command} failed: {error}")
    sentry_sdk.capture_exception(error)
    # Send alert to ops channel
    embed = discord.Embed(
        title="⚠️ Command Error",
        description=f"Command failed: {error}",
        color=discord.Color.orange()
    )
    ops_channel = bot.get_channel(OPS_CHANNEL_ID)
    await ops_channel.send(embed=embed)
    await ctx.send("An error occurred. The team has been notified.", ephemeral=True)</code></pre>`
      },
      {
        id: "slash-autocomplete", title: "Slash Command Autocomplete & Groups", duration: "30 min",
        description: "Build typeahead autocomplete for commands. Implement command groups, subcommands, and dynamic choices.",
        content: `<h2>Autocomplete & Command Groups</h2>
<p>Slash commands support <strong>autocomplete</strong> that shows suggestions as the user types. This is essential for commands with dynamic options like user search or item lookup.</p>
<pre><code class="language-python">@app_commands.command(name="profile")
@app_commands.autocomplete(member=autocomplete_members)
async def profile(self, interaction: discord.Interaction, member: discord.Member):
    user_data = await get_user_profile(member.id)
    embed = discord.Embed(title=f"{member.display_name}'s Profile")
    embed.add_field(name="XP", value=user_data['xp'])
    embed.add_field(name="Level", value=user_data['level'])
    await interaction.response.send_message(embed=embed)

async def autocomplete_members(interaction: discord.Interaction,
                                current: str) -> list[app_commands.Choice[str]]:
    members = [m for m in interaction.guild.members
               if current.lower() in m.display_name.lower()]
    return [app_commands.Choice(name=m.display_name, value=str(m.id))
            for m in members[:25]]</code></pre>`
      }
    ]
  },
  {
    id: "discord-tier-4", title: "Tier 4: Economy & Gamification",
    lessons: [
      {
        id: "virtual-currency-system", title: "Virtual Currency System", duration: "35 min",
        description: "Build a production-grade virtual economy with PostgreSQL transactions, daily rewards, and transfer mechanics.",
        content: `<h2>Virtual Economy</h2>
<p>A bot economy requires <strong>atomic transactions</strong> to prevent race conditions. Use PostgreSQL's <strong>row-level locking</strong> and transactions to ensure balances remain consistent even under high concurrency.</p>
<pre><code class="language-python">import asyncpg

async def transfer_currency(pool, sender_id: int, receiver_id: int, amount: int) -> bool:
    async with pool.acquire() as conn:
        async with conn.transaction():
            # Lock sender's row
            sender = await conn.fetchrow(
                "SELECT balance FROM economy WHERE user_id = $1 FOR UPDATE",
                sender_id
            )
            if not sender or sender['balance'] < amount:
                return False
            # Deduct from sender
            await conn.execute(
                "UPDATE economy SET balance = balance - $1 WHERE user_id = $2",
                amount, sender_id
            )
            # Credit receiver
            await conn.execute(
                "INSERT INTO economy (user_id, balance) VALUES ($1, $2) "
                "ON CONFLICT (user_id) DO UPDATE SET balance = economy.balance + $2",
                receiver_id, amount
            )
            return True</code></pre>`,
        quiz: [
          {
            question: "Why is 'SELECT ... FOR UPDATE' used in economy transactions?",
            options: ["To improve read performance", "To lock the row and prevent race conditions", "To encrypt the data", "To create a backup"],
            correctIndex: 1,
            explanation: "SELECT FOR UPDATE locks the row exclusively, preventing concurrent transactions from modifying it until the current transaction completes."
          }
        ]
      },
      {
        id: "xp-leveling-system", title: "XP & Leveling System", duration: "30 min",
        description: "Implement a scalable XP system with level-up announcements, cooldown-based earning, and role rewards.",
        content: `<h2>Leveling Mechanics</h2>
<p>A leveling system rewards user engagement. Use an <strong>exponential curve</strong> for XP requirements (each level requires more XP than the last) and enforce <strong>cooldowns</strong> to prevent spam.</p>
<pre><code class="language-python">import math, time
from collections import defaultdict

class XPManager:
    XP_PER_MESSAGE = 15
    COOLDOWN_SECONDS = 60
    cooldowns = defaultdict(float)

    @classmethod
    def xp_for_level(cls, level: int) -> int:
        """Exponential XP curve: each level needs 50% more XP."""
        return int(100 * (1.5 ** (level - 1)))

    @classmethod
    async def add_message_xp(cls, pool, user_id: int, guild_id: int) -> dict | None:
        now = time.time()
        if now - cls.cooldowns[user_id] < cls.COOLDOWN_SECONDS:
            return None  # On cooldown

        cls.cooldowns[user_id] = now
        async with pool.acquire() as conn:
            user = await conn.fetchrow(
                "SELECT xp, level FROM user_xp WHERE user_id=$1 AND guild_id=$2",
                user_id, guild_id
            )
            if not user:
                user = {'xp': 0, 'level': 1}
            new_xp = user['xp'] + cls.XP_PER_MESSAGE
            new_level = user['level']
            while new_xp >= cls.xp_for_level(new_level):
                new_xp -= cls.xp_for_level(new_level)
                new_level += 1
            await conn.execute("""
                INSERT INTO user_xp (user_id, guild_id, xp, level)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (user_id, guild_id) DO UPDATE
                SET xp=$3, level=$4
            """, user_id, guild_id, new_xp, new_level)
            return {'leveled_up': new_level > user['level'], 'new_level': new_level}</code></pre>`
      },
      {
        id: "leaderboards-redis", title: "Leaderboards with Redis Sorted Sets", duration: "25 min",
        description: "Build real-time leaderboards using Redis sorted sets for O(log n) rank queries and instant score updates.",
        content: `<h2>Real-Time Leaderboards</h2>
<p>PostgreSQL is not ideal for real-time leaderboards. Use <strong>Redis sorted sets</strong> which provide O(log n) add/update operations and instant rank queries — perfect for live leaderboards.</p>
<pre><code class="language-python">import redis.asyncio as redis

class Leaderboard:
    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client

    async def set_score(self, guild_id: int, user_id: int, score: int):
        key = f"leaderboard:{guild_id}"
        await self.redis.zadd(key, {str(user_id): score})

    async def get_rank(self, guild_id: int, user_id: int) -> int | None:
        key = f"leaderboard:{guild_id}"
        rank = await self.redis.zrevrank(key, str(user_id))
        return rank + 1 if rank is not None else None

    async def get_top(self, guild_id: int, count: int = 10) -> list[tuple[int, int]]:
        key = f"leaderboard:{guild_id}"
        results = await self.redis.zrevrange(key, 0, count - 1, withscores=True)
        return [(int(uid), int(score)) for uid, score in results]</code></pre>`
      },
      {
        id: "item-shop-inventory", title: "Item Shop & Inventory System", duration: "30 min",
        description: "Build a shop with purchasable items, user inventories, role purchases, and consumable item usage.",
        content: `<h2>Economy Shop</h2>
<p>An item shop lets users spend their virtual currency on <strong>roles</strong>, <strong>consumables</strong>, and <strong>cosmetics</strong>. Each purchase must validate balance, check inventory capacity, and apply the item effect.</p>
<pre><code class="language-python">class ShopItem:
    def __init__(self, item_id: str, name: str, cost: int, item_type: str, effect: str):
        self.item_id = item_id
        self.name = name
        self.cost = cost
        self.type = item_type  # 'role', 'consumable', 'cosmetic'
        self.effect = effect

SHOP_ITEMS = [
    ShopItem("vip_role", "VIP Role", 5000, "role", "gives VIP role"),
    ShopItem("xp_boost", "2x XP Boost (1h)", 1000, "consumable", "xp_boost"),
    ShopItem("name_color", "Custom Name Color", 2500, "cosmetic", "color"),
]

async def purchase_item(pool, redis_cli, user_id: int, item_id: str, guild_id: int):
    item = next((i for i in SHOP_ITEMS if i.item_id == item_id), None)
    if not item:
        return "Item not found"
    async with pool.acquire() as conn:
        balance = await conn.fetchval(
            "SELECT balance FROM economy WHERE user_id=$1", user_id
        )
        if not balance or balance < item.cost:
            return "Insufficient funds"
        await conn.execute(
            "UPDATE economy SET balance = balance - $1 WHERE user_id=$2",
            item.cost, user_id
        )
        await conn.execute(
            "INSERT INTO inventory (user_id, item_id, guild_id) VALUES ($1, $2, $3)",
            user_id, item_id, guild_id
        )
        return f"Purchased {item.name} for {item.cost} coins!"</code></pre>`
      }
    ]
  },
  {
    id: "discord-tier-5", title: "Tier 5: Deployment & Monitoring",
    lessons: [
      {
        id: "docker-containerization", title: "Docker Containerization", duration: "35 min",
        description: "Containerize your Discord bot with multi-stage Docker builds, volume management, and health checks.",
        content: `<h2>Docker for Bots</h2>
<p><strong>Docker</strong> ensures your bot runs the same way in development and production. Use <strong>multi-stage builds</strong> to keep images small and <strong>health checks</strong> to automatically restart unhealthy containers.</p>
<pre><code class="language-dockerfile"># Multi-stage Docker build
FROM python:3.12-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.12-slim
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY bot/ ./bot/
COPY config/ ./config/
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD python -c "import socket; socket.create_connection(('localhost', 8080))" || exit 1
CMD ["python", "-m", "bot.main"]</code></pre>`,
        quiz: [
          {
            question: "What is the benefit of multi-stage Docker builds?",
            options: ["Faster network speed", "Smaller final image size by separating build dependencies from runtime", "Automatic scaling", "Better logging"],
            correctIndex: 1,
            explanation: "Multi-stage builds use multiple FROM statements, copying only the runtime artifacts to the final image while discarding build tools and intermediate layers."
          }
        ]
      },
      {
        id: "kubernetes-orchestration", title: "Kubernetes Orchestration", duration: "40 min",
        description: "Deploy your bot to Kubernetes with Deployments, ConfigMaps, Horizontal Pod Autoscaling, and rolling updates.",
        content: `<h2>Kubernetes Deployment</h2>
<p><strong>Kubernetes</strong> orchestrates containerized applications. Deploy your bot with <strong>Deployments</strong> for declarative updates, <strong>ConfigMaps</strong> for configuration, and <strong>HPAs</strong> for automatic scaling based on CPU/memory.</p>
<pre><code class="language-yaml">apiVersion: apps/v1
kind: Deployment
metadata:
  name: discord-bot
spec:
  replicas: 3
  selector:
    matchLabels:
      app: discord-bot
  template:
    metadata:
      labels:
        app: discord-bot
    spec:
      containers:
      - name: bot
        image: myregistry/bot:latest
        envFrom:
        - secretRef:
            name: bot-secrets
        resources:
          requests: { cpu: "250m", memory: "256Mi" }
          limits:   { cpu: "500m", memory: "512Mi" }
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: discord-bot-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: discord-bot
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70</code></pre>`
      },
      {
        id: "prometheus-grafana", title: "Prometheus Metrics & Grafana Dashboards", duration: "30 min",
        description: "Instrument your bot with Prometheus metrics and build real-time Grafana dashboards for bot health and activity.",
        content: `<h2>Observability Stack</h2>
<p><strong>Prometheus</strong> collects metrics from your bot (commands per second, gateway latency, error rates) and <strong>Grafana</strong> visualizes them in real-time dashboards.</p>
<pre><code class="language-python">from prometheus_client import Counter, Histogram, Gauge, start_http_server
import time

commands_total = Counter('discord_commands_total', 'Total commands executed',
                         ['command', 'guild_id'])
command_duration = Histogram('discord_command_duration_seconds',
                              'Command execution duration',
                              ['command'], buckets=[0.1, 0.5, 1.0, 2.0, 5.0])
guilds_gauge = Gauge('discord_guilds_online', 'Number of guilds connected')

@bot.event
async def on_ready():
    start_http_server(8080)  # Prometheus metrics endpoint
    print("Metrics server started on :8080")

@bot.event
async def on_command_completion(ctx):
    commands_total.labels(command=ctx.command.name, guild_id=str(ctx.guild.id)).inc()
    guilds_gauge.set(len(bot.guilds))</code></pre>`
      },
      {
        id: "pm2-process-management", title: "PM2 Process Management & Auto-Restart", duration: "20 min",
        description: "Deploy and manage Node.js-based bots with PM2 — cluster mode, zero-downtime restarts, and log management.",
        content: `<h2>Process Management with PM2</h2>
<p><strong>PM2</strong> is a production process manager for Node.js applications. It provides <strong>auto-restart</strong> on crash, <strong>cluster mode</strong> for multi-core utilization, and built-in log management.</p>
<pre><code class="language-javascript">// ecosystem.config.js — PM2 configuration
module.exports = {
  apps: [{
    name: 'discord-bot',
    script: 'dist/index.js',
    instances: 2,          // Cluster mode
    exec_mode: 'cluster',
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
      DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    max_restarts: 10,
    restart_delay: 5000,
  }]
}
// Deploy with: pm2 start ecosystem.config.js</code></pre>`
      }
    ]
  }
]

export default function DiscordCoursePage() {
  return (
    <div className="bg-background text-foreground font-sans">
      <Navbar />
      <LessonPlayer
        title="Advanced Discord Development"
        description="Production-grade Discord bot architecture. Tiered from basic events to distributed sharding and Redis IPC."
        category="Discord"
        accentColor="#7289DA"
        modules={discordModules}
        instructor="Danny"
        rating={4.8}
        reviewCount={4200}
        lastUpdated="Feb 2026"
      />
    </div>
  )
}
