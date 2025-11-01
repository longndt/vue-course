# Vue 3 Routing & Authentication - Quick Reference

## 🎯 **Vue Router Setup**

### **Router Configuration**
```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/Admin.vue'),
    meta: { requiresAuth: true, requiresRole: 'admin' }
  },
  {
    path: '/users/:id',
    name: 'UserDetail',
    component: () => import('@/views/UserDetail.vue'),
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  // Check if route is guest only
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
    return
  }

  // Check role requirements
  if (to.meta.requiresRole && !authStore.hasRole(to.meta.requiresRole)) {
    next({ name: 'Dashboard' })
    return
  }

  next()
})

export default router
```

### **Navigation in Components**
```vue
<template>
  <nav class="navigation">
    <router-link to="/" class="nav-link">Home</router-link>
    <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
    <router-link to="/profile" class="nav-link">Profile</router-link>

    <!-- Dynamic routes -->
    <router-link
      :to="{ name: 'UserDetail', params: { id: userId } }"
      class="nav-link"
    >
      User {{ userId }}
    </router-link>

    <!-- Query parameters -->
    <router-link
      :to="{ name: 'Search', query: { q: searchTerm } }"
      class="nav-link"
    >
      Search
    </router-link>

    <!-- Programmatic navigation -->
    <button @click="goToProfile">Go to Profile</button>
    <button @click="goBack">Go Back</button>
  </nav>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, watch } from 'vue'

const router = useRouter()
const route = useRoute()

// Access route data
const userId = computed(() => route.params.id)
const searchTerm = ref('')

// Programmatic navigation
const goToProfile = () => {
  router.push({ name: 'Profile' })
}

const goBack = () => {
  router.go(-1)
}

// Watch route changes
watch(() => route.params.id, (newId) => {
  console.log('User ID changed:', newId)
})

// Access query parameters
const queryParams = computed(() => route.query)
</script>
```

## 🔐 **Authentication System**

### **Auth Store with Pinia**
```javascript
// stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role || '')
  const isAdmin = computed(() => user.value?.role === 'admin')

  // Actions
  const login = async (credentials) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/auth/login', credentials)

      user.value = response.data.user
      token.value = response.data.token

      // Store token in localStorage
      localStorage.setItem('token', response.data.token)

      // Set default authorization header
      api.setAuthToken(response.data.token)

      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (data) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/auth/register', data)

      user.value = response.data.user
      token.value = response.data.token

      localStorage.setItem('token', response.data.token)
      api.setAuthToken(response.data.token)

      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    api.clearAuthToken()
  }

  const fetchUser = async () => {
    if (!token.value) return

    try {
      const response = await api.get('/auth/me')
      user.value = response.data
    } catch (err) {
      // Token might be invalid
      logout()
    }
  }

  const hasRole = (role) => {
    return user.value?.role === role
  }

  const hasAnyRole = (roles) => {
    return roles.includes(user.value?.role || '')
  }

  // Initialize auth state
  const init = async () => {
    if (token.value) {
      api.setAuthToken(token.value)
      await fetchUser()
    }
  }

  return {
    // State
    user,
    token,
    loading,
    error,
    // Getters
    isAuthenticated,
    userRole,
    isAdmin,
    // Actions
    login,
    register,
    logout,
    fetchUser,
    hasRole,
    hasAnyRole,
    init
  }
})
```

### **Login Component**
```vue
<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin" class="login-form">
      <h2>Login</h2>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          :class="{ error: errors.email }"
          :disabled="loading"
        />
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          :class="{ error: errors.password }"
          :disabled="loading"
        />
        <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
      </div>

      <div class="form-group">
        <label class="checkbox-label">
          <input v-model="form.remember" type="checkbox" />
          Remember me
        </label>
      </div>

      <button type="submit" :disabled="loading || !isValid" class="btn-primary">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>

      <div v-if="error" class="error-banner">
        {{ error }}
      </div>
    </form>

    <div class="login-footer">
      <p>Don't have an account? <router-link to="/register">Sign up</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const { loading, error } = storeToRefs(authStore)

// Form state
const form = reactive({
  email: '',
  password: '',
  remember: false
})

const errors = reactive({
  email: '',
  password: ''
})

// Validation
const isValid = computed(() => {
  return form.email.trim() && form.password.trim()
})

// Methods
const validateForm = () => {
  errors.email = !form.email.trim() ? 'Email is required' : ''
  errors.password = !form.password.trim() ? 'Password is required' : ''
}

const handleLogin = async () => {
  validateForm()

  if (!isValid.value) return

  try {
    await authStore.login({
      email: form.email,
      password: form.password
    })

    // Redirect to intended page or dashboard
    const redirect = route.query.redirect || '/dashboard'
    router.push(redirect)
  } catch (err) {
    // Error is handled by the store
  }
}
</script>
```

### **Protected Route Component**
```vue
<template>
  <div v-if="loading" class="loading-container">
    <div class="spinner"></div>
    <p>Loading...</p>
  </div>

  <div v-else-if="!isAuthenticated" class="unauthorized">
    <h2>Access Denied</h2>
    <p>You need to be logged in to access this page.</p>
    <router-link to="/login" class="btn-primary">Login</router-link>
  </div>

  <div v-else-if="!hasRequiredRole" class="forbidden">
    <h2>Forbidden</h2>
    <p>You don't have permission to access this page.</p>
    <router-link to="/dashboard" class="btn-primary">Go to Dashboard</router-link>
  </div>

  <div v-else>
    <slot />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const props = defineProps({
  requiredRole: {
    type: String,
    default: null
  },
  requiredRoles: {
    type: Array,
    default: null
  }
})

const authStore = useAuthStore()
const { user, loading, isAuthenticated } = storeToRefs(authStore)

const hasRequiredRole = computed(() => {
  if (!props.requiredRole && !props.requiredRoles) return true

  if (props.requiredRole) {
    return authStore.hasRole(props.requiredRole)
  }

  if (props.requiredRoles) {
    return authStore.hasAnyRole(props.requiredRoles)
  }

  return true
})

onMounted(() => {
  if (!isAuthenticated.value) {
    authStore.fetchUser()
  }
})
</script>
```

## 🔄 **Advanced Patterns**

### **Route-based Code Splitting**
```javascript
// Lazy load components
const Home = () => import('@/views/Home.vue')
const Dashboard = () => import('@/views/Dashboard.vue')
const Profile = () => import('@/views/Profile.vue')

// With loading component
const AsyncComponent = defineAsyncComponent({
  loader: () => import('@/components/HeavyComponent.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorComponent,
  delay: 200,
  timeout: 3000
})
```

### **Route Meta Fields**
```javascript
// router/meta.js
// Route meta is just a plain object in JavaScript

// Usage in routes
{
  path: '/admin',
  name: 'Admin',
  component: () => import('@/views/Admin.vue'),
  meta: {
    requiresAuth: true,
    requiresRole: 'admin',
    title: 'Admin Panel',
    breadcrumb: 'Administration',
    icon: 'settings'
  }
}
```

### **Breadcrumb Component**
```vue
<template>
  <nav class="breadcrumb">
    <ol class="breadcrumb-list">
      <li v-for="(item, index) in breadcrumbs" :key="item.path" class="breadcrumb-item">
        <router-link
          v-if="index < breadcrumbs.length - 1"
          :to="item.path"
          class="breadcrumb-link"
        >
          {{ item.name }}
        </router-link>
        <span v-else class="breadcrumb-current">
          {{ item.name }}
        </span>

        <span v-if="index < breadcrumbs.length - 1" class="breadcrumb-separator">
          /
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbs = computed(() => {
  const matched = route.matched.filter(record => record.meta.breadcrumb)

  return matched.map(record => ({
    name: record.meta.breadcrumb,
    path: record.path
  }))
})
</script>
```

### **Route Transitions**
```vue
<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="transitionName" mode="out-in">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const transitionName = computed(() => {
  const toDepth = route.path.split('/').length
  const fromDepth = route.path.split('/').length

  return toDepth < fromDepth ? 'slide-right' : 'slide-left'
})
</script>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from {
  transform: translateX(100%);
}

.slide-left-leave-to {
  transform: translateX(-100%);
}

.slide-right-enter-from {
  transform: translateX(-100%);
}

.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
```

### **Global Error Handling**
```javascript
// router/errorHandler.js
import { Router } from 'vue-router'

export function setupErrorHandling(router) {
  router.onError((error) => {
    console.error('Router error:', error)

    // Handle chunk loading errors
    if (error.message.includes('Loading chunk')) {
      window.location.reload()
    }
  })
}

// Usage in main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { setupErrorHandling } from './router/errorHandler'

const app = createApp(App)
app.use(router)

setupErrorHandling(router)
app.mount('#app')
```

## 🎯 **Quick Tips**

1. **Use route meta fields** for authentication and authorization
2. **Implement navigation guards** for route protection
3. **Use lazy loading** for better performance
4. **Handle route errors** gracefully
5. **Implement breadcrumbs** for better UX
6. **Use route transitions** for smooth navigation
7. **Store auth state** in Pinia store
8. **Implement role-based access control**
9. **Use route parameters** for dynamic content
10. **Handle deep linking** with query parameters

## 📚 **Next Steps**

- File upload handling
- Real-time features with WebSockets
- Progressive Web App features
- Testing routing and authentication
- Performance optimization
