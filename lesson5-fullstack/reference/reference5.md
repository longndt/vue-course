# Vue 3 Full-Stack Integration & Production Deployment - Quick Reference

## 🎯 **Full-Stack Architecture**

### **Project Structure**
```
vue-fullstack-app/
├── frontend/                 # Vue 3 frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── views/           # Page components
│   │   ├── stores/          # Pinia stores
│   │   ├── services/        # API services
│   │   ├── composables/     # Custom composables
│   │   ├── router/          # Vue Router config
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   ├── package.json
│   └── vite.config.ts
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utility functions
│   ├── package.json
│   └── server.js
├── shared/                  # Shared types and utilities
│   ├── types/              # TypeScript interfaces
│   └── utils/              # Common utilities
└── docker-compose.yml       # Docker configuration
```

### **Backend API Setup**
```typescript
// backend/src/server.js
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { connectDB } from './config/database.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
app.use('/api/', limiter)

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Logging
app.use(morgan('combined'))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Error handling
app.use(errorHandler)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Start server
const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
```

### **Database Models**
```typescript
// backend/src/models/User.js
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject()
  delete user.password
  return user
}

export default mongoose.model('User', userSchema)
```

### **API Controllers**
```typescript
// backend/src/controllers/userController.js
import User from '../models/User.js'
import { generateToken } from '../utils/jwt.js'

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Create user
    const user = await User.create({ name, email, password })
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      data: {
        user,
        token
      }
    })
  } catch (error) {
    next(error)
  }
}

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    const token = generateToken(user._id)

    res.json({
      success: true,
      data: {
        user,
        token
      }
    })
  } catch (error) {
    next(error)
  }
}

export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query

    const query = search
      ? { name: { $regex: search, $options: 'i' } }
      : {}

    const users = await User.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await User.countDocuments(query)

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    })
  } catch (error) {
    next(error)
  }
}
```

## 🌐 **Frontend Integration**

### **API Service with Authentication**
```typescript
// frontend/src/services/api.ts
import axios from 'axios'

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

class ApiService {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.token = localStorage.getItem('token')

    // Set up axios instance
    this.setupAxios()
  }

  private setupAxios() {
    axios.defaults.baseURL = this.baseURL
    axios.defaults.timeout = 10000

    // Request interceptor
    axios.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken()
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  setToken(token: string) {
    this.token = token
    localStorage.setItem('token', token)
  }

  clearToken() {
    this.token = null
    localStorage.removeItem('token')
  }

  async get<T>(url: string): Promise<ApiResponse<T>> {
    const response = await axios.get(url)
    return response.data
  }

  async post<T>(url: string, data: any): Promise<ApiResponse<T>> {
    const response = await axios.post(url, data)
    return response.data
  }

  async put<T>(url: string, data: any): Promise<ApiResponse<T>> {
    const response = await axios.put(url, data)
    return response.data
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await axios.delete(url)
    return response.data
  }
}

export const api = new ApiService(import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
```

### **File Upload Component**
```vue
<template>
  <div class="file-upload">
    <div
      class="upload-area"
      :class="{ 'drag-over': isDragOver, 'uploading': uploading }"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="multiple"
        @change="handleFileSelect"
        class="file-input"
      />

      <div v-if="!uploading" class="upload-content">
        <div class="upload-icon">📁</div>
        <p>Drop files here or click to select</p>
        <p class="upload-hint">{{ acceptText }}</p>
      </div>

      <div v-else class="upload-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
        </div>
        <p>Uploading... {{ progress }}%</p>
      </div>
    </div>

    <div v-if="uploadedFiles.length > 0" class="uploaded-files">
      <h4>Uploaded Files:</h4>
      <ul>
        <li v-for="file in uploadedFiles" :key="file.id" class="file-item">
          <span class="file-name">{{ file.name }}</span>
          <span class="file-size">{{ formatFileSize(file.size) }}</span>
          <button @click="removeFile(file.id)" class="remove-btn">×</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { api } from '@/services/api'

interface UploadedFile {
  id: string
  name: string
  size: number
  url: string
}

interface Props {
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  onUpload?: (files: UploadedFile[]) => void
}

const props = withDefaults(defineProps<Props>(), {
  accept: '*/*',
  multiple: false,
  maxSize: 10
})

const emit = defineEmits<{
  upload: [files: UploadedFile[]]
  error: [message: string]
}>()

// State
const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)
const uploading = ref(false)
const progress = ref(0)
const uploadedFiles = ref<UploadedFile[]>([])

// Computed
const acceptText = computed(() => {
  if (props.accept === '*/*') return 'Any file type'
  return `Accepted: ${props.accept}`
})

// Methods
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    handleFiles(Array.from(target.files))
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false

  if (event.dataTransfer?.files) {
    handleFiles(Array.from(event.dataTransfer.files))
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleFiles = async (files: File[]) => {
  // Validate files
  for (const file of files) {
    if (file.size > props.maxSize * 1024 * 1024) {
      emit('error', `File ${file.name} is too large. Maximum size is ${props.maxSize}MB.`)
      return
    }
  }

  uploading.value = true
  progress.value = 0

  try {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })

    const response = await api.post<UploadedFile[]>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          progress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        }
      }
    })

    uploadedFiles.value.push(...response.data)
    emit('upload', response.data)
    props.onUpload?.(response.data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    emit('error', message)
  } finally {
    uploading.value = false
    progress.value = 0
  }
}

const removeFile = (fileId: string) => {
  uploadedFiles.value = uploadedFiles.value.filter(file => file.id !== fileId)
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>
```

### **Real-time Features with WebSockets**
```typescript
// frontend/src/composables/useWebSocket.ts
import { ref, onMounted, onUnmounted } from 'vue'

interface WebSocketMessage {
  type: string
  data: any
  timestamp: string
}

export function useWebSocket(url: string) {
  const socket = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const messages = ref<WebSocketMessage[]>([])
  const error = ref<string | null>(null)

  const connect = () => {
    try {
      socket.value = new WebSocket(url)

      socket.value.onopen = () => {
        isConnected.value = true
        error.value = null
        console.log('WebSocket connected')
      }

      socket.value.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          messages.value.push(message)
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err)
        }
      }

      socket.value.onclose = () => {
        isConnected.value = false
        console.log('WebSocket disconnected')
      }

      socket.value.onerror = (err) => {
        error.value = 'WebSocket connection error'
        console.error('WebSocket error:', err)
      }
    } catch (err) {
      error.value = 'Failed to create WebSocket connection'
      console.error('WebSocket creation error:', err)
    }
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.close()
      socket.value = null
    }
  }

  const send = (message: any) => {
    if (socket.value && isConnected.value) {
      socket.value.send(JSON.stringify(message))
    }
  }

  const subscribe = (type: string, callback: (data: any) => void) => {
    const unsubscribe = () => {
      // Remove listener logic here
    }

    // Add listener logic here
    return unsubscribe
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
    error,
    connect,
    disconnect,
    send,
    subscribe
  }
}

// Usage in component
<script setup lang="ts">
import { useWebSocket } from '@/composables/useWebSocket'

const { isConnected, messages, send, subscribe } = useWebSocket('ws://localhost:5000')

// Subscribe to specific message types
const unsubscribe = subscribe('notification', (data) => {
  console.log('Notification received:', data)
})

// Send message
const sendMessage = () => {
  send({
    type: 'chat',
    data: { message: 'Hello!' }
  })
}
</script>
```

## 🚀 **Production Deployment**

### **Docker Configuration**
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://backend:5000/api

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/vueapp
      - JWT_SECRET=your-jwt-secret

  mongodb:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

### **Environment Configuration**
```typescript
// frontend/src/config/env.ts
interface EnvConfig {
  API_URL: string
  WS_URL: string
  APP_NAME: string
  VERSION: string
}

const config: EnvConfig = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:5000',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Vue App',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0'
}

export default config
```

### **Build Optimization**
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          ui: ['@headlessui/vue', '@heroicons/vue']
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

## 🎯 **Quick Tips**

1. **Use environment variables** for configuration
2. **Implement proper error handling** throughout the stack
3. **Use Docker** for consistent deployment
4. **Implement health checks** for monitoring
5. **Use HTTPS** in production
6. **Implement rate limiting** to prevent abuse
7. **Use database indexes** for better performance
8. **Implement logging** for debugging
9. **Use CDN** for static assets
10. **Monitor application performance** in production

## 📚 **Next Steps**

- CI/CD pipeline setup
- Monitoring and logging
- Performance optimization
- Security hardening
- Testing strategies
