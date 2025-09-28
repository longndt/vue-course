# Lesson 4: Routing, Authentication & Advanced Patterns

## Overview

In this lesson, you'll learn how to create multi-page Vue applications using Vue Router and implement comprehensive authentication systems. We'll build complete authentication workflows with protected routes and explore advanced Vue patterns used in enterprise applications.

## Learning Objectives

After this lesson, you will be able to:

- Set up complex routing architectures with Vue Router
- Create protected routes with navigation guards
- Implement JWT-based authentication systems
- Manage user sessions and role-based access control
- Apply advanced Vue patterns (Provide/Inject, Composables, Dynamic Components)
- Implement global state management with Pinia
- Build scalable authentication workflows

## 1. Understanding Vue Router

### Basic Routing

```ts
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Product from '../views/Product.vue'
import Dashboard from '../views/Dashboard.vue'
import Profile from '../views/Profile.vue'
import Settings from '../views/Settings.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  // Basic route
  { path: '/', name: 'Home', component: Home },

  // Route with parameter
  { path: '/product/:id', name: 'Product', component: Product },

  // Nested routes
  {
    path: '/dashboard',
    component: Dashboard,
    children: [
      { path: 'profile', component: Profile },
      { path: 'settings', component: Settings }
    ]
  },

  // Catch-all route for 404
  { path: '/:pathMatch(.*)*', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

## 🔍 **Knowledge Checkpoint 1**

Before building complex routing, ensure you understand:

1. **What's the difference between client-side and server-side routing?**
2. **When would you use nested routes vs separate routes?**
3. **How do you access URL parameters in a Vue component?**
4. **Why do we need a "catch-all" route?**

_💡 Single Page Applications (SPAs) handle navigation differently than traditional websites!_

---

### Navigation Components

```vue
<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav>
    <!-- Basic link -->
    <RouterLink to="/">Home</RouterLink>

    <!-- Link with active state -->
    <RouterLink
      to="/dashboard"
      active-class="active"
    >
      Dashboard
    </RouterLink>
  </nav>
</template>

<style scoped>
.active {
  font-weight: bold;
  color: #42b883;
}
</style>
```

### Using Route Parameters

```vue
<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const id = route.params.id

function goHome() {
  router.push('/')
}
</script>

<template>
  <div>
    <h1>Product {{ id }}</h1>
    <button @click="goHome">Back to Home</button>
  </div>
</template>
```

## 2. Implementing Authentication

### 1. Authentication Store (Pinia)

```ts
// stores/auth.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      user.value = data.user
      token.value = data.token
      localStorage.setItem('token', data.token)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  const isAuthenticated = computed(() => !!token.value)

  return {
    user,
    token,
    login,
    logout,
    isAuthenticated
  }
})
```

### 2. Login Form

```vue
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
  if (isLoading.value) return

  isLoading.value = true
  try {
    await authStore.login(email.value, password.value)
    router.push('/dashboard')
  } catch (error) {
    alert('Login failed: ' + error.message)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input
      v-model="email"
      type="email"
      placeholder="Email"
      required
    />
    <input
      v-model="password"
      type="password"
      placeholder="Password"
      required
    />
    <button type="submit" :disabled="isLoading">
      {{ isLoading ? 'Logging in...' : 'Log In' }}
    </button>
  </form>
</template>
```

### 3. Navigation Guards

```ts
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'Login', component: () => import('../views/Login.vue') },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Global navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login if not authenticated
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    // Redirect to dashboard if already authenticated
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router
```

```ts
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

## Lab Exercises

### Exercise 1: Basic Routing

Create a multi-page application with:

1. Home page
2. About page
3. Contact page
4. Navigation menu
5. 404 page

### Exercise 2: User Authentication

Implement a complete authentication system:

1. Login form with JWT integration
2. Registration form with validation
3. Password reset functionality
4. Remember me functionality
5. Comprehensive error handling

### Exercise 3: Protected Dashboard

Build a protected dashboard area:

1. Protected routes with authentication guards
2. User profile page
3. Settings page
4. Admin section with role-based access
5. Session management

### Exercise 4: Advanced Vue Patterns

Implement advanced patterns:

1. Composables for authentication logic
2. Provide/Inject pattern for data sharing
3. Dynamic Components for reusable UI
4. Custom hooks for authentication logic
5. Context API for global state management

## 4. Advanced Vue Patterns

### Higher-Order Components (Vue Composables)

```vue
<!-- Composable for authentication -->
<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.replace('/login')
  }
})
</script>

// Usage
const ProtectedProfile = withAuth(ProfilePage);
```

### Render Props Pattern

```vue
<!-- Authentication with Pinia store -->
<template>
  <div>
    <LoadingSpinner v-if="authStore.loading" />
    <Dashboard v-else-if="authStore.user" />
    <LoginPage v-else />
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import Dashboard from '@/components/Dashboard.vue'
import LoginPage from '@/pages/Login.vue'

const authStore = useAuthStore()
</script>
  );
}
```

### Compound Components

```vue
<!-- Modal compound component -->
<template>
  <Teleport to="body" v-if="isOpen">
    <div class="modal-backdrop" @click="onClose">
      <div class="modal-content" @click.stop>
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup>
interface Props {
  isOpen: boolean
}

defineProps<Props>()
defineEmits<{
  close: []
}>()
</script>

<!-- Usage -->
<template>
  <Modal :isOpen="showLogin" @close="showLogin = false">
      <Modal.Header>
        <h2>Login Required</h2>
      </Modal.Header>
      <Modal.Body>
        <LoginForm />
      </Modal.Body>
      <Modal.Footer>
        <button @click="onClose">Cancel</button>
      </Modal.Footer>
    </Modal>
  </Modal>
</template>

<script setup>
import { ref } from 'vue'
import Modal from '@/components/Modal.vue'

const showLogin = ref(false)
</script>
```

### State Management with Pinia

```typescript
// stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (credentials) => {
    loading.value = true
    try {
      const response = await authAPI.login(credentials)
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
          });
        } catch (error) {
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateProfile: (updates) => {
        set((state) => ({
          user: { ...state.user, ...updates },
        }));
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);

// Usage in components
function useAuth() {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  return {
    user,
    isAuthenticated,
    login,
    logout,
    isLoading: user === null && isAuthenticated,
  };
}
```

## Additional Resources

- [Vue Router Documentation](https://router.vuejs.org/)
- [JWT Authentication Guide](https://jwt.io/introduction)
- [Navigation Guards Tutorial](https://router.vuejs.org/guide/advanced/navigation-guards.html)
- [Authentication Best Practices](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/04-Authentication_Testing)

## 📊 **Final Knowledge Assessment**

Complete this self-assessment to check your routing and authentication skills:

### **Vue Router Basics (Must Know)**

- [ ] I can set up basic routes with Vue Router
- [ ] I understand how to handle route parameters
- [ ] I can implement nested routing structures
- [ ] I know how to navigate programmatically

### **Authentication Implementation (Must Know)**

- [ ] I understand JWT tokens and how they work
- [ ] I can implement login and logout functionality
- [ ] I know how to store and retrieve user sessions
- [ ] I can create protected routes that require authentication

### **Advanced Patterns (Good to Know)**

- [ ] I can implement role-based access control
- [ ] I understand Pinia stores for global state management
- [ ] I know how to use Zustand for complex state management
- [ ] I can create custom hooks for authentication logic

### **Security Considerations (Important to Know)**

- [ ] I understand token storage best practices
- [ ] I know how to handle token expiration
- [ ] I can implement automatic logout on token expiry
- [ ] I understand basic security principles for SPAs

**🎯 Goal: Check at least 12/16 items before moving to Lesson 5**

### **Self-Reflection Questions**

1. How would you handle user authentication in a large application?
2. What are the security risks of storing tokens in localStorage?
3. When would you choose Context API over Zustand for state management?

---

## 🎓 **Ready for Lesson 5?**

If you completed the assessment above and feel comfortable with routing and authentication, you're ready to move on to [Lesson 5: Full-Stack Integration & Production Deployment](../lesson5-fullstack/).

**Still need practice?** Consider:

- Building more complex routing scenarios
- Implementing additional authentication providers
- Experimenting with different state management patterns
- Adding role-based access control to your applications

## Homework

Create a complete authentication system with:

1. Social login integration (Google/GitHub)
2. Email verification
3. Password reset flow
4. Session management
5. Remember me functionality
