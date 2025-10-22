# Vue 3 Component Lifecycle 🔄

## Component Lifecycle Hooks Overview

This diagram shows the complete lifecycle of a Vue 3 component from creation to destruction.

```mermaid
graph TD
    A[Component Creation] --> B[setup() function]
    B --> C[beforeCreate]
    C --> D[created]
    D --> E[beforeMount]
    E --> F[mounted]

    F --> G[Component Active]
    G --> H[Data Changes]
    H --> I[beforeUpdate]
    I --> J[updated]
    J --> G

    G --> K[Component Destruction]
    K --> L[beforeUnmount]
    L --> M[unmounted]

    subgraph "Composition API Hooks"
        N[onBeforeMount]
        O[onMounted]
        P[onBeforeUpdate]
        Q[onUpdated]
        R[onBeforeUnmount]
        S[onUnmounted]
    end

    B --> N
    N --> O
    O --> P
    P --> Q
    Q --> R
    R --> S

    style A fill:#e3f2fd
    style F fill:#e8f5e8
    style G fill:#fff3e0
    style M fill:#ffebee
```

## Detailed Lifecycle Phases

### 1. Creation Phase

```mermaid
sequenceDiagram
    participant App as Application
    participant Comp as Component
    participant DOM as DOM

    App->>Comp: new Component()
    Comp->>Comp: setup() function runs
    Comp->>Comp: onBeforeCreate()
    Comp->>Comp: Initialize data & methods
    Comp->>Comp: onCreated()
    Comp->>DOM: Template compilation
    Comp->>Comp: onBeforeMount()
    Comp->>DOM: Mount to DOM
    Comp->>Comp: onMounted()
    Comp->>App: Component ready
```

### 2. Update Phase

```mermaid
sequenceDiagram
    participant User as User Interaction
    participant Comp as Component
    participant DOM as DOM

    User->>Comp: Data changes
    Comp->>Comp: onBeforeUpdate()
    Comp->>DOM: Re-render template
    Comp->>Comp: onUpdated()
    Comp->>User: UI updated
```

### 3. Destruction Phase

```mermaid
sequenceDiagram
    participant App as Application
    participant Comp as Component
    participant DOM as DOM

    App->>Comp: Remove component
    Comp->>Comp: onBeforeUnmount()
    Comp->>DOM: Remove from DOM
    Comp->>Comp: onUnmounted()
    Comp->>App: Component destroyed
```

## Composition API Lifecycle Hooks

### Hook Usage Patterns

```mermaid
graph LR
    subgraph "Creation Hooks"
        A[onBeforeMount<br/>Before DOM mounting]
        B[onMounted<br/>After DOM mounting]
    end

    subgraph "Update Hooks"
        C[onBeforeUpdate<br/>Before re-rendering]
        D[onUpdated<br/>After re-rendering]
    end

    subgraph "Destruction Hooks"
        E[onBeforeUnmount<br/>Before component removal]
        F[onUnmounted<br/>After component removal]
    end

    subgraph "Error Handling"
        G[onErrorCaptured<br/>Catch child errors]
    end

    A --> B
    C --> D
    E --> F

    style A fill:#e3f2fd
    style B fill:#e8f5e8
    style C fill:#fff3e0
    style D fill:#f3e5f5
    style E fill:#ffebee
    style F fill:#fce4ec
    style G fill:#f1f8e9
```

## Lifecycle Hook Examples

### Basic Component with Lifecycle

```vue
<script setup lang="ts">
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted
} from 'vue'

// Creation phase
onBeforeMount(() => {
  console.log('Component is about to be mounted')
})

onMounted(() => {
  console.log('Component is mounted to DOM')
  // Perfect for:
  // - API calls
  // - DOM manipulation
  // - Event listeners
  // - Timers
})

// Update phase
onBeforeUpdate(() => {
  console.log('Component is about to update')
})

onUpdated(() => {
  console.log('Component has been updated')
  // Perfect for:
  // - DOM operations after updates
  // - Logging changes
})

// Destruction phase
onBeforeUnmount(() => {
  console.log('Component is about to be unmounted')
  // Perfect for:
  // - Cleanup timers
  // - Remove event listeners
  // - Cancel API requests
})

onUnmounted(() => {
  console.log('Component has been unmounted')
})
</script>
```

## Common Use Cases by Lifecycle Phase

### Mounting Phase Use Cases

```mermaid
graph TD
    subgraph "onBeforeMount"
        A[Initialize non-reactive data]
        B[Set up initial state]
        C[Prepare for DOM mounting]
    end

    subgraph "onMounted"
        D[API calls]
        E[DOM manipulation]
        F[Event listeners]
        G[Timers/Intervals]
        H[Third-party library initialization]
    end

    A --> D
    B --> E
    C --> F

    style A fill:#e3f2fd
    style D fill:#e8f5e8
```

### Update Phase Use Cases

```mermaid
graph TD
    subgraph "onBeforeUpdate"
        A[Save current state]
        B[Prepare for changes]
        C[Validate before update]
    end

    subgraph "onUpdated"
        D[DOM operations after update]
        E[Logging changes]
        F[Scroll to position]
        G[Focus management]
    end

    A --> D
    B --> E
    C --> F

    style A fill:#fff3e0
    style D fill:#f3e5f5
```

### Unmounting Phase Use Cases

```mermaid
graph TD
    subgraph "onBeforeUnmount"
        A[Save important data]
        B[Prepare for cleanup]
        C[Cancel pending operations]
    end

    subgraph "onUnmounted"
        D[Remove event listeners]
        E[Clear timers]
        F[Cancel API requests]
        G[Clean up third-party libraries]
    end

    A --> D
    B --> E
    C --> F

    style A fill:#ffebee
    style D fill:#fce4ec
```

## Lifecycle Best Practices

### Do's and Don'ts

```mermaid
graph LR
    subgraph "✅ Do"
        A[Use onMounted for API calls]
        B[Clean up in onBeforeUnmount]
        C[Use onUpdated sparingly]
        D[Handle errors with onErrorCaptured]
    end

    subgraph "❌ Don't"
        E[Modify reactive data in onMounted]
        F[Forget to clean up resources]
        G[Use onUpdated for side effects]
        H[Ignore error handling]
    end

    style A fill:#e8f5e8
    style B fill:#e8f5e8
    style C fill:#e8f5e8
    style D fill:#e8f5e8
    style E fill:#ffebee
    style F fill:#ffebee
    style G fill:#ffebee
    style H fill:#ffebee
```

## Lifecycle vs React Hooks Comparison

### Vue 3 vs React Lifecycle

```mermaid
graph TB
    subgraph "Vue 3 Lifecycle"
        A[onMounted]
        B[onUpdated]
        C[onUnmounted]
    end

    subgraph "React Hooks"
        D[useEffect with empty deps]
        E[useEffect with deps]
        F[useEffect cleanup]
    end

    subgraph "Equivalent Patterns"
        G[onMounted ≈ useEffect(() => {}, [])]
        H[onUpdated ≈ useEffect(() => {}, [deps])]
        I[onUnmounted ≈ useEffect cleanup]
    end

    A --> G
    B --> H
    C --> I

    style A fill:#e3f2fd
    style D fill:#f3e5f5
    style G fill:#e8f5e8
```

## Advanced Lifecycle Patterns

### Conditional Lifecycle Hooks

```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

// Conditional mounting based on props
const props = defineProps<{
  enableTracking: boolean
}>()

let intervalId: number | null = null

onMounted(() => {
  if (props.enableTracking) {
    // Start tracking only if enabled
    intervalId = setInterval(() => {
      console.log('Tracking...')
    }, 1000)
  }
})

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>
```

### Lifecycle with Async Operations

```vue
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const data = ref(null)
const loading = ref(false)
let abortController: AbortController | null = null

onMounted(async () => {
  loading.value = true
  abortController = new AbortController()

  try {
    const response = await fetch('/api/data', {
      signal: abortController.signal
    })
    data.value = await response.json()
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Failed to fetch data:', error)
    }
  } finally {
    loading.value = false
  }
})

onBeforeUnmount(() => {
  // Cancel ongoing requests
  if (abortController) {
    abortController.abort()
  }
})
</script>
```

## Lifecycle Debugging

### Debugging Lifecycle Issues

```mermaid
graph TD
    A[Lifecycle Issue] --> B{Identify Phase}
    B --> C[Mounting Issues]
    B --> D[Update Issues]
    B --> E[Unmounting Issues]

    C --> F[Check onMounted logic]
    C --> G[Verify DOM readiness]
    C --> H[Check async operations]

    D --> I[Check onUpdated logic]
    D --> J[Verify update triggers]
    D --> K[Check infinite loops]

    E --> L[Check cleanup logic]
    E --> M[Verify resource cleanup]
    E --> N[Check memory leaks]

    style A fill:#ffebee
    style F fill:#e8f5e8
    style I fill:#fff3e0
    style L fill:#f3e5f5
```

---

**Next Steps**: Learn about [Reactivity System](./reactivity-system.md) to understand how Vue 3's reactive data system works under the hood.
