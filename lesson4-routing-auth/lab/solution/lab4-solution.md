# Lab 4 Solution - Vue Router & Authentication

## Complete Solution Structure

```
auth-app/
├── src/
│   ├── router/
│   │   └── index.js
│   ├── stores/
│   │   └── auth.js
│   ├── pages/
│   │   ├── Home.vue
│   │   ├── Login.vue
│   │   └── Dashboard.vue
│   └── App.vue
└── package.json
```

---

## Complete Code Solutions

### src/router/index.js

```javascript
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/Home.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../pages/Dashboard.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
```

### src/stores/auth.js

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)

  const isAuthenticated = computed(() => !!user.value && !!token.value)

  const login = async (credentials) => {
    try {
      // Simulate API call
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      user.value = data.user
      token.value = data.token
      localStorage.setItem('token', data.token)
      return true
    } catch (error) {
      console.error('Login error:', error)
      // For demo, use mock login
      user.value = { name: credentials.username, email: credentials.email }
      token.value = 'mock-token-' + Date.now()
      localStorage.setItem('token', token.value)
      return true
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  const checkAuth = () => {
    if (token.value && !user.value) {
      // Try to restore user from token
      // In real app, validate token with backend
      user.value = { name: 'User' }
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
})
```

### src/pages/Login.vue

```vue
<template>
  <div class="login-page">
    <div class="login-card">
      <h2>Login</h2>
      <form @submit="handleLogin" class="login-form">
        <div class="form-group">
          <label>Username</label>
          <input
            v-model="username"
            type="text"
            required
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="form-input"
          />
        </div>
        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async (e) => {
  e.preventDefault()
  loading.value = true
  error.value = ''

  try {
    const success = await authStore.login({
      username: username.value,
      password: password.value
    })

    if (success) {
      const redirect = route.query.redirect || '/dashboard'
      router.push(redirect)
    }
  } catch (err) {
    error.value = 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

.login-form {
  margin-top: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
}

.login-btn {
  width: 100%;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
}

.error {
  color: #ef4444;
  margin-top: 1rem;
}
</style>
```

### src/pages/Dashboard.vue

```vue
<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Dashboard</h1>
      <button @click="handleLogout" class="logout-btn">Logout</button>
    </header>
    <main>
      <p>Welcome, {{ authStore.user?.name }}!</p>
      <p>This is a protected route.</p>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.dashboard {
  padding: 2rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}
</style>
```

### src/pages/Home.vue

```vue
<template>
  <div class="home">
    <h1>Welcome</h1>
    <p>This is the home page.</p>
    <router-link v-if="!authStore.isAuthenticated" to="/login" class="login-link">
      Go to Login
    </router-link>
    <router-link v-else to="/dashboard" class="dashboard-link">
      Go to Dashboard
    </router-link>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.home {
  padding: 2rem;
  text-align: center;
}

.login-link,
.dashboard-link {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
}
</style>
```

### src/main.js

```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Check auth on app init
const authStore = useAuthStore()
authStore.checkAuth()

app.mount('#app')
```

---

## Key Learning Points

1. **Vue Router**: Route configuration and navigation
2. **Navigation Guards**: Protecting routes based on authentication
3. **Pinia Store**: Global authentication state management
4. **Protected Routes**: Meta fields for route protection
5. **Redirect Logic**: Redirecting after login

---
