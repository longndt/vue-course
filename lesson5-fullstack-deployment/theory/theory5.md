# Vue 3 Full-Stack Integration & Production Deployment

## Theory 5: Full-Stack Integration & Production Deployment 🚀

### Quick Reference 📋

*For detailed learning objectives and deployment concepts, see [readme.md](../readme.md)*

---

## Full-Stack Architecture Overview 🏗️

### MEVN Stack Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vue.js 3      │    │   Express.js    │    │   MongoDB       │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
│                 │    │                 │    │                 │
│ • Components    │    │ • REST APIs     │    │ • Collections   │
│ • State Mgmt    │    │ • Authentication│    │ • Documents     │
│ • Routing       │    │ • File Upload   │    │ • Indexes       │
│ • Real-time     │    │ • WebSockets    │    │ • Aggregation   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
│                     │                     │
│   Node.js Runtime   │   Node.js Runtime   │   Node.js Driver │
└─────────────────────┴─────────────────────┴─────────────────┘
```

**MEVN Stack Components:**
- **M**ongoDB: NoSQL database for data storage
- **E**xpress.js: Web framework for Node.js
- **V**ue.js: Progressive JavaScript framework for frontend
- **N**ode.js: JavaScript runtime for backend

### System Design Patterns

**1. Monolithic vs Microservices**

```typescript
// Monolithic approach (recommended for learning)
// All backend logic in one Node.js application
const express = require('express')
const app = express()

// API routes
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/upload', uploadRoutes)

// Microservices approach (advanced)
// Separate services for different domains
// - User Service (port 3001)
// - Post Service (port 3002)
// - File Service (port 3003)
```

**2. API Gateway Patterns**

```typescript
// API Gateway with rate limiting and authentication
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

app.use(helmet()) // Security headers
app.use(limiter) // Rate limiting
app.use('/api', authenticateToken) // Authentication middleware
```

---

## Backend Integration with Node.js/Express 🔧

### 1. RESTful API Design

```typescript
// server/routes/users.ts
import express from 'express'
import { UserController } from '../controllers/UserController'
import { authenticateToken } from '../middleware/auth'
import { validateUser } from '../middleware/validation'

const router = express.Router()
const userController = new UserController()

// GET /api/users - List all users
router.get('/', authenticateToken, userController.getAllUsers)

// GET /api/users/:id - Get user by ID
router.get('/:id', authenticateToken, userController.getUserById)

// POST /api/users - Create new user
router.post('/', validateUser, userController.createUser)

// PUT /api/users/:id - Update user
router.put('/:id', authenticateToken, validateUser, userController.updateUser)

// DELETE /api/users/:id - Delete user
router.delete('/:id', authenticateToken, userController.deleteUser)

export default router
```

### 2. Authentication & Authorization

```typescript
// server/middleware/auth.ts
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

interface AuthRequest extends Request {
  user?: any
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' })
    }
    req.user = user
    next()
  })
}

export const requireRole = (role: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }
    next()
  }
}
```

### 3. File Upload System

```typescript
// server/middleware/upload.ts
import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Ensure uploads directory exists
const uploadsDir = 'uploads'
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('Invalid file type'))
  }
}

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
})
```

---

## Real-Time Features with WebSockets 🔌

### 1. WebSocket Integration

```typescript
// server/websocket.ts
import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import jwt from 'jsonwebtoken'

export const setupWebSocket = (server: HTTPServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  })

  // Authentication middleware for WebSocket
  io.use((socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) {
      return next(new Error('Authentication error'))
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
      if (err) return next(new Error('Authentication error'))
      socket.userId = decoded.userId
      next()
    })
  })

  io.on('connection', (socket) => {
    console.log(`User ${socket.userId} connected`)

    // Join user to their personal room
    socket.join(`user_${socket.userId}`)

    // Handle chat messages
    socket.on('send_message', async (data) => {
      const { recipientId, message } = data

      // Save message to database
      const savedMessage = await saveMessage({
        senderId: socket.userId,
        recipientId,
        message,
        timestamp: new Date()
      })

      // Send to recipient
      socket.to(`user_${recipientId}`).emit('new_message', savedMessage)

      // Send confirmation to sender
      socket.emit('message_sent', savedMessage)
    })

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      socket.to(`user_${data.recipientId}`).emit('user_typing', {
        userId: socket.userId,
        isTyping: true
      })
    })

    socket.on('typing_stop', (data) => {
      socket.to(`user_${data.recipientId}`).emit('user_typing', {
        userId: socket.userId,
        isTyping: false
      })
    })

    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected`)
    })
  })

  return io
}
```

### 2. Vue 3 WebSocket Integration

```vue
<!-- composables/useWebSocket.ts -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '@/stores/auth'

interface Message {
  id: string
  senderId: string
  recipientId: string
  message: string
  timestamp: Date
}

export function useWebSocket() {
  const socket = ref<Socket | null>(null)
  const isConnected = ref(false)
  const messages = ref<Message[]>([])
  const typingUsers = ref<Set<string>>(new Set())

  const authStore = useAuthStore()

  const connect = () => {
    if (!authStore.token) return

    socket.value = io(import.meta.env.VITE_API_URL, {
      auth: {
        token: authStore.token
      }
    })

    socket.value.on('connect', () => {
      isConnected.value = true
      console.log('Connected to WebSocket')
    })

    socket.value.on('disconnect', () => {
      isConnected.value = false
      console.log('Disconnected from WebSocket')
    })

    socket.value.on('new_message', (message: Message) => {
      messages.value.push(message)
    })

    socket.value.on('user_typing', (data: { userId: string; isTyping: boolean }) => {
      if (data.isTyping) {
        typingUsers.value.add(data.userId)
      } else {
        typingUsers.value.delete(data.userId)
      }
    })
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      isConnected.value = false
    }
  }

  const sendMessage = (recipientId: string, message: string) => {
    if (socket.value && isConnected.value) {
      socket.value.emit('send_message', { recipientId, message })
    }
  }

  const startTyping = (recipientId: string) => {
    if (socket.value && isConnected.value) {
      socket.value.emit('typing_start', { recipientId })
    }
  }

  const stopTyping = (recipientId: string) => {
    if (socket.value && isConnected.value) {
      socket.value.emit('typing_stop', { recipientId })
    }
  }

  onMounted(() => {
    connect()
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    isConnected,
    messages,
    typingUsers,
    sendMessage,
    startTyping,
    stopTyping
  }
}
</script>
```

---

## Performance Optimization 🚀

### 1. Code Splitting

```vue
<!-- App.vue -->
<template>
  <div id="app">
    <Suspense>
      <template #default>
        <RouterView />
      </template>
      <template #fallback>
        <LoadingSpinner />
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

// Lazy load components
const LoadingSpinner = defineAsyncComponent(() => import('@/components/LoadingSpinner.vue'))
</script>
```

```typescript
// router/index.ts
const routes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/pages/Profile.vue'),
    meta: { requiresAuth: true }
  }
]
```

### 2. Memoization and Caching

```vue
<!-- components/ExpensiveComponent.vue -->
<template>
  <div>
    <h3>Processed Data</h3>
    <div v-for="item in processedData" :key="item.id">
      {{ item.name }} - {{ item.processedValue }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'

interface Props {
  data: ExpensiveData[]
  filter: string
}

const props = defineProps<Props>()

// Computed properties are automatically memoized
const processedData = computed(() => {
  console.log('Processing data...') // This will only run when dependencies change
  return props.data
    .filter(item => item.name.includes(props.filter))
    .map(item => ({
      ...item,
      processedValue: expensiveCalculation(item)
    }))
})

// Memoize expensive calculations
const expensiveCalculation = (item: ExpensiveData) => {
  // Simulate expensive operation
  return item.value * 2 + Math.random()
}

// Watch for changes and log
watch(processedData, (newData) => {
  console.log('Processed data updated:', newData.length, 'items')
})
</script>
```

### 3. Virtual Scrolling

```vue
<!-- components/VirtualList.vue -->
<template>
  <div class="virtual-list" ref="container" @scroll="handleScroll">
    <div :style="{ height: totalHeight + 'px' }" class="virtual-list-content">
      <div
        v-for="item in visibleItems"
        :key="item.id"
        :style="{ transform: `translateY(${item.top}px)` }"
        class="virtual-item"
      >
        <slot :item="item.data" :index="item.index" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  items: any[]
  itemHeight: number
  containerHeight: number
}

const props = defineProps<Props>()

const container = ref<HTMLElement>()
const scrollTop = ref(0)

const totalHeight = computed(() => props.items.length * props.itemHeight)

const visibleItems = computed(() => {
  const startIndex = Math.floor(scrollTop.value / props.itemHeight)
  const endIndex = Math.min(
    startIndex + Math.ceil(props.containerHeight / props.itemHeight) + 1,
    props.items.length
  )

  return props.items.slice(startIndex, endIndex).map((item, index) => ({
    data: item,
    index: startIndex + index,
    top: (startIndex + index) * props.itemHeight
  }))
})

const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement
  scrollTop.value = target.scrollTop
}

onMounted(() => {
  if (container.value) {
    container.value.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  if (container.value) {
    container.value.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped>
.virtual-list {
  height: 400px;
  overflow-y: auto;
  border: 1px solid #ddd;
}

.virtual-list-content {
  position: relative;
}

.virtual-item {
  position: absolute;
  width: 100%;
  padding: 10px;
  border-bottom: 1px solid #eee;
}
</style>
```

---

## Build Configuration & Optimization ⚙️

### 1. Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-demi'],
          router: ['vue-router'],
          pinia: ['pinia'],
          utils: ['lodash-es', 'dayjs']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

### 2. Environment Configuration

```typescript
// config/env.ts
interface EnvConfig {
  VITE_API_URL: string
  VITE_WS_URL: string
  VITE_APP_NAME: string
  VITE_APP_VERSION: string
}

export const env: EnvConfig = {
  VITE_API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  VITE_WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:5000',
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME || 'Vue App',
  VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0'
}
```

---

## Production Deployment 🚀

### 1. Deployment Checklist

**Build Optimization:**
- [ ] Minification enabled
- [ ] Tree shaking configured
- [ ] Asset optimization
- [ ] Gzip compression
- [ ] CDN setup

**Environment Setup:**
- [ ] Environment variables configured
- [ ] API endpoints updated
- [ ] Database connections secured
- [ ] Error tracking setup

**Security:**
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] CORS properly set
- [ ] Input validation
- [ ] Rate limiting

### 2. Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /api {
            proxy_pass http://backend:5000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

### 3. Performance Monitoring

```typescript
// utils/performance.ts
import { onMounted, onUnmounted } from 'vue'

export function usePerformanceMonitoring() {
  let observer: PerformanceObserver | null = null

  onMounted(() => {
    if ('PerformanceObserver' in window) {
      observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()

        entries.forEach((entry) => {
          if (entry.entryType === 'paint') {
            console.log(`${entry.name}: ${entry.startTime}ms`)
          }

          if (entry.entryType === 'largest-contentful-paint') {
            console.log(`LCP: ${entry.startTime}ms`)
          }
        })
      })

      observer.observe({
        entryTypes: ['paint', 'largest-contentful-paint', 'navigation']
      })
    }
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })
}
```

---

## Best Practices & Common Pitfalls 🎯

### 1. Performance Best Practices

**Do:**
- Measure performance before optimizing
- Use Vue DevTools profiler
- Implement lazy loading
- Optimize images and assets
- Use computed properties for derived data

**Don't:**
- Over-optimize prematurely
- Ignore bundle size
- Forget to test on slow devices
- Skip performance monitoring

### 2. Deployment Best Practices

**Do:**
- Use automated deployment pipelines
- Implement staged rollouts
- Set up monitoring and alerts
- Keep backups of production data
- Test deployment process regularly

**Don't:**
- Deploy directly to production
- Skip environment variable validation
- Ignore security updates
- Forget to test rollback procedures

### 3. Common Pitfalls

**Performance Issues:**
- Large bundle sizes
- Unnecessary re-renders
- Memory leaks
- Blocking operations

**Deployment Issues:**
- Environment mismatches
- Missing dependencies
- Cache problems
- Database connection issues

---

## Practical Exercise 🧪

### Build a Full-Stack Application

**Frontend (Vue 3):**
1. User authentication
2. Real-time chat
3. File upload
4. Dashboard with charts
5. Responsive design

**Backend (Node.js/Express):**
1. RESTful API
2. JWT authentication
3. WebSocket support
4. File upload handling
5. Database integration

**Database (MongoDB):**
1. User management
2. Message storage
3. File metadata
4. Analytics data

**Deployment:**
1. Docker containerization
2. Environment configuration
3. Performance monitoring
4. Error tracking

---

## Additional Resources 📚

- [Vue 3 Performance Guide](https://vuejs.org/guide/best-practices/performance.html)
- [Web Vitals](https://web.dev/vitals/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Node.js Production Checklist](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

---

**Next Steps:**
- Build your full-stack application
- Deploy to production
- Monitor performance
- Iterate and improve