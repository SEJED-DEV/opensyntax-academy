import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { LessonPlayer, type Module } from "@/components/lesson-player"

export const metadata: Metadata = {
  title: "TypeScript Mastery — Generics, Conditional Types, tRPC & Monorepos",
  description: "Move beyond basic TypeScript. Master generics, conditional types, the infer keyword, mapped types, Zod validation, end-to-end type safety with tRPC, monorepo tooling with Turborepo, and real-world type patterns for production applications.",
  keywords: ["TypeScript Course", "Advanced TypeScript", "tRPC Tutorial", "Zod Validation", "Type-Safe API", "Generics", "Turborepo", "Monorepo", "Branded Types"],
}

const typescriptModules: Module[] = [
  {
    id: "ts-tier-1", title: "Tier 1: Foundations — Static Typing Core",
    lessons: [
      {
        id: "interfaces-enums", title: "Interfaces, Types & Enums", duration: "30 min",
        description: "The building blocks of type safety. When to use Interfaces vs. Type aliases and the pitfalls of Enums.",
        content: `<h2>Interfaces vs Type Aliases</h2>
<p>Both allow you to describe the shape of an object, but <strong>Interfaces</strong> are extendable (declaration merging), while <strong>Types</strong> are more flexible (unions, intersections).</p>
<pre><code class="language-typescript">// Interface — extendable, declaration merging
interface User {
  name: string;
  email: string;
}

// Type alias — unions, intersections, primitives
type Status = "active" | "inactive" | "banned";
type Admin = User & { role: "admin" };
type ApiResponse<T> = { data: T; error: null } | { data: null; error: string };</code></pre>
<h3>The Enum Problem</h3>
<p>Modern TypeScript often avoids <code>enum</code> in favor of <strong>const objects</strong> or <strong>union types</strong>, which result in smaller, more idiomatic JavaScript code after compilation.</p>`,
        quiz: [
          { question: "Which feature is unique to interfaces and NOT available with type aliases?", options: ["Union types", "Declaration merging", "Generic type parameters", "Index signatures"], correctIndex: 1, explanation: "Declaration merging allows multiple interface declarations with the same name to be automatically merged. Type aliases cannot be re-declared." }
        ]
      },
      {
        id: "utility-types", title: "Utility Types & keyof/typeof", duration: "35 min",
        description: "Leverage TypeScript's built-in utility types and the keyof/typeof operators for safer, more expressive code.",
        content: `<h2>Built-in Utility Types</h2>
<p>TypeScript ships with powerful utility types like <code>Partial&lt;T&gt;</code>, <code>Pick&lt;T, K&gt;</code>, <code>Omit&lt;T, K&gt;</code>, and <code>Record&lt;K, V&gt;</code> that eliminate boilerplate and reduce errors.</p>
<pre><code class="language-typescript">interface Config {
  host: string;
  port: number;
  ssl: boolean;
}

// Make all properties optional
type PartialConfig = Partial<Config>;

// Pick specific keys
type ConnectionConfig = Pick<Config, "host" | "port">;

// Use keyof + typeof together
const COLORS = { red: "#ff0000", green: "#00ff00", blue: "#0000ff" } as const;
type ColorName = keyof typeof COLORS; // "red" | "green" | "blue"</code></pre>
<h3>as const Assertions</h3>
<p>The <code>as const</code> assertion narrows values to their literal types, enabling precise discriminated unions and preventing unwanted widening.</p>`
      },
      {
        id: "type-guards", title: "Type Guards, Narrowing & Discriminated Unions", duration: "40 min",
        description: "Master type narrowing with custom type guards, discriminated unions, and exhaustiveness checking.",
        content: `<h2>Discriminated Unions</h2>
<p>Discriminated unions (tagged unions) use a common literal property to narrow types at runtime. TypeScript automatically refines the type after the discriminant check.</p>
<pre><code class="language-typescript">type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return (shape.base * shape.height) / 2;
    default:
      // exhaustive check — TypeScript error if we miss a case
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}</code></pre>
<h3>Custom Type Guards</h3>
<p>Write functions that return <code>value is Type</code> predicates to encapsulate complex narrowing logic, making your type refinements reusable across the codebase.</p>`
      }
    ]
  },
  {
    id: "ts-tier-2", title: "Tier 2: Intermediate — Advanced Type Logic",
    lessons: [
      {
        id: "generics-conditional", title: "Generics & Conditional Types", duration: "45 min",
        description: "Write reusable logic inside the type system. Using 'extends', 'infer', and template literal types.",
        content: `<h2>Generics: Type Variables</h2>
<p>Generics act as placeholders for types. They allow you to write a function once and use it safely with numbers, strings, or custom objects.</p>
<pre><code class="language-typescript">function wrap<T>(item: T): { data: T } {
  return { data: item };
}</code></pre>
<h3>Conditional Types</h3>
<p>Using the ternary syntax at the type level: <code>T extends U ? X : Y</code>. This allows for complex transformations like unwrapping promises or stripping nullability.</p>`
      },
      {
        id: "mapped-types", title: "Mapped Types & Template Literals", duration: "40 min",
        description: "Transform object types programmatically with mapped types and template literal string manipulation.",
        content: `<h2>Mapped Types</h2>
<p>Mapped types iterate over a union of keys and produce a new object type. Combined with <code>keyof</code>, they enable type-safe API response transformations.</p>
<pre><code class="language-typescript">// Make all properties readonly and nullable
type ReadonlyNullable<T> = {
  readonly [K in keyof T]: T[K] | null;
};

// Prefix all keys with a string
type Prefixed<T, P extends string> = {
  [K in keyof T as \`\${P}\${string & K}\`]: T[K];
};

type User = { name: string; age: number };
type PrefixedUser = Prefixed<User, "user_">;
// { user_name: string; user_age: number }</code></pre>
<h3>Template Literal Types</h3>
<p>Template literal types allow string manipulation at the type level using <code>\`prefix_\${K}\`</code> syntax. They pair perfectly with mapped types to generate type-safe event emitters, API clients, and CSS property transformers.</p>`,
        quiz: [
          { question: "What does the mapped type { [K in keyof T]: T[K] | null } do?", options: ["Removes null from all properties", "Makes all properties nullable while keeping their original types", "Creates a new type with only null values", "Converts all properties to strings"], correctIndex: 1, explanation: "This mapped type iterates over each key K in T and produces a new type where each property value is T[K] | null, preserving the original type but allowing null." }
        ]
      },
      {
        id: "infer-recursive", title: "The infer Keyword & Recursive Types", duration: "50 min",
        description: "Extract types dynamically with infer in conditional types and define recursive type structures for trees and JSON.",
        content: `<h2>The infer Keyword</h2>
<p><code>infer</code> lets you declare a type variable within a conditional type's extends clause, capturing the inner type of wrapped generics like Promises and Arrays.</p>
<pre><code class="language-typescript">// Unwrap a Promise type
type Unwrap<T> = T extends Promise<infer U> ? U : T;
type Result = Unwrap<Promise<string>>; // string

// Extract element type from an array
type ElementType<T> = T extends (infer U)[] ? U : never;
type Item = ElementType<number[]>; // number

// Recursive JSON type
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

function parseJSON<T extends string>(json: T): JSONValue {
  return JSON.parse(json);
}</code></pre>
<h3>Recursive Types</h3>
<p>Recursive types reference themselves, enabling type-safe representations of trees, linked lists, nested comment threads, and deep partials.</p>`
      }
    ]
  },
  {
    id: "ts-tier-3", title: "Tier 3: Production — End-to-End Safety",
    lessons: [
      {
        id: "zod-trpc", title: "Zod Schema Validation & tRPC", duration: "55 min",
        description: "Bridging the gap between server and client. Runtime validation and type-safe API communication.",
        content: `<h2>Runtime Safety with Zod</h2>
<p>TypeScript disappears at runtime. We use <strong>Zod</strong> to validate incoming JSON data, ensuring our application never processes malformed payloads.</p>
<h3>The tRPC Revolution</h3>
<p>For full-stack TypeScript apps, <strong>tRPC</strong> eliminates the need for manual API definitions. The client infers the backend types directly, resulting in 100% type safety from the database to the UI.</p>
<p><strong>Design Tip:</strong> Use <strong>Moulded Types</strong>—derive your API schemas from your database models to ensure one source of truth for your data shapes.</p>`
      },
      {
        id: "error-handling-patterns", title: "Type-Safe Error Handling Patterns", duration: "35 min",
        description: "Design robust, type-safe error handling using Result types, Either monads, and custom error classes.",
        content: `<h2>The Result Pattern</h2>
<p>Instead of throwing exceptions, return a Result type that explicitly encodes success and failure, making error paths visible in the type signature.</p>
<pre><code class="language-typescript">type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function divide(a: number, b: number): Result<number> {
  if (b === 0) return { ok: false, error: new Error("Division by zero") };
  return { ok: true, value: a / b };
}

const result = divide(10, 2);
if (result.ok) {
  console.log(result.value); // number
} else {
  console.error(result.error); // Error
}</code></pre>
<h3>Error Boundary Types</h3>
<p>Combine discriminated unions for errors with React error boundaries or Express error middleware to ensure every error path is handled at compile time.</p>`,
        quiz: [
          { question: "What is the primary advantage of the Result pattern over exception-based error handling in TypeScript?", options: ["Faster execution", "Error paths are encoded in the type system, making them visible and enforceable at compile time", "Smaller bundle size", "Automatic error logging"], correctIndex: 1, explanation: "The Result pattern makes error handling explicit in function signatures, ensuring callers must handle both success and failure cases—the compiler enforces this." }
        ]
      },
      {
        id: "type-testing", title: "Type Testing with expect-type", duration: "25 min",
        description: "Write automated tests for your TypeScript types to prevent regressions in complex type definitions.",
        content: `<h2>Type-Level Testing</h2>
<p>Complex utility types need tests just like runtime code. Libraries like <code>expect-type</code> and <code>ts-expect</code> let you assert type equality, assignability, and errors at compile time.</p>
<pre><code class="language-typescript">import { expectTypeOf } from "expect-type";
import { Equal, Expect } from "type-testing";

// Assert type equality
type Test1 = Expect<Equal<Unwrap<Promise<number>>, number>>;

// Runtime type assertions
const result = wrap("hello");
expectTypeOf(result).toEqualTypeOf<{ data: string }>();

// Assert compile error
// @ts-expect-error — passing string to numeric function
const bad: number = divide("a", 2);

// Custom type test
type Includes<T, U> = U extends T ? true : false;
type Test2 = Expect<Equal<Includes<"a" | "b", "a">, true>>;</code></pre>
<h3>CI Integration</h3>
<p>Add <code>tsc --noEmit</code> to your CI pipeline. Combine with <code>vitest</code> or <code>jest</code> type tests to catch type regressions before they reach production.</p>`
      }
    ]
  },
  {
    id: "ts-tier-4", title: "Tier 4: TypeScript Tooling",
    lessons: [
      {
        id: "tsconfig-deep", title: "Deep Dive into tsconfig", duration: "40 min",
        description: "Master every tsconfig compiler option including strict mode, module resolution, paths, and output configuration.",
        content: `<h2>Strict Mode Family</h2>
<p>The <code>strict: true</code> flag enables a suite of checks that catch entire categories of bugs. Understanding each sub-flag lets you incrementally adopt strictness.</p>
<pre><code class="language-json">{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "exactOptionalPropertyTypes": true,
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}</code></pre>
<h3>Module Resolution Strategies</h3>
<p><code>node</code>, <code>node16</code>, <code>nodenext</code>, and <code>bundler</code> each handle module resolution differently. Modern projects should use <code>bundler</code> for faster compilation and compatibility with bundlers like Vite and Webpack.</p>`,
        quiz: [
          { question: "What does the noUncheckedIndexedAccess option do?", options: ["Disables index signatures entirely", "Adds undefined to every indexed access type (e.g., T[K] becomes T[K] | undefined)", "Makes all array accesses return the element type directly", "Enables numeric indexing only"], correctIndex: 1, explanation: "noUncheckedIndexedAccess adds undefined to the return type of indexed accesses (t[key]), forcing you to handle the case where the key doesn't exist." }
        ]
      },
      {
        id: "project-references", title: "Project References & Composite Projects", duration: "35 min",
        description: "Structure large TypeScript codebases with project references for faster builds and incremental compilation.",
        content: `<h2>Project References</h2>
<p>Project references split your codebase into smaller projects that can be built independently. TypeScript tracks dependencies and only rebuilds changed projects, dramatically reducing compile times.</p>
<pre><code class="language-json">// tsconfig.json (root)
{
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/utils" },
    { "path": "./apps/web" }
  ]
}

// packages/core/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "rootDir": "src",
    "outDir": "dist"
  }
}</code></pre>
<h3>Build Order</h3>
<p>TypeScript automatically determines the build order based on project references. Use <code>tsc --build</code> (or <code>-b</code>) to compile all projects in the correct sequence with incremental caching.</p>`
      },
      {
        id: "turborepo-setup", title: "Monorepo Setups with Turborepo", duration: "50 min",
        description: "Build and maintain monorepos with Turborepo, including task orchestration, caching, and dependency management.",
        content: `<h2>Turborepo Fundamentals</h2>
<p>Turborepo orchestrates tasks across your monorepo with intelligent caching. It remembers previous task outputs and skips redundant work, making CI pipelines faster.</p>
<pre><code class="language-json">// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"],
      "cache": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "cache": false
    }
  }
}</code></pre>
<h3>Cache Strategy</h3>
<p>Turborepo caches by task inputs (source files, dependencies, environment variables). Remote caching (Vercel, custom S3) shares caches across CI runners and developers.</p>`
      }
    ]
  },
  {
    id: "ts-tier-5", title: "Tier 5: Real-World Patterns",
    lessons: [
      {
        id: "branded-types", title: "Branded Types & Nominal Typing", duration: "35 min",
        description: "Simulate nominal typing in TypeScript using branded types to prevent mixing semantically different values of the same primitive type.",
        content: `<h2>Branded Types</h2>
<p>TypeScript uses structural typing, so <code>string</code> and <code>string</code> are always compatible. Branded types add a phantom property that prevents accidentally mixing IDs, emails, and other identifiers.</p>
<pre><code class="language-typescript">declare const brand: unique symbol;

type UserId = string & { [brand]: "UserId" };
type Email = string & { [brand]: "Email" };
type OrderId = string & { [brand]: "OrderId" };

function createUserId(id: string): UserId {
  return id as UserId;
}

function sendEmail(email: Email): void {
  console.log("Sending to", email);
}

const uid = createUserId("abc-123");
sendEmail(uid); // Type error! Email !== UserId
// ✅ sendEmail(createEmail("user@example.com"));</code></pre>
<h3>Validation at Boundaries</h3>
<p>Apply branded types at system boundaries (API handlers, database readers). Once validated, the branded type flows safely through your entire domain without redundant checks.</p>`,
        quiz: [
          { question: "What problem do branded types solve in TypeScript?", options: ["Runtime performance", "Preventing accidental mixing of structurally identical but semantically different values", "Bundle size reduction", "Interface merging"], correctIndex: 1, explanation: "Branded types prevent passing a string ID where an email is expected, even though both are strings, by adding a unique phantom brand property that structural typing checks." }
        ]
      },
      {
        id: "state-machines", title: "State Machines with Types", duration: "45 min",
        description: "Model finite state machines in the type system for predictable UI state and workflow management.",
        content: `<h2>Type-Level State Machines</h2>
<p>Model all possible states and transitions at the type level, making illegal states unrepresentable. The compiler prevents invalid state transitions before runtime.</p>
<pre><code class="language-typescript">type PaymentState =
  | { status: "idle" }
  | { status: "processing"; txId: string }
  | { status: "success"; txId: string; confirmedAt: Date }
  | { status: "failed"; error: string; retryCount: number };

type Transition<T extends PaymentState, E extends Event> =
  T extends { status: "idle" }
    ? { status: "processing"; txId: string }
    : T extends { status: "processing" }
      ? E extends { type: "confirm" }
        ? { status: "success"; txId: T["txId"]; confirmedAt: Date }
        : { status: "failed"; error: string; retryCount: 0 }
      : never;

function transition<T extends PaymentState>(
  state: T,
  event: Event
): Transition<T, Event> {
  // runtime implementation
}</code></pre>
<h3>XState Integration</h3>
<p>Use <strong>XState</strong> for runtime state machines with TypeScript-first definitions. The library infers the event types and context from your machine definition, providing type-safe actions and guards.</p>`
      },
      {
        id: "declarative-apis", title: "Declarative Typing for APIs", duration: "40 min",
        description: "Design type-safe, declarative API schemas using Zod, tRPC, and OpenAPI code generation for end-to-end type safety.",
        content: `<h2>Declarative API Contracts</h2>
<p>Declare your API contract once with Zod schemas and derive both runtime validation and TypeScript types. This eliminates duplication and ensures the server and client stay in sync.</p>
<pre><code class="language-typescript">import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "./trpc";

const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
});

const CreateUserInput = UserSchema.pick({ name: true, email: true });

export type User = z.infer<typeof UserSchema>;
export type CreateUserInput = z.infer<typeof CreateUserInput>;

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(CreateUserInput)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.insert(input);
      return user;
    }),
});</code></pre>
<h3>OpenAPI Code Generation</h3>
<p>Use <code>openapi-typescript</code> to generate TypeScript types from OpenAPI specs. This is ideal for consuming third-party APIs or maintaining a public API contract.</p>`
      },
      {
        id: "fp-patterns", title: "Functional Programming Patterns: Option & Result", duration: "45 min",
        description: "Adopt functional programming patterns in TypeScript using Option, Result, and Either types for safer, more predictable code.",
        content: `<h2>Option Type</h2>
<p>Replace nullable values (<code>undefined | null</code>) with the Option type, which forces callers to handle the None case and eliminates null reference errors.</p>
<pre><code class="language-typescript">type Option<T> =
  | { _tag: "Some"; value: T }
  | { _tag: "None" };

function map<T, U>(opt: Option<T>, fn: (val: T) => U): Option<U> {
  if (opt._tag === "None") return opt;
  return { _tag: "Some", value: fn(opt.value) };
}

function getOrElse<T>(opt: Option<T>, fallback: T): T {
  return opt._tag === "Some" ? opt.value : fallback;
}

// Usage
const user = findUserById("123"); // Option<User>
const displayName = map(user, (u) => u.name.toUpperCase());
console.log(getOrElse(displayName, "ANONYMOUS"));</code></pre>
<h3>Piping with fp-ts</h3>
<p>Libraries like <code>fp-ts</code> or <code>effect-ts</code> provide a full ecosystem of functional abstractions (Either, Task, IO, Reader) with pipe operators for composable, type-safe data transformations.</p>`
      }
    ]
  }
]

export default function TypescriptPage() {
  return (
    <div className="bg-background text-foreground font-sans">
      <Navbar />
      <LessonPlayer
        title="TypeScript Mastery"
        description="Master the most powerful type system in the world. From basic interfaces to advanced conditional types and production-grade end-to-end safety."
        category="Web"
        accentColor="#3178C6"
        modules={typescriptModules}
        instructor="Matt Pocock"
        rating={4.9}
        reviewCount={3400}
        lastUpdated="Mar 2026"
      />
    </div>
  )
}
