# Vue Testing Strategies Guide 🧪

## Overview

This comprehensive guide covers testing strategies for Vue 3 applications, from unit testing to end-to-end testing, ensuring code quality and reliability.

## Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Testing Setup](#testing-setup)
3. [Unit Testing](#unit-testing)
4. [Component Testing](#component-testing)
5. [Integration Testing](#integration-testing)
6. [End-to-End Testing](#end-to-end-testing)
7. [Testing Custom Composables](#testing-custom-composables)
8. [Testing Pinia Stores](#testing-pinia-stores)
9. [Mock Strategies](#mock-strategies)
10. [Test Coverage](#test-coverage)
11. [CI/CD Testing](#cicd-testing)
12. [Performance Testing](#performance-testing)

## Testing Philosophy

### Testing Pyramid

```
    /\
   /  \
  / E2E \     <- Few, expensive, slow
 /______\
/        \
/Integration\ <- Some, moderate cost
/__________\
/          \
/   Unit    \ <- Many, cheap, fast
/____________\
```

### What to Test

**Unit Tests (70%)**
- Individual functions and methods
- Component logic
- Utility functions
- Composables

**Integration Tests (20%)**
- Component interactions
- API integrations
- Store interactions
- Route changes

**E2E Tests (10%)**
- Critical user journeys
- Complete workflows
- Cross-browser compatibility

## Testing Setup

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})
```

### Test Setup File

```typescript
// tests/setup.ts
import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Global test utilities
global.fetch = vi.fn()

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Configure Vue Test Utils
config.global.plugins = []
config.global.mocks = {
  $t: (key: string) => key // Mock i18n
}
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  },
  "devDependencies": {
    "@vue/test-utils": "^2.4.0",
    "vitest": "^1.0.0",
    "jsdom": "^23.0.0",
    "@vitest/ui": "^1.0.0",
    "playwright": "^1.40.0",
    "@playwright/test": "^1.40.0"
  }
}
```

## Unit Testing

### Testing Utility Functions

```typescript
// utils/formatDate.ts
export function formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return format
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day)
}

// utils/formatDate.test.ts
import { describe, it, expect } from 'vitest'
import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('should format date with default format', () => {
    const date = new Date('2024-01-15')
    expect(formatDate(date)).toBe('2024-01-15')
  })

  it('should format date with custom format', () => {
    const date = new Date('2024-01-15')
    expect(formatDate(date, 'DD/MM/YYYY')).toBe('15/01/2024')
  })

  it('should handle edge cases', () => {
    const date = new Date('2024-12-31')
    expect(formatDate(date)).toBe('2024-12-31')
  })
})
```

### Testing Composables

```vue
<!-- composables/useCounter.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'

export function useCounter(initialValue: number = 0) {
  const count = ref(initialValue)

  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue

  const isEven = computed(() => count.value % 2 === 0)
  const isPositive = computed(() => count.value > 0)

  return {
    count,
    increment,
    decrement,
    reset,
    isEven,
    isPositive
  }
}
</script>
```

```typescript
// composables/useCounter.test.ts
import { describe, it, expect } from 'vitest'
import { useCounter } from './useCounter'

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { count } = useCounter()
    expect(count.value).toBe(0)
  })

  it('should initialize with custom value', () => {
    const { count } = useCounter(10)
    expect(count.value).toBe(10)
  })

  it('should increment count', () => {
    const { count, increment } = useCounter()
    increment()
    expect(count.value).toBe(1)
  })

  it('should decrement count', () => {
    const { count, decrement } = useCounter(5)
    decrement()
    expect(count.value).toBe(4)
  })

  it('should reset count', () => {
    const { count, increment, reset } = useCounter(0)
    increment()
    increment()
    reset()
    expect(count.value).toBe(0)
  })

  it('should compute isEven correctly', () => {
    const { count, increment, isEven } = useCounter(1)
    expect(isEven.value).toBe(false)

    increment()
    expect(isEven.value).toBe(true)
  })

  it('should compute isPositive correctly', () => {
    const { count, increment, isPositive } = useCounter(0)
    expect(isPositive.value).toBe(false)

    increment()
    expect(isPositive.value).toBe(true)
  })
})
```

## Component Testing

### Basic Component Testing

```vue
<!-- components/Button.vue -->
<template>
  <button
    :class="buttonClass"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  disabled: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClass = computed(() => [
  'btn',
  `btn-${props.variant}`,
  `btn-${props.size}`
])

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
.btn {
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-small {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.btn-medium {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.btn-large {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
```

```typescript
// components/Button.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from './Button.vue'

describe('Button', () => {
  it('should render with default props', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me'
      }
    })

    expect(wrapper.text()).toBe('Click me')
    expect(wrapper.classes()).toContain('btn-primary')
    expect(wrapper.classes()).toContain('btn-medium')
  })

  it('should render with custom props', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'danger',
        size: 'large',
        disabled: true
      },
      slots: {
        default: 'Delete'
      }
    })

    expect(wrapper.classes()).toContain('btn-danger')
    expect(wrapper.classes()).toContain('btn-large')
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('should emit click event when clicked', async () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me'
      }
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('should not emit click event when disabled', async () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true
      },
      slots: {
        default: 'Click me'
      }
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })
})
```

### Testing Component with Props and Events

```vue
<!-- components/UserCard.vue -->
<template>
  <div class="user-card">
    <img :src="user.avatar" :alt="user.name" class="avatar" />
    <div class="user-info">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
      <p v-if="user.bio">{{ user.bio }}</p>
    </div>
    <div class="actions">
      <button @click="editUser">Edit</button>
      <button @click="deleteUser" class="danger">Delete</button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface User {
  id: number
  name: string
  email: string
  avatar: string
  bio?: string
}

interface Props {
  user: User
}

const props = defineProps<Props>()

const emit = defineEmits<{
  edit: [user: User]
  delete: [user: User]
}>()

const editUser = () => {
  emit('edit', props.user)
}

const deleteUser = () => {
  emit('delete', props.user)
}
</script>
```

```typescript
// components/UserCard.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UserCard from './UserCard.vue'

describe('UserCard', () => {
  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg',
    bio: 'Software Developer'
  }

  it('should render user information', () => {
    const wrapper = mount(UserCard, {
      props: {
        user: mockUser
      }
    })

    expect(wrapper.find('h3').text()).toBe('John Doe')
    expect(wrapper.find('p').text()).toBe('john@example.com')
    expect(wrapper.find('img').attributes('src')).toBe('https://example.com/avatar.jpg')
  })

  it('should render bio when provided', () => {
    const wrapper = mount(UserCard, {
      props: {
        user: mockUser
      }
    })

    const bioElement = wrapper.find('p:last-of-type')
    expect(bioElement.text()).toBe('Software Developer')
  })

  it('should emit edit event when edit button is clicked', async () => {
    const wrapper = mount(UserCard, {
      props: {
        user: mockUser
      }
    })

    await wrapper.find('button:first-child').trigger('click')

    expect(wrapper.emitted('edit')).toBeTruthy()
    expect(wrapper.emitted('edit')?.[0]).toEqual([mockUser])
  })

  it('should emit delete event when delete button is clicked', async () => {
    const wrapper = mount(UserCard, {
      props: {
        user: mockUser
      }
    })

    await wrapper.find('button.danger').trigger('click')

    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')?.[0]).toEqual([mockUser])
  })
})
```

## Integration Testing

### Testing Component Interactions

```vue
<!-- components/TodoList.vue -->
<template>
  <div class="todo-list">
    <h2>Todo List</h2>

    <form @submit.prevent="addTodo">
      <input
        v-model="newTodo"
        placeholder="Add a new todo"
        required
      />
      <button type="submit">Add</button>
    </form>

    <ul>
      <li v-for="todo in todos" :key="todo.id" class="todo-item">
        <input
          type="checkbox"
          :checked="todo.completed"
          @change="toggleTodo(todo.id)"
        />
        <span :class="{ completed: todo.completed }">
          {{ todo.text }}
        </span>
        <button @click="deleteTodo(todo.id)" class="delete-btn">
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Todo {
  id: number
  text: string
  completed: boolean
}

const todos = ref<Todo[]>([])
const newTodo = ref('')

let nextId = 1

const addTodo = () => {
  if (newTodo.value.trim()) {
    todos.value.push({
      id: nextId++,
      text: newTodo.value.trim(),
      completed: false
    })
    newTodo.value = ''
  }
}

const toggleTodo = (id: number) => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
  }
}

const deleteTodo = (id: number) => {
  todos.value = todos.value.filter(t => t.id !== id)
}
</script>
```

```typescript
// components/TodoList.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoList from './TodoList.vue'

describe('TodoList Integration', () => {
  it('should add a new todo', async () => {
    const wrapper = mount(TodoList)

    const input = wrapper.find('input[type="text"]')
    const form = wrapper.find('form')

    await input.setValue('Learn Vue testing')
    await form.trigger('submit')

    expect(wrapper.findAll('li')).toHaveLength(1)
    expect(wrapper.find('li span').text()).toBe('Learn Vue testing')
  })

  it('should toggle todo completion', async () => {
    const wrapper = mount(TodoList)

    // Add a todo
    await wrapper.find('input[type="text"]').setValue('Test todo')
    await wrapper.find('form').trigger('submit')

    // Toggle completion
    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.setChecked(true)

    expect(wrapper.find('span').classes()).toContain('completed')
  })

  it('should delete a todo', async () => {
    const wrapper = mount(TodoList)

    // Add a todo
    await wrapper.find('input[type="text"]').setValue('Test todo')
    await wrapper.find('form').trigger('submit')

    // Delete the todo
    await wrapper.find('button.delete-btn').trigger('click')

    expect(wrapper.findAll('li')).toHaveLength(0)
  })

  it('should not add empty todos', async () => {
    const wrapper = mount(TodoList)

    await wrapper.find('form').trigger('submit')

    expect(wrapper.findAll('li')).toHaveLength(0)
  })
})
```

## End-to-End Testing

### Playwright Setup

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### E2E Test Examples

```typescript
// tests/e2e/user-journey.spec.ts
import { test, expect } from '@playwright/test'

test.describe('User Journey', () => {
  test('should complete user registration and login', async ({ page }) => {
    // Navigate to registration page
    await page.goto('/register')

    // Fill registration form
    await page.fill('[data-testid="name"]', 'John Doe')
    await page.fill('[data-testid="email"]', 'john@example.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.fill('[data-testid="confirm-password"]', 'password123')

    // Submit form
    await page.click('[data-testid="register-button"]')

    // Should redirect to login page
    await expect(page).toHaveURL('/login')

    // Login with credentials
    await page.fill('[data-testid="email"]', 'john@example.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-button"]')

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('[data-testid="welcome-message"]')).toContainText('Welcome, John Doe')
  })

  test('should create and manage todos', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'john@example.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-button"]')

    // Navigate to todos
    await page.goto('/todos')

    // Add a todo
    await page.fill('[data-testid="todo-input"]', 'Learn Vue testing')
    await page.click('[data-testid="add-todo-button"]')

    // Verify todo was added
    await expect(page.locator('[data-testid="todo-item"]')).toContainText('Learn Vue testing')

    // Mark todo as complete
    await page.click('[data-testid="todo-checkbox"]')
    await expect(page.locator('[data-testid="todo-item"]')).toHaveClass(/completed/)

    // Delete todo
    await page.click('[data-testid="delete-todo-button"]')
    await expect(page.locator('[data-testid="todo-item"]')).toHaveCount(0)
  })
})
```

## Testing Custom Composables

### Testing API Composables

```typescript
// composables/useApi.ts
import { ref, computed } from 'vue'

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApi<T>(url: string) {
  const state = ref<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const fetchData = async () => {
    state.value.loading = true
    state.value.error = null

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      state.value.data = await response.json()
    } catch (error) {
      state.value.error = error instanceof Error ? error.message : 'Unknown error'
    } finally {
      state.value.loading = false
    }
  }

  const isSuccess = computed(() => !state.value.loading && !state.value.error && state.value.data !== null)
  const isError = computed(() => !state.value.loading && state.value.error !== null)

  return {
    ...state.value,
    fetchData,
    isSuccess,
    isError
  }
}
```

```typescript
// composables/useApi.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useApi } from './useApi'

// Mock fetch
global.fetch = vi.fn()

describe('useApi', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should initialize with default state', () => {
    const { data, loading, error } = useApi('/api/test')

    expect(data.value).toBeNull()
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('should fetch data successfully', async () => {
    const mockData = { id: 1, name: 'Test' }
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData)
    })

    const { data, loading, error, fetchData, isSuccess } = useApi('/api/test')

    await fetchData()

    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(data.value).toEqual(mockData)
    expect(isSuccess.value).toBe(true)
  })

  it('should handle fetch errors', async () => {
    ;(fetch as any).mockRejectedValueOnce(new Error('Network error'))

    const { data, loading, error, fetchData, isError } = useApi('/api/test')

    await fetchData()

    expect(loading.value).toBe(false)
    expect(error.value).toBe('Network error')
    expect(data.value).toBeNull()
    expect(isError.value).toBe(true)
  })

  it('should handle HTTP errors', async () => {
    ;(fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    })

    const { data, loading, error, fetchData, isError } = useApi('/api/test')

    await fetchData()

    expect(loading.value).toBe(false)
    expect(error.value).toBe('HTTP 404: Not Found')
    expect(data.value).toBeNull()
    expect(isError.value).toBe(true)
  })
})
```

## Testing Pinia Stores

### Store Testing

```typescript
// stores/userStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value)

  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      user.value = data.user
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    error.value = null
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout
  }
})
```

```typescript
// stores/userStore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from './userStore'

// Mock fetch
global.fetch = vi.fn()

describe('UserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.resetAllMocks()
  })

  it('should initialize with default state', () => {
    const store = useUserStore()

    expect(store.user).toBeNull()
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('should login successfully', async () => {
    const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' }
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ user: mockUser })
    })

    const store = useUserStore()

    await store.login('john@example.com', 'password123')

    expect(store.user).toEqual(mockUser)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.isAuthenticated).toBe(true)
  })

  it('should handle login errors', async () => {
    ;(fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401
    })

    const store = useUserStore()

    await store.login('john@example.com', 'wrongpassword')

    expect(store.user).toBeNull()
    expect(store.loading).toBe(false)
    expect(store.error).toBe('Login failed')
    expect(store.isAuthenticated).toBe(false)
  })

  it('should logout successfully', () => {
    const store = useUserStore()
    store.user = { id: 1, name: 'John Doe' }

    store.logout()

    expect(store.user).toBeNull()
    expect(store.error).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })
})
```

## Mock Strategies

### API Mocking

```typescript
// tests/mocks/api.ts
import { vi } from 'vitest'

export const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn()
}

export const setupApiMocks = () => {
  global.fetch = vi.fn()

  mockApi.get.mockImplementation((url: string) => {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data: 'mock data' })
    })
  })

  mockApi.post.mockImplementation((url: string, data: any) => {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true })
    })
  })
}
```

### Component Mocking

```typescript
// tests/mocks/components.ts
import { vi } from 'vitest'

export const mockComponents = {
  RouterLink: vi.fn(),
  RouterView: vi.fn(),
  Teleport: vi.fn()
}

export const setupComponentMocks = () => {
  return {
    global: {
      components: mockComponents
    }
  }
}
```

## Test Coverage

### Coverage Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
})
```

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
open coverage/index.html
```

## CI/CD Testing

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run unit tests
      run: npm run test:run

    - name: Run E2E tests
      run: npm run test:e2e

    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
```

## Performance Testing

### Component Performance Testing

```typescript
// tests/performance/component-performance.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { performance } from 'perf_hooks'
import HeavyComponent from '../components/HeavyComponent.vue'

describe('Component Performance', () => {
  it('should render within acceptable time', async () => {
    const start = performance.now()

    const wrapper = mount(HeavyComponent, {
      props: {
        items: Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `Item ${i}` }))
      }
    })

    const end = performance.now()
    const renderTime = end - start

    expect(renderTime).toBeLessThan(100) // Should render in less than 100ms
  })

  it('should handle large datasets efficiently', async () => {
    const largeDataset = Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Item ${i}` }))

    const start = performance.now()

    const wrapper = mount(HeavyComponent, {
      props: { items: largeDataset }
    })

    const end = performance.now()
    const renderTime = end - start

    expect(renderTime).toBeLessThan(500) // Should handle 10k items in less than 500ms
  })
})
```

## Best Practices Summary

1. **Write tests first (TDD)**
2. **Test behavior, not implementation**
3. **Use descriptive test names**
4. **Keep tests simple and focused**
5. **Mock external dependencies**
6. **Test edge cases and error conditions**
7. **Maintain good test coverage**
8. **Use appropriate testing levels**
9. **Automate testing in CI/CD**
10. **Regularly review and update tests**

---

**Remember**: Good tests are an investment in your codebase's future. They catch bugs early, enable confident refactoring, and serve as living documentation of your application's behavior.
