import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import App from './App.vue';
import './index.css';

// Import pages
import Home from './pages/Home.vue';
import Login from './pages/Login.vue';
import Products from './pages/Products.vue';
import Profile from './pages/Profile.vue';
import Cart from './pages/Cart.vue';

// Import auth store
import { useAuthStore } from './stores/auth';

// Define routes
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Home' }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: 'Login', requiresGuest: true }
  },
  {
    path: '/products',
    name: 'Products',
    component: Products,
    meta: { title: 'Products' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { title: 'Profile', requiresAuth: true }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: { title: 'Cart', requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Create Pinia store
const pinia = createPinia();

// Create app instance
const app = createApp(App);

// Install plugins
app.use(pinia);
app.use(router);

// Setup navigation guards after installing Pinia
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Update page title
  if (to.meta.title) {
    document.title = `Vue Shop - ${to.meta.title}`;
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
    return;
  }

  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'Home' });
    return;
  }

  next();
});

// Initialize auth store
const authStore = useAuthStore();
authStore.initializeAuth();

// Mount app
app.mount('#app');
