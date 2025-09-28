# Vue State Management Guide

This guide covers Vue 3 state management patterns.

## Built-in Reactive State

Vue 3 provides powerful reactive state management.

```vue
<template>
  <div>
    <h2>Count: {{ count }}</h2>
    <button @click="increment">+</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)
const increment = () => count.value++
</script>
```

## Pinia Store

```typescript
// stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)

  const login = async (credentials) => {
    // Login logic
  }

  return { user, isAuthenticated, login }
})
```

## Best Practices

1. Use Pinia for global state
2. Keep local state in components
3. Use TypeScript for type safety

