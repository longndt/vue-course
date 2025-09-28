# Lesson 4 Demo: Vue Router + Pinia Authentication

This demo showcases Vue Router for navigation and Pinia for authentication state management in Vue 3 applications.

## Features

- **Vue Router v4** for client-side routing
- **Pinia** for authentication state management
- **Route Guards** and navigation protection
- **Persistent Authentication** with localStorage
- **Modern Vue 3 Patterns** including:
  - Composition API with `<script setup>`
  - TypeScript integration
  - Reactive state management
  - Navigation guards
  - Route meta fields

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- VS Code with Vue 3 extensions (Volar recommended)

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run the application:**

   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:5174`

## Project Structure

```
demo/
├── src/
│   ├── stores/
│   │   └── auth.ts           # Pinia authentication store
│   ├── components/
│   │   └── Layout.vue        # Main layout component
│   ├── pages/
│   │   ├── Home.vue          # Public home page
│   │   ├── Login.vue         # Login page
│   │   ├── Products.vue      # Public products page
│   │   ├── Profile.vue       # Protected profile page
│   │   └── Cart.vue          # Protected cart page
│   ├── App.vue               # Main app component
│   ├── main.ts               # App entry point with router setup
│   └── index.css             # Global styles
└── package.json
```

## Key Concepts Demonstrated

### 1. Router Setup with Navigation Guards

```typescript
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from './stores/auth';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Home' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { title: 'Profile', requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
    return;
  }

  next();
});
```

### 2. Pinia Authentication Store

```typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isLoading = ref(false);

  // Getters
  const isAuthenticated = computed(() => {
    return !!token.value && !!user.value;
  });

  // Actions
  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true;
    try {
      const response = await mockLogin(credentials);
      if (response.success) {
        token.value = response.token;
        user.value = response.user;
        localStorage.setItem('auth_token', response.token);
        return true;
      }
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('auth_token');
  };

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout
  };
});
```

### 3. Vue 3 Component with Authentication

```vue
<template>
  <div class="login">
    <form @submit.prevent="handleLogin">
      <input
        v-model="form.username"
        type="text"
        placeholder="Username"
        required
      />
      <input
        v-model="form.password"
        type="password"
        placeholder="Password"
        required
      />
      <button type="submit" :disabled="authStore.isLoading">
        {{ authStore.isLoading ? 'Signing in...' : 'Sign In' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  username: '',
  password: ''
});

const handleLogin = async () => {
  const success = await authStore.login(form);
  if (success) {
    router.push('/');
  }
};
</script>
```

## Authentication Features

### Mock Authentication System

- **Demo Credentials:**
  - Admin: `admin` / `admin123`
  - User: `user` / `user123`
  - Guest: `john` / `john123`

### Authentication Flow

1. **Login**: Validates credentials and stores JWT token
2. **Token Persistence**: Stores token in localStorage
3. **Route Protection**: Navigation guards redirect unauthenticated users
4. **Auto-initialization**: Restores auth state on app load
5. **Redirect After Login**: Returns to intended page

## Vue Router Features

### Route Configuration

- **Public Routes**: Accessible to all users
- **Protected Routes**: Require authentication (`meta.requiresAuth: true`)
- **Guest Routes**: Only for non-authenticated users (`meta.requiresGuest: true`)
- **Dynamic Titles**: Route-based page titles

### Navigation Patterns

- **Declarative Navigation**: Using `<router-link>` components
- **Programmatic Navigation**: Using `useRouter()` composable
- **Conditional Navigation**: Based on authentication state
- **Route Parameters**: Dynamic route segments
- **Query Parameters**: URL search parameters and redirects

## Learning Objectives

By completing this lesson, you will understand:

1. **Vue Router v4**
   - Modern routing with Composition API
   - Navigation guards and route protection
   - Route meta fields and dynamic configuration

2. **Pinia State Management**
   - Modern Vuex alternative with better TypeScript support
   - Composition API style stores
   - Reactive state management patterns

3. **Vue 3 Authentication**
   - JWT token handling with composables
   - Persistent authentication state
   - Route-based access control

4. **Modern Vue Patterns**
   - `<script setup>` syntax
   - Composition API with TypeScript
   - Reactive state and computed properties

## Best Practices Demonstrated

- **Composition API**: Modern Vue 3 development patterns
- **Type Safety**: Full TypeScript integration
- **Separation of Concerns**: Store-based state management
- **User Experience**: Loading states and smooth transitions
- **Security**: Token-based authentication with expiration
- **Accessibility**: Proper navigation semantics and ARIA labels

## Resources

- [Vue Router v4 Documentation](https://router.vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/composition-api-introduction.html)
- [TypeScript with Vue](https://vuejs.org/guide/typescript/overview.html)
