# Lesson 5 Quickstart: Vue 3 Fullstack & Production Deployment

## Quick Setup & Exploration

```bash
cd lesson5-fullstack/demo
npm install
npm run dev
```

🌐 **Open**: http://localhost:5175

## Demo Features To Explore

### 🏠 **Home Page**
- Modern landing page design
- Feature showcase with animations
- Navigation to all sections

### 📊 **Dashboard**
- Real-time metrics simulation
- Interactive stat cards
- Activity feed with timestamps
- Refresh functionality

### 📁 **File Upload**
- Drag & drop interface
- Multi-file selection
- Progress tracking
- File preview gallery

### 💬 **Live Chat**
- Real-time messaging simulation
- Connection status indicators
- Online user list
- Mobile-responsive design

### 📈 **Analytics**
- Interactive time period selection
- Animated metrics with trends
- Traffic source breakdown
- Real-time activity monitoring

## Key Vue 3 Patterns Used

### Composition API with TypeScript
```vue
<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'

interface User {
  id: string
  name: string
  email: string
}

const users = ref<User[]>([])
const isLoading = ref(false)

const userCount = computed(() => users.value.length)

onMounted(async () => {
  await loadUsers()
})
</script>
```

### Reactive State Management
```typescript
const metrics = reactive({
  pageViews: 45678,
  uniqueVisitors: 8934,
  bounceRate: 34.2,
  conversionRate: 3.8
})

// Reactive updates
const refreshData = () => {
  metrics.pageViews += Math.floor(Math.random() * 1000)
}
```

### Vue Router 4 Setup
```typescript
const routes = [
  { path: '/', component: Home, meta: { title: 'Home' } },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/upload', component: FileUpload },
  { path: '/chat', component: Chat },
  { path: '/analytics', component: Analytics }
]
```

## Production Deployment

### 1. Build for Production

```bash
# Optimize and build
npm run build

# Preview production build
npm run preview

# Analyze bundle size
npm run analyze
```

### 2. Deploy to Vercel (Recommended)

#### Option A: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

#### Option B: GitHub Integration
1. Push to GitHub repository
2. Connect to [vercel.com](https://vercel.com)
3. Auto-deploy on every push

### 3. Environment Configuration

```bash
# .env.production
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Vue Fullstack Demo
VITE_WS_URL=wss://ws.yourdomain.com
```

### 4. Performance Optimizations

#### Vite Configuration
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          utils: ['axios', '@vueuse/core'],
          charts: ['chart.js'] // if using charts
        }
      }
    },
    sourcemap: true
  }
})
```

#### Code Splitting
```typescript
// Lazy load heavy components
const Analytics = () => import('./pages/Analytics.vue')
const FileUpload = () => import('./pages/FileUpload.vue')
```

### 5. CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy Vue App

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: vercel/vercel-action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

## Backend Integration Examples

### API Client Setup
```typescript
class ApiClient {
  private baseURL = import.meta.env.VITE_API_URL

  async uploadFile(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${this.baseURL}/upload`, {
      method: 'POST',
      body: formData
    })

    return response.json()
  }

  async getAnalytics(): Promise<AnalyticsData> {
    const response = await fetch(`${this.baseURL}/analytics`)
    return response.json()
  }
}
```

### WebSocket Integration
```typescript
import { io, Socket } from 'socket.io-client'

export const useSocket = () => {
  const socket = ref<Socket>()
  const isConnected = ref(false)

  const connect = () => {
    socket.value = io(import.meta.env.VITE_WS_URL)

    socket.value.on('connect', () => {
      isConnected.value = true
    })

    socket.value.on('disconnect', () => {
      isConnected.value = false
    })
  }

  return { socket, isConnected, connect }
}
```

### Pinia Store Integration
```typescript
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const isLoading = ref(false)
  const user = ref<User | null>(null)

  const login = async (credentials: LoginData) => {
    isLoading.value = true
    try {
      const response = await api.login(credentials)
      user.value = response.user
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, user, login }
})
```

## Performance Monitoring

### Web Vitals
```typescript
import { getCLS, getFID, getLCP } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getLCP(console.log)
```

### Error Tracking
```typescript
// Sentry integration
import * as Sentry from '@sentry/vue'

Sentry.init({
  app,
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE
})
```

## Testing Production Build

### Lighthouse Scores
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 90+
- **SEO**: 90+

### Cross-Browser Testing
```bash
# Test URLs
- Chrome: http://localhost:5175
- Firefox: Same URL
- Safari: Same URL
- Mobile: Use dev tools device simulation
```

## 🎯 Learning Outcomes

After exploring this demo, you'll understand:

- ✅ **Modern Vue 3 patterns** with Composition API
- ✅ **TypeScript integration** in Vue applications
- ✅ **Real-time features** simulation patterns
- ✅ **File management** with drag & drop
- ✅ **Responsive design** implementation
- ✅ **Production deployment** strategies
- ✅ **Performance optimization** techniques
- ✅ **Code organization** best practices

## Next Steps

1. **Explore Each Feature**: Navigate through all pages
2. **Inspect Code**: Review Vue 3 patterns used
3. **Deploy Your Version**: Try deploying to Vercel
4. **Customize**: Modify components and styling
5. **Integrate Backend**: Add real API endpoints
6. **Add Testing**: Implement Vue Test Utils
7. **Optimize Further**: Add PWA features

## Resources

- [Vue 3 Guide](https://vuejs.org/guide/)
- [Vue Router 4](https://router.vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Vercel Deployment](https://vercel.com/docs)
- [TypeScript with Vue](https://vuejs.org/guide/typescript/)
