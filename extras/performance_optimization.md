# Vue Performance Optimization Guide ⚡

## Overview

This comprehensive guide covers Vue 3 performance optimization techniques, from basic optimizations to advanced patterns for production applications.

## Table of Contents

1. [Vue 3 Performance Fundamentals](#vue-3-performance-fundamentals)
2. [Component Optimization](#component-optimization)
3. [Reactivity Optimization](#reactivity-optimization)
4. [Bundle Optimization](#bundle-optimization)
5. [Runtime Performance](#runtime-performance)
6. [Memory Management](#memory-management)
7. [Lazy Loading & Code Splitting](#lazy-loading--code-splitting)
8. [Image & Asset Optimization](#image--asset-optimization)
9. [Caching Strategies](#caching-strategies)
10. [Production Optimizations](#production-optimizations)
11. [Performance Monitoring](#performance-monitoring)
12. [Tools & Profiling](#tools--profiling)

## Vue 3 Performance Fundamentals

### Understanding Vue 3's Performance Features

Vue 3 includes several performance improvements over Vue 2:

- **Proxy-based Reactivity**: More efficient than Vue 2's Object.defineProperty
- **Tree-shaking Support**: Smaller bundle sizes
- **Composition API**: Better code organization and reusability
- **Teleport**: Efficient portal rendering
- **Suspense**: Better async component handling

### Performance Budgets

```typescript
// performance.config.ts
export const performanceConfig = {
  budgets: {
    // Bundle size limits
    bundle: {
      js: '500kb',
      css: '100kb',
      images: '1mb'
    },
    // Runtime performance
    runtime: {
      fcp: 1800, // First Contentful Paint (ms)
      lcp: 2500, // Largest Contentful Paint (ms)
      fid: 100,  // First Input Delay (ms)
      cls: 0.1   // Cumulative Layout Shift
    }
  }
}
```

## Component Optimization

### Using `defineAsyncComponent` for Lazy Loading

```vue
<!-- LazyComponent.vue -->
<template>
  <div>
    <h2>Heavy Component</h2>
    <p>This component is loaded lazily</p>
  </div>
</template>

<script setup lang="ts">
// Heavy computation or large dependencies
const heavyData = computed(() => {
  // Simulate heavy computation
  return Array.from({ length: 10000 }, (_, i) => i)
})
</script>
```

```vue
<!-- App.vue -->
<template>
  <div>
    <button @click="showHeavy = !showHeavy">
      Toggle Heavy Component
    </button>

    <Suspense v-if="showHeavy">
      <template #default>
        <LazyHeavyComponent />
      </template>
      <template #fallback>
        <div>Loading...</div>
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'

const showHeavy = ref(false)

// Lazy load the heavy component
const LazyHeavyComponent = defineAsyncComponent(() =>
  import('./LazyComponent.vue')
)
</script>
```

### Optimizing Computed Properties

```vue
<template>
  <div>
    <h2>User List</h2>
    <input v-model="searchQuery" placeholder="Search users..." />

    <!-- Optimized list rendering -->
    <div class="user-list">
      <div
        v-for="user in filteredUsers"
        :key="user.id"
        class="user-item"
      >
        {{ user.name }} - {{ user.email }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, shallowRef } from 'vue'

interface User {
  id: number
  name: string
  email: string
  department: string
}

const users = shallowRef<User[]>([])
const searchQuery = ref('')

// Optimized computed with proper dependencies
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value

  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user =>
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query)
  )
})

// Load users data
const loadUsers = async () => {
  const response = await fetch('/api/users')
  users.value = await response.json()
}

onMounted(() => {
  loadUsers()
})
</script>
```

### Using `shallowRef` and `shallowReactive`

```vue
<template>
  <div>
    <h2>Large Dataset</h2>
    <div class="data-grid">
      <div
        v-for="item in largeDataSet"
        :key="item.id"
        class="data-item"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, onMounted } from 'vue'

interface DataItem {
  id: number
  name: string
  // ... many other properties
}

// Use shallowRef for large objects that don't need deep reactivity
const largeDataSet = shallowRef<DataItem[]>([])

const loadData = async () => {
  // Simulate loading large dataset
  const data = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    // ... many other properties
  }))

  largeDataSet.value = data
}

onMounted(() => {
  loadData()
})
</script>
```

## Reactivity Optimization

### Optimizing Watchers

```vue
<template>
  <div>
    <input v-model="searchQuery" placeholder="Search..." />
    <div v-if="isLoading">Loading...</div>
    <div v-else>
      <div v-for="result in searchResults" :key="result.id">
        {{ result.title }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'

const searchQuery = ref('')
const searchResults = ref([])
const isLoading = ref(false)

// Debounced search with optimized watcher
let searchTimeout: NodeJS.Timeout

watch(searchQuery, (newQuery) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  if (newQuery.length < 2) {
    searchResults.value = []
    return
  }

  searchTimeout = setTimeout(async () => {
    isLoading.value = true
    try {
      const response = await fetch(`/api/search?q=${newQuery}`)
      searchResults.value = await response.json()
    } finally {
      isLoading.value = false
    }
  }, 300) // 300ms debounce
}, { flush: 'post' })

// Cleanup on unmount
onUnmounted(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})
</script>
```

### Memoization with `computed`

```vue
<template>
  <div>
    <h2>Expensive Calculations</h2>
    <input v-model.number="inputValue" type="number" />

    <div class="results">
      <div>Fibonacci: {{ fibonacciResult }}</div>
      <div>Prime Check: {{ isPrimeResult ? 'Yes' : 'No' }}</div>
      <div>Factorial: {{ factorialResult }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const inputValue = ref(10)

// Memoized expensive calculations
const fibonacciResult = computed(() => {
  const n = inputValue.value
  if (n <= 1) return n

  let a = 0, b = 1
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b]
  }
  return b
})

const isPrimeResult = computed(() => {
  const n = inputValue.value
  if (n < 2) return false
  if (n === 2) return true
  if (n % 2 === 0) return false

  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false
  }
  return true
})

const factorialResult = computed(() => {
  const n = inputValue.value
  if (n < 0) return 0
  if (n <= 1) return 1

  let result = 1
  for (let i = 2; i <= n; i++) {
    result *= i
  }
  return result
})
</script>
```

## Bundle Optimization

### Tree Shaking Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ui-vendor': ['element-plus', '@headlessui/vue'],
          'utils-vendor': ['lodash-es', 'dayjs']
        }
      }
    },
    // Enable tree shaking
    treeshake: true,
    // Minify for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
```

### Dynamic Imports

```vue
<template>
  <div>
    <button @click="loadChart">Load Chart</button>
    <button @click="loadTable">Load Table</button>

    <Suspense>
      <template #default>
        <component :is="currentComponent" />
      </template>
      <template #fallback>
        <div>Loading component...</div>
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'

const currentComponent = ref(null)

// Dynamic imports for code splitting
const loadChart = async () => {
  currentComponent.value = defineAsyncComponent(() =>
    import('./components/Chart.vue')
  )
}

const loadTable = async () => {
  currentComponent.value = defineAsyncComponent(() =>
    import('./components/DataTable.vue')
  )
}
</script>
```

## Runtime Performance

### Virtual Scrolling for Large Lists

```vue
<template>
  <div class="virtual-scroll-container">
    <div
      ref="scrollContainer"
      class="scroll-container"
      @scroll="handleScroll"
    >
      <div :style="{ height: totalHeight + 'px' }">
        <div
          v-for="item in visibleItems"
          :key="item.id"
          :style="{
            position: 'absolute',
            top: item.top + 'px',
            height: itemHeight + 'px',
            width: '100%'
          }"
          class="list-item"
        >
          {{ item.data.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface ListItem {
  id: number
  data: {
    name: string
    // ... other properties
  }
}

const props = defineProps<{
  items: ListItem[]
  itemHeight?: number
  containerHeight?: number
}>()

const itemHeight = props.itemHeight || 50
const containerHeight = props.containerHeight || 400
const scrollTop = ref(0)

const totalHeight = computed(() => props.items.length * itemHeight)

const visibleStart = computed(() =>
  Math.floor(scrollTop.value / itemHeight)
)

const visibleEnd = computed(() =>
  Math.min(
    visibleStart.value + Math.ceil(containerHeight / itemHeight) + 1,
    props.items.length
  )
)

const visibleItems = computed(() => {
  const items = []
  for (let i = visibleStart.value; i < visibleEnd.value; i++) {
    items.push({
      ...props.items[i],
      top: i * itemHeight
    })
  }
  return items
})

const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement
  scrollTop.value = target.scrollTop
}
</script>

<style scoped>
.virtual-scroll-container {
  height: 400px;
  overflow: hidden;
}

.scroll-container {
  height: 100%;
  overflow-y: auto;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #eee;
}
</style>
```

### Optimizing Large Lists

```vue
<template>
  <div>
    <h2>Optimized List</h2>
    <input v-model="searchQuery" placeholder="Search..." />

    <!-- Use v-memo for expensive list items -->
    <div
      v-for="item in filteredItems"
      :key="item.id"
      v-memo="[item.id, item.name, item.status]"
      class="list-item"
    >
      <div class="item-content">
        <h3>{{ item.name }}</h3>
        <p>{{ item.description }}</p>
        <span :class="['status', item.status]">
          {{ item.status }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Item {
  id: number
  name: string
  description: string
  status: 'active' | 'inactive' | 'pending'
}

const items = ref<Item[]>([])
const searchQuery = ref('')

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value

  const query = searchQuery.value.toLowerCase()
  return items.value.filter(item =>
    item.name.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query)
  )
})

// Load items
const loadItems = async () => {
  const response = await fetch('/api/items')
  items.value = await response.json()
}

onMounted(() => {
  loadItems()
})
</script>

<style scoped>
.list-item {
  padding: 16px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.list-item:hover {
  background-color: #f5f5f5;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
}

.status.active {
  background-color: #d4edda;
  color: #155724;
}

.status.inactive {
  background-color: #f8d7da;
  color: #721c24;
}

.status.pending {
  background-color: #fff3cd;
  color: #856404;
}
</style>
```

## Memory Management

### Cleaning Up Resources

```vue
<template>
  <div>
    <button @click="startTimer">Start Timer</button>
    <button @click="stopTimer">Stop Timer</button>
    <p>Time: {{ time }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const time = ref(0)
let timerId: NodeJS.Timeout | null = null

const startTimer = () => {
  if (timerId) return

  timerId = setInterval(() => {
    time.value++
  }, 1000)
}

const stopTimer = () => {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
}

// Cleanup on unmount
onUnmounted(() => {
  stopTimer()
})
</script>
```

### Event Listener Cleanup

```vue
<template>
  <div>
    <h2>Window Events</h2>
    <p>Scroll position: {{ scrollY }}</p>
    <p>Window size: {{ windowWidth }}x{{ windowHeight }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const scrollY = ref(0)
const windowWidth = ref(0)
const windowHeight = ref(0)

const handleScroll = () => {
  scrollY.value = window.scrollY
}

const handleResize = () => {
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
}

onMounted(() => {
  // Add event listeners
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize)

  // Initial values
  handleScroll()
  handleResize()
})

onUnmounted(() => {
  // Clean up event listeners
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})
</script>
```

## Lazy Loading & Code Splitting

### Route-based Code Splitting

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('../views/About.vue')
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('../views/Admin.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    }
  ]
})

export default router
```

### Component-based Code Splitting

```vue
<template>
  <div>
    <nav>
      <button @click="currentTab = 'home'">Home</button>
      <button @click="currentTab = 'about'">About</button>
      <button @click="currentTab = 'contact'">Contact</button>
    </nav>

    <Suspense>
      <template #default>
        <component :is="currentComponent" />
      </template>
      <template #fallback>
        <div>Loading...</div>
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue'

const currentTab = ref('home')

// Lazy load components
const components = {
  home: defineAsyncComponent(() => import('./Home.vue')),
  about: defineAsyncComponent(() => import('./About.vue')),
  contact: defineAsyncComponent(() => import('./Contact.vue'))
}

const currentComponent = computed(() => components[currentTab.value])
</script>
```

## Image & Asset Optimization

### Lazy Loading Images

```vue
<template>
  <div>
    <h2>Image Gallery</h2>
    <div class="gallery">
      <div
        v-for="image in images"
        :key="image.id"
        class="image-container"
      >
        <img
          :src="image.thumbnail"
          :alt="image.alt"
          loading="lazy"
          @click="loadFullImage(image)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Image {
  id: number
  thumbnail: string
  fullSize: string
  alt: string
}

const images = ref<Image[]>([])

const loadFullImage = async (image: Image) => {
  // Load full-size image when needed
  const fullImage = new Image()
  fullImage.src = image.fullSize
  fullImage.onload = () => {
    // Replace thumbnail with full image
    const img = document.querySelector(`img[alt="${image.alt}"]`) as HTMLImageElement
    if (img) {
      img.src = image.fullSize
    }
  }
}

// Load images
const loadImages = async () => {
  const response = await fetch('/api/images')
  images.value = await response.json()
}

onMounted(() => {
  loadImages()
})
</script>

<style scoped>
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.image-container {
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 8px;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s;
}

.image-container img:hover {
  transform: scale(1.05);
}
</style>
```

## Caching Strategies

### Service Worker Caching

```typescript
// sw.js
const CACHE_NAME = 'vue-app-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
      })
  )
})
```

### API Response Caching

```typescript
// composables/useApiCache.ts
import { ref, computed } from 'vue'

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class ApiCache {
  private cache = new Map<string, CacheEntry<any>>()

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  clear() {
    this.cache.clear()
  }
}

const apiCache = new ApiCache()

export function useApiCache() {
  const fetchWithCache = async <T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> => {
    // Check cache first
    const cached = apiCache.get<T>(key)
    if (cached) return cached

    // Fetch and cache
    const data = await fetcher()
    apiCache.set(key, data, ttl)
    return data
  }

  return {
    fetchWithCache,
    clearCache: () => apiCache.clear()
  }
}
```

## Production Optimizations

### Build Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true
    })
  ],
  build: {
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log']
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          ui: ['element-plus']
        }
      }
    }
  }
})
```

### Environment-specific Optimizations

```typescript
// config/performance.ts
export const performanceConfig = {
  development: {
    enableDevtools: true,
    enableProfiler: true,
    logPerformance: true
  },
  production: {
    enableDevtools: false,
    enableProfiler: false,
    logPerformance: false,
    enableCompression: true,
    enableCaching: true
  }
}
```

## Performance Monitoring

### Real User Monitoring

```typescript
// utils/performance.ts
export class PerformanceMonitor {
  private static instance: PerformanceMonitor

  static getInstance() {
    if (!this.instance) {
      this.instance = new PerformanceMonitor()
    }
    return this.instance
  }

  measurePageLoad() {
    if (typeof window === 'undefined') return

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

      const metrics = {
        fcp: this.getFCP(),
        lcp: this.getLCP(),
        fid: this.getFID(),
        cls: this.getCLS(),
        ttfb: navigation.responseStart - navigation.requestStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        loadComplete: navigation.loadEventEnd - navigation.navigationStart
      }

      this.sendMetrics(metrics)
    })
  }

  private getFCP(): number {
    const paintEntries = performance.getEntriesByType('paint')
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint')
    return fcpEntry ? fcpEntry.startTime : 0
  }

  private getLCP(): number {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        resolve(lastEntry.startTime)
      })
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
    })
  }

  private getFID(): number {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const firstEntry = entries[0]
        resolve(firstEntry.processingStart - firstEntry.startTime)
      })
      observer.observe({ entryTypes: ['first-input'] })
    })
  }

  private getCLS(): number {
    return new Promise((resolve) => {
      let clsValue = 0
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        resolve(clsValue)
      })
      observer.observe({ entryTypes: ['layout-shift'] })
    })
  }

  private sendMetrics(metrics: any) {
    // Send to analytics service
    fetch('/api/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metrics)
    })
  }
}
```

## Tools & Profiling

### Vue DevTools Profiler

```vue
<template>
  <div>
    <button @click="expensiveOperation">Run Expensive Operation</button>
    <div v-if="result">{{ result }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const result = ref('')

const expensiveOperation = () => {
  // This will be profiled by Vue DevTools
  const start = performance.now()

  // Simulate expensive operation
  let sum = 0
  for (let i = 0; i < 1000000; i++) {
    sum += Math.random()
  }

  const end = performance.now()
  result.value = `Operation completed in ${end - start}ms`
}
</script>
```

### Bundle Analysis

```bash
# Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Analyze bundle
npm run build
# Open dist/stats.html in browser
```

## Best Practices Summary

1. **Use `defineAsyncComponent` for large components**
2. **Implement virtual scrolling for large lists**
3. **Use `shallowRef` for large objects**
4. **Optimize computed properties**
5. **Implement proper cleanup**
6. **Use code splitting for routes**
7. **Optimize images and assets**
8. **Implement caching strategies**
9. **Monitor performance metrics**
10. **Profile with Vue DevTools**

---

**Remember**: Performance optimization is an ongoing process. Regularly profile your application and monitor real user metrics to identify bottlenecks and improvement opportunities.
