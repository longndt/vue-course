# Lab 2 Solution - Advanced Vue 3 Components

## Complete Solution Structure

```
advanced-components/
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
│   │   └── LoadingSpinner/
│   │       └── LoadingSpinner.vue
│   ├── composables/
│   │   ├── useForm.js
│   │   ├── useLoading.js
│   │   └── useTheme.js
│   └── App.vue
└── package.json
```

---

## Complete Code Solutions

### src/components/Card/Card.vue

```vue
<template>
  <div :class="`card ${props.className || ''}`">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  className: {
    type: String,
    default: ''
  }
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

### src/components/Card/CardHeader.vue

```vue
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
```

### src/components/Card/CardBody.vue

```vue
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
```

### src/components/Card/CardFooter.vue

```vue
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

### src/composables/useLoading.js

```javascript
import { ref } from 'vue'

export function useLoading(initialValue = false) {
  const isLoading = ref(initialValue)

  const setLoading = (value) => {
    isLoading.value = value
  }

  const withLoading = async (asyncFn) => {
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

### src/composables/useForm.js

```javascript
import { ref, reactive } from 'vue'

export function useForm(initialValues) {
  const values = reactive({ ...initialValues })
  const errors = ref({})

  const handleChange = (field, value) => {
    values[field] = value
    // Clear error when user starts typing
    if (errors.value[field]) {
      delete errors.value[field]
    }
  }

  const validate = () => {
    const newErrors = {}
    Object.entries(values).forEach(([key, value]) => {
      if (!value) {
        newErrors[key] = `${key} is required`
      }
    })
    errors.value = newErrors
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (callback) => (e) => {
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

### src/composables/useTheme.js

```javascript
import { ref, provide, inject } from 'vue'

const THEME_KEY = Symbol('theme')

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
  const context = inject(THEME_KEY)
  if (!context) {
    throw new Error('useTheme must be used within a component that provides theme')
  }
  return context
}
```

### src/components/LoadingSpinner/LoadingSpinner.vue

```vue
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

### src/components/Form/RegistrationForm.vue

```vue
<template>
  <form @submit="handleSubmit(onSubmit)" class="registration-form">
    <div class="form-group">
      <input
        type="text"
        :value="values.username"
        @input="handleChange('username', $event.target.value)"
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
        @input="handleChange('email', $event.target.value)"
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
        @input="handleChange('password', $event.target.value)"
        placeholder="Password"
        class="form-input"
        :class="{ error: errors.password }"
      />
      <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
    </div>

    <button type="submit" class="submit-btn">Register</button>
  </form>
</template>

<script setup>
import { useForm } from '@/composables/useForm'

const { values, errors, handleChange, handleSubmit, reset } = useForm({
  username: '',
  email: '',
  password: ''
})

const onSubmit = (formData) => {
  console.log('Form submitted:', formData)
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
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}
</style>
```

### src/components/Modal/Modal.vue

```vue
<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click="onClose">
      <div class="modal" @click.stop>
        <button class="modal-close" @click="onClose">×</button>
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])

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
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
```

### src/components/ErrorBoundary/ErrorBoundary.vue

```vue
<template>
  <div v-if="hasError" class="error-boundary">
    <h2>Something went wrong</h2>
    <p>{{ error?.message }}</p>
    <button @click="retry" class="retry-btn">Try Again</button>
  </div>
  <slot v-else />
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const error = ref(null)

onErrorCaptured((err, instance, info) => {
  console.error('Error caught by boundary:', err, info)
  hasError.value = true
  error.value = err
  return false
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

### src/App.vue (Example Usage)

```vue
<template>
  <div :class="`app ${theme}`">
    <ErrorBoundary>
      <Card className="product-card">
        <CardHeader>
          <h2>Product Title</h2>
        </CardHeader>
        <CardBody>
          <p>Product description goes here...</p>
          <span class="price">$99.99</span>
        </CardBody>
        <CardFooter>
          <button>Add to Cart</button>
        </CardFooter>
      </Card>

      <RegistrationForm />

      <button @click="isModalOpen = true">Open Modal</button>
      <Modal :is-open="isModalOpen" @close="isModalOpen = false">
        <h2>Modal Content</h2>
        <p>This is modal content</p>
      </Modal>
    </ErrorBoundary>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { provideTheme } from '@/composables/useTheme'
import Card from './components/Card/Card.vue'
import CardHeader from './components/Card/CardHeader.vue'
import CardBody from './components/Card/CardBody.vue'
import CardFooter from './components/Card/CardFooter.vue'
import RegistrationForm from './components/Form/RegistrationForm.vue'
import Modal from './components/Modal/Modal.vue'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.vue'

const { theme } = provideTheme()
const isModalOpen = ref(false)
</script>
```

---

## Key Learning Points

1. **Component Composition**: Card system demonstrates slot-based composition
2. **Composables Pattern**: Reusable logic extraction (useForm, useLoading, useTheme)
3. **Provide/Inject**: Theme management across component tree
4. **Error Handling**: Error boundaries for graceful error recovery
5. **Teleport**: Modal rendering outside component tree

---
