# Lab 5: Vue 3 Performance Optimization & Advanced Patterns

## Overview

In this focused lab exercise, you'll implement advanced Vue 3 performance optimization techniques and patterns. This demonstrates essential optimization strategies used in modern Vue applications with Composition API.

_For detailed learning objectives and performance concepts, see [../readme.md](../readme.md)_

## Exercises

- Code Splitting & Lazy Loading
- Component Memoization
- Virtual Lists & Performance Monitoring

## Exercises

### Exercise 1: Code Splitting

1. Implement Vue 3 dynamic imports for route components:

```vue
<!-- src/App.vue -->
<template>
  <Suspense>
    <template #default>
      <router-view />
    </template>
    <template #fallback>
      <LoadingSpinner />
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import LoadingSpinner from './components/LoadingSpinner.vue'

// Router configuration with lazy loading
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const Home = defineAsyncComponent(() => import('../pages/Home.vue'))
const About = defineAsyncComponent(() => import('../pages/About.vue'))
const Dashboard = defineAsyncComponent(() => import('../pages/Dashboard.vue'))

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/dashboard', component: Dashboard }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
</script>
```

2. Create a LoadingSpinner component:

```vue
<!-- src/components/LoadingSpinner.vue -->
<template>
  <div class="loading-spinner">
    <div class="spinner"></div>
  </div>
</template>

<style scoped>
.loading-spinner {
  display: flex;

// src/components/LoadingSpinner/LoadingSpinner.css
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

3. Create an ErrorBoundary for lazy-loaded components:

```vue
<!-- src/components/ErrorBoundary.vue -->
<template>
  <div v-if="hasError" class="error-boundary">
    <h1>Something went wrong.</h1>
    <button @click="retry">Retry</button>
  </div>
  <slot v-else />
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)

// Vue 3 error boundary using onErrorCaptured
onErrorCaptured((error, errorInfo) => {
  console.error("Error:", error)
  console.error("Error Info:", errorInfo)
  hasError.value = true
  return false // Prevent error from propagating
})

const retry = () => {
  hasError.value = false
  window.location.reload()
}
}

// Update main.js to include router
function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>{/* ... routes ... */}</Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
```

### Exercise 2: Component Memoization

1. Create a memoized list component:

```vue
<!-- src/components/MemoizedList.vue -->
<template>
  <div class="memoized-list">
    <ListItem
      v-for="item in sortedItems"
      :key="item.id"
      :item="item"
      @select="handleSelect"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ListItem from './ListItem.vue'

interface Props {
  items: Array<{ id: number; title: string; description: string }>
}

const props = defineProps<Props>()

const selectedId = ref(null)

// Vue's computed properties are automatically memoized
const sortedItems = computed(() => {
  console.log("Sorting items...")
  return [...props.items].sort((a, b) => a.title.localeCompare(b.title))
})

const handleSelect = (item) => {
  selectedId.value = item.id
}
</script>
```

```vue
<!-- src/components/ListItem.vue -->
<template>
  <div class="list-item" @click="$emit('select', item)">
    <h3>{{ item.title }}</h3>
    <p>{{ item.description }}</p>
  </div>
</template>

<script setup>
interface Props {
  item: { id: number; title: string; description: string }
}

defineProps<Props>()
defineEmits<{ select: [item: Props['item']] }>()

// Vue components are automatically optimized - no need for memo
// Use onUpdated for debugging renders if needed
import { onUpdated } from 'vue'

const props = defineProps<Props>()

onUpdated(() => {
  console.log(`Rendering ListItem: ${props.item.id}`)
})
</script>
```

2. Implement a performance-optimized form:

```vue
<!-- src/components/OptimizedForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="optimized-form">
    <FormInput
      v-for="field in fields"
      :key="field.name"
      :label="field.label"
      :name="field.name"
      :value="formData[field.name]"
      @update="handleInputChange"
    />
    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Submitting...' : 'Submit' }}
    </button>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import FormInput from './FormInput.vue'

const isSubmitting = ref(false)
const formData = reactive({
  name: '',
  email: '',
  message: ''
})

const fields = [
  { name: 'name', label: 'Name' },
  { name: 'email', label: 'Email' },
  { name: 'message', label: 'Message' }
]

const handleInputChange = (name: string, value: string) => {
  formData[name] = value
}

const handleSubmit = async () => {
  isSubmitting.value = true
  // Submit logic here
  console.log('Submitting:', formData)
  isSubmitting.value = false
}
</script>
```

```vue
<!-- src/components/FormInput.vue -->
<template>
  <div class="form-group">
    <label>{{ label }}</label>
    <input
      :value="value"
      @input="$emit('update', name, ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script setup>
interface Props {
  label: string
  name: string
  value: string
}

defineProps<Props>()
defineEmits<{ update: [name: string, value: string] }>()
</script>
      <Input
        label="Email"
        value={formData.email}
        onChange={handleEmailChange}
      />
      <Input
        label="Message"
        value={formData.message}
        onChange={handleMessageChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default memo(OptimizedForm);
```

### Exercise 3: Virtual List Implementation

Create a virtualized list component:

```vue
<!-- src/components/VirtualList.vue -->
<template>
  <div
    ref="containerRef"
    @scroll="handleScroll"
    :style="{
      height: windowHeight + 'px',
      overflow: 'auto',
    }"
  >
    <div :style="{ height: totalHeight + 'px' }">
      <div
        :style="{
          transform: `translateY(${startIndex * itemHeight}px)`,
        }"
      >
        <component
          v-for="(item, index) in visibleData"
          :key="startIndex + index"
          :is="renderItem"
          :item="item"
          :index="startIndex + index"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

interface Props {
  items: any[]
  itemHeight: number
  windowHeight: number
  renderItem: any // Component to render each item
}

const props = defineProps<Props>()

const scrollTop = ref(0)
const containerRef = ref()

const totalHeight = computed(() => props.items.length * props.itemHeight)
const startIndex = computed(() => Math.floor(scrollTop.value / props.itemHeight))
const visibleItems = computed(() => Math.ceil(props.windowHeight / props.itemHeight))
const endIndex = computed(() => Math.min(startIndex.value + visibleItems.value + 1, props.items.length))
const visibleData = computed(() => props.items.slice(startIndex.value, endIndex.value))

const handleScroll = () => {
  scrollTop.value = containerRef.value.scrollTop
}
</script>
  );
}

// Usage example:
function VirtualizedList() {
  const items = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    title: `Item ${i}`,
    description: `Description for item ${i}`,
  }));

  return (
    <VirtualList
      items={items}
      itemHeight={50}
      windowHeight={400}
      renderItem={(item, index) => (
        <div
          key={item.id}
          style={{
            height: 50,
            padding: 10,
            borderBottom: "1px solid #eee",
          }}
        >
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      )}
    />
  );
}
```

### Exercise 4: Performance Monitoring

1. Create a performance monitoring component:

```vue
<!-- src/components/PerformanceMonitor.vue -->
<template>
  <div :data-performance-id="id">
    <slot />
  </div>
</template>

<script setup>
import { onMounted, onUpdated, onUnmounted } from 'vue'

interface Props {
  id: string
}

const props = defineProps<Props>()

let startTime: number

onMounted(() => {
  startTime = performance.now()
  console.log(`Performance Monitor [${props.id}]: Component mounted`)
})

onUpdated(() => {
  const endTime = performance.now()
  const duration = endTime - startTime

  console.log({
    id: props.id,
    phase: 'update',
    actualDuration: duration,
    startTime,
    endTime,
  })

  startTime = performance.now()
})

onUnmounted(() => {
  console.log(`Performance Monitor [${props.id}]: Component unmounted`)
})
</script>
```

```vue
<!-- Usage in App.vue -->
<template>
  <PerformanceMonitor id="app">
    <div class="app">
      <!-- App content -->
    </div>
  </PerformanceMonitor>
</template>

<script setup>
import PerformanceMonitor from './components/PerformanceMonitor.vue'
</script>
```

2. Implement a custom performance hook:

```typescript
// src/composables/usePerformance.ts
import { onMounted, onUnmounted } from 'vue'

export function usePerformance(label: string) {
  let startTime: number

  onMounted(() => {
    startTime = performance.now()
  })

  onUnmounted(() => {
    const endTime = performance.now()
    const duration = endTime - startTime
    console.log(`${label} took ${duration}ms`)
  })
}
```

```vue
<!-- Usage -->
<!-- ExpensiveComponent.vue -->
<template>
  <div>
    <!-- Component content -->
  </div>
</template>

<script setup>
import { usePerformance } from '@/composables/usePerformance'

usePerformance("ExpensiveComponent")

// Component logic here
</script>
```

## Bonus Tasks

### 1. Implement Intersection Observer

Create a component that lazy loads images:

```vue
<!-- src/components/LazyImage.vue -->
<template>
  <div ref="imgRef" class="lazy-image">
    <img v-if="isVisible" :src="src" :alt="alt" />
    <div v-else class="placeholder">Loading...</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  src: string
  alt: string
}

const props = defineProps<Props>()

const isVisible = ref(false)
const imgRef = ref()
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true
        observer?.disconnect()
      }
    },
    { threshold: 0.1 }
  )

  if (imgRef.value) {
    observer.observe(imgRef.value)
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
  }, []);

  return (
    <div ref={imgRef}>
      {isVisible ? (
        <img src={src} alt={alt} />
      ) : (
        <div class="image-placeholder" />
      )}
    </div>
  );
}
```

### 2. Add Web Worker

Implement a web worker for heavy computations:

```javascript
// src/workers/compute.worker.js
self.addEventListener("message", (e) => {
  const { data } = e;

  // Heavy computation
  const result = heavyComputation(data);

  self.postMessage(result);
});

function heavyComputation(data) {
  // Simulate heavy computation
  let result = 0;
  for (let i = 0; i < data.iterations; i++) {
    result += Math.sqrt(i) * data.multiplier;
  }
  return result;
}
```

```typescript
// src/composables/useWebWorker.ts
import { ref, onUnmounted, readonly } from 'vue'

export function useWebWorker(workerPath: string) {
  const result = ref(null)
  const error = ref(null)
  const isLoading = ref(false)
  let worker: Worker | null = null

  const initWorker = () => {
    worker = new Worker(workerPath)

    worker.onmessage = (e) => {
      result.value = e.data
      isLoading.value = false
    }

    worker.onerror = (e) => {
      error.value = e.error
      isLoading.value = false
    }
  }

  const sendMessage = (data: any) => {
    if (!worker) {
      initWorker()
    }

    isLoading.value = true
    error.value = null
    worker?.postMessage(data)
  }

  onUnmounted(() => {
    worker?.terminate()
  })

  return {
    result: readonly(result),
    error: readonly(error),
    isLoading: readonly(isLoading),
    sendMessage,
  }
  }, [workerPath]);

  const compute = (data) => {
    workerRef.value.postMessage(data);
  };

  return { result, error, compute };
}
```

## Submission Requirements

1. GitHub repository containing:

   - Complete application code
   - Performance optimization documentation
   - Benchmark results
   - Profile traces

2. Your implementation should demonstrate:
   - Code splitting
   - Memoization
   - Virtual list
   - Performance monitoring
   - Error handling

## Grading Criteria

- Code Splitting Implementation (20%)
- Memoization Usage (20%)
- Virtual List Performance (20%)
- Performance Monitoring (20%)
- Code Quality (20%)

## Advanced CSS & Performance Design

### High-Performance UI Design

This lab showcases performance-optimized CSS design:

1. **GPU-Accelerated Animations**: Using transform and opacity for smooth animations
2. **Glass Morphism Cards**: Semi-transparent designs with backdrop filters
3. **Optimized Gradients**: Efficient gradient implementations
4. **Enhanced Navigation**: Professional navbar with blur effects
5. **Smooth Interactions**: 60fps animations and transitions

### Performance-Focused CSS

```css
/* GPU-accelerated card hover */
.card:hover {
  transform: translateY(-4px); /* Uses GPU */
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}

/* Efficient glass morphism */
nav {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
  backdrop-filter: blur(12px); /* Hardware accelerated */
}

/* Optimized transitions */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Performance-friendly gradients */
body {
  background: linear-gradient(135deg, #f9fafb 0%, #e2e8f0 100%);
}
```

### Performance Considerations

- Hardware acceleration for animations
- Efficient CSS selectors
- Minimal reflows and repaints
- Optimized backdrop filters
- Smooth 60fps interactions

### Visual Enhancements

- Professional color schemes
- Enhanced typography (16px base font)
- Improved spacing and layout
- Modern glass morphism effects
- Desktop-optimized design

## Additional Resources

- [Vue Performance](https://vuejs.org/guide/best-practices/performance.html)
- [Code Splitting Guide](https://vuejs.org/guide/best-practices/performance.html#lazy-loading-routes)
- [Vue Devtools](https://devtools.vuejs.org/)
- [Web Workers Guide](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)

## Final Project Structure

After completing all exercises in this lab, your performance-optimized project structure should look like:

```
lab5-performance-optimization/
├── index.html
├── package.json
├── readme.md
├── vite.config.js
├── src/
│   ├── App.vue                    # Main app with lazy loading
│   ├── index.css                 # Optimized global styles
│   ├── main.js                   # App entry point
│   ├── components/
│   │   ├── LoadingSpinner/
│   │   │   ├── LoadingSpinner.vue  # Loading component
│   │   │   └── LoadingSpinner.css  # Spinner styles
│   │   ├── VirtualList/
│   │   │   ├── VirtualList.vue     # Virtualized list component
│   │   │   └── VirtualList.css     # List optimization styles
│   │   ├── UserList/
│   │   │   ├── UserList.vue        # Memoized user list
│   │   │   ├── UserItem.vue        # Individual user item
│   │   │   └── UserList.css        # User list styles
│   │   └── PerformanceMonitor/
│   │       ├── PerformanceMonitor.vue  # Performance profiling
│   │       └── PerformanceMonitor.css  # Monitor styles
│   ├── hooks/
│   │   ├── useDebounce.js         # Debounce optimization hook
│   │   ├── useVirtualList.js      # Virtual list logic
│   │   ├── usePerformance.js      # Performance monitoring
│   │   └── useWorker.js           # Web worker integration
│   └── pages/
│       ├── Home.vue               # Lazy-loaded home page
│       ├── About.vue              # Lazy-loaded about page
│       ├── Dashboard.vue          # Performance dashboard
│       └── UserManagement.vue     # Large data management
```

### Key Optimizations Implemented

1. **Code Splitting & Lazy Loading**
   - defineAsyncComponent() for route-based splitting
   - Vue 3 Suspense boundaries with loading states
   - Dynamic imports for components
   - Bundle size optimization

2. **Memoization Techniques**
   - shallowRef for component memoization
   - computed for expensive calculations
   - markRaw for event handler optimization
   - Shallow comparison strategies

3. **Virtual Lists & Large Data**
   - Virtualized scrolling for large datasets
   - Efficient rendering of thousands of items
   - Memory usage optimization
   - Smooth scrolling performance

4. **Performance Monitoring**
   - Vue DevTools Profiler integration
   - Custom performance composables
   - Bundle analysis tools
   - Runtime performance tracking

5. **Advanced Patterns**
   - Web Workers for heavy computations
   - Debounced search inputs
   - Efficient state updates
   - Component lifecycle optimization

This structure demonstrates production-ready Vue performance optimization techniques essential for scalable applications handling large datasets and complex user interactions.
