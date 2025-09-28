import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
import './index.css'

// Import pages
import Home from './pages/Home.vue'
import Dashboard from './pages/Dashboard.vue'
import FileUpload from './pages/FileUpload.vue'
import Chat from './pages/Chat.vue'
import Analytics from './pages/Analytics.vue'
import NotFound from './pages/NotFound.vue'

// Route definitions
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Vue Fullstack Demo' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { title: 'Dashboard', requiresAuth: true }
  },
  {
    path: '/upload',
    name: 'FileUpload',
    component: FileUpload,
    meta: { title: 'File Upload', requiresAuth: true }
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat,
    meta: { title: 'Live Chat', requiresAuth: true }
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: Analytics,
    meta: { title: 'Analytics', requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: 'Page Not Found' }
  }
]

// Create router
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
router.beforeEach((to) => {
  // Update page title
  document.title = to.meta.title as string || 'Vue Fullstack Demo'

  // Add auth check here if needed
  // if (to.meta.requiresAuth && !authStore.isAuthenticated) {
  //   return { name: 'Home' }
  // }
})

// Create app
const app = createApp(App)

// Install plugins
app.use(createPinia())
app.use(router)

// Mount app
app.mount('#app')