# Lab 4: Vue Router & Authentication

## Overview
Implement authentication features with Vue Router and Pinia.

## Exercise 1: Basic Vue Router Setup

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: () => import('@/pages/About.vue') }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
```

## Exercise 2: Authentication Store

```javascript
// stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)

  const login = async (credentials) => {
    // Login logic here
    user.value = { name: 'User' }
    return true
  }

  const logout = () => {
    user.value = null
  }

  return { user, isAuthenticated, login, logout }
})
```

## Exercise 3: Protected Routes

```javascript
// Add to router/index.js
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})
```

## Requirements
- Basic routing
- Authentication with Pinia
- Protected routes
- Login/logout functionality

