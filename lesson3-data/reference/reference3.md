# Vue 3 API Integration & Data Management - Quick Reference

## 🎯 **API Integration Patterns**

### **Basic API Service**
```typescript
// services/api.ts
interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

interface ApiError {
  message: string
  status: number
  code?: string
}

class ApiService {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers
      }
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new ApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status
        )
      }

      const data = await response.json()
      return {
        data,
        message: 'Success',
        success: true
      }
    } catch (error) {
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error',
        0
      )
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  // POST request
  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  // PUT request
  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// Create API instance
export const api = new ApiService('https://api.example.com')
```

### **Data Fetching Composable**
```typescript
// composables/useFetch.ts
import { ref, computed } from 'vue'

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useFetch<T>(url: string | Ref<string>) {
  const state = ref<FetchState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const isSuccess = computed(() => !state.value.loading && !state.value.error)
  const isEmpty = computed(() => !state.value.loading && !state.value.data)

  const execute = async () => {
    state.value.loading = true
    state.value.error = null

    try {
      const response = await fetch(unref(url))
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

  const refetch = () => execute()

  return {
    ...state.value,
    isSuccess,
    isEmpty,
    execute,
    refetch
  }
}

// Usage
<script setup lang="ts">
import { useFetch } from '@/composables/useFetch'

const { data: users, loading, error, refetch } = useFetch<User[]>('/api/users')

onMounted(() => {
  refetch()
})
</script>
```

### **CRUD Operations with Pinia**
```typescript
// stores/users.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

interface User {
  id: number
  name: string
  email: string
  role: string
  createdAt: string
  updatedAt: string
}

interface CreateUserData {
  name: string
  email: string
  role: string
}

interface UpdateUserData extends Partial<CreateUserData> {
  id: number
}

export const useUsersStore = defineStore('users', () => {
  // State
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedUser = ref<User | null>(null)

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
      const response = await api.get<User[]>('/users')
      users.value = response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch users'
    } finally {
      loading.value = false
    }
  }

  const createUser = async (userData: CreateUserData) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post<User>('/users', userData)
      users.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create user'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (userData: UpdateUserData) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.put<User>(`/users/${userData.id}`, userData)
      const index = users.value.findIndex(user => user.id === userData.id)
      if (index !== -1) {
        users.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update user'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      await api.delete(`/users/${id}`)
      users.value = users.value.filter(user => user.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete user'
      throw err
    } finally {
      loading.value = false
    }
  }

  const selectUser = (user: User | null) => {
    selectedUser.value = user
  }

  return {
    // State
    users,
    loading,
    error,
    selectedUser,
    // Getters
    activeUsers,
    userCount,
    getUserById,
    // Actions
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    selectUser
  }
})
```

### **Form with API Integration**
```vue
<template>
  <div class="user-form">
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Name *</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          :class="{ error: errors.name }"
          :disabled="loading"
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
          :disabled="loading"
        />
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>

      <div class="form-group">
        <label for="role">Role</label>
        <select id="role" v-model="form.role" :disabled="loading">
          <option value="">Select role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="guest">Guest</option>
        </select>
      </div>

      <div class="form-actions">
        <button type="button" @click="resetForm" :disabled="loading">
          Reset
        </button>
        <button type="submit" :disabled="!isValid || loading">
          {{ loading ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </form>

    <div v-if="error" class="error-banner">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import { useUsersStore } from '@/stores/users'

interface UserForm {
  name: string
  email: string
  role: string
}

interface Props {
  initialData?: Partial<UserForm>
  userId?: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  success: [user: User]
  error: [message: string]
}>()

const usersStore = useUsersStore()
const { loading, error } = storeToRefs(usersStore)

// Form state
const form = reactive<UserForm>({
  name: '',
  email: '',
  role: '',
  ...props.initialData
})

const errors = reactive<Partial<UserForm>>({})

// Validation
const isValid = computed(() => {
  return form.name.trim() && form.email.trim() && form.role
})

// Methods
const validateForm = () => {
  errors.name = !form.name.trim() ? 'Name is required' : undefined
  errors.email = !form.email.trim() ? 'Email is required' : undefined
  errors.role = !form.role ? 'Role is required' : undefined
}

const resetForm = () => {
  Object.assign(form, {
    name: '',
    email: '',
    role: '',
    ...props.initialData
  })
  Object.keys(errors).forEach(key => {
    delete errors[key as keyof UserForm]
  })
}

const handleSubmit = async () => {
  validateForm()

  if (!isValid.value) return

  try {
    let user: User

    if (props.userId) {
      // Update existing user
      user = await usersStore.updateUser({
        id: props.userId,
        ...form
      })
    } else {
      // Create new user
      user = await usersStore.createUser(form)
    }

    emit('success', user)
    resetForm()
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Operation failed'
    emit('error', message)
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

### **Data Table with API**
```vue
<template>
  <div class="data-table">
    <div class="table-header">
      <h2>Users</h2>
      <button @click="showCreateForm = true" class="btn-primary">
        Add User
      </button>
    </div>

    <div class="table-filters">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search users..."
        class="search-input"
      />
      <select v-model="roleFilter" class="filter-select">
        <option value="">All Roles</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
        <option value="guest">Guest</option>
      </select>
    </div>

    <div v-if="loading" class="loading-state">
      Loading users...
    </div>

    <div v-else-if="error" class="error-state">
      {{ error }}
      <button @click="fetchUsers">Retry</button>
    </div>

    <div v-else class="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span class="role-badge" :class="user.role">
                {{ user.role }}
              </span>
            </td>
            <td>{{ formatDate(user.createdAt) }}</td>
            <td>
              <button @click="editUser(user)" class="btn-sm">Edit</button>
              <button @click="deleteUser(user.id)" class="btn-sm danger">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Modal -->
    <UserForm
      v-if="showCreateForm || editingUser"
      :initial-data="editingUser"
      :user-id="editingUser?.id"
      @success="handleFormSuccess"
      @error="handleFormError"
      @close="closeForm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'
import UserForm from './UserForm.vue'

const usersStore = useUsersStore()
const { users, loading, error } = storeToRefs(usersStore)

// Local state
const searchTerm = ref('')
const roleFilter = ref('')
const showCreateForm = ref(false)
const editingUser = ref<User | null>(null)

// Computed
const filteredUsers = computed(() => {
  let filtered = users.value

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(user =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    )
  }

  if (roleFilter.value) {
    filtered = filtered.filter(user => user.role === roleFilter.value)
  }

  return filtered
})

// Methods
const fetchUsers = () => {
  usersStore.fetchUsers()
}

const editUser = (user: User) => {
  editingUser.value = user
}

const deleteUser = async (id: number) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await usersStore.deleteUser(id)
    } catch (err) {
      console.error('Failed to delete user:', err)
    }
  }
}

const handleFormSuccess = (user: User) => {
  showCreateForm.value = false
  editingUser.value = null
  // Optionally show success message
}

const handleFormError = (message: string) => {
  console.error('Form error:', message)
  // Optionally show error message
}

const closeForm = () => {
  showCreateForm.value = false
  editingUser.value = null
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// Lifecycle
onMounted(() => {
  fetchUsers()
})
</script>
```

### **Error Handling & Loading States**
```vue
<template>
  <div class="api-component">
    <!-- Loading State -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>Something went wrong</h3>
      <p>{{ error }}</p>
      <button @click="retry" class="btn-primary">Try Again</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="isEmpty" class="empty-state">
      <div class="empty-icon">📭</div>
      <h3>No data found</h3>
      <p>There are no items to display.</p>
      <button @click="refresh" class="btn-primary">Refresh</button>
    </div>

    <!-- Success State -->
    <div v-else class="content">
      <slot :data="data" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  data: any
  loading: boolean
  error: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  retry: []
  refresh: []
}>()

const isEmpty = computed(() => {
  if (Array.isArray(props.data)) {
    return props.data.length === 0
  }
  return !props.data
})

const retry = () => {
  emit('retry')
}

const refresh = () => {
  emit('refresh')
}
</script>
```

### **Caching & Optimization**
```typescript
// composables/useCache.ts
import { ref, computed } from 'vue'

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class Cache {
  private cache = new Map<string, CacheEntry<any>>()

  set<T>(key: string, data: T, ttl = 5 * 60 * 1000) { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    const isExpired = Date.now() - entry.timestamp > entry.ttl
    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  clear() {
    this.cache.clear()
  }

  delete(key: string) {
    this.cache.delete(key)
  }
}

const cache = new Cache()

export function useCachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
) {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async () => {
    // Check cache first
    const cached = cache.get<T>(key)
    if (cached) {
      data.value = cached
      return
    }

    loading.value = true
    error.value = null

    try {
      const result = await fetcher()
      data.value = result
      cache.set(key, result, ttl)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  const invalidate = () => {
    cache.delete(key)
  }

  return {
    data,
    loading,
    error,
    execute,
    invalidate
  }
}
```

## 🎯 **Quick Tips**

1. **Use composables** for reusable API logic
2. **Implement proper error handling** with try/catch
3. **Show loading states** during async operations
4. **Use Pinia** for complex state management
5. **Implement caching** for better performance
6. **Validate data** before API calls
7. **Handle empty states** gracefully
8. **Use TypeScript** for API response types
9. **Implement retry logic** for failed requests
10. **Debounce search inputs** to avoid excessive API calls

## 📚 **Next Steps**

- Authentication and authorization
- Real-time data with WebSockets
- File upload handling
- Pagination and infinite scrolling
- Offline support with service workers
