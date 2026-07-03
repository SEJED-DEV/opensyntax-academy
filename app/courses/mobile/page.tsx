import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { LessonPlayer, type Module } from "@/components/lesson-player"

export const metadata: Metadata = {
  title: "Mobile Engineering — React Native, Expo & Reanimated",
  description: "Build production-grade React Native apps for iOS and Android. Master 60fps animations with Reanimated 3 worklets, Expo Router navigation, Skia custom rendering, native module bridging with Swift/Kotlin, EAS CI/CD pipelines, and FlashList performance optimization.",
  keywords: ["React Native Course", "Mobile Development", "Expo Tutorial", "Reanimated", "Mobile App Development", "iOS Android", "Skia", "EAS Build", "FlashList"],
}

const mobileModules: Module[] = [
  {
    id: "mobile-tier-1", title: "Tier 1: Foundations — Native Bridge & UI",
    lessons: [
      {
        id: "rn-primitives", title: "React Native Primitives & Styling", duration: "30 min",
        description: "Moving from the DOM to Native Views. Understanding Flexbox on mobile and the asynchronous bridge.",
        content: `<h2>The Native Bridge</h2>
<p>React Native doesn't use the DOM. Instead, it maps your JavaScript components to <strong>Native UI Views</strong> (UIView on iOS, View on Android) via a C++ bridge.</p>
<h3>Mobile Layouts</h3>
<p>In mobile, <strong>Flexbox</strong> is the only layout engine. Unlike the web, the default direction is <code>column</code>. We use <code>StyleSheet.create</code> to ensure style objects are sent across the bridge efficiently.</p>`
      },
      {
        id: "scroll-lists-gestures", title: "ScrollView, FlashList & Gesture Handling", duration: "35 min",
        description: "Master scrolling, virtualized lists with FlashList, and gesture handling with React Native's built-in gesture system for smooth user interactions.",
        content: `<h2>Efficient Lists on Mobile</h2>
<p>Plain <code>ScrollView</code> renders all children at once — fine for small content, catastrophic for large lists. <strong>FlatList</strong> virtualizes items, rendering only what is visible. <strong>FlashList</strong> (by Shopify) goes further with recycling and prefetching for true 60fps scrolling on low-end devices.</p>
<h3>FlashList Performance</h3>
<p>FlashList recycles views instead of creating new ones, uses a <code>useMemo</code>-inspired comparison for render optimization, and supports <strong>sticky headers</strong>, <strong>swipeable rows</strong>, and <strong>estimated item sizes</strong> for zero-layout-shift rendering.</p>
<pre><code class="language-typescript">import { FlashList } from "@shopify/flash-list";
import { View, Text, StyleSheet } from "react-native";

function FeedList({ data }: { data: FeedItem[] }) {
  return (
    <FlashList
      data={data}
      estimatedItemSize={120}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
        </View>
      )}
      keyExtractor={(item) => item.id}
      onEndReached={() => loadMore()}
      onEndReachedThreshold={0.5}
    />
  );
}

const styles = StyleSheet.create({
  item: { padding: 16, marginVertical: 4, backgroundColor: "#fff", borderRadius: 12 },
  title: { fontSize: 16, fontWeight: "600" },
  desc: { fontSize: 14, color: "#666", marginTop: 4 },
});</code></pre>
<h3>Gesture Handling</h3>
<p>Use <code>PanResponder</code> for custom gestures or better yet, migrate to <strong>React Native Gesture Handler</strong> — it runs gesture recognition on the UI thread using native touch handling, bypassing the JS thread entirely for instant response.</p>`
      },
      {
        id: "platform-specific-apis", title: "Platform-Specific Code & Device APIs", duration: "30 min",
        description: "Write platform-aware code using Platform.select, .ios.tsx/.android.tsx extensions, and access device APIs like camera, location, and biometrics with expo-camera and expo-location.",
        content: `<h2>Cross-Platform Without Compromise</h2>
<p>React Native's promise is "Learn Once, Write Anywhere" — not "Write Once, Run Anywhere." You will need platform-specific code for platform-native UX patterns. Use <code>Platform.OS</code> and file extensions for clean separation.</p>
<h3>Device APIs with Expo</h3>
<p>Expo provides well-typed, permission-aware wrappers for all native device APIs. Never write native code for cameras, location, or notifications again — Expo handles the bridge.</p>
<pre><code class="language-typescript">import { Platform, StyleSheet } from "react-native";
import * as Location from "expo-location";

async function getLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") return;
  const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
  console.log("Lat:", location.coords.latitude);
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.select({ ios: 44, android: 24, default: 0 }),
  },
});</code></pre>`
      }
    ]
  },

  {
    id: "mobile-tier-2", title: "Tier 2: Intermediate — Navigation & State",
    lessons: [
      {
        id: "expo-router", title: "Expo Router & File-based Navigation", duration: "45 min",
        description: "Modern mobile navigation. Shared layouts, stack navigators, and deep linking with Expo.",
        content: `<h2>Expo Router Mastery</h2>
<p>Expo Router brings the 'Next.js' experience to mobile. By using an <code>app/</code> directory, we get file-based routing that automatically generates <strong>Native Stack</strong> and <strong>Tab</strong> navigators.</p>
<h3>Persistence & State</h3>
<p>Mobile apps are not just website wrappers. We use <strong>AsyncStorage</strong> for light persistent data and <strong>React Query</strong> to manage server state with offline-first support.</p>`
      },
      {
        id: "state-management-zustand", title: "State Management with Zustand & MMKV", duration: "40 min",
        description: "Build fast, scalable state management using Zustand for global state and MMKV for ultra-fast key-value persistence (50x faster than AsyncStorage).",
        content: `<h2>Modern State on Mobile</h2>
<p>Redux is heavy for mobile. <strong>Zustand</strong> provides a minimal, hook-based state management solution with zero boilerplate. For persistence, <strong>MMKV</strong> (by WeChat) uses memory-mapped files for synchronous reads — 50x faster than AsyncStorage.</p>
<h3>Zustand + MMKV Persistence</h3>
<p>Combine Zustand middlewares with MMKV adapter for instant app startup with persistent state.</p>
<pre><code class="language-typescript">import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV({ id: "app-storage" });

interface AppState {
  theme: "light" | "dark" | "system";
  onboarded: boolean;
  bookmarks: string[];
  toggleBookmark: (courseId: string) => void;
}

const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: "system",
      onboarded: false,
      bookmarks: [],
      setTheme: (theme) => set({ theme }),
      setOnboarded: () => set({ onboarded: true }),
      toggleBookmark: (courseId) => {
        const bookmarks = get().bookmarks;
        if (bookmarks.includes(courseId)) {
          set({ bookmarks: bookmarks.filter((id) => id !== courseId) });
        } else {
          set({ bookmarks: [...bookmarks, courseId] });
        }
      },
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => ({
        setItem: (key, value) => storage.set(key, value),
        getItem: (key) => storage.getString(key) ?? null,
        removeItem: (key) => storage.delete(key),
      })),
    }
  )
);</code></pre>
<h3>Offline-First with React Query</h3>
<p>Use <strong>React Query</strong> with a persistence adapter to cache API responses on disk. When the app launches offline, data is served from the cache while background refetches update it.</p>`,
        quiz: [
          {
            question: "Why is MMKV significantly faster than AsyncStorage for local persistence?",
            options: ["MMKV uses SQLite under the hood", "MMKV uses memory-mapped files for synchronous reads", "MMKV is written in Java", "MMKV compresses all data automatically"],
            correctIndex: 1,
            explanation: "MMKV uses memory-mapped files (mmap), enabling synchronous reads directly from memory without blocking the JS thread."
          }
        ]
      },
      {
        id: "offline-first-watermelon", title: "Offline-First with WatermelonDB", duration: "45 min",
        description: "Build a truly offline-first mobile app with WatermelonDB. Implement sync protocols, lazy-loaded records, and relational data models that work without connectivity.",
        content: `<h2>Offline-First Architecture</h2>
<p><strong>WatermelonDB</strong> is a high-performance reactive database for React Native. It uses SQLite for fast local storage and a sync adapter to synchronize with a remote server. It is built for apps that must work offline first.</p>
<h3>Schema & Models</h3>
<p>Define your schema and models. WatermelonDB uses lazy loading — records are fetched only when accessed, and rendering is optimized with decorators.</p>
<pre><code class="language-typescript">import { appSchema, tableSchema } from "@watermelondb/decorators";
import { field, relation, children } from "@nozbe/watermelondb/decorators";
import Model from "@nozbe/watermelondb/Model";

export const schema = appSchema({
  version: 2,
  tables: [
    tableSchema({
      name: "projects",
      columns: [
        { name: "name", type: "string" },
        { name: "is_archived", type: "boolean" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "tasks",
      columns: [
        { name: "title", type: "string" },
        { name: "is_completed", type: "boolean" },
        { name: "project_id", type: "string", isIndexed: true },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
  ],
});

class Task extends Model {
  static table = "tasks";
  static associations = { projects: { type: "belongs_to" as const, key: "project_id" } };
  @field("title") title!: string;
  @field("is_completed") isCompleted!: boolean;
  @relation("projects", "project_id") project!: any;
}</code></pre>
<h3>Sync Protocol</h3>
<p>WatermelonDB uses a pull/push sync pattern. On sync, it pushes local changes to the server and pulls remote changes back. The protocol handles conflict resolution with timestamps.</p>`
      }
    ]
  },
  {
    id: "mobile-tier-3", title: "Tier 3: Production — Performance & Native Modules",
    lessons: [
      {
        id: "reanimated-eas", title: "60fps Animations & EAS CI/CD", duration: "60 min",
        description: "Bypassing the JS thread with Reanimated 3 worklets. Native module bridging and cloud-based EAS deployments.",
        content: `<h2>Fluid UI with Reanimated</h2>
<p>To achieve 60fps, we must move compute to the UI thread. <strong>Reanimated 3</strong> uses 'worklets' — JavaScript functions that run purely in C++ on the native side, preventing UI lag.</p>
<h3>EAS & Over-The-Air Updates</h3>
<p>We use <strong>EAS (Expo Application Services)</strong> to build binaries in the cloud. With <strong>EAS Update</strong>, we can push hotfixes to users instantly without waiting for App Store reviews.</p>`
      },
      {
        id: "native-module-bridging", title: "Native Module Bridging (Swift/Kotlin)", duration: "55 min",
        description: "Build native modules when Expo is not enough. Write Swift and Kotlin code, bridge it to JS, and expose it as a React Native Turbo Module.",
        content: `<h2>When to Go Native</h2>
<p>Expo covers 90% of use cases, but sometimes you need platform-specific APIs that are not yet supported: custom Bluetooth stacks, hardware sensors, or proprietary SDKs.</p>
<h3>Swift Native Module (iOS)</h3>
<p>React Native New Architecture uses <strong>Turbo Modules</strong> — native modules are lazily loaded and typed with codegen. The module exposes methods annotated with <code>@objc</code> and uses <code>RCTPromiseResolveBlock</code> for async results.</p>
<pre><code class="language-swift">import Foundation
import React

@objc(HealthKitModule)
class HealthKitModule: NSObject {
  @objc
  func requestAuthorization(_ resolve: @escaping RCTPromiseResolveBlock,
                            rejecter reject: @escaping RCTPromiseRejectBlock) {
    let healthStore = HKHealthStore()
    guard HKHealthStore.isHealthDataAvailable() else {
      reject("HEALTHKIT_UNAVAILABLE", "HealthKit not available", nil)
      return
    }
    let typesToRead: Set<HKObjectType> = [
      HKObjectType.quantityType(forIdentifier: .stepCount)!,
    ]
    healthStore.requestAuthorization(toShare: nil, read: typesToRead) { success, error in
      if success { resolve(true) }
      else { reject("AUTH_FAILED", error?.localizedDescription, error) }
    }
  }
}</code></pre>
<h3>Kotlin Native Module (Android)</h3>
<pre><code class="language-kotlin">class HealthKitModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {
  override fun getName() = "HealthKitModule"
  @ReactMethod
  fun requestAuthorization(promise: Promise) {
    // Use Android Health Connect API
    promise.resolve(true)
  }
}</code></pre>`,
        quiz: [
          {
            question: "When should you write a native module instead of using an Expo package?",
            options: ["When the API requires custom platform-specific SDKs not available in Expo", "When you want to write less code", "Always — native is always better", "When you need to use React Navigation"],
            correctIndex: 0,
            explanation: "Expo covers most use cases. Native modules are needed when you must integrate a proprietary SDK or use platform APIs that Expo has not yet wrapped."
          }
        ]
      },
      {
        id: "skia-graphics", title: "Skia Graphics & Custom Canvas", duration: "45 min",
        description: "Draw custom graphics with React Native Skia. Create charts, custom UI components, and performant canvas rendering using the same GPU-accelerated engine as Chrome and Flutter.",
        content: `<h2>Skia: The GPU Graphics Library</h2>
<p><strong>React Native Skia</strong> brings Google's Skia graphics library (used by Chrome, Android, Flutter) to React Native. It provides a declarative API to draw 2D graphics directly on the GPU.</p>
<h3>Declarative Drawing</h3>
<p>Skia components mirror the Canvas API but are fully declarative and composable. Each <code>Group</code>, <code>Circle</code>, or <code>Path</code> can be animated with Reanimated shared values.</p>
<pre><code class="language-typescript">import { Canvas, Circle, Group, Fill, Shader, useDerivedValue } from "@shopify/react-native-skia";
import { useSharedValue } from "react-native-reanimated";

const DonutChart = () => {
  return (
    <Canvas style={{ width: 200, height: 200 }}>
      <Circle cx={100} cy={100} r={80} color="#4A90D9" />
    </Canvas>
  );
};</code></pre>
<h3>When to Use Skia</h3>
<p>Skia excels for: custom chart libraries, image filters, real-time audio visualizers, and any UI that needs sub-pixel precision rendering unavailable in standard React Native Views.</p>`
      }
    ]
  },
  {
    id: "expo-native-modules", title: "Module 4: Native Modules & Expo",
    lessons: [
      {
        id: "expo-dev-client", title: "Expo Dev Client & Debugging", duration: "35 min",
        description: "Set up the Expo Dev Client for custom native module development. Debug with Flipper, profile with React DevTools, and master the debugging workflow.",
        content: `<h2>Expo Dev Client</h2>
<p>The <strong>Expo Dev Client</strong> bridges the gap between Expo Go (managed) and bare React Native (vanilla). It creates a development build of your app with all native modules pre-installed.</p>
<h3>Setting Up Dev Client</h3>
<p>Unlike Expo Go which can only load pure JS/Expo modules, the Dev Client allows you to add custom native code while retaining Expo's development features: fast refresh, Expo Orbit, and EAS updates.</p>
<pre><code class="language-bash">npx expo run:ios
npx expo run:android
eas build --platform ios --profile development
npx expo start --dev-client</code></pre>
<h3>Debugging Native Crashes</h3>
<p>When native code crashes, use Xcode (iOS) or Android Studio logs to find the stack trace. Symbolicate crash reports with <code>npx react-native symbolicate-ios</code>. Integrate <strong>Sentry</strong> or <strong>Crashlytics</strong> for production native crash reporting.</p>`
      },
      {
        id: "native-module-architecture", title: "Native Module Bridging Architecture", duration: "50 min",
        description: "Understand the React Native New Architecture: Fabric renderer, Turbo Modules, and JSI for synchronous native calls without the bridge overhead.",
        content: `<h2>The New Architecture</h2>
<p>React Native's New Architecture replaces the asynchronous JSON bridge with <strong>JSI (JavaScript Interface)</strong>. Instead of serializing calls over the bridge, JSI gives JavaScript a direct reference to C++ objects — enabling synchronous calls and zero-copy data passing.</p>
<h3>Turbo Modules vs Old Bridge</h3>
<p>Old bridge: async, JSON serialized, must be registered upfront. Turbo Modules: lazy loaded, synchronous when needed, typed with codegen, and natively backed by C++ host objects.</p>
<pre><code class="language-cpp">class MyNativeModule : public HostObject {
 public:
  std::vector<PropNameID> getPropertyNames(Runtime& rt) override {
    return { PropNameID::forAscii(rt, "getDeviceId") };
  }
  Value get(Runtime& rt, const PropNameID& name) override {
    auto propName = name.utf8(rt);
    if (propName == "getDeviceId") {
      return Function::createFromHostFunction(
        rt, name, 0,
        [](Runtime& rt, const Value& thisVal, const Value* args, size_t count) -> Value {
          std::string deviceId = getUniqueDeviceId();
          return Value(rt, String::createFromUtf8(rt, deviceId));
        }
      );
    }
    return Value::undefined();
  }
};</code></pre>`
      },
      {
        id: "eas-build-submit", title: "EAS Build & App Store Submit", duration: "40 min",
        description: "Automate binary builds and app store submissions with EAS. Configure credentials, manage provisioning profiles, and submit to TestFlight and Google Play Console.",
        content: `<h2>EAS: Expo Application Services</h2>
<p><strong>EAS Build</strong> compiles your app in the cloud — no need for a Mac to build iOS or complex Android NDK setup. <strong>EAS Submit</strong> uploads the binary to App Store Connect and Google Play Console.</p>
<h3>EAS Build Configuration</h3>
<p>Configure build profiles in <code>eas.json</code> for development, preview, and production.</p>
<pre><code class="language-json">{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": { "simulator": true }
    },
    "production": {
      "autoIncrement": true,
      "env": { "API_URL": "https://api.opensyntax.academy" }
    }
  },
  "submit": {
    "production": {
      "ios": { "appleId": "dev@opensyntax.academy" },
      "android": { "track": "production" }
    }
  }
}</code></pre>
<h3>CI/CD Integration</h3>
<p>Run EAS Build and Submit from GitHub Actions. On every push to <code>main</code>, build the app, run E2E tests, and submit to TestFlight.</p>`,
        quiz: [
          {
            question: "What is the primary advantage of using EAS Build over building locally?",
            options: ["It is free and unlimited", "It eliminates the need for a Mac to build iOS apps and handles code signing in the cloud", "It builds apps faster than local builds", "It does not require an Apple Developer account"],
            correctIndex: 1,
            explanation: "EAS Build compiles iOS binaries in the cloud, so developers on Windows or Linux can build for iOS without a Mac."
          }
        ]
      },
      {
        id: "app-store-deployment", title: "App Store Deployment & Review Process", duration: "30 min",
        description: "Navigate the App Store and Google Play review processes. Handle rejection, prepare metadata, configure in-app purchases, and implement phased releases.",
        content: `<h2>Submitting to App Stores</h2>
<p>Getting your app on the App Store is a multi-step process involving certificates, provisioning profiles, and review guidelines.</p>
<h3>Preparing for Review</h3>
<p>Apple rejects apps for: broken links, placeholder text, insufficient privacy descriptions, crashes on launch, and using private APIs. Pre-review with TestFlight to catch issues early.</p>
<pre><code class="language-typescript">import * as Application from "expo-application";
console.log("Version:", Application.nativeApplicationVersion);
console.log("Build:", Application.nativeBuildVersion);</code></pre>
<h3>Phased Releases</h3>
<p>Use <strong>phased releases</strong> (Apple: 7-day gradual rollout; Google: staged rollouts) to monitor crash rates before reaching all users. Roll back immediately if issues are detected.</p>`
      }
    ]
  },
  {
    id: "performance-animations", title: "Module 5: Performance & Animations",
    lessons: [
      {
        id: "reanimated-gestures", title: "Reanimated 3 Gesture Handlers", duration: "50 min",
        description: "Build fluid gesture-driven interactions with Reanimated 3 and Gesture Handler. Implement pan, pinch, rotation, and animated scroll views that run at 120fps on the UI thread.",
        content: `<h2>Gesture-Driven Animations</h2>
<p>React Native Gesture Handler combined with Reanimated 3 enables gesture recognition and animation execution entirely on the native UI thread.</p>
<h3>Composed Gestures</h3>
<p>Compose multiple gestures — pan, pinch, rotation — using <code>Gesture.Simultaneous</code>, <code>Gesture.Race</code>, and <code>Gesture.Exclusive</code>. Animated values update synchronously for multi-touch interactions.</p>
<pre><code class="language-typescript">import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

function PinchableImage({ uri }: { uri: string }) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => { scale.value = savedScale.value * e.scale; })
    .onEnd(() => { savedScale.value = scale.value; });

  const panGesture = Gesture.Pan()
    .minPointers(2)
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.Image source={{ uri }} style={[{ width: 300, height: 300 }, animatedStyle]} />
    </GestureDetector>
  );
}</code></pre>`
      },
      {
        id: "skia-custom-renders", title: "Skia Custom Renders & Shaders", duration: "45 min",
        description: "Write custom Skia shaders for GPU-accelerated effects. Implement blur, color matrices, gradients, and procedural textures using GLSL-like shading language.",
        content: `<h2>GPU Shaders with Skia</h2>
<p>Skia supports custom <strong>shaders</strong> — small programs that run on the GPU for each pixel. This enables real-time effects like blurs, color grading, and procedural textures.</p>
<h3>Declarative Shaders</h3>
<p>Skia's <code>Shader</code> component accepts a GLSL-like shader string. Mix shaders, apply them to images or shapes, and animate their parameters with Reanimated shared values.</p>
<pre><code class="language-typescript">import { Canvas, Shader, Fill, Circle } from "@shopify/react-native-skia";

function AnimatedBackground() {
  const source = [
    "uniform float uTime;",
    "uniform vec2 uResolution;",
    "vec4 main(vec2 pos) {",
    "  vec2 uv = pos / uResolution;",
    "  float dist = distance(uv, vec2(0.5));",
    "  vec3 color = 0.5 + 0.5 * cos(uTime + uv.xyx + vec3(0, 2, 4));",
    "  return vec4(color * (1.0 - dist), 1.0);",
    "}"
  ].join("\n");

  return (
    <Canvas style={{ flex: 1 }}>
      <Fill>
        <Shader source={source} />
      </Fill>
    </Canvas>
  );
}</code></pre>`
      },
      {
        id: "flashlist-optimization", title: "FlashList Optimization & Memory Tuning", duration: "35 min",
        description: "Optimize list rendering with FlashList. Tune estimated item sizes, implement view recycling, avoid unnecessary re-renders, and manage memory for 100K+ item lists.",
        content: `<h2>FlashList Mastery</h2>
<p><strong>FlashList</strong> from Shopify replaces FlatList with a fundamentally different architecture: it recycles views and uses <strong>estimated item sizes</strong> to eliminate layout calculations.</p>
<h3>Performance Tuning</h3>
<p>The single most important prop is <code>estimatedItemSize</code>. Set it to the approximate height of your items. This allows FlashList to compute the total scrollable height without measuring every item.</p>
<pre><code class="language-typescript">import { FlashList } from "@shopify/flash-list";

function MessageList({ messages }) {
  return (
    <FlashList
      data={messages}
      estimatedItemSize={72}
      renderItem={({ item }) => <MessageBubble message={item} />}
      keyExtractor={(item) => item.id}
      recycleItems={true}
    />
  );
}

const MessageBubble = React.memo(({ message }) => {
  return <View><Text>{message.text}</Text></View>;
});</code></pre>
<h3>Hermes Engine</h3>
<p><strong>Hermes</strong> is an open-source JavaScript engine optimized for React Native. It precompiles bytecode at build time, reducing startup time by 50% and app size by 30%. Enable it in <code>app.json</code> with <code>"hermes": true</code>.</p>`,
        quiz: [
          {
            question: "Why is estimatedItemSize the most critical prop for FlashList performance?",
            options: ["It determines the number of items to render", "It allows FlashList to calculate scrollable content size without measuring every item", "It sets the maximum height of the list", "It controls how many items are recycled"],
            correctIndex: 1,
            explanation: "estimatedItemSize tells FlashList the approximate height of each item, allowing it to compute total scrollable height and determine which items to render without measuring every single item."
          }
        ]
      }
    ]
  }
]

export default function MobilePage() {
  return (
    <div className="bg-background text-foreground font-sans">
      <Navbar />
      <LessonPlayer
        title="Mobile Engineering · React Native"
        description="Build high-performance native apps for iOS and Android. From bridge fundamentals and Expo layouts to 60fps Reanimated worklets and cloud deployments."
        category="Mobile"
        accentColor="#3DDC84"
        modules={mobileModules}
        instructor="Evan Bacon"
        rating={4.8}
        reviewCount={2040}
        lastUpdated="Mar 2026"
      />
    </div>
  )
}
