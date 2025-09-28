# Lesson 4 Quickstart: Vue Router & Pinia Authentication

## Quick Setup

```bash
cd lesson4-routing-auth/demo
npm install
npm run dev
```

## Test Authentication

1. Open http://localhost:5174
2. Try login with: `admin` / `admin123`
3. Navigate to protected routes

## Key Concepts

- **Vue Router v4**: Client-side navigation with Composition API
- **Pinia Store**: Modern state management for authentication
- **Navigation Guards**: Route protection and redirects
- **JWT Tokens**: Secure authentication with localStorage

## Demo Flow

1. Visit public pages (Home, Products)
2. Try accessing Profile (redirects to login)
3. Login with demo credentials:
   - `admin` / `admin123`
   - `user` / `user123`
   - `john` / `john123`
4. Access protected areas (Profile, Cart)
5. Logout to reset state

## Vue 3 Features Used

- **Composition API**: `<script setup>` syntax
- **TypeScript**: Full type safety
- **Reactive State**: `ref()` and `computed()`
- **Router Composables**: `useRouter()` and `useRoute()`
- **Store Composables**: `useAuthStore()`

## Quick Build Guide

### 1. Setup Dependencies

```bash
# Install Vue Router and Pinia
npm install vue-router@4 pinia
npm install -D @types/node

# For TypeScript support
npm install -D typescript @vue/tsconfig
```

### 2. Create Router (main.ts)

```typescript
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: () => import('./pages/Home.vue') },
    { path: '/login', name: 'Login', component: () => import('./pages/Login.vue') },
    { path: '/profile', name: 'Profile', component: () => import('./pages/Profile.vue'), meta: { requiresAuth: true } }
  ]
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

### 3. Create Auth Store

```typescript
// stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('auth_token'))

  const isAuthenticated = computed(() => !!user.value && !!token.value)

  const login = async (credentials) => {
    // Mock login logic
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      user.value = { name: 'Admin', role: 'admin' }
      token.value = 'mock-jwt-token'
      localStorage.setItem('auth_token', token.value)
      return true
    }
    return false
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
  }

  return { user, token, isAuthenticated, login, logout }
})
```

### 4. Create Login Component

```vue
<!-- pages/Login.vue -->
<template>
  <div class="login">
    <form @submit.prevent="handleLogin">
      <input v-model="form.username" placeholder="Username" required />
      <input v-model="form.password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  const success = await authStore.login(form)
  if (success) {
    router.push('/')
  }
}
</script>
```

### 5. Add Navigation Guards

```typescript
// Add to router setup in main.ts
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' })
  } else {
    next()
  }
})
```

## 🎉 Congratulations!

You now have:

- ✅ Client-side routing with Vue Router v4
- ✅ Authentication system with Pinia
- ✅ Protected routes with navigation guards
- ✅ Login/logout functionality
- ✅ TypeScript integration

## Test Your Setup

1. Visit your app - navigate freely between pages
2. Try accessing protected routes (redirects to login)
3. Login with demo credentials
4. Access protected areas
5. Logout to reset state

## Next Steps

1. Read the full [Lesson 4 README](./README.md)
2. Explore advanced routing patterns
3. Add role-based access control
4. Complete the lab exercises

## Need Help?

- Check browser console for routing errors
- Ensure all imports are correct
- Verify Pinia store setup
- Test navigation guard logic
