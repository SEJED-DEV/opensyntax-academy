import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { LessonPlayer, type Module } from "@/components/lesson-player"

export const metadata: Metadata = {
  title: "Advanced React Patterns — Compound Components & Suspense",
  description: "Master patterns used by world-class React libraries. Compound components, render props, Suspense architecture, concurrent features, performance optimization, state management ecosystems with Zustand and Jotai, and production testing with React Testing Library and Playwright.",
  keywords: ["React Course", "Advanced React", "Compound Components", "React Suspense", "useTransition", "React Performance", "Zustand", "React Testing Library", "Playwright"],
}

const reactPatternsModules: Module[] = [
  {
    id: "react-tier-1", title: "Tier 1: Foundations — Modern State & Hooks",
    lessons: [
      {
        id: "hooks-fundamentals", title: "useState, useEffect & Custom Hooks", duration: "30 min",
        description: "Move beyond classes. Manage local state and side effects with the primary React hooks and build reusable custom hooks.",
        content: `<h2>Functional React</h2>
<p>In modern React, everything is a function. <strong>useState</strong> provides persistent values across renders, while <strong>useEffect</strong> synchronizes with external systems like APIs and subscriptions.</p>
<pre><code class="language-tsx">import { useState, useEffect, useCallback } from "react"

interface User {
  id: string
  name: string
  email: string
}

function useUser(userId: string | null) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!userId) return
    let cancelled = false

    setLoading(true)
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => {
        if (!cancelled) setUser(data)
      })
      .catch(err => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [userId])

  return { user, loading, error }
}</code></pre>
<h3>Custom Hooks</h3>
<p>Extract complex state logic into reusable, testable functions. Custom hooks are the primary mechanism for logic reuse in React.</p>`
      },
      {
        id: "usereducer-context", title: "useReducer & Context for Global State", duration: "35 min",
        description: "Build predictable global state with useReducer and Context, implementing redux-like patterns without external dependencies.",
        content: `<h2>Reducer Pattern</h2>
<p><strong>useReducer</strong> is ideal for complex state logic with multiple sub-values or when the next state depends on the previous one. Combined with <strong>Context</strong>, it provides global state management without external libraries.</p>
<pre><code class="language-tsx">import { createContext, useContext, useReducer, type Dispatch } from "react"

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; qty: number } }
  | { type: "TOGGLE_CART" }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM":
      return {
        ...state,
        items: state.items.some(i => i.id === action.payload.id)
          ? state.items.map(i =>
              i.id === action.payload.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          : [...state.items, action.payload],
      }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.payload),
      }
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen }
    default:
      return state
  }
}

const CartContext = createContext<CartState | null>(null)
const CartDispatchContext = createContext<Dispatch<CartAction> | null>(null)

function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  })
  return (
    <CartContext.Provider value={state}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartContext.Provider>
  )
}</code></pre>
<p>Split Context and Dispatch into separate providers to prevent unnecessary re-renders — components that only dispatch don't need to subscribe to state changes.</p>`,
        quiz: [
          {
            question: "Why should you split Context into separate state and dispatch contexts?",
            options: ["It's required by React's rules of hooks", "Components that only dispatch actions won't re-render when state changes", "It reduces bundle size", "It enables server-side rendering"],
            correctIndex: 1,
            explanation: "Splitting contexts prevents components that only call dispatch from re-rendering when state changes. React only re-renders consumers when their specific context value changes."
          }
        ]
      },
      {
        id: "useref-dom", title: "useRef & DOM Manipulation", duration: "25 min",
        description: "Master useRef for DOM access, mutable values across renders, and integration with third-party imperative libraries.",
        content: `<h2>The Ref System</h2>
<p><strong>useRef</strong> provides a mutable object that persists across renders without causing re-renders when its value changes. Use it for DOM references, interval IDs, or any mutable value that shouldn't trigger re-renders.</p>
<pre><code class="language-tsx">import { useRef, useEffect, useCallback, useState } from "react"

function AutoResizeTextarea({ minRows = 3 }: { minRows?: number }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [value, setValue] = useState("")

  const resize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "0px"
    el.style.height = \`\${el.scrollHeight}px\`
  }, [])

  useEffect(() => {
    resize()
  }, [value, resize])

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    const observer = new ResizeObserver(resize)
    observer.observe(el)
    return () => observer.disconnect()
  }, [resize])

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={e => setValue(e.target.value)}
      rows={minRows}
      style={{ overflow: "hidden", resize: "none" }}
    />
  )
}

// Forwarding refs to child components
const FancyInput = forwardRef<HTMLInputElement, Props>(
  (props, ref) => (
    <input ref={ref} className="fancy" {...props} />
  )
)</code></pre>
<p>Use <strong>forwardRef</strong> when a parent needs direct access to a child's DOM node — essential for focus management, measurements, and integration with form libraries.</p>`
      }
    ]
  },
  {
    id: "react-tier-2", title: "Tier 2: Intermediate — Advanced Composition",
    lessons: [
      {
        id: "compound-render-props", title: "Compound Components & Render Props", duration: "45 min",
        description: "Master the patterns used by Radix UI and Headless UI. Implicit context communication and inversion of control for flexible component APIs.",
        content: `<h2>Compound Components</h2>
<p>Allows for highly flexible UI where children communicate implicitly. This pattern builds robust Tabs, Modals, and Accordions without prop drilling.</p>
<pre><code class="language-tsx"><Tabs>
  <TabList>
    <Tab>Account</Tab>
    <Tab>Security</Tab>
  </TabList>
  <TabPanel>Account settings content</TabPanel>
  <TabPanel>Security settings content</TabPanel>
</Tabs></code></pre>
<pre><code class="language-tsx">// Implementation
interface TabsContextValue {
  activeIndex: number
  setActiveIndex: (index: number) => void
}
const TabsContext = createContext<TabsContextValue | null>(null)

function Tabs({ children }: { children: React.ReactNode }) {
  const [activeIndex, setActiveIndex] = useState(0)
  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      {children}
    </TabsContext.Provider>
  )
}

function Tab({ children, index: _index }: { children: React.ReactNode; index?: number }) {
  const ctx = useContext(TabsContext)!
  const index = _index ?? parseInt(useId(), 10)
  return (
    <button
      data-active={ctx.activeIndex === index}
      onClick={() => ctx.setActiveIndex(index)}
    >
      {children}
    </button>
  )
}</code></pre>
<h3>Render Props</h3>
<p>A technique for sharing code using a prop whose value is a function, giving control back to the consumer for maximum flexibility.</p>`
      },
      {
        id: "higher-order-components", title: "Higher-Order Components & Slot Patterns", duration: "35 min",
        description: "Build reusable cross-cutting concerns with Higher-Order Components and implement slot-based layouts inspired by modern design systems.",
        content: `<h2>Cross-Cutting Concerns</h2>
<p><strong>Higher-Order Components (HOCs)</strong> wrap a component to add functionality — the original pattern for code reuse before hooks. Modern HOCs combine with hooks for type-safe enhancements like authentication guards and analytics wrappers.</p>
<pre><code class="language-tsx">// HOC for authentication guard
function withAuth<P extends object>(
  Component: ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth()
    if (loading) return <Spinner />
    if (!user) return <Navigate to="/login" replace />
    return <Component {...props} user={user} />
  }
}

const DashboardPage = withAuth(({ user }) => {
  return <h1>Welcome, {user.name}</h1>
})

// Slot pattern for flexible layouts
interface CardProps {
  title: React.ReactNode
  actions?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
}

function Card({ title, actions, children, footer }: CardProps) {
  return (
    <div className="card">
      <header>
        <h2>{title}</h2>
        {actions && <div className="card-actions">{actions}</div>}
      </header>
      <main>{children}</main>
      {footer && <footer>{footer}</footer>}
    </div>
  )
}</code></pre>
<p>HOCs compose naturally — you can chain <code>withAuth(withAnalytics(withErrorBoundary(Component)))</code> for layered functionality.</p>`,
        quiz: [
          {
            question: "What is a key trade-off of Higher-Order Components compared to hooks?",
            options: ["HOCs are faster at runtime", "HOCs can cause naming collisions when multiple HOCs inject the same prop name, whereas hooks compose more naturally", "HOCs don't work with TypeScript", "Hooks require more boilerplate code"],
            correctIndex: 1,
            explanation: "Multiple HOCs can accidentally overwrite each other's props if they inject props with the same name. Hooks avoid this because values are explicitly destructured."
          }
        ]
      },
      {
        id: "polymorphic-components", title: "Polymorphic Components & AsProp", duration: "30 min",
        description: "Build polymorphic components with the 'as' prop pattern used by Chakra UI and MUI for rendering any HTML element or custom component.",
        content: `<h2>The As Prop</h2>
<p><strong>Polymorphic components</strong> can render as any HTML element or custom component via the <code>as</code> prop — used by Chakra UI, MUI, and Radix for flexible, accessible UI primitives.</p>
<pre><code class="language-tsx">import { ElementType, ComponentPropsWithoutRef, forwardRef } from "react"

type PolymorphicProps<
  T extends ElementType,
  P = Record<string, never>
> = {
  as?: T
} & P & Omit<ComponentPropsWithoutRef<T>, keyof P | "as">

function Text<T extends ElementType = "span">({
  as,
  children,
  className,
  ...props
}: PolymorphicProps<T>) {
  const Component = as || "span"
  return <Component className={className} {...props}>{children}</Component>
}

// Usage
<Text as="h1" className="title">Heading</Text>
<Text as="p">Paragraph</Text>
<Text as="a" href="/home">Link</Text>
<Text as={CustomComponent} customProp="value">Custom</Text>

// More advanced: constrained polymorphic
type HeadingLevel = "h1" | "h2" | "h3" | "h4"
interface HeadingProps {
  as?: HeadingLevel
  children: React.ReactNode
}
function Heading({ as: Tag = "h2", children }: HeadingProps) {
  return <Tag>{children}</Tag>
}</code></pre>
<p>Type-safe polymorphic components provide autocomplete for all props of the chosen element — <code>href</code> appears when <code>as="a"</code>, <code>htmlFor</code> when <code>as="label"</code>.</p>`
      }
    ]
  },
  {
    id: "react-tier-3", title: "Tier 3: Production — Performance & Architecture",
    lessons: [
      {
        id: "concurrent-suspense", title: "Concurrent Rendering & Suspense", duration: "60 min",
        description: "Build responsive UIs with useTransition, useDeferredValue, and declarative loading states via Suspense-driven data fetching.",
        content: `<h2>Concurrent Mode</h2>
<p>React 19 makes UIs feel faster by allowing rendering to be interruptible. <strong>useTransition</strong> prioritizes urgent updates (input) over non-urgent ones (list loading).</p>
<pre><code class="language-tsx">import { useState, useTransition, useDeferredValue, Suspense } from "react"

function ProductSearch() {
  const [query, setQuery] = useState("")
  const [isPending, startTransition] = useTransition()
  const deferredQuery = useDeferredValue(query)
  const isStale = query !== deferredQuery

  return (
    <>
      <input
        value={query}
        onChange={e => {
          // Urgent: update input
          startTransition(() => {
            // Non-urgent: filter results
            setQuery(e.target.value)
          })
        }}
        placeholder="Search products..."
      />
      <Suspense fallback={<Skeleton />}>
        <SearchResults
          query={deferredQuery}
          style={{ opacity: isStale ? 0.5 : 1 }}
        />
      </Suspense>
    </>
  )
}

// useOptimistic for optimistic updates
function LikeButton({ postId, likes }: { postId: string; likes: number }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    (state) => state + 1
  )

  const handleLike = async () => {
    addOptimisticLike()
    await fetch(\`/api/posts/\${postId}/like\`, { method: "POST" })
  }

  return <button onClick={handleLike}>{optimisticLikes} likes</button>
}</code></pre>
<h3>Suspense Architecture</h3>
<p><strong>Suspense</strong> allows declarative waiting for data, code, or images, eliminating spinners and layout shift.</p>`
      },
      {
        id: "virtualization-window", title: "Virtualization with react-window", duration: "40 min",
        description: "Build performant lists with thousands of items using windowing techniques, variable-size lists, and infinite scrolling patterns.",
        content: `<h2>Virtualization</h2>
<p>Rendering thousands of DOM nodes kills performance. <strong>Windowing</strong> (also called virtualization) only renders items visible in the viewport, recycling DOM nodes as the user scrolls.</p>
<pre><code class="language-tsx">import { FixedSizeList, VariableSizeList } from "react-window"
import { AutoSizer } from "react-virtualized-auto-sizer"
import InfiniteLoader from "react-window-infinite-loader"

// Fixed-size list (fastest)
function ContactList({ contacts }: { contacts: Contact[] }) {
  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList
          height={height}
          width={width}
          itemCount={contacts.length}
          itemSize={72}
        >
          {({ index, style }) => {
            const contact = contacts[index]
            return (
              <div style={style} className="contact-row">
                <Avatar src={contact.avatar} />
                <div>
                  <span>{contact.name}</span>
                  <small>{contact.email}</small>
                </div>
              </div>
            )
          }}
        </FixedSizeList>
      )}
    </AutoSizer>
  )
}

// Variable-size list for dynamic content
function FeedList({ items }: { items: FeedItem[] }) {
  const listRef = useRef<VariableSizeList>(null)
  const sizeMap = useRef<Map<number, number>>(new Map())

  const getSize = (index: number) =>
    sizeMap.current.get(index) ?? 200 // default height

  return (
    <VariableSizeList
      ref={listRef}
      itemCount={items.length}
      itemSize={getSize}
      estimatedItemSize={200}
    >
      {({ index, style }) => (
        <FeedItemCard
          item={items[index]}
          style={style}
          onHeightChange={(height) => {
            sizeMap.current.set(index, height)
            listRef.current?.resetAfterIndex(index)
          }}
        />
      )}
    </VariableSizeList>
  )
}</code></pre>
<p>Use <code>react-window</code> over <code>react-virtualized</code> — it's smaller, faster, and better maintained. Add <code>react-window-infinite-loader</code> for paginated data.</p>`,
        quiz: [
          {
            question: "What is the primary performance benefit of windowing/virtualization?",
            options: ["It compresses images on the client", "It only renders items visible in the viewport, dramatically reducing DOM nodes and memory usage for large lists", "It defers JavaScript execution to idle time", "It uses Web Workers for rendering"],
            correctIndex: 1,
            explanation: "Windowing only mounts DOM nodes for items visible in the viewport, plus a small overscan buffer. A list with 100,000 items might only render 15-20 DOM nodes at any time."
          }
        ]
      },
      {
        id: "code-splitting-lazy", title: "Code Splitting & Lazy Loading", duration: "35 min",
        description: "Reduce bundle size with React.lazy, Suspense boundaries, dynamic imports, and route-based code splitting for production applications.",
        content: `<h2>Bundle Optimization</h2>
<p>Shipping all JavaScript at once creates slow initial loads. <strong>Code splitting</strong> divides your bundle into chunks loaded on demand. <strong>React.lazy</strong> and <strong>dynamic imports</strong> make this declarative.</p>
<pre><code class="language-tsx">import { lazy, Suspense, ComponentType } from "react"

// Route-based code splitting
const Dashboard = lazy(() => import("./pages/Dashboard"))
const Settings = lazy(() => import("./pages/Settings"))
const Analytics = lazy(() =>
  import(/* webpackChunkName: "analytics" */ "./pages/Analytics")
)

// Component-level splitting for heavy libraries
const MarkdownEditor = lazy(() =>
  import("./components/MarkdownEditor")
)

// Preload on hover for instant navigation
function SidebarLink({ href, label, component: Component }) {
  const preload = () => {
    const mod = import("./pages/" + label)
    // Webpack will start fetching the chunk
  }
  return (
    <Link
      to={href}
      onMouseEnter={preload}
      onFocus={preload}
    >
      {label}
    </Link>
  )
}

// Suspense with fallback
function AppRoutes() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Suspense>
  )
}

// Named exports with dynamic import
const { AdminPanel } = lazy(() =>
  import("./admin").then(mod => ({ default: mod.AdminPanel }))
)</code></pre>
<p>Use <strong>preload</strong> on hover/focus for critical routes to make navigation feel instant while still deferring initial load. Monitor with <strong>Lighthouse</strong> and <strong>Webpack Bundle Analyzer</strong>.</p>`
      }
    ]
  },
  {
    id: "react-tier-4", title: "Tier 4: State Management Ecosystems",
    lessons: [
      {
        id: "zustand-jotai-rtk", title: "Zustand vs Jotai vs Redux Toolkit", duration: "45 min",
        description: "Compare modern state management libraries — Zustand's simplicity, Jotai's atomic approach, and Redux Toolkit's opinionated structure — to choose the right tool.",
        content: `<h2>State Management Landscape</h2>
<p>Each library takes a different approach: <strong>Zustand</strong> uses a single store with hooks, <strong>Jotai</strong> uses atomic atoms inspired by Recoil, and <strong>Redux Toolkit</strong> provides an opinionated structure with slices and thunks.</p>
<pre><code class="language-tsx">// Zustand: minimal, no providers needed
import { create } from "zustand"

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  total: () => number
}

const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) =>
    set((state) => ({
      items: state.items.some(i => i.id === item.id)
        ? state.items.map(i =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          )
        : [...state.items, item],
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter(i => i.id !== id),
    })),
  total: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
}))

// Jotai: atomic approach
import { atom, useAtom } from "jotai"

const cartAtom = atom<CartItem[]>([])
const cartTotalAtom = atom((get) =>
  get(cartAtom).reduce((s, i) => s + i.price * i.quantity, 0)
)

function CartTotal() {
  const [total] = useAtom(cartTotalAtom)
  return <span>\${total.toFixed(2)}</span>
}

// Redux Toolkit: structured slices
import { createSlice, configureStore } from "@reduxjs/toolkit"

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] as CartItem[] },
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(i => i.id === action.payload.id)
      if (existing) existing.quantity += action.payload.quantity
      else state.items.push(action.payload)
    },
  },
})</code></pre>
<p><strong>Rule of thumb:</strong> Zustand for medium apps, Jotai for highly atomic state, Redux Toolkit for large teams needing strong conventions.</p>`,
        quiz: [
          {
            question: "How does Zustand differ from Redux Toolkit in terms of architecture?",
            options: ["Zustand requires a Provider wrapper around the entire app", "Zustand uses a store created outside React with hooks-based access, no boilerplate, and no Provider needed", "Zustand only works with class components", "Zustand is owned by Meta"],
            correctIndex: 1,
            explanation: "Zustand stores are standalone objects that can be accessed outside React. They don't require Provider components, reducers, or action creators — just hooks on the client side."
          }
        ]
      },
      {
        id: "selectors-memoization", title: "Selectors & Memoization", duration: "35 min",
        description: "Optimize re-renders with selectors, createSelector memoization, and fine-grained subscriptions in Zustand and Redux Toolkit.",
        content: `<h2>Efficient Subscriptions</h2>
<p>Without selectors, a component subscribes to the entire store and re-renders on any change. <strong>Selectors</strong> extract only the needed slice. <strong>Memoized selectors</strong> (via createSelector or useShallow) prevent unnecessary computations.</p>
<pre><code class="language-tsx">// Zustand: shallow equality for selective subscriptions
import { create } from "zustand"
import { useShallow } from "zustand/react/shallow"

function UserAvatar() {
  // Only re-renders when name or avatar changes, not entire store
  const { name, avatar } = useCartStore(
    useShallow(state => ({
      name: state.user.name,
      avatar: state.user.avatar,
    }))
  )
  return <img src={avatar} alt={name} />
}

// Redux Toolkit: createSelector for memoization
import { createSelector } from "@reduxjs/toolkit"

const selectItems = (state: RootState) => state.cart.items
const selectFilter = (state: RootState) => state.cart.filter

const selectFilteredItems = createSelector(
  [selectItems, selectFilter],
  (items, filter) => items.filter(i =>
    i.name.toLowerCase().includes(filter.toLowerCase())
  )
)

// Jotai: derived atoms with memoization
import { atom } from "jotai"
import { atomFamily } from "jotai/utils"

const itemsAtom = atom<Item[]>([])
const filterAtom = atom("")
const filteredItemsAtom = atom((get) => {
  const filter = get(filterAtom).toLowerCase()
  if (!filter) return get(itemsAtom)
  return get(itemsAtom).filter(i =>
    i.name.toLowerCase().includes(filter)
  )
})

// atomFamily for parameterized selectors
const itemByIdAtom = atomFamily((id: string) =>
  atom((get) => get(itemsAtom).find(i => i.id === id))
)</code></pre>
<p>Use <strong>React.memo</strong> on components consuming derived data to prevent re-renders when the selector returns a new reference but equivalent value.</p>`
      },
      {
        id: "middleware-side-effects", title: "Middleware & Side Effects", duration: "30 min",
        description: "Handle async side effects with Zustand middleware, Redux Thunk, and Jotai async atoms for API calls and state persistence.",
        content: `<h2>Side Effect Management</h2>
<p>State management libraries provide middleware for side effects: <strong>Zustand</strong> has a devtools middleware and allows direct async in actions, <strong>Redux Toolkit</strong> uses createAsyncThunk, and <strong>Jotai</strong> handles async with loadable atoms.</p>
<pre><code class="language-tsx">// Zustand: async actions are just async functions
import { create } from "zustand"
import { persist, devtools } from "zustand/middleware"

interface UserStore {
  user: User | null
  loading: boolean
  fetchUser: (id: string) => Promise<void>
}

const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        loading: false,
        fetchUser: async (id: string) => {
          set({ loading: true })
          try {
            const res = await fetch(\`/api/users/\${id}\`)
            const user = await res.json()
            set({ user, loading: false })
          } catch {
            set({ loading: false })
          }
        },
      }),
      { name: "user-storage", partialize: (state) => ({ user: state.user }) }
    ),
    { name: "UserStore" }
  )
)

// Redux Toolkit: createAsyncThunk
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    const response = await fetch("/api/users")
    if (!response.ok) return rejectWithValue("Failed to fetch")
    return response.json() as Promise<User[]>
  }
)

const usersSlice = createSlice({
  name: "users",
  initialState: { items: [], loading: false, error: null } as UsersState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.loading = true })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})</code></pre>
<p>For persistence, Zustand's persist middleware automatically serializes to localStorage/AsyncStorage. Redux Toolkit can use redux-persist for the same functionality.</p>`
      },
      {
        id: "devtools-integration", title: "DevTools Integration", duration: "25 min",
        description: "Debug application state with Redux DevTools integration for Zustand, Jotai, and Redux Toolkit, including time-travel debugging and state inspection.",
        content: `<h2>Developer Experience</h2>
<p>Modern state management libraries integrate with the <strong>Redux DevTools Extension</strong> for time-travel debugging, action logging, and state inspection in development.</p>
<pre><code class="language-tsx">// Zustand: automatic devtools integration
import { devtools } from "zustand/middleware"

const useStore = create<AppState>()(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    {
      name: "AppStore",
      enabled: process.env.NODE_ENV === "development",
    }
  )
)

// Named actions for better DevTools traces
const useNamedStore = create<Store>()(
  devtools((set) => ({
    count: 0,
    increment: () => {
      set((state) => ({ count: state.count + 1 }), false, "increment")
    },
    reset: () => {
      set({ count: 0 }, false, "reset")
    },
  }))
)

// Jotai: devtools with the Devtools component
import { DevTools, useAtomDevtools } from "jotai-devtools"

function App() {
  return (
    <>
      {process.env.NODE_ENV === "development" && <DevTools />}
      <AppContent />
    </>
  )
}

// Or per-atom devtools
function Counter() {
  useAtomDevtools(counterAtom, { name: "Counter" })
  const [count, setCount] = useAtom(counterAtom)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}

// Redux Toolkit: built-in DevTools
const store = configureStore({
  reducer: rootReducer,
  devTools: {
    name: "MyApp",
    maxAge: 50,
    trace: true,
    traceLimit: 25,
  },
})</code></pre>
<p>Use <strong>trace: true</strong> to see stack traces for each action dispatch, making it easy to trace where state changes originate in your codebase.</p>`,
        quiz: [
          {
            question: "What capability does the Redux DevTools extension provide beyond just viewing state?",
            options: ["It can deploy your application", "Time-travel debugging — replaying or jumping between past actions to see state at any point", "It automatically optimizes bundle size", "It replaces the need for unit tests"],
            correctIndex: 1,
            explanation: "Time-travel debugging lets you step backward/forward through dispatched actions, inspect the state tree at each step, and even re-dispatch actions to reproduce bugs."
          }
        ]
      }
    ]
  },
  {
    id: "react-tier-5", title: "Tier 5: Testing & Accessibility",
    lessons: [
      {
        id: "rtl-patterns", title: "React Testing Library Patterns", duration: "45 min",
        description: "Write maintainable component tests with React Testing Library — user-centric queries, async patterns, custom render utilities, and testing custom hooks.",
        content: `<h2>Testing from the User's Perspective</h2>
<p><strong>React Testing Library</strong> encourages testing components the way users interact with them — by text content, roles, and labels — not by implementation details like state or class names.</p>
<pre><code class="language-tsx">import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { server } from "../mocks/server"
import { HttpResponse, http } from "msw"

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test("submits form and shows success message", async () => {
  const user = userEvent.setup()

  render(<ContactForm />)

  // Find by accessible label (preferred)
  await user.type(screen.getByLabelText(/name/i), "Alice")
  await user.type(screen.getByLabelText(/email/i), "alice@example.com")
  await user.click(screen.getByRole("button", { name: /submit/i }))

  // Wait for async success
  await waitFor(() => {
    expect(
      screen.getByText(/message sent/i)
    ).toBeInTheDocument()
  })
})

test("shows validation errors on empty submit", async () => {
  const user = userEvent.setup()

  render(<ContactForm />)

  await user.click(screen.getByRole("button", { name: /submit/i }))

  expect(screen.getByText(/name is required/i)).toBeInTheDocument()
  expect(screen.getByText(/email is required/i)).toBeInTheDocument()
})

// Testing custom hooks with renderHook
import { renderHook, act } from "@testing-library/react"

test("useCounter increments and decrements", () => {
  const { result } = renderHook(() => useCounter(0))

  act(() => result.current.increment())
  expect(result.current.count).toBe(1)

  act(() => result.current.decrement())
  expect(result.current.count).toBe(0)
})

// Custom render with providers
function renderWithProviders(
  ui: React.ReactElement,
  { preloadedState, ...options }: RenderOptions = {}
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <CartProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </CartProvider>
  )
  return render(ui, { wrapper: Wrapper, ...options })
}</code></pre>
<p>Prefer <code>@testing-library/user-event</code> over <code>fireEvent</code> — it simulates real browser interactions including focus, blur, and keyboard events.</p>`,
        quiz: [
          {
            question: "Why does React Testing Library recommend querying by accessible roles and labels rather than test IDs or class names?",
            options: ["Class-based queries are slower", "Role and label queries enforce accessible implementations and test the component the way users actually experience it", "Test IDs don't work in production builds", "React Testing Library doesn't support querySelector"],
            correctIndex: 1,
            explanation: "Querying by roles/labels ensures your components are accessible and tests survive refactors. If you can't find an element by its accessible role, users with assistive technology can't find it either."
          }
        ]
      },
      {
        id: "playwright-e2e", title: "Playwright E2E Testing", duration: "50 min",
        description: "Build production-grade end-to-end tests with Playwright — cross-browser automation, API mocking, visual regression, and CI integration.",
        content: `<h2>End-to-End Testing</h2>
<p><strong>Playwright</strong> is the leading E2E testing framework, supporting Chromium, Firefox, WebKit, and mobile emulation with auto-waiting and network interception.</p>
<pre><code class="language-ts">// playwright.config.ts
import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [["html"], ["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 15"] },
    },
  ],
})

// e2e/cart.spec.ts
import { test, expect } from "@playwright/test"

test.describe("Shopping Cart", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/products")
  })

  test("adds item to cart and completes checkout", async ({ page }) => {
    // Add item to cart
    await page.getByRole("button", { name: /add to cart/i }).first().click()

    // Navigate to cart
    await page.getByRole("link", { name: /cart/i }).click()

    // Verify item is in cart
    await expect(page.getByTestId("cart-item")).toBeVisible()
    await expect(page.getByTestId("cart-total")).toContainText("$29.99")

    // Complete checkout
    await page.getByRole("button", { name: /checkout/i }).click()
    await page.fill("[name=card]", "4242424242424242")
    await page.getByRole("button", { name: /pay/i }).click()

    // Assert success
    await expect(page.getByText(/order confirmed/i)).toBeVisible()
  })

  test("persists cart across page reload", async ({ page }) => {
    await page.getByRole("button", { name: /add to cart/i }).first().click()
    await page.reload()
    await page.getByRole("link", { name: /cart/i }).click()
    await expect(page.getByTestId("cart-item")).toBeVisible()
  })
})</code></pre>
<p>Use <strong>trace viewer</strong> to debug failed tests — it records a full trace with DOM snapshots, network logs, and console output at each action.</p>`
      },
      {
        id: "aria-patterns", title: "ARIA Patterns & Screen Readers", duration: "35 min",
        description: "Build accessible React components with WAI-ARIA patterns, keyboard navigation, focus management, and screen reader compatibility.",
        content: `<h2>Accessible React</h2>
<p><strong>WAI-ARIA</strong> provides HTML attributes that communicate UI semantics to assistive technology. Modern React components should implement keyboard navigation and proper ARIA roles for menus, dialogs, tabs, and live regions.</p>
<pre><code class="language-tsx">import { useRef, useEffect, useCallback } from "react"

function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement as HTMLElement
      dialogRef.current?.focus()
    } else {
      previousFocus.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      // Trap focus within dialog
      if (e.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusable || focusable.length === 0) return
        const first = focusable[0] as HTMLElement
        const last = focusable[focusable.length - 1] as HTMLElement
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      ref={dialogRef}
      tabIndex={-1}
      style={{ position: "fixed", inset: 0, zIndex: 1000 }}
    >
      <div onClick={onClose} aria-hidden="true" />
      <div role="document">
        <h2 id="dialog-title">{title}</h2>
        {children}
        <button onClick={onClose} aria-label="Close dialog">X</button>
      </div>
    </div>
  )
}

// Accessible tabs pattern
function TabPanel({ id, label, children, hidden }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      id={id}
      aria-labelledby={\`\${id}-tab\`}
      hidden={hidden}
    >
      {children}
    </div>
  )
}</code></pre>
<p>Always test with a real screen reader (VoiceOver, NVDA, JAWS). Automated checks find ~30% of issues — manual testing finds the rest.</p>`,
        quiz: [
          {
            question: "Why is it important to trap keyboard focus inside an open modal dialog?",
            options: ["It looks more visually appealing", "Users who navigate via keyboard could tab behind the dialog and lose context, making the page inaccessible", "It prevents the dialog from closing accidentally", "It's required by React's component model"],
            correctIndex: 1,
            explanation: "Keyboard focus must cycle within the modal while it's open. Without focus trapping, keyboard users can tab to elements behind the overlay, losing context and breaking the dialog experience."
          }
        ]
      },
      {
        id: "axe-core-automation", title: "axe-core Automation", duration: "30 min",
        description: "Automate accessibility audits in CI with axe-core, jest-axe, and Playwright axe integrations to catch violations before they reach production.",
        content: `<h2>Automated Accessibility</h2>
<p><strong>axe-core</strong> by Deque Labs is the industry standard for automated accessibility testing. Integrate it into unit tests with <strong>jest-axe</strong> and E2E tests with Playwright's axe integration.</p>
<pre><code class="language-tsx">// Unit test with jest-axe
import { render } from "@testing-library/react"
import { axe, toHaveNoViolations } from "jest-axe"

expect.extend(toHaveNoViolations)

test("Navigation component has no accessibility violations", async () => {
  const { container } = render(<Navigation />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})

// Per-element assertions
test("specific component passes accessibility rules", async () => {
  const { container } = render(
    <>
      <h1>Page Title</h1>
      <main>
        <Accordion items={items} />
      </main>
    </>
  )
  const results = await axe(container, {
    rules: {
      // Skip heading order check if testing a fragment
      "heading-order": { enabled: false },
    },
  })
  expect(results).toHaveNoViolations()
})

// Playwright E2E accessibility check
import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

test("checkout page has no critical violations", async ({ page }) => {
  await page.goto("/checkout")

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .exclude("#chat-widget") // Third-party widget
    .analyze()

  expect(accessibilityScanResults.violations).toEqual([])
})

// CI integration — fail build on violations
// In CI, configure axe to enforce level AA compliance
const CIResults = await new AxeBuilder({ page })
  .withTags(["wcag2aa", "wcag21aa"])
  .options({
    resultTypes: ["violations"],
    iframeTimeout: 10000,
  })
  .analyze()

if (CIResults.violations.length > 0) {
  console.error(
    \`Accessibility violations found: \${CIResults.violations.length}\`
  )
  process.exit(1)
}</code></pre>
<p>Set up axe checks as part of your CI pipeline and use <strong>axe DevTools</strong> browser extension for local debugging. Catch violations in PRs, not production.</p>`
      }
    ]
  }
]

export default function ReactPatternsPage() {
  return (
    <div className="bg-background text-foreground font-sans">
      <Navbar />
      <LessonPlayer
        title="React Advanced Patterns"
        description="Master the building blocks of world-class React libraries. From custom hooks and compound components to concurrent rendering and performance profiling."
        category="Web"
        accentColor="#61DAFB"
        modules={reactPatternsModules}
        instructor="Dan Abramov"
        rating={4.7}
        reviewCount={2200}
        lastUpdated="Mar 2026"
      />
    </div>
  )
}
