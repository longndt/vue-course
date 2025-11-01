# Vue 3 Routing & Authentication

## Theory 4: Vue Router & Authentication 🧭

### Quick Reference 📋

*For detailed learning objectives and concepts, see [readme.md](../readme.md)*

---

## Why Do We Need Navigation? 🤔

Think of a website like a book:

- Each page has different content
- You can move between pages
- Some pages are public
- Some pages need permission to view

**Website Structure Example:**

```
📱 My Website
├── 🏠 Home Page (public)
├── ℹ️ About Page (public)
├── 👤 Profile Page (private)
└── ⚙️ Settings Page (private)
```

**Modern SPA Benefits:**
- No page refreshes
- Faster navigation
- Better user experience
- State preservation between pages

---

## Setting Up Vue Router 🛠️

### 1. Install Vue Router

```bash
npm install vue-router@4
```

### 2. Basic Setup

```javascript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Home from '@/pages/Home.vue'
import About from '@/pages/About.vue'
import Contact from '@/pages/Contact.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Home' }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { title: 'About' }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact,
    meta: { title: 'Contact' }
  }
]

export const router = createRouter({
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
```

### 3. App Setup

```vue
<!-- App.vue -->
<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-brand">
        <RouterLink to="/">My App</RouterLink>
      </div>
      <div class="nav-links">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/contact">Contact</RouterLink>
      </div>
    </nav>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>

<style scoped>
.navbar {
  background: #f8f9fa;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-brand a {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: #333;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.nav-links a:hover {
  background: #e9ecef;
}

.nav-links a.router-link-active {
  color: #007bff;
  font-weight: bold;
  background: #e3f2fd;
}

.main-content {
  min-height: calc(100vh - 80px);
  padding: 2rem;
}
</style>
```

---

## Protected Routes & Authentication 🔒

### 1. Navigation Guards

```javascript
// router/index.js
import { useAuthStore } from '@/stores/auth'

const routes = [
  // Public routes
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login.vue'),
    meta: { requiresAuth: false, guestOnly: true }
  },

  // Protected routes
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/pages/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/pages/Admin.vue'),
    meta: { requiresAuth: true, requiresRole: 'admin' }
  }
]

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // Check if route is guest only
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    next({ name: 'Profile' })
    return
  }

  // Check role requirements
  if (to.meta.requiresRole && !authStore.hasRole(to.meta.requiresRole)) {
    next({ name: 'Profile' })
    return
  }

  next()
})
```

### 2. Authentication Store (Pinia)

```javascript
// stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role || '')

  const login = async (credentials) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })

      const data = await response.json()

      if (response.ok) {
        user.value = data.user
        token.value = data.token
        localStorage.setItem('token', data.token)
        return { success: true }
      } else {
        error.value = data.message
        return { success: false, error: data.message }
      }
    } catch (err) {
      error.value = 'Network error'
      return { success: false, error: 'Network error' }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  const hasRole = (role) => {
    return user.value?.role === role
  }

  const hasAnyRole = (roles) => {
    return roles.includes(user.value?.role || '')
  }

  const fetchUser = async () => {
    if (!token.value) return

    try {
      const response = await fetch('/api/me', {
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      })

      if (response.ok) {
        user.value = await response.json()
      } else {
        logout()
      }
    } catch (err) {
      logout()
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    userRole,
    login,
    logout,
    hasRole,
    hasAnyRole,
    fetchUser
  }
})
```

### 3. Login Component

```vue
<!-- pages/Login.vue -->
<template>
  <div class="login-page">
    <div class="login-container">
      <form @submit.prevent="handleLogin" class="login-form">
        <h2>Welcome Back</h2>
        <p class="subtitle">Sign in to your account</p>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            :class="{ error: errors.email }"
            placeholder="Enter your email"
            required
          />
          <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            :class="{ error: errors.password }"
            placeholder="Enter your password"
            required
          />
          <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
        </div>

        <div class="form-options">
          <label class="checkbox-label">
            <input v-model="form.remember" type="checkbox" />
            Remember me
          </label>
          <a href="#" class="forgot-password">Forgot password?</a>
        </div>

        <button type="submit" :disabled="loading" class="login-button">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>

        <div class="signup-link">
          Don't have an account? <a href="#">Sign up</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const errors = reactive({})
const loading = ref(false)
const error = ref('')

const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key])

  if (!form.email.trim()) {
    errors.email = 'Email is required'
  } else if (!form.email.includes('@')) {
    errors.email = 'Please enter a valid email'
  }

  if (!form.password.trim()) {
    errors.password = 'Password is required'
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }
}

const handleLogin = async () => {
  validateForm()

  if (Object.keys(errors).length > 0) return

  loading.value = true
  error.value = ''

  const result = await authStore.login({
    email: form.email,
    password: form.password
  })

  if (result.success) {
    const redirect = route.query.redirect || '/profile'
    router.push(redirect)
  } else {
    error.value = result.error || 'Login failed'
  }

  loading.value = false
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  overflow: hidden;
  width: 100%;
  max-width: 400px;
}

.login-form {
  padding: 40px;
}

.login-form h2 {
  text-align: center;
  margin-bottom: 8px;
  color: #333;
  font-size: 2rem;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
}

.form-group input.error {
  border-color: #dc3545;
}

.field-error {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 4px;
  display: block;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  text-align: center;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 0.875rem;
}

.forgot-password {
  color: #007bff;
  text-decoration: none;
  font-size: 0.875rem;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-button {
  width: 100%;
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.login-button:hover:not(:disabled) {
  background: #0056b3;
}

.login-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.signup-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.signup-link a {
  color: #007bff;
  text-decoration: none;
}

.signup-link a:hover {
  text-decoration: underline;
}
</style>
```

---

## Dynamic Routes & Parameters 🔗

### 1. Route Parameters

```javascript
// router/index.ts
const routes: RouteRecordRaw[] = [
  {
    path: '/user/:id',
    name: 'UserProfile',
    component: () => import('@/pages/UserProfile.vue'),
    props: true, // Pass params as props
    meta: { requiresAuth: true }
  },
  {
    path: '/post/:slug',
    name: 'PostDetail',
    component: () => import('@/pages/PostDetail.vue'),
    props: true
  }
]
```

### 2. Using Route Parameters

```vue
<!-- pages/UserProfile.vue -->
<template>
  <div v-if="loading" class="loading-container">
    <div class="spinner"></div>
    <p>Loading user profile...</p>
  </div>

  <div v-else-if="error" class="error-container">
    <h3>Error loading profile</h3>
    <p>{{ error }}</p>
    <button @click="fetchUser" class="retry-btn">Try Again</button>
  </div>

  <div v-else-if="user" class="user-profile">
    <div class="profile-header">
      <img :src="user.avatar || '/default-avatar.png'" :alt="user.name" class="avatar" />
      <div class="profile-info">
        <h1>{{ user.name }}</h1>
        <p class="email">{{ user.email }}</p>
        <span class="role-badge">{{ user.role }}</span>
      </div>
    </div>

    <div class="profile-content">
      <div class="profile-section">
        <h3>About</h3>
        <p>{{ user.bio || 'No bio available' }}</p>
      </div>

      <div class="profile-section">
        <h3>Activity</h3>
        <div class="activity-list">
          <div v-for="activity in user.activities" :key="activity.id" class="activity-item">
            {{ activity.description }}
            <span class="activity-date">{{ formatDate(activity.date) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="not-found">
    <h3>User not found</h3>
    <p>The user you're looking for doesn't exist.</p>
    <RouterLink to="/" class="home-link">Go Home</RouterLink>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const route = useRoute()

const user = ref(null)
const loading = ref(true)
const error = ref(null)

const fetchUser = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await fetch(`/api/users/${props.id}`)

    if (response.ok) {
      user.value = await response.json()
    } else if (response.status === 404) {
      user.value = null
    } else {
      throw new Error('Failed to fetch user')
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

onMounted(() => {
  fetchUser()
})
</script>

<style scoped>
.loading-container, .error-container, .not-found {
  text-align: center;
  padding: 40px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.user-profile {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-info h1 {
  margin: 0 0 8px 0;
  color: #333;
}

.email {
  color: #666;
  margin: 0 0 8px 0;
}

.role-badge {
  background: #007bff;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.profile-section {
  margin-bottom: 30px;
}

.profile-section h3 {
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e9ecef;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.activity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 6px;
}

.activity-date {
  color: #666;
  font-size: 0.875rem;
}

.retry-btn, .home-link {
  background: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  text-decoration: none;
  display: inline-block;
  margin-top: 15px;
}

.retry-btn:hover, .home-link:hover {
  background: #0056b3;
}
</style>
```

---

## Advanced Routing Patterns 🚀

### 1. Nested Routes

```javascript
// router/index.ts
const routes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: () => import('@/layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/pages/Dashboard.vue')
      },
      {
        path: 'profile',
        name: 'DashboardProfile',
        component: () => import('@/pages/Profile.vue')
      },
      {
        path: 'settings',
        name: 'DashboardSettings',
        component: () => import('@/pages/Settings.vue')
      }
    ]
  }
]
```

### 2. Route Meta Fields

```javascript
// router/index.js

const routes = [
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/pages/Admin.vue'),
    meta: {
      requiresAuth: true,
      requiresRole: 'admin',
      title: 'Admin Panel',
      breadcrumb: 'Administration'
    }
  }
]
```

### 3. Breadcrumb Component

```vue
<!-- components/Breadcrumb.vue -->
<template>
  <nav class="breadcrumb" v-if="breadcrumbs.length > 0">
    <ol class="breadcrumb-list">
      <li v-for="(item, index) in breadcrumbs" :key="item.path" class="breadcrumb-item">
        <RouterLink
          v-if="index < breadcrumbs.length - 1"
          :to="item.path"
          class="breadcrumb-link"
        >
          {{ item.name }}
        </RouterLink>
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

<style scoped>
.breadcrumb {
  padding: 10px 0;
  margin-bottom: 20px;
}

.breadcrumb-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-link {
  color: #007bff;
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.breadcrumb-link:hover {
  background: #f8f9fa;
}

.breadcrumb-current {
  color: #666;
  padding: 4px 8px;
  font-weight: 500;
}

.breadcrumb-separator {
  color: #999;
  margin: 0 4px;
}
</style>
```

---

## Common Mistakes to Avoid ⚠️

### 1. Forgetting Router Setup

```vue
<!-- ❌ Wrong - No router setup -->
<template>
  <div>
    <RouterView />
  </div>
</template>

<!-- ✅ Correct - With proper router -->
<template>
  <div id="app">
    <nav>
      <RouterLink to="/">Home</RouterLink>
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>
```

### 2. Not Handling Route Parameters

```vue
<!-- ❌ Wrong - Not accessing route params -->
<script setup>
const userId = '123' // Hardcoded
</script>

<!-- ✅ Correct - Using route params -->
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const userId = route.params.id
</script>
```

### 3. Missing Error Handling

```vue
<!-- ❌ Wrong - No error handling -->
<script setup>
const fetchUser = async () => {
  const response = await fetch(`/api/users/${userId}`)
  const user = await response.json()
  // What if the request fails?
}
</script>

<!-- ✅ Correct - With error handling -->
<script setup>
const user = ref(null)
const loading = ref(false)
const error = ref(null)

const fetchUser = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await fetch(`/api/users/${userId}`)
    if (response.ok) {
      user.value = await response.json()
    } else {
      throw new Error('Failed to fetch user')
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>
```

---

## Practice Time! 💪

### Exercise: Build a Mini Blog

Create a simple blog with:

1. **Home page** (list of posts)
2. **Single post page** (dynamic route)
3. **Admin page** (protected)
4. **Login page**

```vue
<!-- App.vue -->
<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-brand">
        <RouterLink to="/">My Blog</RouterLink>
      </div>
      <div class="nav-links">
        <RouterLink to="/">Home</RouterLink>
        <template v-if="authStore.isAuthenticated">
          <RouterLink to="/admin">Admin</RouterLink>
          <button @click="authStore.logout" class="logout-btn">Logout</button>
        </template>
        <template v-else>
          <RouterLink to="/login">Login</RouterLink>
        </template>
      </div>
    </nav>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>
```

---

## Key Concepts Summary 📝

### Vue Router Basics
- **RouterView**: Displays matched component
- **RouterLink**: Navigation component
- **useRouter()**: Programmatic navigation
- **useRoute()**: Access current route info

### Authentication Patterns
- **Navigation Guards**: Control route access
- **Pinia Store**: Manage auth state
- **Route Meta**: Add authentication requirements
- **Persistent Login**: localStorage + API validation

### Best Practices
- Use TypeScript for type safety
- Implement proper error handling
- Store tokens securely
- Validate on both client and server
- Use route meta for permissions

---

## Need Help? 🆘

### Common Problems:

1. **Page not found?**
   - Check route path spelling
   - Make sure component exists
   - Verify router setup

2. **Can't access private page?**
   - Check if user is authenticated
   - Verify navigation guards
   - Check Pinia store state

3. **Route parameters not working?**
   - Check route definition
   - Verify parameter names
   - Use `useRoute()` to access params

### Useful Resources:

- [Vue Router Guide](https://router.vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/composition-api-introduction.html)
- Ask your teacher!

---

**Tips:**
- Start with public pages
- Add navigation
- Then add protected pages
- Finally add login system