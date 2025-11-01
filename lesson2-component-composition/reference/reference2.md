# Vue 3 Component Architecture & Vue Composition API - Quick Reference

## 🎯 **Advanced Component Patterns**

### **Composition API with TypeScript**
```vue
<template>
  <div class="user-card">
    <h3>{{ user.name }}</h3>
    <p>{{ user.email }}</p>
    <button @click="toggleEdit">{{ isEditing ? 'Cancel' : 'Edit' }}</button>

    <form v-if="isEditing" @submit.prevent="saveUser">
      <input v-model="editForm.name" />
      <input v-model="editForm.email" type="email" />
      <button type="submit">Save</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface User {
  id: number
  name: string
  email: string
  role: string
}

interface Props {
  user: User
  editable?: boolean
}

interface Emits {
  update: [user: User]
  delete: [id: number]
}

const props = withDefaults(defineProps<Props>(), {
  editable: true
})

const emit = defineEmits<Emits>()

// Reactive state
const isEditing = ref(false)
const editForm = ref({
  name: '',
  email: ''
})

// Computed properties
const displayName = computed(() =>
  props.user.name.toUpperCase()
)

const canEdit = computed(() =>
  props.editable && props.user.role !== 'admin'
)

// Watchers
watch(() => props.user, (newUser) => {
  editForm.value = {
    name: newUser.name,
    email: newUser.email
  }
}, { immediate: true })

// Methods
const toggleEdit = () => {
  isEditing.value = !isEditing.value
}

const saveUser = () => {
  const updatedUser = {
    ...props.user,
    ...editForm.value
  }
  emit('update', updatedUser)
  isEditing.value = false
}

const deleteUser = () => {
  if (confirm('Are you sure?')) {
    emit('delete', props.user.id)
  }
}
</script>
```

### **Custom Composables**
```typescript
// composables/useCounter.ts
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  const double = computed(() => count.value * 2)
  const isEven = computed(() => count.value % 2 === 0)

  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue

  return {
    count,
    double,
    isEven,
    increment,
    decrement,
    reset
  }
}

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

  const isSuccess = computed(() => !state.value.loading && !state.value.error)
  const isEmpty = computed(() => !state.value.loading && !state.value.data)

  const fetch = async () => {
    state.value.loading = true
    state.value.error = null

    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch')
      state.value.data = await response.json()
    } catch (error) {
      state.value.error = error instanceof Error ? error.message : 'Unknown error'
    } finally {
      state.value.loading = false
    }
  }

  const refetch = () => fetch()

  return {
    ...state.value,
    isSuccess,
    isEmpty,
    fetch,
    refetch
  }
}

// Usage in component
<script setup lang="ts">
import { useCounter } from '@/composables/useCounter'
import { useApi } from '@/composables/useApi'

const { count, increment, decrement } = useCounter(10)
const { data: users, loading, error, fetch } = useApi<User[]>('/api/users')

onMounted(() => {
  fetch()
})
</script>
```

### **State Management with Pinia**
```typescript
// stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: number
  name: string
  email: string
  role: string
}

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const activeUsers = computed(() =>
    users.value.filter(user => user.role !== 'inactive')
  )

  const userCount = computed(() => users.value.length)

  const getUserById = computed(() => (id: number) =>
    users.value.find(user => user.id === id)
  )

  // Actions
  const fetchUsers = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('/api/users')
      users.value = await response.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch users'
    } finally {
      loading.value = false
    }
  }

  const addUser = async (userData: Omit<User, 'id'>) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      const newUser = await response.json()
      users.value.push(newUser)
    } catch (err) {
      error.value = 'Failed to add user'
    }
  }

  const updateUser = async (id: number, updates: Partial<User>) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      const updatedUser = await response.json()
      const index = users.value.findIndex(user => user.id === id)
      if (index !== -1) {
        users.value[index] = updatedUser
      }
    } catch (err) {
      error.value = 'Failed to update user'
    }
  }

  const deleteUser = async (id: number) => {
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE' })
      users.value = users.value.filter(user => user.id !== id)
    } catch (err) {
      error.value = 'Failed to delete user'
    }
  }

  const setCurrentUser = (user: User | null) => {
    currentUser.value = user
  }

  return {
    // State
    users,
    currentUser,
    loading,
    error,
    // Getters
    activeUsers,
    userCount,
    getUserById,
    // Actions
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    setCurrentUser
  }
})
```

### **Advanced Form Handling**
```vue
<template>
  <form @submit.prevent="handleSubmit" class="user-form">
    <div class="form-group">
      <label for="name">Name *</label>
      <input
        id="name"
        v-model="form.name"
        type="text"
        :class="{ error: errors.name }"
        @blur="validateField('name')"
      />
      <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
    </div>

    <div class="form-group">
      <label for="email">Email *</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        :class="{ error: errors.email }"
        @blur="validateField('email')"
      />
      <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
    </div>

    <div class="form-group">
      <label for="role">Role</label>
      <select id="role" v-model="form.role">
        <option value="">Select role</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
        <option value="guest">Guest</option>
      </select>
    </div>

    <div class="form-actions">
      <button type="button" @click="resetForm">Reset</button>
      <button type="submit" :disabled="!isValid || isSubmitting">
        {{ isSubmitting ? 'Saving...' : 'Save' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'

interface UserForm {
  name: string
  email: string
  role: string
}

interface FormErrors {
  name?: string
  email?: string
}

const props = defineProps<{
  initialData?: Partial<UserForm>
  onSubmit: (data: UserForm) => Promise<void>
}>()

const emit = defineEmits<{
  success: []
  error: [message: string]
}>()

// Form state
const form = reactive<UserForm>({
  name: '',
  email: '',
  role: '',
  ...props.initialData
})

const errors = reactive<FormErrors>({})
const isSubmitting = ref(false)

// Validation rules
const validationRules = {
  name: (value: string) => {
    if (!value.trim()) return 'Name is required'
    if (value.length < 2) return 'Name must be at least 2 characters'
    return null
  },
  email: (value: string) => {
    if (!value.trim()) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return 'Invalid email format'
    return null
  }
}

// Computed properties
const isValid = computed(() => {
  return Object.keys(validationRules).every(field => {
    const value = form[field as keyof UserForm] as string
    return !validationRules[field as keyof typeof validationRules](value)
  })
})

// Methods
const validateField = (field: keyof UserForm) => {
  const value = form[field] as string
  const rule = validationRules[field as keyof typeof validationRules]
  if (rule) {
    errors[field as keyof FormErrors] = rule(value) || undefined
  }
}

const validateForm = () => {
  Object.keys(validationRules).forEach(field => {
    validateField(field as keyof UserForm)
  })
}

const resetForm = () => {
  Object.assign(form, {
    name: '',
    email: '',
    role: '',
    ...props.initialData
  })
  Object.keys(errors).forEach(key => {
    delete errors[key as keyof FormErrors]
  })
}

const handleSubmit = async () => {
  validateForm()

  if (!isValid.value) return

  isSubmitting.value = true

  try {
    await props.onSubmit(form)
    emit('success')
    resetForm()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Submission failed'
    emit('error', message)
  } finally {
    isSubmitting.value = false
  }
}

// Watch for initial data changes
watch(() => props.initialData, (newData) => {
  if (newData) {
    Object.assign(form, newData)
  }
}, { deep: true })
</script>
```

### **Component Composition Patterns**
```vue
<!-- BaseCard.vue - Base component -->
<template>
  <div :class="['card', variant, { clickable }]" @click="handleClick">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>

    <div class="card-body">
      <slot />
    </div>

    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  clickable: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>

<!-- UserCard.vue - Specialized component -->
<template>
  <BaseCard
    :variant="user.isActive ? 'success' : 'default'"
    :clickable="true"
    @click="handleCardClick"
  >
    <template #header>
      <h3>{{ user.name }}</h3>
      <span class="status" :class="user.isActive ? 'active' : 'inactive'">
        {{ user.isActive ? 'Active' : 'Inactive' }}
      </span>
    </template>

    <div class="user-info">
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Role:</strong> {{ user.role }}</p>
      <p><strong>Last Login:</strong> {{ formatDate(user.lastLogin) }}</p>
    </div>

    <template #footer>
      <div class="card-actions">
        <button @click.stop="editUser">Edit</button>
        <button @click.stop="deleteUser" class="danger">Delete</button>
      </div>
    </template>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from './BaseCard.vue'

interface User {
  id: number
  name: string
  email: string
  role: string
  isActive: boolean
  lastLogin: string
}

interface Props {
  user: User
}

interface Emits {
  edit: [user: User]
  delete: [id: number]
  click: [user: User]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleCardClick = () => {
  emit('click', props.user)
}

const editUser = () => {
  emit('edit', props.user)
}

const deleteUser = () => {
  if (confirm('Are you sure you want to delete this user?')) {
    emit('delete', props.user.id)
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}
</script>
```

### **Advanced Reactive Patterns**
```typescript
// Deep reactive objects
const state = reactive({
  user: {
    profile: {
      name: 'John',
      settings: {
        theme: 'dark',
        notifications: true
      }
    },
    preferences: {
      language: 'en',
      timezone: 'UTC'
    }
  },
  ui: {
    loading: false,
    sidebarOpen: true
  }
})

// Shallow reactive for performance
const shallowState = shallowReactive({
  largeArray: new Array(10000).fill(0).map((_, i) => ({ id: i, value: Math.random() }))
})

// Readonly reactive
const readonlyState = readonly(reactive({
  config: {
    apiUrl: 'https://api.example.com',
    version: '1.0.0'
  }
}))

// Computed with dependencies
const userDisplayName = computed(() => {
  const user = state.user.profile
  return `${user.name} (${user.settings.theme})`
})

// Watch with deep option
watch(
  () => state.user.profile.settings,
  (newSettings, oldSettings) => {
    console.log('Settings changed:', newSettings)
  },
  { deep: true }
)

// Watch multiple sources
watch(
  [() => state.user.profile.name, () => state.user.preferences.language],
  ([name, language]) => {
    console.log(`User ${name} language: ${language}`)
  }
)
```

### **Error Handling Patterns**
```vue
<template>
  <div class="error-boundary">
    <div v-if="hasError" class="error-state">
      <h3>Something went wrong</h3>
      <p>{{ errorMessage }}</p>
      <button @click="retry">Try Again</button>
    </div>

    <div v-else>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const errorMessage = ref('')

onErrorCaptured((error) => {
  hasError.value = true
  errorMessage.value = error.message
  console.error('Error captured:', error)
  return false // Prevent error from propagating
})

const retry = () => {
  hasError.value = false
  errorMessage.value = ''
}
</script>
```

## 🎯 **Quick Tips**

1. **Use composables** for reusable logic
2. **Prefer `reactive()`** for objects, `ref()` for primitives
3. **Use `computed()`** for derived state
4. **Implement proper error handling** with try/catch
5. **Use TypeScript interfaces** for type safety
6. **Compose components** using slots and props
7. **Implement validation** for forms
8. **Use Pinia** for complex state management
9. **Handle loading states** in async operations
10. **Use `onErrorCaptured`** for error boundaries

## 📚 **Next Steps**

- API integration patterns
- Routing and navigation
- Authentication flows
- Testing strategies
- Performance optimization
