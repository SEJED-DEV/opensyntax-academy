import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { LessonPlayer, type Module } from "@/components/lesson-player"

export const metadata: Metadata = {
  title: "Rust & Systems Programming — Memory Safety, Tokio & WebAssembly",
  description: "Master Rust's ownership model, fearless concurrency, and async programming with Tokio. Build production-grade systems with Rust: compile WASM modules, create C FFI bindings and PyO3 Python extensions, deploy embedded Rust on ESP32, and build an HTTP server from scratch.",
  keywords: ["Rust Course", "Systems Programming", "WebAssembly", "WASM", "Tokio", "Rustlang", "Memory Safety", "FFI", "PyO3", "Embedded Rust"],
}

const rustModules: Module[] = [
  {
    id: "rust-foundations", title: "Module 1 — Memory & Ownership",
    lessons: [
      {
        id: "ownership-borrowing", title: "Ownership & Borrowing", duration: "35 min",
        description: "Understand the compiler rules that make Rust memory-safe without a garbage collector.",
        content: `<h2>The Ownership Model</h2>
<p>Unlike languages with a Garbage Collector (Java, Python) or manual memory management (C, C++), Rust introduces a third paradigm: <strong>Ownership</strong>. It guarantees memory safety at compile time.</p>
<h3>Three Rules of Ownership</h3>
<ol>
  <li>Each value in Rust has an owner.</li>
  <li>There can only be one owner at a time.</li>
  <li>When the owner goes out of scope, the value will be dropped.</li>
</ol>
<pre><code class="language-rust">fn main() {
    let s1 = String::from("hello");
    let s2 = s1; // Ownership moves to s2
    
    // println!("{}, world!", s1); // ERROR: value borrowed here after move
    println!("{}, world!", s2); // Works perfectly
}</code></pre>

<h3>Borrowing with References</h3>
<p>If we want a function to use a value without taking ownership, we pass a reference (<code>&amp;</code>).</p>
<pre><code class="language-rust">fn calculate_length(s: &String) -> usize { // s is a reference to a String
    s.len()
} // Here, s goes out of scope. But because it does not have ownership, nothing is dropped.

fn main() {
    let s1 = String::from("hello");
    let len = calculate_length(&s1);
    println!("The length of '{}' is {}.", s1, len);
}</code></pre>`
      },
      {
        id: "lifetimes", title: "Lifetimes", duration: "30 min",
        description: "Learn how the compiler prevents dangling pointers.",
        content: `<h2>Validating References with Lifetimes</h2>
<p>Every reference in Rust has a <em>lifetime</em>, which is the scope for which that reference is valid. The Rust borrow checker uses lifetimes to ensure all borrows are valid.</p>
<pre><code class="language-rust">// This will fail to compile!
// fn longest(x: &str, y: &str) -> &str {
//    if x.len() > y.len() { x } else { y }
// }

// Correct implementation with explicit lifetime annotations
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
</code></pre>
<p>The notation <code>&lt;'a&gt;</code> tells the compiler that the returned reference will be valid as long as <em>both</em> parameters are valid. It prevents returning a reference to a string that might be dropped early.</p>`
      },
      {
        id: "smart-pointers", title: "Smart Pointers: Box, Rc, Arc & RefCell", duration: "40 min",
        description: "Master Rust's smart pointer types. Understand when to use Box for heap allocation, Rc for shared ownership, Arc for thread-safe sharing, and RefCell for interior mutability.",
        content: `<h2>Smart Pointers in Rust</h2>
<p>Rust's <strong>smart pointers</strong> are data structures that act like pointers but also provide additional metadata and capabilities. Unlike regular references (<code>&amp;</code>), smart pointers <strong>own</strong> the data they point to. The most common are <code>Box&lt;T&gt;</code>, <code>Rc&lt;T&gt;</code>, <code>Arc&lt;T&gt;</code>, and <code>RefCell&lt;T&gt;</code>.</p>
<h3>Box&lt;T&gt;: Heap Allocation</h3>
<p>Use <code>Box</code> when you have a type whose size is unknown at compile time (like recursive types) or when you want to transfer ownership of a large value without copying.</p>
<pre><code class="language-rust">use std::rc::Rc;
use std::cell::RefCell;
use std::sync::{Arc, Mutex};

// Box: heap allocation for recursive types
#[derive(Debug)]
enum List {
    Cons(i32, Box<List>),
    Nil,
}

// Rc: reference-counted shared ownership (single-threaded)
let shared = Rc::new(42);
let a = Rc::clone(&shared); // Increments reference count
let b = Rc::clone(&shared);

// RefCell: interior mutability with runtime borrow checking
let cell = RefCell::new(10);
*cell.borrow_mut() += 5;
assert_eq!(*cell.borrow(), 15);

// Arc: thread-safe reference counting (multi-threaded)
let arc = Arc::new(Mutex::new(vec![1, 2, 3]));
let arc_clone = Arc::clone(&arc);

std::thread::spawn(move || {
    let mut data = arc_clone.lock().unwrap();
    data.push(4);
}).join().unwrap();

// RefCell + Rc pattern for tree structures
#[derive(Debug)]
struct TreeNode {
    value: i32,
    children: RefCell<Vec<Rc<TreeNode>>>,
}</code></pre>
<h3>When to Use Which</h3>
<p><code>Box</code>: single ownership, heap-allocated. <code>Rc</code>: multiple read-only owners in single-threaded context. <code>Arc</code>: multiple owners across threads (use with <code>Mutex</code> or <code>RwLock</code>). <code>RefCell</code>: single owner that needs mutable access through shared references — panics if borrow rules violated at runtime.</p>`,
        quiz: [
          {
            question: "Why would you use Arc&lt;Mutex&lt;T&gt;&gt; instead of Rc&lt;RefCell&lt;T&gt;&gt; for sharing mutable data across threads?",
            options: ["Arc is faster than Rc", "Rc is not thread-safe (does not implement Send), so it cannot be moved across threads", "RefCell cannot hold integers", "Arc can only hold Box types"],
            correctIndex: 1,
            explanation: "Rc uses non-atomic reference counting, making it unsafe to share across threads (Rc does not implement Send). Arc uses atomic reference counting and is thread-safe. Mutex provides thread-safe interior mutability, while RefCell is not Sync."
          }
        ]
      }
    ],
  },
  {
    id: "async-rust", title: "Module 2 — Fearless Concurrency",
    lessons: [
      {
        id: "async-tokio", title: "Async Run-times & Tokio", duration: "40 min",
        description: "Build high-performance concurrent applications without data races.",
        content: `<h2>Asynchronous Programming in Rust</h2>
<p>Rust's standard library provides the <code>Future</code> trait, but it does not include an async runtime. <strong>Tokio</strong> is the industry standard runtime for writing reliable, asynchronous systems.</p>
<pre><code class="language-rust">use tokio::net::TcpListener;
use tokio::io::{AsyncReadExt, AsyncWriteExt};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let listener = TcpListener::bind("127.0.0.1:8080").await?;

    loop {
        let (mut socket, _) = listener.accept().await?;

        // Spawn a new green-thread per connection
        tokio::spawn(async move {
            let mut buf = [0; 1024];

            // In a loop, read data from the socket and write it back
            loop {
                let n = match socket.read(&mut buf).await {
                    Ok(n) if n == 0 => return,
                    Ok(n) => n,
                    Err(e) => {
                        eprintln!("failed to read from socket; err = {:?}", e);
                        return;
                    }
                };

                // Write the data back
                if let Err(e) = socket.write_all(&buf[0..n]).await {
                    eprintln!("failed to write to socket; err = {:?}", e);
                    return;
                }
            }
        });
    }
}</code></pre>
<p>Because of Rust's <code>Send</code> and <code>Sync</code> traits, it's impossible to accidentally share mutated state across threads without proper synchronization primitives (like <code>Mutex</code> or <code>RwLock</code>).</p>`
      },
      {
        id: "tokio-channels", title: "Channels & Shared State with Tokio", duration: "45 min",
        description: "Communicate between async tasks using Tokio channels. Implement oneshot, mpsc, broadcast, and watch channels for message passing and shared state coordination.",
        content: `<h2>Async Communication Patterns</h2>
<p>Tokio provides four channel types for communicating between tasks. Choosing the right channel is essential for correct and performant async systems. <strong>Oneshot</strong> for single-value responses, <strong>mpsc</strong> for multi-producer single-consumer workloads, <strong>broadcast</strong> for fan-out patterns, and <strong>watch</strong> for state observation.</p>
<h3>Building a Task Pipeline</h3>
<p>A common pattern: a producer task generates data, a worker pool processes it, and an aggregator collects results. Channels connect these stages with backpressure — if a channel is full, the sender awaits until space is available, naturally slowing the producer.</p>
<pre><code class="language-rust">use tokio::sync::{mpsc, oneshot};
use tokio::time::{sleep, Duration};
use rand::Rng;

// Message: a work request with a response channel
struct WorkItem {
    id: u32,
    data: Vec<u8>,
    reply: oneshot::Sender<Result<String, String>>,
}

#[tokio::main]
async fn main() {
    // Channel: producer sends work, workers receive
    let (tx, mut rx) = mpsc::channel::<WorkItem>(32);

    // Spawn worker pool (3 workers)
    for worker_id in 0..3 {
        let mut worker_rx = rx.resubscribe();
        tokio::spawn(async move {
            while let Some(item) = worker_rx.recv().await {
                let result = process_work(worker_id, &item).await;
                let _ = item.reply.send(result);
            }
        });
    }

    // Producer: generate 10 work items
    for id in 0..10 {
        let (reply_tx, reply_rx) = oneshot::channel();
        tx.send(WorkItem {
            id,
            data: vec![id as u8; 100],
            reply: reply_tx,
        }).await.unwrap();

        // Await the result
        let result = reply_rx.await.unwrap();
        println!("Item {}: {:?}", id, result);
    }
}

async fn process_work(worker: u32, item: &WorkItem) -> Result<String, String> {
    sleep(Duration::from_millis(rand::thread_rng().gen_range(50..200))).await;
    Ok(format!("Worker {} processed item {}", worker, item.id))
}</code></pre>
<h3>Shared State with Arc&lt;Mutex&gt;</h3>
<p>When channels are not the right abstraction (you need random access to shared state), use <code>Arc&lt;tokio::sync::Mutex&gt;</code>. Unlike <code>std::sync::Mutex</code>, Tokio's Mutex releases the lock when the holding task <code>.await</code>s, preventing deadlocks in async contexts.</p>`,
        quiz: [
          {
            question: "When should you use tokio::sync::Mutex instead of std::sync::Mutex in an async application?",
            options: ["Always — tokio's mutex is faster", "When you need to hold the lock across an .await point", "When you have only one thread", "std::sync::Mutex should never be used"],
            correctIndex: 1,
            explanation: "std::sync::Mutex will block the thread when locked, preventing the Tokio runtime from running other tasks on that thread. tokio::sync::Mutex yields the task when the lock would block, allowing other tasks to continue."
          }
        ]
      },
      {
        id: "cli-http-client", title: "Building a CLI HTTP Client with Reqwest", duration: "35 min",
        description: "Build a production-grade CLI HTTP client using Reqwest and Clap. Handle JSON serialization, retries with exponential backoff, streaming responses, and connection pooling.",
        content: `<h2>Async HTTP with Reqwest</h2>
<p><strong>Reqwest</strong> is the most popular HTTP client in the Rust ecosystem. Built on top of <code>hyper</code> and <code>tokio</code>, it provides an ergonomic API for making HTTP requests with full control over connection pooling, timeouts, redirects, and TLS.</p>
<h3>Building a Status Checker CLI</h3>
<p>We'll build a CLI tool that checks the health of multiple endpoints concurrently, with retry logic and structured error handling.</p>
<pre><code class="language-rust">use clap::Parser;
use reqwest::{Client, StatusCode};
use serde::{Deserialize, Serialize};
use std::time::Duration;
use tokio::time::sleep;

#[derive(Parser)]
#[command(name = "health-check")]
struct Args {
    #[arg(short, long)]
    urls: Vec<String>,

    #[arg(short, long, default_value = "30")]
    timeout_secs: u64,
}

#[derive(Serialize, Deserialize)]
struct HealthResult {
    url: String,
    status: u16,
    latency_ms: u64,
    healthy: bool,
}

async fn check_health(client: &Client, url: &str) -> HealthResult {
    let start = std::time::Instant::now();

    // Retry with exponential backoff
    for attempt in 1..=3 {
        match client.get(url).timeout(Duration::from_secs(5)).send().await {
            Ok(resp) => {
                let latency = start.elapsed().as_millis() as u64;
                return HealthResult {
                    url: url.to_string(),
                    status: resp.status().as_u16(),
                    latency_ms: latency,
                    healthy: resp.status().is_success(),
                };
            }
            Err(e) => {
                if attempt < 3 {
                    let backoff = Duration::from_millis(2u64.pow(attempt) * 100);
                    eprintln!("Retry {} for {}: {}", attempt, url, e);
                    sleep(backoff).await;
                }
            }
        }
    }

    HealthResult {
        url: url.to_string(),
        status: 0,
        latency_ms: 0,
        healthy: false,
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args = Args::parse();

    let client = Client::builder()
        .user_agent("opensyntax-health-check/1.0")
        .pool_max_idle_per_host(10)
        .timeout(Duration::from_secs(args.timeout_secs))
        .build()?;

    let mut handles = Vec::new();
    for url in &args.urls {
        let client = client.clone();
        let url = url.clone();
        handles.push(tokio::spawn(async move {
            check_health(&client, &url).await
        }));
    }

    for handle in handles {
        let result = handle.await?;
        println!("{}", serde_json::to_string(&result)?);
    }

    Ok(())
}</code></pre>
<h3>Connection Pooling</h3>
<p>Reqwest reuses HTTP connections via an internal connection pool. The pool maintains idle connections to frequently accessed hosts, avoiding TCP handshake and TLS negotiation overhead. Configure pool size and idle timeout based on expected concurrency.</p>`
      }
    ],
  },
  {
    id: "webassembly", title: "Module 3 — WebAssembly",
    lessons: [
      {
        id: "rust-wasm", title: "Compiling Rust to WASM", duration: "35 min",
        description: "Run Rust code in the browser at near-native speeds.",
        content: `<h2>WebAssembly (WASM)</h2>
<p>WebAssembly is a binary instruction format for a stack-based virtual machine. It's designed as a portable compilation target allowing execution at native speed on the web.</p>
<h3>wasm-bindgen</h3>
<p><code>wasm-bindgen</code> facilitates high-level interactions between Wasm modules and JavaScript.</p>
<pre><code class="language-rust">use wasm_bindgen::prelude::*;

// When the \`wee_alloc\` feature is enabled, use \`wee_alloc\` as the global allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}! This is Rust running in the browser!", name));
}
</code></pre>
<p>You can compile this using <code>wasm-pack build --target web</code>, and then seamlessly import the resulting module directly into your Next.js frontend to offload heavy cryptographic or image-processing workloads!</p>`
      },
      {
        id: "wasm-dom", title: "WASM: DOM Manipulation & Web APIs", duration: "40 min",
        description: "Interact with the DOM and Web APIs directly from Rust using web-sys and js-sys. Manipulate elements, handle events, and integrate with browser APIs without JavaScript glue code.",
        content: `<h2>Rust in the Browser</h2>
<p><strong>web-sys</strong> provides Rust bindings to all Web APIs (DOM, CSSOM, WebGL, Web Audio, etc.). <strong>js-sys</strong> provides bindings to JavaScript built-ins (Date, Map, Promise, etc.). Together they let you write browser applications entirely in Rust.</p>
<h3>Manipulating the DOM</h3>
<p>With web-sys, you can query the DOM, create elements, set attributes, attach event listeners, and modify styles — all from Rust. Since WASM has direct access to the DOM via the host bindings, there is no overhead compared to JavaScript.</p>
<pre><code class="language-rust">use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use web_sys::{window, Document, Element, HtmlElement, console};

#[wasm_bindgen(start)]
pub fn main() {
    let window = window().unwrap();
    let document = window.document().unwrap();

    // Query existing element
    let app = document.get_element_by_id("app").unwrap();

    // Create a new button
    let button = document.create_element("button").unwrap();
    button.set_text_content(Some("Click me!"));
    button.set_attribute("class", "rust-button").unwrap();

    // Style it
    let html_button = button.dyn_ref::<HtmlElement>().unwrap();
    html_button.style().set_property("background", "#DEA584").unwrap();
    html_button.style().set_property("color", "white").unwrap();
    html_button.style().set_property("padding", "12px 24px").unwrap();
    html_button.style().set_property("border", "none").unwrap();
    html_button.style().set_property("border-radius", "8px").unwrap();

    // Add event listener via closure
    let closure = Closure::wrap(Box::new(move || {
        console::log_1(&"Button clicked!".into());
        let _ = window.alert_with_message("Hello from Rust WASM!");
    }) as Box<dyn Fn()>);

    button.add_event_listener_with_callback("click", closure.as_ref().unchecked_ref()).unwrap();
    closure.forget(); // Prevent the closure from being dropped

    app.append_child(&button).unwrap();
}

// Call JavaScript functions directly via js-sys
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = Math)]
    fn random() -> f64;
    #[wasm_bindgen(js_namespace = console)]
    fn time(label: &str);
    #[wasm_bindgen(js_namespace = console)]
    fn time_end(label: &str);
}</code></pre>
<h3>Performance DOM Batching</h3>
<p>DOM operations are expensive. Use a <strong>batch update pattern</strong>: collect all changes in a Vec, then apply them in a single DOM write. Alternatively, use a virtual DOM library like <strong>Dominator</strong> or <strong>Yew</strong> that diff and batch updates automatically — similar to React's approach.</p>`
      },
      {
        id: "wasm-workers", title: "WASM with Web Workers & Threads", duration: "45 min",
        description: "Leverage Web Workers and WASM threads for parallel computation. Implement shared memory with Wasm threads proposal, and build a CPU-intensive data processing pipeline that does not block the UI.",
        content: `<h2>Parallel WASM</h2>
<p>WASM traditionally runs on the main thread. For CPU-intensive tasks, we need <strong>Web Workers</strong> (separate OS threads with message passing) and the <strong>WASM Threads proposal</strong> (shared memory via <code>SharedArrayBuffer</code> and atomic operations).</p>
<h3>Worker Thread Pattern</h3>
<p>Each Web Worker loads the same WASM module. The main thread sends data via <code>postMessage</code>, the worker processes it, and sends the result back. For zero-copy transfer, use <code>Transferable</code> objects like <code>ArrayBuffer</code>.</p>
<pre><code class="language-rust">// main.rs — Image processing in a Web Worker
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;
use web_sys::{console, Worker, DedicatedWorkerGlobalScope};

#[wasm_bindgen]
pub fn spawn_worker(wasm_bytes: &[u8]) -> Result<Worker, JsValue> {
    // Create a blob URL for the worker
    let blob = web_sys::Blob::new_with_str_sequence(
        &js_sys::Array::of1(&JsValue::from_str(
            r#"
            importScripts('worker.js');
            onmessage = function(e) {
                const result = Module.process_data(e.data);
                postMessage(result);
            };
            "#
        ))
    )?;

    let url = web_sys::Url::create_object_url_with_blob(&blob)?;
    let worker = Worker::new(&url)?;

    Ok(worker)
}

// worker.rs — running in the worker context
#[wasm_bindgen]
pub fn process_data(input: &[u8]) -> Vec<u8> {
    // CPU-intensive computation
    let mut data = input.to_vec();
    for byte in data.iter_mut() {
        *byte = byte.wrapping_mul(2).wrapping_add(7);
    }
    data
}

// Shared memory via Atomic operations (WASM threads)
use std::sync::atomic::{AtomicU32, Ordering};

fn parallel_sum(data: &[u32], num_threads: usize) -> u32 {
    let shared = Arc::new(AtomicU32::new(0));
    let mut handles = vec![];

    for chunk in data.chunks(data.len() / num_threads) {
        let shared = Arc::clone(&shared);
        let chunk = chunk.to_vec();
        handles.push(std::thread::spawn(move || {
            let sum: u32 = chunk.iter().sum();
            shared.fetch_add(sum, Ordering::Relaxed);
        }));
    }

    for h in handles { h.join().unwrap(); }
    shared.load(Ordering::Relaxed)
}</code></pre>
<h3>When to Use Workers</h3>
<p>Use Web Workers for: image/video processing, data compression, cryptographic hashing (Argon2, bcrypt), JSON parsing of large payloads, and WebGL compute shaders. The main thread stays responsive for UI interactions.</p>`
      }
    ],
  },
  {
    id: "advanced-async", title: "Module 4 — Advanced Async & Networking",
    lessons: [
      {
        id: "tokio-runtime-internals", title: "Tokio Runtime Internals", duration: "55 min",
        description: "Deep dive into Tokio's multi-threaded runtime. Understand the work-stealing scheduler, I/O driver (epoll/io_uring/kqueue), task lifecycle, and how to tune runtime parameters for latency vs throughput.",
        content: `<h2>Inside the Tokio Runtime</h2>
<p>Tokio's multi-threaded runtime is a sophisticated piece of systems software. It combines a <strong>work-stealing task scheduler</strong>, an <strong>I/O driver</strong> backed by epoll (Linux) or kqueue (macOS), and a <strong>timer wheel</strong> for efficient timeout management. Understanding these internals helps you write performant async code.</p>
<h3>Work-Stealing Scheduler</h3>
<p>Each worker thread has its own <strong>local task queue</strong>. When a task yields (by calling <code>.await</code>), it is parked. Other workers can <strong>steal</strong> tasks from a busy worker's queue to balance load. This maximizes CPU utilization without a single global lock on the task queue.</p>
<pre><code class="language-rust">use tokio::runtime::{Runtime, Builder};

// Custom runtime configuration
let runtime = Builder::new_multi_thread()
    .worker_threads(8)              // Default: num CPUs
    .max_blocking_threads(64)       // Thread pool for blocking tasks
    .thread_name("opensyntax-worker")
    .thread_stack_size(3 * 1024 * 1024) // 3MB stack per thread
    .enable_all()                   // I/O + time drivers
    .build()
    .unwrap();

runtime.block_on(async {
    // spawn_blocking for CPU-intensive or blocking I/O
    let result = tokio::task::spawn_blocking(|| {
        // This runs on the blocking thread pool, not the async workers
        std::thread::sleep(std::time::Duration::from_secs(1));
        42
    }).await.unwrap();

    // spawn for async tasks (on the work-stealing scheduler)
    let handle = tokio::spawn(async {
        // ... async work
    });

    // yield_now() to voluntarily yield back to the scheduler
    tokio::task::yield_now().await;
});

// Global runtime (set by #[tokio::main])
#[tokio::main(flavor = "multi_thread", worker_threads = 4)]
async fn main() {
    // ...
}

// Metrics: inspect runtime state
use tokio::runtime::Handle;

fn print_runtime_metrics(handle: &Handle) {
    let metrics = handle.metrics();
    println!("Workers: {}", metrics.num_workers());
    println!("Tasks spawned: {}", metrics.spawned_tasks_count());
    println!("Tasks scheduled: {}", metrics.scheduled_tasks_count());
    println!("IO events processed: {}", metrics.io_event_count());
    println!("Poll time (micros): {}", metrics.poll_time());
}</code></pre>
<h3>I/O Driver: epoll vs io_uring</h3>
<p>Tokio uses <strong>epoll</strong> on Linux by default. For higher performance, enable <strong>io_uring</strong> (Linux 5.1+) which reduces syscalls by using submission/ completion queues in shared memory. On macOS, Tokio uses <strong>kqueue</strong>. The driver is automatically selected at runtime based on OS and kernel version.</p>`
      },
      {
        id: "async-traits", title: "Async Traits & Async Fn", duration: "35 min",
        description: "Write async methods in traits using async-trait macro and the stabilized AFIT (Async Fn in Traits). Understand trait object safety, Send bounds, and the design patterns for async polymorphism.",
        content: `<h2>Async Traits in Rust</h2>
<p>Rust's trait system historically did not support async methods. The <strong>async-trait</strong> crate provided a workaround by desugaring <code>async fn</code> into <code>fn() -> Pin<Box<dyn Future>></code>. As of Rust 1.75, <strong>AFIT (Async Fn in Traits)</strong> is stabilized, allowing native async trait methods.</p>
<h3>async-trait vs Native AFIT</h3>
<p>Both approaches have trade-offs. async-trait boxes each return value (heap allocation), while AFIT uses impl Trait (no allocation) but cannot be used with trait objects (<code>dyn Trait</code>). Choose based on whether you need dynamic dispatch.</p>
<pre><code class="language-rust">use async_trait::async_trait;
use std::future::Future;

// Approach 1: async-trait (works with trait objects, allocates)
#[async_trait]
trait Repository {
    async fn get_user(&self, id: u64) -> Result<User, Error>;
    async fn save_user(&self, user: &User) -> Result<(), Error>;
}

// Approach 2: Native AFIT (no allocation, no dyn support)
trait Cache {
    async fn get(&self, key: &str) -> Option<&[u8]>;
    async fn set(&mut self, key: String, value: Vec<u8>);
}

// Approach 3: Manual Future (most control, most verbose)
trait Service {
    fn process(&self, input: Input) -> impl Future<Output = Result<Output, Error>> + Send;
}

// Implementing async-trait
struct PostgresRepository {
    pool: sqlx::PgPool,
}

#[async_trait]
impl Repository for PostgresRepository {
    async fn get_user(&self, id: u64) -> Result<User, Error> {
        sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
            .bind(id)
            .fetch_one(&self.pool)
            .await
            .map_err(Error::from)
    }

    async fn save_user(&self, user: &User) -> Result<(), Error> {
        sqlx::query("INSERT INTO users (id, name, email) VALUES ($1, $2, $3)")
            .bind(user.id)
            .bind(&user.name)
            .bind(&user.email)
            .execute(&self.pool)
            .await?;
        Ok(())
    }
}

// Composition with async traits
struct UserService<R: Repository> {
    repo: R,
}

impl<R: Repository> UserService<R> {
    async fn register_user(&self, name: String, email: String) -> Result<User, Error> {
        let user = User::new(name, email);
        self.repo.save_user(&user).await?;
        Ok(user)
    }
}</code></pre>`
      },
      {
        id: "http-server-scratch", title: "Building an HTTP Server from Scratch with Hyper", duration: "60 min",
        description: "Build a production-grade HTTP server using Hyper and Tokio. Implement routing, middleware (logging, CORS, auth), connection pooling, graceful shutdown, and TLS termination.",
        content: `<h2>Building with Hyper</h2>
<p><strong>Hyper</strong> is a fast, correct HTTP implementation in Rust. It is the foundation for production frameworks like Axum and Warp. We'll build a minimal HTTP server to understand request/response handling, middleware composition, and lifecycle management.</p>
<h3>Core Server Loop</h3>
<p>Hyper uses a <code>Service</code> trait: given a <code>Request</code>, return a <code>Response</code> future. Middleware are services that wrap other services — each layer adds one concern (logging, auth, compression).</p>
<pre><code class="language-rust">use hyper::server::conn::http1;
use hyper::service::service_fn;
use hyper::{Body, Method, Request, Response, StatusCode};
use hyper_util::rt::TokioIo;
use std::net::SocketAddr;
use std::sync::Arc;
use tokio::net::TcpListener;

#[derive(Clone)]
struct AppState {
    db_pool: Arc<sqlx::PgPool>,
}

async fn handle_request(
    req: Request<Body>,
    state: AppState,
) -> Result<Response<Body>, hyper::Error> {
    // Logging middleware
    println!("{} {} {:?}", req.method(), req.uri(), req.version());

    // CORS headers
    let mut resp = match (req.method(), req.uri().path()) {
        (&Method::GET, "/health") => {
            Response::new(Body::from(r#"{"status":"ok"}"#))
        }
        (&Method::GET, "/api/users") => {
            // Query database
            let users = get_users(&state.db_pool).await;
            let body = serde_json::to_string(&users).unwrap();
            Response::new(Body::from(body))
        }
        (&Method::POST, "/api/users") => {
            // Parse JSON body
            let body_bytes = hyper::body::to_bytes(req.into_body()).await.unwrap();
            let user: NewUser = serde_json::from_slice(&body_bytes).unwrap();
            let created = create_user(&state.db_pool, user).await;
            Response::builder()
                .status(StatusCode::CREATED)
                .body(Body::from(serde_json::to_string(&created).unwrap()))
                .unwrap()
        }
        _ => Response::builder()
            .status(StatusCode::NOT_FOUND)
            .body(Body::from(r#"{"error":"not found"}"#))
            .unwrap(),
    };

    // Add CORS headers
    resp.headers_mut().insert(
        "access-control-allow-origin",
        "*".parse().unwrap(),
    );
    resp.headers_mut().insert(
        "content-type",
        "application/json".parse().unwrap(),
    );

    Ok(resp)
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    let listener = TcpListener::bind(addr).await?;

    // Initialize app state
    let pool = sqlx::PgPool::connect("postgres://...").await?;
    let state = AppState { db_pool: Arc::new(pool) };

    println!("Server running on http://{}", addr);

    // Graceful shutdown with signal handling
    let (tx, rx) = tokio::sync::oneshot::channel::<()>();

    tokio::spawn(async move {
        tokio::signal::ctrl_c().await.unwrap();
        println!("Shutdown signal received");
        let _ = tx.send(());
    });

    loop {
        tokio::select! {
            result = listener.accept() => {
                let (stream, _) = result?;
                let state = state.clone();

                tokio::spawn(async move {
                    let io = TokioIo::new(stream);
                    if let Err(err) = http1::Builder::new()
                        .serve_connection(io, service_fn(|req| handle_request(req, state.clone())))
                        .await
                    {
                        eprintln!("Connection error: {}", err);
                    }
                });
            }
            _ = &mut rx => {
                println!("Shutting down gracefully...");
                break;
            }
        }
    }

    Ok(())
}</code></pre>
<h3>TLS Termination</h3>
<p>Add TLS with <strong>rustls</strong> (pure Rust TLS) or <strong>native-tls</strong> (OpenSSL). Use Let's Encrypt with <code>rustls-pemfile</code> to load certificates. In production, terminate TLS at a reverse proxy (NGINX, Envoy) and use internal HTTP between services.</p>`,
        quiz: [
          {
            question: "Why is Hyper considered a good foundation for building HTTP frameworks in Rust?",
            options: ["Hyper is the only HTTP library for Rust", "Hyper implements HTTP/1.1 and HTTP/2 correctly and efficiently, providing a minimal Service trait that frameworks like Axum build upon", "Hyper automatically adds TLS and routing", "Hyper is part of the Rust standard library"],
            correctIndex: 1,
            explanation: "Hyper provides a correct, performant implementation of the HTTP protocol with a minimal Service trait (Request -> Response). Frameworks like Axum, Warp, and Tide are built on top of Hyper, adding routing, middleware, and ergonomic APIs."
          }
        ]
      }
    ]
  },
  {
    id: "rust-production", title: "Module 5 — Rust in Production",
    lessons: [
      {
        id: "ffi-c", title: "FFI with C: Interfacing Rust with Native Libraries", duration: "50 min",
        description: "Call C libraries from Rust and expose Rust functions to C. Master unsafe FFI patterns, ABI compatibility, memory safety across the boundary, and build system integration with cc and pkg-config.",
        content: `<h2>Foreign Function Interface</h2>
<p>Rust's FFI (Foreign Function Interface) allows calling C libraries directly and exposing Rust functions with C ABI. This is essential for integrating with existing C/C++ codebases (FFmpeg, libcurl, OpenSSL) or writing shared libraries consumed by other languages.</p>
<h3>Calling C from Rust</h3>
<p>Use <code>extern "C"</code> blocks to declare foreign functions. Wrap them in safe Rust abstractions to contain the unsafe code. Always handle null pointers, errno, and resource cleanup carefully.</p>
<pre><code class="language-rust">use std::ffi::{CStr, CString};
use std::os::raw::{c_char, c_int, c_void};
use std::ptr;

// Link to a C library
#[link(name = "sqlite3")]
extern "C" {
    fn sqlite3_open(filename: *const c_char, db: *mut *mut c_void) -> c_int;
    fn sqlite3_close(db: *mut c_void) -> c_int;
    fn sqlite3_exec(
        db: *mut c_void,
        sql: *const c_char,
        callback: Option<unsafe extern "C" fn(*mut c_void, c_int, *mut *mut c_char, *mut *mut c_char) -> c_int>,
        arg: *mut c_void,
        errmsg: *mut *mut c_char,
    ) -> c_int;
    fn sqlite3_errmsg(db: *mut c_void) -> *const c_char;
    fn sqlite3_free(ptr: *mut c_void);
}

// Safe Rust wrapper
pub struct SqliteDb {
    db: *mut c_void,
}

impl SqliteDb {
    pub fn open(path: &str) -> Result<Self, String> {
        let c_path = CString::new(path).map_err(|e| e.to_string())?;
        let mut db = ptr::null_mut();

        let rc = unsafe { sqlite3_open(c_path.as_ptr(), &mut db) };
        if rc != 0 {
            let err = unsafe { CStr::from_ptr(sqlite3_errmsg(db)) }
                .to_string_lossy()
                .into_owned();
            unsafe { sqlite3_close(db) };
            return Err(err);
        }

        Ok(SqliteDb { db })
    }

    pub fn execute(&self, sql: &str) -> Result<(), String> {
        let c_sql = CString::new(sql).map_err(|e| e.to_string())?;
        let mut errmsg: *mut c_char = ptr::null_mut();

        let rc = unsafe {
            sqlite3_exec(self.db, c_sql.as_ptr(), None, ptr::null_mut(), &mut errmsg)
        };

        if rc != 0 {
            let err = unsafe { CStr::from_ptr(errmsg) }
                .to_string_lossy()
                .into_owned();
            unsafe { sqlite3_free(errmsg as *mut c_void) };
            return Err(err);
        }

        Ok(())
    }
}

impl Drop for SqliteDb {
    fn drop(&mut self) {
        unsafe { sqlite3_close(self.db) };
    }
}</code></pre>
<h3>Exposing Rust as a C Library</h3>
<p>Use <code>#[no_mangle]</code> and <code>extern "C"</code> on public functions. Build with <code>crate-type = ["cdylib"]</code> to produce a <code>.so</code> / <code>.dylib</code> / <code>.dll</code> that any C-compatible language (Python, Go, Node.js via napi-rs) can call.</p>`,
        quiz: [
          {
            question: "Why is it important to wrap unsafe FFI calls in a safe Rust API?",
            options: ["It makes the code run faster", "It contains the unsafe code in a small, auditable boundary and exposes a safe interface to the rest of the application", "FFI calls are automatically safe in Rust", "It is only needed for C++ libraries"],
            correctIndex: 1,
            explanation: "unsafe blocks should be as small as possible. By wrapping FFI calls in a safe Rust API, you ensure that memory safety, null pointer checking, and resource cleanup are handled in one place — the rest of the application uses safe Rust."
          }
        ]
      },
      {
        id: "pyo3-bindings", title: "PyO3: Python Bindings with Rust", duration: "45 min",
        description: "Write Python extensions in Rust using PyO3. Achieve 10-100x speedups for CPU-bound Python code, create ergonomic Python APIs from Rust, and publish native wheels with maturin.",
        content: `<h2>PyO3: Rust-Powered Python</h2>
<p><strong>PyO3</strong> allows you to write native Python modules in Rust. Functions and classes written in Rust can be called from Python with zero overhead — no data serialization or subprocess calls. This is ideal for performance-critical Python libraries.</p>
<h3>Writing a Python Module</h3>
<p>PyO3 uses Rust's derive macros to generate Python-compatible classes, methods, and functions. The <code>#[pyfunction]</code> attribute exposes a function, <code>#[pyclass]</code> creates a Python class, and <code>#[pymethods]</code> defines methods.</p>
<pre><code class="language-rust">use pyo3::prelude::*;
use pyo3::types::PyDict;
use std::collections::HashMap;

// Fast JSON parser — 10x faster than Python's json module
#[pyfunction]
fn fast_json_parse(data: &str) -> PyResult<HashMap<String, String>> {
    // Use serde_json (Rust) instead of Python's json (CPython)
    let parsed: HashMap<String, String> = serde_json::from_str(data)
        .map_err(|e| pyo3::exceptions::PyValueError::new_err(e.to_string()))?;
    Ok(parsed)
}

// A Python class backed by Rust
#[pyclass]
struct TextAnalyzer {
    word_count: usize,
}

#[pymethods]
impl TextAnalyzer {
    #[new]
    fn new() -> Self {
        TextAnalyzer { word_count: 0 }
    }

    fn analyze(&mut self, text: &str) -> PyResult<PyObject> {
        // Fast Rust word counting
        self.word_count = text.split_whitespace().count();

        // Return a Python dict
        Python::with_gil(|py| {
            let dict = PyDict::new(py);
            dict.set_item("word_count", self.word_count)?;
            dict.set_item("char_count", text.chars().count())?;
            dict.set_item("byte_count", text.len())?;
            Ok(dict.to_object(py))
        })
    }

    fn count_matches(&self, text: &str, pattern: &str) -> usize {
        text.matches(pattern).count()
    }
}

// Module initialization
#[pymodule]
fn opensyntax_text(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(fast_json_parse, m)?)?;
    m.add_class::<TextAnalyzer>()?;
    Ok(())
}

// Usage from Python:
// from opensyntax_text import fast_json_parse, TextAnalyzer
// analyzer = TextAnalyzer()
// result = analyzer.analyze("Hello world!")
// print(result)  # {"word_count": 2, "char_count": 12, "byte_count": 12}</code></pre>
<h3>Publishing with Maturin</h3>
<p>Use <strong>maturin</strong> to build and publish PyO3 modules. It generates platform-specific wheels (manylinux, macOS, Windows) for PyPI. On <code>pip install</code>, users get pre-compiled native binaries — no Rust toolchain required on their machine.</p>`
      },
      {
        id: "embedded-rust", title: "Embedded Rust: ESP32 & Raspberry Pi", duration: "55 min",
        description: "Deploy Rust on embedded devices. Program ESP32-C3 with the ESP-RS framework, blink LEDs with the HAL, read sensors via I2C/SPI, and set up no_std Rust for bare-metal programming.",
        content: `<h2>Rust on Embedded</h2>
<p>Rust's zero-cost abstractions and memory safety make it an ideal language for embedded systems. The <strong>Embedded Rust Working Group</strong> maintains HALs (Hardware Abstraction Layers) for most microcontrollers, enabling cross-platform embedded development without C.</p>
<h3>ESP32-C3 with ESP-RS</h3>
<p>The ESP32-C3 is a RISC-V microcontroller with WiFi and BLE. The <strong>esp-rs</strong> ecosystem provides a HAL, WiFi driver, and build system. We'll write a no_std application that blinks an LED and reads a temperature sensor over I2C.</p>
<pre><code class="language-rust">// Cargo.toml
// [dependencies]
// esp32c3-hal = { features = ["rt"] }
// esp-backtrace = { features = ["esp32c3", "exception-handler"] }
// embedded-hal-bus = "0.1"
// aht20 = "0.3"  // Temperature/humidity sensor driver

#![no_std]
#![no_main]

use esp32c3_hal::{
    clock::ClockControl,
    gpio::{IO, Level, Output},
    i2c::I2C,
    peripherals::Peripherals,
    prelude::*,
    timer::TimerGroup,
    Delay,
    Rtc,
};
use esp_backtrace as _;

#[entry]
fn main() -> ! {
    let peripherals = Peripherals::take();
    let mut system = peripherals.SYSTEM.split();
    let clocks = ClockControl::boot_defaults(system.clock_control).freeze();

    // Initialize delay
    let mut rtc = Rtc::new(peripherals.RTC_CNTL);
    let timer_group0 = TimerGroup::new(
        peripherals.TIMG0,
        &clocks,
        &mut system.peripheral_clock_control,
    );
    let mut delay = Delay::new(&clocks);

    // Set up GPIO pins
    let io = IO::new(peripherals.GPIO, peripherals.IO_MUX);
    let mut led = Output::new(io.pins.gpio8, Level::Low);

    // I2C for temperature sensor (AHT20)
    let i2c = I2C::new(
        peripherals.I2C0,
        io.pins.gpio4,  // SDA
        io.pins.gpio5,  // SCL
        100u32.kHz(),
        &mut system.peripheral_clock_control,
        &clocks,
    );

    let mut sensor = aht20::Aht20::new(i2c, aht20::Address::Standard);

    // Main loop
    loop {
        led.toggle();
        delay.delay_ms(500u32);

        // Read temperature and humidity
        match sensor.measure(&mut delay) {
            Ok(()) => {
                let temp = sensor.temperature();
                let humidity = sensor.relative_humidity();
                // In real code, print via UART or transmit via WiFi
                // (temp, humidity) in 0.01°C and 0.01% units
            }
            Err(_) => {
                // Sensor not responding
            }
        }
    }
}</code></pre>
<h3>Cross-Compilation Setup</h3>
<p>Use <code>rustup target add</code> to install the target (e.g., <code>riscv32imc-unknown-none-elf</code> for ESP32-C3). Configure <code>.cargo/config.toml</code> with the correct linker and runner. For Raspberry Pi (aarch64-unknown-linux-gnu), cross-compile with the <strong>aarch64-linux-gnu-gcc</strong> toolchain and deploy via SSH.</p>`
      },
      {
        id: "cross-compilation", title: "Cross-Compilation & CI/CD for Rust", duration: "35 min",
        description: "Set up cross-compilation for multiple targets (Linux, macOS, Windows, ARM). Automate building, testing, and publishing with GitHub Actions and Cross. Handle platform-specific dependencies and conditional compilation.",
        content: `<h2>Cross-Compilation in Rust</h2>
<p>Rust's target system supports cross-compilation for various platforms. <strong>Cross</strong> is a tool that automates cross-compilation by using Docker images with pre-installed toolchains. Combined with GitHub Actions matrix builds, you can release for 10+ targets from CI.</p>
<h3>GitHub Actions Matrix</h3>
<p>Set up a matrix that builds for x86_64 Linux, macOS, Windows, aarch64 Linux (ARM), and more. Use <strong>actions-rs/toolchain</strong> to install the target, then build and run platform-specific tests.</p>
<pre><code class="language-yaml"># .github/workflows/release.yml
name: Build & Release

on:
  push:
    tags: ["v*"]

jobs:
  build:
    strategy:
      matrix:
        target:
          - x86_64-unknown-linux-gnu
          - x86_64-apple-darwin
          - aarch64-apple-darwin
          - x86_64-pc-windows-msvc
          - aarch64-unknown-linux-gnu
        include:
          - target: x86_64-unknown-linux-gnu
            os: ubuntu-latest
          - target: x86_64-apple-darwin
            os: macos-latest
          - target: aarch64-apple-darwin
            os: macos-latest
          - target: x86_64-pc-windows-msvc
            os: windows-latest
          - target: aarch64-unknown-linux-gnu
            os: ubuntu-latest

    runs-on: \${{ matrix.os }}

    steps:
      - uses: actions/checkout@v4

      - uses: actions-rust-lang/setup-rust-toolchain@v1
        with:
          target: \${{ matrix.target }}

      - name: Build
        run: cargo build --release --target \${{ matrix.target }}

      - name: Run tests
        run: cargo test --target \${{ matrix.target }}

      - name: Package
        shell: bash
        run: |
          if [ "\${{ matrix.os }}" = "windows-latest" ]; then
            7z a "opensyntax-tool-\${{ matrix.target }}.zip" ./target/\${{ matrix.target }}/release/opensyntax-tool.exe
          else
            tar czf "opensyntax-tool-\${{ matrix.target }}.tar.gz" -C ./target/\${{ matrix.target }}/release opensyntax-tool
          fi

      - uses: actions/upload-artifact@v4
        with:
          name: opensyntax-tool-\${{ matrix.target }}
          path: opensyntax-tool-\${{ matrix.target }}.*

  release:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
      - name: Create Release
        uses: softprops/action-gh-release@v2
        with:
          files: opensyntax-tool-*/
          generate_release_notes: true
</code></pre>
<h3>Conditional Compilation</h3>
<p>Use <code>#[cfg(target_os = "linux")]</code> and <code>#[cfg(not(target_os = "windows"))]</code> to write platform-specific code. The <code>cfg-if</code> crate provides a macro for cleaner conditional blocks. For system dependencies (OpenSSL, zlib), use the <code>pkg-config</code> crate or vendored features.</p>`
      }
    ]
  }
]

export default function RustPage() {
  return (
    <div className="bg-background text-foreground font-sans">
      <Navbar />
      <LessonPlayer
        title="Rust & Systems Programming"
        description="Master the language Stack Overflow users voted 'most loved' for 8 years running. Understand the borrow checker, memory lifetimes, multithreaded concurrency with Tokio, and compiling high-performance WebAssembly."
        category="Systems"
        accentColor="#DEA584"
        modules={rustModules}
        instructor="Steve Klabnik"
        rating={4.9}
        reviewCount={4300}
        lastUpdated="Mar 2026"
      />
    </div>
  )
}
