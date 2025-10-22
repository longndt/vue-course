# Lab 2: Advanced Vue 3 Components and Composition

## Overview

In this lab, you'll apply component composition patterns and architecture concepts covered in the lesson. Focus on hands-on implementation of reusable component systems using Vue 3's Composition API and modern patterns.

_For learning objectives and prerequisites, see [../README.md](../README.md)_

## Pre-Lab Checklist

- [ ] Lab 1 completed successfully
- [ ] Node.js v18+ and npm installed
- [ ] VS Code with Vue extensions
- [ ] Basic TypeScript understanding
- [ ] Vue 3 Composition API knowledge from previous lessons

## Exercises

### Exercise 1: Component Composition

**💡 Architecture Note:** We'll use TypeScript for better development experience and type safety, consistent with Lab 1.

Create a Card component system using composition:

```vue
<!-- src/components/Card/Card.vue -->
<template>
  <div :class="`card ${props.class}`">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  class: ''
})
</script>

<style scoped>
.card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}
</style>
```

Create Card subcomponents:

```vue
<!-- CardHeader.vue -->
<template>
  <div class="card-header">
    <slot />
  </div>
</template>

<style scoped>
.card-header {
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.card-header h2 {
  margin: 0;
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 700;
}
</style>

<!-- CardBody.vue -->
<template>
  <div class="card-body">
    <slot />
  </div>
</template>

<style scoped>
.card-body {
  margin-bottom: 1rem;
}

.card-body p {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #059669;
}
</style>

<!-- CardFooter.vue -->
<template>
  <div class="card-footer">
    <slot />
  </div>
</template>

<style scoped>
.card-footer {
  display: flex;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}
</style>
```

Usage example:

```vue
<template>
  <Card class="product-card">
    <CardHeader>
      <h2>Product Title</h2>
    </CardHeader>
    <CardBody>
      <p>Product description goes here...</p>
      <span class="price">$99.99</span>
    </CardBody>
    <CardFooter>
      <Button text="Add to Cart" />
    </CardFooter>
  </Card>
</template>
```

### Exercise 2: Composables (Vue's equivalent to Hooks)

1. Create a useLoading composable:

```typescript
// src/composables/useLoading.ts
import { ref } from 'vue'

export function useLoading(initialValue = false) {
  const isLoading = ref(initialValue)

  const setLoading = (value: boolean) => {
    isLoading.value = value
  }

  const withLoading = async <T>(asyncFn: () => Promise<T>): Promise<T> => {
    setLoading(true)
    try {
      const result = await asyncFn()
      return result
    } finally {
      setLoading(false)
    }
  }

  return {
    isLoading,
    setLoading,
    withLoading
  }
}
```

2. Create a LoadingSpinner component:

```vue
<!-- src/components/LoadingSpinner/LoadingSpinner.vue -->
<template>
  <div class="spinner">
    <div class="spinner-inner"></div>
  </div>
</template>

<style scoped>
.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.spinner-inner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
```

3. Apply the composable:

```vue
<!-- src/components/ProductList/ProductList.vue -->
<template>
  <div>
    <div v-if="isLoading" class="loading-container">
      <LoadingSpinner />
    </div>
    <div v-else class="product-list">
      <div v-for="product in products" :key="product.id" class="product-item">
        {{ product.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLoading } from '@/composables/useLoading'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner.vue'

interface Product {
  id: number
  name: string
}

const { isLoading, withLoading } = useLoading()
const products = ref<Product[]>([])

const fetchProducts = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  products.value = [
    { id: 1, name: "Product 1" },
    { id: 2, name: "Product 2" },
  ]
}

onMounted(() => {
  withLoading(fetchProducts)
})
</script>
```

### Exercise 3: Custom Composables

1. Create a useForm composable:

```typescript
// src/composables/useForm.ts
import { ref, reactive } from 'vue'

interface FormErrors {
  [key: string]: string
}

export function useForm<T extends Record<string, any>>(initialValues: T) {
  const values = reactive({ ...initialValues })
  const errors = ref<FormErrors>({})

  const handleChange = (field: keyof T, value: any) => {
    values[field] = value
    // Clear error when user starts typing
    if (errors.value[field as string]) {
      delete errors.value[field as string]
    }
  }

  const validate = () => {
    const newErrors: FormErrors = {}
    Object.entries(values).forEach(([key, value]) => {
      if (!value) {
        newErrors[key] = `${key} is required`
      }
    })
    errors.value = newErrors
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (callback: (values: T) => void) => (e: Event) => {
    e.preventDefault()
    if (validate()) {
      callback(values)
    }
  }

  const reset = () => {
    Object.assign(values, initialValues)
    errors.value = {}
  }

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    validate,
    reset
  }
}
```

2. Create a Form component using the composable:

```vue
<!-- src/components/Form/RegistrationForm.vue -->
<template>
  <form @submit="handleSubmit(onSubmit)" class="registration-form">
    <div class="form-group">
      <input
        type="text"
        :value="values.username"
        @input="handleChange('username', ($event.target as HTMLInputElement).value)"
        placeholder="Username"
        class="form-input"
        :class="{ error: errors.username }"
      />
      <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
    </div>

    <div class="form-group">
      <input
        type="email"
        :value="values.email"
        @input="handleChange('email', ($event.target as HTMLInputElement).value)"
        placeholder="Email"
        class="form-input"
        :class="{ error: errors.email }"
      />
      <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
    </div>

    <div class="form-group">
      <input
        type="password"
        :value="values.password"
        @input="handleChange('password', ($event.target as HTMLInputElement).value)"
        placeholder="Password"
        class="form-input"
        :class="{ error: errors.password }"
      />
      <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
    </div>

    <button type="submit" class="submit-btn">Register</button>
  </form>
</template>

<script setup lang="ts">
import { useForm } from '@/composables/useForm'

const { values, errors, handleChange, handleSubmit, reset } = useForm({
  username: '',
  email: '',
  password: ''
})

const onSubmit = (formData: typeof values) => {
  console.log('Form submitted:', formData)
  // Reset form after successful submission
  reset()
}
</script>

<style scoped>
.registration-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}
</style>
```

### Exercise 4: Provide/Inject Pattern (Vue's Context API)

1. Create a Theme composable:

```typescript
// src/composables/useTheme.ts
import { ref, provide, inject } from 'vue'

const THEME_KEY = Symbol('theme')

interface ThemeContext {
  theme: Ref<string>
  toggleTheme: () => void
}

export function provideTheme() {
  const theme = ref('light')

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  provide(THEME_KEY, {
    theme,
    toggleTheme
  })

  return { theme, toggleTheme }
}

export function useTheme() {
  const context = inject<ThemeContext>(THEME_KEY)
  if (!context) {
    throw new Error('useTheme must be used within a component that provides theme')
  }
  return context
}
```

2. Implement theme-aware components:

```vue
<!-- src/components/ThemedButton/ThemedButton.vue -->
<template>
  <button :class="`button ${theme}`">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { theme } = useTheme()
</script>

<style scoped>
.button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.button.light {
  background: #3b82f6;
  color: white;
}

.button.dark {
  background: #1e293b;
  color: #f8fafc;
  border: 1px solid #334155;
}
</style>

<!-- src/App.vue -->
<template>
  <div :class="`app ${theme}`">
    <ThemeToggle />
    <ThemedButton>Click me</ThemedButton>
  </div>
</template>

<script setup lang="ts">
import { provideTheme } from '@/composables/useTheme'
import ThemeToggle from '@/components/ThemeToggle.vue'
import ThemedButton from '@/components/ThemedButton/ThemedButton.vue'

const { theme } = provideTheme()
</script>
```

## Bonus Tasks

### 1. Implement Error Boundaries

Create an ErrorBoundary component to handle component errors gracefully:

```vue
<!-- src/components/ErrorBoundary/ErrorBoundary.vue -->
<template>
  <div v-if="hasError" class="error-boundary">
    <h2>Something went wrong</h2>
    <p>{{ error?.message }}</p>
    <button @click="retry" class="retry-btn">Try Again</button>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const error = ref<Error | null>(null)

onErrorCaptured((err, instance, info) => {
  console.error('Error caught by boundary:', err, info)
  hasError.value = true
  error.value = err
  return false // Prevent the error from propagating further
})

const retry = () => {
  hasError.value = false
  error.value = null
}
</script>

<style scoped>
.error-boundary {
  text-align: center;
  padding: 2rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #dc2626;
}

.retry-btn {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  margin-top: 1rem;
}
</style>
```

### 2. Create a Teleport Modal

Implement a modal component using Vue 3's Teleport:

```vue
<!-- src/components/Modal/Modal.vue -->
<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click="onClose">
      <div class="modal" @click.stop>
        <button class="modal-close" @click="onClose">
          ×
        </button>
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { Teleport } from 'vue'

interface Props {
  isOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const onClose = () => {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
}
</style>
```

## Modern CSS Styling Guidelines

### Enhanced Visual Design

This lab features modern CSS with the following improvements:

1. **Gradient Backgrounds**: Beautiful gradient backgrounds for headers and cards
2. **Glass Morphism Effects**: Semi-transparent backgrounds with backdrop filters
3. **Enhanced Shadows**: Multi-layered shadows for depth and dimension
4. **Smooth Animations**: Cubic-bezier transitions for professional feel
5. **Improved Typography**: Better font sizing and spacing for readability

### Key CSS Features

```css
/* Modern gradient header */
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* Glass morphism cards */
.card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

/* Demo sections with backdrop blur */
.demo-section {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

### Responsive Design

The layout is optimized for desktop computers with:
- Larger max-width (1400px)
- Enhanced spacing and padding
- Improved grid layouts
- Better hover effects
- Professional color schemes

## Final Project Structure 📁

After completing all exercises in Lab 2, your project should have the following structure:

```
advanced-components/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Card/
│   │   │   ├── Card.vue
│   │   │   ├── CardHeader.vue
│   │   │   ├── CardBody.vue
│   │   │   └── CardFooter.vue
│   │   ├── ErrorBoundary/
│   │   │   └── ErrorBoundary.vue
│   │   ├── Form/
│   │   │   └── RegistrationForm.vue
│   │   ├── Modal/
│   │   │   └── Modal.vue
│   │   ├── ThemedComponents/
│   │   │   ├── ThemedButton.vue
│   │   │   └── ThemeToggle.vue
│   │   └── ProductList/
│   │       └── ProductList.vue
│   ├── composables/
│   │   ├── useForm.ts
│   │   ├── useLoading.ts
│   │   ├── useTheme.ts
│   │   └── useLocalStorage.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.vue
│   ├── style.css
│   └── main.ts
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── readme.md
```

### Key Features Implemented:

#### **Component Composition Patterns:**
- ✅ **Card System**: Compound components (Card.Header, Card.Body, Card.Footer)
- ✅ **Modal Teleport**: Using Vue 3 Teleport for overlay rendering
- ✅ **Flexible Layout**: Composable components with slots

#### **Advanced State Management:**
- ✅ **Provide/Inject**: Theme management with provide/inject pattern
- ✅ **Custom Composables**: Reusable logic for forms, loading, and themes
- ✅ **Reactive State**: Vue 3's reactive system for state management

#### **Professional Patterns:**
- ✅ **Error Boundaries**: Graceful error handling and recovery
- ✅ **Type Safety**: Comprehensive TypeScript interfaces
- ✅ **Modern CSS**: Glass morphism effects, gradients, and animations

#### **Interactive Features:**
- ✅ **Theme Switching**: Light/dark mode with provide/inject
- ✅ **Form Validation**: Custom useForm composable with error handling
- ✅ **Modal Management**: Teleport-based modals with backdrop click handling
- ✅ **Loading States**: Composable pattern for async operations

### Expected Functionality:
1. **Component Showcase**: Interactive demos of all component patterns
2. **Theme System**: Seamless light/dark mode switching
3. **Form Handling**: Registration form with validation and error states
4. **Modal Interactions**: Product details modal with smooth animations
5. **Error Recovery**: Error boundaries with retry functionality
6. **Professional UI**: Modern design with glass morphism and smooth transitions

## Submission Requirements

1. GitHub repository containing:

   - Complete source code
   - readme.md with setup instructions
   - Component documentation
   - Screenshots/GIFs of components in action

2. Your implementation should demonstrate:
   - Proper component composition
   - Effective use of composables
   - Provide/Inject implementation
   - Error handling
   - Responsive design

## Grading Criteria

- Component Architecture (25%)
- Composable Implementation (25%)
- Provide/Inject Usage (20%)
- Code Quality (20%)
- Documentation (10%)

## Additional Resources

- [Vue 3 Composition API](https://vuejs.org/guide/composition-api-introduction.html)
- [Vue 3 Composables](https://vuejs.org/guide/reusability/composables.html)
- [Provide/Inject](https://vuejs.org/guide/components/provide-inject.html)
- [Error Handling](https://vuejs.org/guide/essentials/error-handling.html)