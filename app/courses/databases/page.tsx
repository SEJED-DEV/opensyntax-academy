import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { LessonPlayer, type Module } from "@/components/lesson-player"

export const metadata: Metadata = {
  title: "Database Engineering — PostgreSQL Internals & Redis",
  description: "Master production-grade database engineering with PostgreSQL internals, B-Tree indexing strategies, MVCC and vacuum tuning, query optimization with EXPLAIN, Redis data structures, event streaming, and database administration including replication, backup, and point-in-time recovery.",
  keywords: ["Database Course", "PostgreSQL Tutorial", "Redis Course", "SQL Optimization", "B-Tree Index", "Database Engineering", "Query Optimization", "Database Administration"],
}

const databasesModules: Module[] = [
  {
    id: "db-tier-1", title: "Tier 1: Foundations — Relational Theory & SQL",
    lessons: [
      {
        id: "sql-basics", title: "SQL Syntax & Normalization", duration: "30 min",
        description: "The core of data integrity. Understanding 1NF, 2NF, 3NF and the power of JOINs for reliable data modeling.",
        content: `<h2>The Relational Model</h2>
<p>Databases ensure <strong>Data Integrity</strong> through normalization. By following normalization rules, we prevent data duplication and update anomalies.</p>
<pre><code class="language-sql">-- Normalized schema example
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(customer_id),
    order_date TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'pending'
);

-- JOIN to reconstruct the full view
SELECT c.email, o.order_id, o.order_date
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE c.email = 'user@example.com';</code></pre>
<h3>The Power of JOINs</h3>
<p>Understanding <strong>Inner</strong>, <strong>Left</strong>, <strong>Right</strong>, and <strong>Full Outer Joins</strong> is the first step toward complex data reporting.</p>`
      },
      {
        id: "window-functions-subqueries", title: "Window Functions & Subqueries", duration: "35 min",
        description: "Build advanced analytical queries with window functions, CTEs, and correlated subqueries for sophisticated data transformations.",
        content: `<h2>Analytical SQL</h2>
<p><strong>Window functions</strong> perform calculations across rows related to the current row without collapsing them — perfect for running totals, moving averages, and ranking.</p>
<pre><code class="language-sql">-- Running total of sales per month with year-over-year comparison
SELECT
    DATE_TRUNC('month', order_date) AS month,
    SUM(amount) AS monthly_revenue,
    SUM(SUM(amount)) OVER (
        ORDER BY DATE_TRUNC('month', order_date)
        ROWS UNBOUNDED PRECEDING
    ) AS running_total,
    LAG(SUM(amount), 12) OVER (
        ORDER BY DATE_TRUNC('month', order_date)
    ) AS same_month_last_year
FROM orders
GROUP BY 1
ORDER BY 1;

-- Rank customers by total spend
SELECT
    customer_id,
    SUM(amount) AS lifetime_value,
    RANK() OVER (ORDER BY SUM(amount) DESC) AS rank
FROM orders
GROUP BY customer_id
HAVING SUM(amount) > 1000;</code></pre>
<p>Use <strong>CTEs</strong> (WITH clauses) to break complex queries into readable, composable steps that are easier to debug and optimize.</p>`
      },
      {
        id: "transactions-constraints", title: "Transactions & Constraints", duration: "30 min",
        description: "Master ACID transactions, isolation levels, foreign key constraints, and check constraints for bulletproof data integrity.",
        content: `<h2>ACID Transactions</h2>
<p>PostgreSQL guarantees <strong>Atomicity</strong>, <strong>Consistency</strong>, <strong>Isolation</strong>, and <strong>Durability</strong>. Understanding isolation levels — <strong>Read Committed</strong>, <strong>Repeatable Read</strong>, and <strong>Serializable</strong> — is critical for correct concurrent access.</p>
<pre><code class="language-sql">-- Transaction with error handling
BEGIN;

-- Reserve inventory
UPDATE products
SET stock_count = stock_count - 1
WHERE product_id = 123
  AND stock_count > 0;

-- Create order
INSERT INTO orders (customer_id, product_id, quantity, total)
VALUES (42, 123, 1, 29.99);

-- If any constraint fails, everything rolls back
COMMIT;

-- Check constraints protect data quality
ALTER TABLE products
ADD CONSTRAINT positive_stock
CHECK (stock_count >= 0);

ALTER TABLE orders
ADD CONSTRAINT valid_total
CHECK (total > 0);</code></pre>
<p>Use <strong>Serializable</strong> isolation only when necessary — it prevents all anomalies but reduces concurrency. Prefer <strong>Repeatable Read</strong> for most business logic.</p>`,
        quiz: [
          {
            question: "What happens if a CHECK constraint fails mid-transaction in PostgreSQL?",
            options: ["Only the violating row is skipped", "The entire transaction is rolled back", "The constraint is automatically dropped", "A warning is logged but the insert proceeds"],
            correctIndex: 1,
            explanation: "PostgreSQL treats constraint violations as errors that abort the current statement and roll back the transaction. All changes in the transaction are discarded."
          }
        ]
      }
    ]
  },
  {
    id: "db-tier-2", title: "Tier 2: Intermediate — Optimization & Caching",
    lessons: [
      {
        id: "indexing-redis", title: "B-Tree Indexes & Redis Caching", duration: "45 min",
        description: "Make queries fly with index strategies and reduce database load with Redis in-memory caching.",
        content: `<h2>Mastering Performance</h2>
<p>Slow queries kill applications. <strong>Indexes</strong> turn O(n) scans into O(log n) lookups. Using <code>EXPLAIN ANALYZE</code>, we see exactly where the database bottleneck is.</p>
<pre><code class="language-sql">-- Create a covering index for common query pattern
CREATE INDEX idx_orders_customer_date
ON orders (customer_id, order_date DESC)
INCLUDE (total, status);

-- Verify with EXPLAIN ANALYZE
EXPLAIN (ANALYZE, BUFFERS)
SELECT total, status
FROM orders
WHERE customer_id = 42
ORDER BY order_date DESC
LIMIT 10;</code></pre>
<h3>Redis Caching</h3>
<p>The fastest database query is the one you don't make. Use <strong>Redis</strong> to store frequently accessed data in RAM, reducing load on PostgreSQL.</p>`,
        quiz: [
          {
            question: "What is the primary benefit of a covering index with INCLUDE columns?",
            options: ["It reduces disk space usage", "It allows the query to be answered entirely from the index without touching the table (index-only scan)", "It automatically partitions the table", "It disables sequential scans"],
            correctIndex: 1,
            explanation: "A covering index includes all columns needed by a query, allowing PostgreSQL to satisfy the query entirely from the index pages, which are much faster to read than the heap."
          }
        ]
      },
      {
        id: "partial-covering-indexes", title: "Partial & Covering Indexes", duration: "35 min",
        description: "Build production-grade indexing strategies with partial indexes for filtered queries and covering indexes for index-only scans.",
        content: `<h2>Advanced Index Strategies</h2>
<p>Not all indexes are equal. <strong>Partial indexes</strong> only index a subset of rows, making them smaller and faster. <strong>Covering indexes</strong> (with INCLUDE) store extra columns in the index leaf pages for index-only scans.</p>
<pre><code class="language-sql">-- Partial index: only active orders (faster, smaller)
CREATE INDEX idx_active_orders
ON orders (customer_id, created_at)
WHERE status NOT IN ('cancelled', 'refunded');

-- Covering index: includes payload columns for index-only scans
CREATE INDEX idx_orders_lookup
ON orders (customer_id, order_date DESC)
INCLUDE (total, status, shipping_address);

-- Multi-column index with ordering
CREATE INDEX idx_products_search
ON products (category_id, price ASC, name)
WHERE available = true;

-- Test which index is being used
EXPLAIN (ANALYZE, BUFFERS, SETTINGS)
SELECT total, status FROM orders
WHERE customer_id = 99 AND status = 'shipped'
ORDER BY order_date DESC
LIMIT 20;</code></pre>
<p>Monitor index usage with <code>pg_stat_user_indexes</code> and drop unused indexes to speed up writes.</p>`
      },
      {
        id: "connection-pooling", title: "Connection Pooling & PgBouncer", duration: "30 min",
        description: "Scale your database connections with PgBouncer transaction pooling, connection limits, and queue management for high-traffic applications.",
        content: `<h2>Connection Management</h2>
<p>PostgreSQL forks a process per connection. At scale, thousands of connections overwhelm the server. <strong>PgBouncer</strong> multiplexes connections, allowing thousands of app connections to share a small pool of database connections.</p>
<pre><code class="language-ini"># pgbouncer.ini
[databases]
mydb = host=127.0.0.1 port=5432 dbname=mydb

[pgbouncer]
listen_addr = 0.0.0.0
listen_port = 6432
auth_type = scram-sha-256
auth_file = /etc/pgbouncer/userlist.txt

# Pool configuration
pool_mode = transaction
default_pool_size = 50
max_client_conn = 1000
max_db_connections = 80

# Timeouts
server_idle_timeout = 600
client_idle_timeout = 0
query_timeout = 30</code></pre>
<p><strong>Transaction pooling</strong> releases a connection back to the pool after each transaction, giving the best ratio of app connections to database connections.</p>`,
        quiz: [
          {
            question: "What does 'transaction pooling' in PgBouncer mean?",
            options: ["Each application connection keeps a dedicated database connection forever", "Database connections are released back to the pool after each transaction completes", "Transactions are batched together for performance", "The pool only accepts read-only transactions"],
            correctIndex: 1,
            explanation: "Transaction pooling returns connections to the pool after each transaction ends, allowing thousands of application connections to share a small pool of actual database connections."
          }
        ]
      }
    ]
  },
  {
    id: "db-tier-3", title: "Tier 3: Production — Systems Internals",
    lessons: [
      {
        id: "mvcc-streaming", title: "MVCC, Vacuuming & Event Streaming", duration: "60 min",
        description: "Master Multi-Version Concurrency Control (MVCC) internals, autovacuum tuning, and building event-driven systems with Redis Streams.",
        content: `<h2>PostgreSQL Internals</h2>
<p>PostgreSQL doesn't overwrite data; it creates <strong>dead tuples</strong> via MVCC. Configuring <strong>Autovacuum</strong> correctly is critical to prevent database bloat and transaction ID wraparound.</p>
<pre><code class="language-sql">-- Check table bloat
SELECT
    schemaname,
    relname,
    n_dead_tup,
    n_live_tup,
    round(n_dead_tup * 100.0 / NULLIF(n_live_tup + n_dead_tup, 0), 2) AS dead_pct
FROM pg_stat_user_tables
WHERE n_dead_tup > 1000
ORDER BY n_dead_tup DESC;

-- Configure aggressive autovacuum for a busy table
ALTER TABLE orders SET (
    autovacuum_vacuum_scale_factor = 0.01,
    autovacuum_vacuum_threshold = 1000,
    autovacuum_vacuum_cost_limit = -1
);</code></pre>
<h3>Event Streaming</h3>
<p>Modern architectures are event-driven. Use <strong>Redis Streams</strong> with <strong>Consumer Groups</strong> for reliable message processing across distributed workers.</p>`
      },
      {
        id: "wal-pitr", title: "WAL Architecture & Point-in-Time Recovery", duration: "45 min",
        description: "Deep dive into PostgreSQL WAL internals, continuous archiving, and point-in-time recovery for bulletproof disaster recovery.",
        content: `<h2>Write-Ahead Log</h2>
<p>The <strong>Write-Ahead Log (WAL)</strong> is PostgreSQL's reliability backbone. Every change is written to WAL before hitting data pages. This enables <strong>Point-in-Time Recovery (PITR)</strong> and <strong>streaming replication</strong>.</p>
<pre><code class="language-sql">-- WAL configuration (postgresql.conf)
wal_level = replica           # Minimum for replication
max_wal_senders = 10          # Concurrent replication connections
wal_keep_size = 1024          # MB of WAL to retain
archive_mode = on
archive_command = 'aws s3 cp %p s3://myorg-db-wal/%f'

-- Perform PITR recovery
-- recovery.conf (or postgresql.conf in PG12+)
restore_command = 'aws s3 cp s3://myorg-db-wal/%f %p'
recovery_target_time = '2026-06-15 14:30:00 UTC'
recovery_target_action = promote

-- Check WAL statistics
SELECT * FROM pg_stat_wal;
SELECT pg_walfile_name(pg_current_wal_lsn());</code></pre>
<p>Test PITR recovery regularly — untested backups are just wishes. Automate restoration in a staging environment as part of your DR drills.</p>`
      },
      {
        id: "logical-replication-replicas", title: "Logical Replication & Read Replicas", duration: "40 min",
        description: "Set up logical replication for selective data distribution, build read replicas for horizontal read scaling, and manage failover.",
        content: `<h2>Replication Strategies</h2>
<p><strong>Logical replication</strong> publishes changes at the row level, allowing selective replication of tables across different PostgreSQL versions. <strong>Read replicas</strong> distribute read traffic and provide high availability.</p>
<pre><code class="language-sql">-- Publisher (primary)
CREATE PUBLICATION orders_pub
FOR TABLE orders, order_items
WHERE (status IN ('active', 'shipped'));

-- Subscriber (replica)
CREATE SUBSCRIPTION orders_sub
CONNECTION 'host=primary.example.com port=5432 dbname=mydb'
PUBLICATION orders_pub
WITH (copy_data = true, connect = true);

-- Monitor replication lag
SELECT
    pid,
    application_name,
    state,
    sync_state,
    pg_wal_lsn_diff(
        pg_current_wal_lsn(),
        replay_lsn
    ) AS replay_lag_bytes
FROM pg_stat_replication;</code></pre>
<p>Use <strong>pg_rewind</strong> to quickly rejoin a former primary after a failover without re-syncing the entire database.</p>`
      }
    ]
  },
  {
    id: "db-tier-4", title: "Tier 4: Query Optimization & EXPLAIN",
    lessons: [
      {
        id: "reading-query-plans", title: "Reading Query Plans", duration: "40 min",
        description: "Master EXPLAIN and EXPLAIN ANALYZE output — understand sequential scans, index scans, hash joins, nested loops, and sort operations.",
        content: `<h2>Decoding EXPLAIN</h2>
<p><strong>EXPLAIN</strong> shows the query planner's chosen execution plan. <strong>EXPLAIN ANALYZE</strong> actually executes the query and reports real timings. The key is identifying expensive nodes: <strong>Sequential Scans</strong>, <strong>Nested Loops</strong>, and <strong>Sort operations</strong>.</p>
<pre><code class="language-sql">EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT c.name, SUM(o.total) AS total_spent
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_date >= NOW() - INTERVAL '30 days'
GROUP BY c.name
ORDER BY total_spent DESC
LIMIT 10;

-- Key plan nodes to watch for:
-- Seq Scan on large tables (bad)
-- Nested Loop with many iterations (bad)
-- Sort on disk (track_memory > work_mem)
-- Index Only Scan (excellent)
-- Hash Join with large inner relation (excellent)</code></pre>
<pre><code class="language-sql">-- Diagnose a slow query
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM orders
WHERE status = 'pending'
  AND order_date < NOW() - INTERVAL '7 days'
ORDER BY order_date;</code></pre>
<p>Look for <code>rows= vs. rows_examined=</code> mismatches — skewed statistics often cause bad plans. Run <code>ANALYZE</code> periodically.</p>`,
        quiz: [
          {
            question: "What does 'rows_examined' being much higher than 'rows' in an EXPLAIN ANALYZE output typically indicate?",
            options: ["The query is perfectly optimized", "The planner's row estimates are inaccurate, possibly due to stale statistics", "PostgreSQL is using a covering index", "The query is using parallel workers"],
            correctIndex: 1,
            explanation: "A large mismatch between estimated and actual rows means the planner has stale statistics. Run ANALYZE or increase default_statistics_target."
          }
        ]
      },
      {
        id: "index-only-scans", title: "Index-Only Scans & Visibility Maps", duration: "35 min",
        description: "Optimize for index-only scans by understanding visibility maps, HOT updates, and covering index design.",
        content: `<h2>Index-Only Scans</h2>
<p>An <strong>Index-Only Scan</strong> retrieves all required data from the index without touching the heap (table). This is possible when PostgreSQL can determine tuple visibility from the <strong>Visibility Map</strong>.</p>
<pre><code class="language-sql">-- Setup for index-only scans
CREATE INDEX idx_orders_covering
ON orders (customer_id, order_date DESC)
INCLUDE (total, status);

-- This should trigger an Index Only Scan
EXPLAIN (ANALYZE, BUFFERS)
SELECT customer_id, order_date, total, status
FROM orders
WHERE customer_id = 42
ORDER BY order_date DESC
LIMIT 50;

-- Check visibility map health
SELECT
    relname,
    pg_size_pretty(pg_relation_size(relid)) AS table_size,
    pg_size_pretty(pg_indexes_size(relid)) AS index_size,
    n_dead_tup,
    n_live_tup,
    round(100.0 * heap_blks_hit / NULLIF(heap_blks_hit + heap_blks_read, 0), 2) AS cache_hit_ratio
FROM pg_stat_user_tables
WHERE relname = 'orders';</code></pre>
<p><strong>HOT (Heap-Only Tuples)</strong> updates avoid index maintenance when no indexed columns change. Frequent HOT updates keep the visibility map clean for index-only scans.</p>`
      },
      {
        id: "cte-optimization", title: "CTE Optimization & Materialization", duration: "30 min",
        description: "Optimize CTE queries in PostgreSQL 16+ — understand materialization vs inlining, recursive CTEs, and when to use subqueries instead.",
        content: `<h2>CTE Performance</h2>
<p>PostgreSQL traditionally <strong>materializes</strong> CTEs, meaning the CTE runs to completion before the outer query uses its results. Since PG12, the planner may <strong>inline</strong> CTEs when they're used only once. Use <code>MATERIALIZED</code> or <code>NOT MATERIALIZED</code> to control behavior.</p>
<pre><code class="language-sql">-- Force materialization (useful for expensive CTEs used multiple times)
WITH regional_sales AS MATERIALIZED (
    SELECT region, SUM(amount) AS total_sales
    FROM orders
    WHERE order_date >= NOW() - INTERVAL '90 days'
    GROUP BY region
)
SELECT region, total_sales,
       total_sales * 100.0 / SUM(total_sales) OVER () AS percent
FROM regional_sales
ORDER BY total_sales DESC;

-- Force inlining (useful when CTE acts as a filter)
WITH high_value AS NOT MATERIALIZED (
    SELECT * FROM orders WHERE total > 1000
)
SELECT c.name, h.*
FROM customers c
JOIN high_value h ON c.customer_id = h.customer_id;

-- Recursive CTE: bill of materials / tree traversal
WITH RECURSIVE org_chart AS (
    SELECT employee_id, name, manager_id, 1 AS depth
    FROM employees WHERE manager_id IS NULL
    UNION ALL
    SELECT e.employee_id, e.name, e.manager_id, oc.depth + 1
    FROM employees e
    JOIN org_chart oc ON e.manager_id = oc.employee_id
)
SELECT * FROM org_chart ORDER BY depth, name;</code></pre>
<p>Always test with and without <code>MATERIALIZED</code>/<code>NOT MATERIALIZED</code> — the right choice depends on data size and query shape.</p>`
      },
      {
        id: "window-functions-performance", title: "Window Functions Performance", duration: "35 min",
        description: "Build high-performance analytical queries with window functions, frame specifications, and ordered-set aggregates for production reporting.",
        content: `<h2>Analytical Performance</h2>
<p>Window functions enable elegant analytical queries, but poor frame specifications can cause O(n²) performance. Understanding <strong>window framing</strong> and <strong>ordering</strong> is key to efficient query design.</p>
<pre><code class="language-sql">-- Efficient moving average with proper framing
SELECT
    date,
    revenue,
    AVG(revenue) OVER (
        ORDER BY date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS moving_avg_7day,
    AVG(revenue) OVER (
        ORDER BY date
        ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
    ) AS moving_avg_30day
FROM daily_revenue
ORDER BY date;

-- First/last value with framing
SELECT
    customer_id,
    order_date,
    total,
    FIRST_VALUE(total) OVER (
        PARTITION BY customer_id
        ORDER BY order_date DESC
    ) AS most_recent_order,
    LAST_VALUE(total) OVER (
        PARTITION BY customer_id
        ORDER BY order_date DESC
        RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS first_order
FROM orders;

-- Ordered-set aggregate for percentiles
SELECT
    department,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary) AS median_salary,
    PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY salary) AS p90_salary
FROM employees
GROUP BY department;</code></pre>
<p>Use <code>RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING</code> with <code>LAST_VALUE</code> to get correct results — the default frame only goes to <code>CURRENT ROW</code>.</p>`,
        quiz: [
          {
            question: "What is the default frame specification in PostgreSQL for window functions?",
            options: ["RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING", "RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW", "ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING", "No frame is applied by default"],
            correctIndex: 1,
            explanation: "The default frame is RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW, which means LAST_VALUE without an explicit frame usually returns the current row's value, not the last value in the partition."
          }
        ]
      }
    ]
  },
  {
    id: "db-tier-5", title: "Tier 5: Database Administration",
    lessons: [
      {
        id: "vacuum-deep-dive", title: "VACUUM Deep Dive", duration: "40 min",
        description: "Master PostgreSQL VACUUM internals, autovacuum tuning, bloat detection, and preventing transaction ID wraparound for 24/7 production databases.",
        content: `<h2>VACUUM Internals</h2>
<p>PostgreSQL's MVCC creates dead tuples that must be reclaimed. <strong>VACUUM</strong> marks space as reusable. <strong>VACUUM FULL</strong> rewrites the table to return space to the OS but locks the table. <strong>Autovacuum</strong> runs automatically based on thresholds.</p>
<pre><code class="language-sql">-- Manual vacuum with verbose output
VACUUM (VERBOSE, ANALYZE) orders;

-- Check autovacuum configuration
SELECT name, setting, unit, short_desc
FROM pg_settings
WHERE name LIKE 'autovacuum%';

-- Detect table bloat
CREATE EXTENSION IF NOT EXISTS pgstattuple;
SELECT * FROM pgstattuple('orders');

-- Monitor vacuum progress (PG13+)
SELECT
    pid,
    datname,
    relid::regclass AS table_name,
    phase,
    heap_blks_total,
    heap_blks_scanned,
    heap_blks_vacuumed,
    index_vacuum_count,
    max_dead_tuple_index
FROM pg_stat_progress_vacuum
WHERE datname = current_database();

-- Calculate wraparound safety margin
SELECT
    datname,
    age(datfrozenxid) AS xid_age,
    round(100.0 * age(datfrozenxid) / 200000000, 2) AS pct_toward_wraparound
FROM pg_database
ORDER BY xid_age DESC;</code></pre>
<p>Set <code>autovacuum_vacuum_cost_limit = -1</code> for critical tables to prevent bloat during peak traffic.</p>`,
        quiz: [
          {
            question: "What is the danger of transaction ID wraparound in PostgreSQL?",
            options: ["Queries become slightly slower", "The database can shut down or become read-only to prevent data loss", "Indexes are automatically dropped", "WAL files are deleted"],
            correctIndex: 1,
            explanation: "If the XID age reaches 2 billion (roughly), PostgreSQL enters emergency mode — shutting down or becoming read-only to prevent data corruption. Regular VACUUM freezes old XIDs to prevent this."
          }
        ]
      },
      {
        id: "replication-strategies", title: "Replication Strategies & High Availability", duration: "45 min",
        description: "Design high-availability PostgreSQL architectures with streaming replication, synchronous replication, Patroni clusters, and automated failover.",
        content: `<h2>High Availability Architecture</h2>
<p>Production databases need <strong>streaming replication</strong> for failover and read scaling. <strong>Synchronous replication</strong> ensures zero data loss at the cost of write latency. <strong>Patroni</strong> automates leader election and failover.</p>
<pre><code class="language-sql">-- Primary configuration (postgresql.conf)
wal_level = replica
max_wal_senders = 10
wal_keep_size = 1024
synchronous_standby_names = 'FIRST 2 (replica1, replica2, replica3)'

-- Standby configuration
primary_conninfo = 'host=primary.example.com port=5432 user=replicator'
primary_slot_name = 'standby1'
hot_standby = on

-- Check replication state
SELECT
    application_name,
    client_addr,
    state,
    sync_state,
    write_lag,
    flush_lag,
    replay_lag,
    pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn) AS bytes_behind
FROM pg_stat_replication;</code></pre>
<pre><code class="language-yaml"># Patroni configuration
scope: mydb-cluster
namespace: /service/
name: pg-primary
restapi:
  listen: 0.0.0.0:8008
  connect_address: 10.0.1.10:8008
consul:
  host: 10.0.0.10:8500
postgresql:
  listen: 0.0.0.0:5432
  connect_address: 10.0.1.10:5432
  parameters:
    wal_level: replica
    hot_standby: "on"
    max_wal_senders: 10</code></pre>
<p>Test failover regularly with <code>pg_ctl promote</code> on the standby and verify application reconnection.</p>`
      },
      {
        id: "read-replicas-load-balancing", title: "Read Replicas & Load Balancing", duration: "35 min",
        description: "Scale read traffic with PostgreSQL read replicas, connection routing, load balancing with HAProxy or Pgpool-II, and replica lag monitoring.",
        content: `<h2>Read Scaling</h2>
<p><strong>Read replicas</strong> handle SELECT traffic while the primary handles writes. Route queries using <strong>HAProxy</strong> or <strong>Pgpool-II</strong> to distribute load across replicas and fail over automatically.</p>
<pre><code class="language-haproxy"># haproxy.cfg
frontend pg_read_frontend
    bind *:6432
    mode tcp
    default_backend pg_read_replicas

backend pg_read_replicas
    mode tcp
    balance roundrobin
    option tcp-check
    server replica1 10.0.1.20:5432 check
    server replica2 10.0.1.21:5432 check
    server replica3 10.0.1.22:5432 check

frontend pg_write_frontend
    bind *:7432
    mode tcp
    default_backend pg_primary

backend pg_primary
    mode tcp
    option tcp-check
    server primary 10.0.1.10:5432 check</code></pre>
<pre><code class="language-sql">-- Monitor replica lag from any replica
SELECT
    CASE
        WHEN pg_last_wal_receive_lsn() = pg_last_wal_replay_lsn()
        THEN 0
        ELSE EXTRACT(EPOCH FROM NOW() - pg_last_xact_replay_timestamp())
    END AS replica_lag_seconds;

-- Check which server you're on
SELECT
    pg_is_in_recovery() AS is_replica,
    inet_server_addr() AS server_ip;</code></pre>
<p>Set <code>max_standby_archive_delay</code> and <code>max_standby_streaming_delay</code> to prevent long-running queries on replicas from blocking WAL replay.</p>`,
        quiz: [
          {
            question: "Why might a read replica show stale data even when replication lag is minimal?",
            options: ["The primary is down", "A long-running query on the replica conflicts with WAL replay, temporarily stalling it", "The replica is in read-only mode", "PostgreSQL doesn't support read replicas"],
            correctIndex: 1,
            explanation: "Long-running queries on a replica can block WAL replay while they hold snapshots. Setting max_standby_streaming_delay controls how long replay waits before canceling the conflicting query."
          }
        ]
      },
      {
        id: "backup-strategies-pitr", title: "Backup Strategies & Point-in-Time Recovery", duration: "40 min",
        description: "Design bulletproof backup strategies with pg_dump, pgBackRest, continuous WAL archiving, and automated PITR testing for disaster recovery compliance.",
        content: `<h2>Backup Engineering</h2>
<p>A proper backup strategy combines <strong>logical backups</strong> (pg_dump) for schema and selective data with <strong>physical backups</strong> (pgBackRest, WAL archiving) for full PITR capability. Test restoration regularly — untested backups are worthless.</p>
<pre><code class="language-bash">#!/bin/bash
# Automated backup using pgBackRest
# /etc/cron.d/pgbackrest

# Full backup every Sunday at 2 AM
0 2 * * 0 postgres \
  pgbackrest --stanza=mydb --type=full backup

# Incremental every other day at 2 AM
0 2 * * 1,2,3,4,5,6 postgres \
  pgbackrest --stanza=mydb --type=incr backup

# Retention policy: keep 4 full backups
# pgbackrest.conf
[global]
repo1-path=/backup/postgres
repo1-retention-full=4
repo1-retention-diff=4

[mydb]
pg1-path=/var/lib/postgresql/16/main</code></pre>
<pre><code class="language-sql">-- Logical backup for specific tables
-- pg_dump -t orders -t customers --format=custom mydb > critical_tables.dump

-- Test PITR restoration
-- 1. Restore base backup
-- 2. Configure restore_command to fetch WAL from S3
-- 3. Set recovery_target_time
-- 4. Verify data integrity with CHECKSUM or hash comparison</code></pre>
<p>Follow the <strong>3-2-1 rule</strong>: three copies, two media types, one off-site. Validate backups by restoring to a staging environment every month.</p>`
      }
    ]
  }
]

export default function DatabasesPage() {
  return (
    <div className="bg-background text-foreground font-sans">
      <Navbar />
      <LessonPlayer
        title="Database Engineering"
        description="Master the systems data layer. From relational theory and SQL normalization to PostgreSQL internals and high-performance event streaming."
        category="Systems"
        accentColor="#336791"
        modules={databasesModules}
        instructor="Martin Kleppmann"
        rating={5.0}
        reviewCount={1100}
        lastUpdated="Mar 2026"
      />
    </div>
  )
}
