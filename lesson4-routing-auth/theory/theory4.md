# Theory 4: Vue Router & Authentication 🧭

## Quick Reference 📋

_For detailed learning objectives and concepts, see [readme.md](../readme.md)_

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

---

## Setting Up Vue Router 🛠️

### 1. Install Vue Router

```bash
npm install vue-router@4
```

### 2. Basic Setup

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import About from '@/pages/About.vue'
import Contact from '@/pages/Contact.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/contact', component: Contact }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
```

### 3. App Setup

```vue
<!-- App.vue -->
<template>
  <div id="app">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/contact">Contact</RouterLink>
    </nav>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView, RouterLink } from 'vue-router'</script>

<style scoped>
nav {
  background: #f8f9fa;
  padding: 1rem;
}

nav a {
  margin-right: 1rem;
  color: #333;
  text-decoration: none;
  padding: 0.5rem;
}

nav a.router-link-active {
  color: #007bff;
  font-weight: bold;
}
</style>
```

---

## Protected Routes & Authentication 🔒

### 1. Navigation Guards

```typescript
// router/index.ts
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/profile',
    component: () => import('@/pages/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    component: () => import('@/pages/Login.vue'),
    meta: { requiresGuest: true }
  }
]

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/profile')
  } else {
    next()
  }
})
```

### 2. Authentication Store (Pinia)

```typescript
// stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value)

  const login = async (credentials) => {
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
        return { success: false, error: data.message }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout
  }
})
```

### 3. Login Component

```vue
<!-- pages/Login.vue -->
<template>
  <div class="login-page">
    <form @submit.prevent="handleLogin" class="login-form">
      <h2>Login</h2>

      <div v-if="error" class="error">
        {{ error }}
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  const result = await authStore.login(form)

  if (result.success) {
    router.push('/profile')
  } else {
    error.value = result.error
  }

  loading.value = false
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.login-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  min-width: 300px;
}

.form-group {
  margin-bottom: 1rem;
}

.error {
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
}
</style>

---

## Dynamic Routes & Parameters 🔗

### 1. Route Parameters

```typescript
// Dynamic user profile route
const routes = [
  {
    path: '/user/:id',
    component: UserProfile,
    props: true // Pass params as props
  }
]
```

### 2. Using Route Parameters

```vue
<!-- pages/UserProfile.vue -->
<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="user" class="user-profile">
    <h2>{{ user.name }}</h2>
    <p>{{ user.email }}</p>
  </div>
  <div v-else>User not found</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const user = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await fetch(`/api/users/${route.params.id}`)
    if (response.ok) {
      user.value = await response.json()
    }
  } catch (error) {
    console.error('Error loading user:', error)
  } finally {
    loading.value = false
  }
})
</script>

```typescript
// Using Protected Routes with Vue Router
const routes = [
  // Public pages
  { path: '/', component: Home },
  { path: '/about', component: About },

  // Private pages
  {
    path: '/profile',
    component: ProfilePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    component: SettingsPage,
    meta: { requiresAuth: true }
  }
]
````

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

---

## Practice Time! 💪

### Exercise: Build a Mini Blog
Create a simple blog with:
1. Home page (list of posts)
2. Single post page
3. Admin page (protected)
4. Login page

```vue
<!-- Example Structure -->
<template>
  <div id="app">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <template v-if="authStore.user">
        <RouterLink to="/admin">Admin</RouterLink>
        <button @click="authStore.logout">Logout
            </button>
          </>
        ) : (
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

1. Page not found?
   - Check route path spelling
   - Make sure component exists
   - Verify router setup

2. Can't access private page?
   - Check if user is authenticated
   - Verify navigation guards
   - Check Pinia store state

### Useful Resources:

- [Vue Router Guide](https://router.vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- Ask your teacher!

---

This completes the Vue Router and Authentication theory! 🎉

Tips:

- Start with public pages
- Add navigation
- Then add protected pages
- Finally add login system
