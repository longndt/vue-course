# Lesson 5: Full-Stack Integration & Production Deployment

## Overview

In this lesson, you'll learn how to build complete full-stack applications by integrating Vue 3 with backend services, implementing real-time features, and deploying to production. We'll cover professional deployment strategies and production-ready optimizations.

## Learning Objectives

After this lesson, you will be able to:

- Design full-stack application architectures
- Integrate Vue 3 with Node.js/Express/MongoDB backends
- Implement file upload and media management systems
- Build real-time features with WebSockets and Server-Sent Events
- Optimize Vue 3 applications for production performance
- Deploy full-stack applications using modern CI/CD pipelines
- Set up monitoring, logging, and error tracking
- Configure environment management for different deployment stages

## 1. Full-Stack Architecture Patterns

### Monolithic vs Microservices Architecture

```
Modern VENM Stack:
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│    Vue 3    │    │   Node.js    │    │   MongoDB   │
│  Frontend   │────│   Express    │────│  Database   │
└─────────────┘    └──────────────┘    └─────────────┘
```

### Integration with Node.js/Express Backends

```javascript
// API Client Configuration for Node.js Integration
class NodeApiClient {
│              Database           │
└─────────────────────────────────┘

Modern Microservices:
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│    Vue 3    │    │   API        │    │   Auth      │
│  Frontend   │────│  Gateway     │────│  Service    │
└─────────────┘    └──────────────┘    └─────────────┘
                            │
                   ┌─────────────────┐
                   │  User Service   │
                   │ File Service    │
                   │Notification Svc │
                   └─────────────────┘
```

### Integration with Node.js/Express Backends

````typescript
### Integration with Node.js/Express Backends

```javascript
// API Client Configuration for Node.js Integration
class NodeApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // CRUD Operations
  async getUsers() {
    return this.request('/api/users');
  }

  async createUser(userData) {
    return this.request('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id, userData) {
    return this.request(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/api/users/${id}`, {
      method: 'DELETE',
    });
  }
}

// Usage in Vue 3 Components
const apiClient = new NodeApiClient("http://localhost:5000");
````

## 🔍 **Knowledge Checkpoint 1**

Before building full-stack integrations, ensure you understand:

1. **What's the difference between monolithic and microservices architecture?**
2. **How does a Vue 3 frontend communicate with a Node.js backend?**
3. **Why do we need error handling in API client classes?**
4. **What are the benefits of using environment variables for API URLs?**

_💡 Full-stack development connects frontend and backend - think of it as building a bridge between two cities!_

---

## 2. File Upload and Media Management

### Advanced File Upload with Progress Tracking

```typescript
// Vue 3 Composition API for File Upload
import { ref, type Ref } from 'vue'

interface FileUploadComposable {
  upload: (file: File) => Promise<string>;
  progress: Ref<number>;
  isUploading: Ref<boolean>;
  error: Ref<string | null>;
}

export function useFileUpload(endpoint: string): FileUploadComposable {
  const progress = ref(0);
  const isUploading = ref(false);
  const error = ref<string | null>(null);

  const upload = async (file: File): Promise<string> => {
    isUploading.value = true;
    progress.value = 0;
    error.value = null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("timestamp", Date.now().toString());
    formData.append("originalName", file.name);

    try {
      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        // Track upload progress
        xhr.upload.addEventListener('progress', (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            progress.value = percentCompleted;
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            try {
              const result = JSON.parse(xhr.responseText);
              progress.value = 100;
              isUploading.value = false;
              resolve(result.fileUrl);
            } catch (parseError) {
              error.value = 'Failed to parse response';
              isUploading.value = false;
              reject(parseError);
            }
          } else {
            error.value = `Upload failed: ${xhr.statusText}`;
            isUploading.value = false;
            reject(new Error(`Upload failed: ${xhr.statusText}`));
          }
        });

        xhr.addEventListener('error', () => {
          error.value = 'Network error occurred';
          isUploading.value = false;
          reject(new Error('Network error occurred'));
        });

        xhr.open('POST', endpoint);
        xhr.send(formData);
      });
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Upload failed";
      isUploading.value = false;
      throw err;
    }
  };

  return { upload, progress, isUploading, error };
}

// Multi-file upload Vue component
<template>
  <div class="multi-file-uploader">
    <div
      class="drop-zone"
      @drop="handleDrop"
      @dragover.prevent
      @dragenter.prevent
    >
      <input
        type="file"
        multiple
        @change="handleFileSelect"
        accept="image/*,application/pdf,.doc,.docx"
      />
      <p>Drag & drop files here or click to select</p>
    </div>

    <div v-if="files.length > 0" class="file-list">
      <div v-for="file in files" :key="file.name" class="file-item">
        {{ file.name }}
        <progress :value="progress" max="100" v-if="isUploading"></progress>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  onUploadComplete: (urls: string[]) => void;
}

const props = defineProps<Props>();

const files = ref<File[]>([]);
const uploadedUrls = ref<string[]>([]);
const { upload, progress, isUploading } = useFileUpload("/api/upload");

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  const droppedFiles = Array.from(event.dataTransfer?.files || []);
  files.value = [...files.value, ...droppedFiles];
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const selectedFiles = Array.from(target.files);
    files.value = [...files.value, ...selectedFiles];
  }
};

const uploadFiles = async () => {
  const urls: string[] = [];

  for (const file of files.value) {
    try {
      const url = await upload(file);
      urls.push(url);
    } catch (error) {
      console.error(`Failed to upload ${file.name}:`, error);
    }
  }

  uploadedUrls.value = urls;
  props.onUploadComplete(urls);
  };

  return (
    <div class="upload-area">
      <FileDropzone @drop="handleDrop" />
      <FilePreviewList :files="files" />
      <button
        v-if="files.length > 0"
        @click="uploadFiles"
        :disabled="isUploading"
      >
        {{ isUploading ? `Uploading... ${progress}%` : "Upload Files" }}
      </button>
    </div>
  );
}
```

## 3. Real-Time Features with WebSockets

### WebSocket Integration for Live Updates

```typescript
// Vue 3 WebSocket composable for real-time features
import { ref, onMounted, onUnmounted, type Ref } from 'vue'

type ConnectionStatus = "connecting" | "open" | "closed";

interface WebSocketComposable<T> {
  socket: Ref<WebSocket | null>;
  lastMessage: Ref<T | null>;
  connectionStatus: Ref<ConnectionStatus>;
  sendMessage: (message: any) => void;
}

export function useWebSocket<T>(url: string): WebSocketComposable<T> {
  const socket = ref<WebSocket | null>(null);
  const lastMessage = ref<T | null>(null);
  const connectionStatus = ref<ConnectionStatus>("connecting");

  onMounted(() => {
    const ws = new WebSocket(url);
    socket.value = ws;

    ws.onopen = () => {
      connectionStatus.value = "open";
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        lastMessage.value = message;
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      connectionStatus.value = "closed";
      console.log("WebSocket disconnected");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  });

  onUnmounted(() => {
    if (socket.value) {
      socket.value.close();
    }
  });

  const sendMessage = (message: any) => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      socket.value.send(JSON.stringify(message));
    }
  };

  return {
    socket,
    lastMessage,
    sendMessage,
    connectionStatus,
  };
}

// Real-time chat Vue component
<template>
  <div class="chat-container">
    <div class="connection-status">
      {{ connectionStatus === "open" ? "🟢 Connected" : "🔴 Disconnected" }}
    </div>

    <div class="messages">
      <ChatBubble
        v-for="(message, index) in messages"
        :key="index"
        :message="message"
      />
    </div>

    <div class="input-area">
      <input
        v-model="newMessage"
        @keyup.enter="handleSendMessage"
        :disabled="connectionStatus !== 'open'"
        placeholder="Type a message..."
      />
      <button
        @click="handleSendMessage"
        :disabled="connectionStatus !== 'open'"
      >
        Send
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { getCurrentUser } from '@/utils/auth'

interface ChatMessage {
  text: string;
  userId: string;
  timestamp: string;
}

const messages = ref<ChatMessage[]>([]);
const newMessage = ref("");
const { lastMessage, sendMessage, connectionStatus } = useWebSocket<ChatMessage>(
  "ws://localhost:8080/chat"
);

watch(lastMessage, (newLastMessage) => {
  if (newLastMessage) {
    messages.value.push(newLastMessage);
  }
});

const handleSendMessage = () => {
  if (newMessage.value.trim() && connectionStatus.value === "open") {
    sendMessage({
      text: newMessage.value,
      userId: getCurrentUser().id,
      timestamp: new Date().toISOString(),
    });
    newMessage.value = "";
  }
};
</script>
        />
        <button @click="handleSendMessage" :disabled="!isConnected">
          Send
        </button>
      </div>
    </div>
  );
}
```

## 1. Performance Optimization

### Understanding Vue Performance

Vue apps can become slow due to:

1. Large bundle sizes
2. Unnecessary re-renders
3. Unoptimized images
4. Heavy computations

### Code Splitting

Break your app into smaller chunks:

```vue
<!-- Before - everything in one bundle -->
<template>
  <BigComponent />
</template>

<script setup>
import BigComponent from "./BigComponent.vue";
</script>

<!-- After - split into chunks with dynamic imports -->
<template>
  <Suspense>
    <template #default>
      <BigComponent />
    </template>
    <template #fallback>
      <Loading />
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import Loading from './Loading.vue'

const BigComponent = defineAsyncComponent(() => import('./BigComponent.vue'))
</script>
```

### Preventing Re-renders

Use Vue's reactive optimizations for components that render often:

```vue
<!-- Vue components are automatically optimized with reactive system -->
<!-- No need for manual memoization - Vue handles this efficiently -->

<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <span>{{ rating }}/10</span>
  </div>
</template>

<script setup>
interface Props {
  title: string;
  rating: number;
}

// Props are automatically reactive and optimized
defineProps<Props>();
</script>

<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <span>{{ rating }}/10</span>
  </div>
</template>
```

### Optimizing Images

```vue
<!-- Bad - full-size image loaded -->
<img src="large-image.jpg" />

<!-- Better - responsive images -->
<template>
  <picture>
    <source
      media="(min-width: 800px)"
      srcset="large-image.jpg"
    />
    <source
      media="(min-width: 400px)"
      srcset="medium-image.jpg"
    />
    <img src="small-image.jpg" alt="Description" />
  </picture>
</template>
```

## 2. Performance Monitoring

### Using Vue DevTools

```vue
<!-- Add component names for profiling -->
<template>
  <header>
    <!-- Header content -->
  </header>
</template>

<script setup>
// Component automatically has name based on filename
// Use Vue DevTools to profile component performance

// For measuring render times, use onMounted/onUpdated
import { onMounted, onUpdated } from 'vue'

onMounted(() => {
  console.time('Component Mount')
  console.timeEnd('Component Mount')
})

onUpdated(() => {
  console.time('Component Update')
  console.timeEnd('Component Update')
})
</script>
```

```typescript
// Slow component example for profiling
// SlowComponent.vue
  console.time("SlowComponent render");
  // ... component logic
  console.timeEnd("SlowComponent render");
  return <div>...</div>;
}
```

### Web Vitals Monitoring

```typescript
import { getCLS, getFID, getLCP } from "web-vitals";

// Vue 3 Web Vitals monitoring
function reportWebVitals({ name, value }: { name: string, value: number }) {
  console.log(`${name}: ${value}`);
  // Send to analytics service
  if (import.meta.env.PROD) {
    // Send to your analytics service
    fetch('/api/vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, value, timestamp: Date.now() })
    });
  }
}

// Initialize web vitals monitoring
getCLS(reportWebVitals);
getFID(reportWebVitals);
getLCP(reportWebVitals);
```

## 3. Deployment Process

### 1. Build Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    // Generate source maps
    sourcemap: true,

    // Split chunks
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["vue", "vue-router"],
          // Split large dependencies
          utils: ["date-fns", "lodash"],
        },
      },
    },
  },
});
```

### 2. Environment Variables

```bash
# .env
VITE_API_URL=https://api.example.com
VITE_GA_ID=UA-XXXXX-Y

# .env.production
VITE_API_URL=https://api.production.com
VITE_GA_ID=UA-PROD-Y
```

```typescript
// Usage in Vue components
<script setup>
const apiUrl = import.meta.env.VITE_API_URL;
const gaId = import.meta.env.VITE_GA_ID;

console.log('API URL:', apiUrl);
</script>
```

### 3. Deployment Scripts

```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview",
    "deploy:vercel": "vercel",
    "deploy:netlify": "netlify deploy --prod"
  }
}
```

## 4. Production Deployment Strategies

### Container-Based Deployment with Docker

```dockerfile
# Frontend Dockerfile
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

```dockerfile
# Backend Dockerfile (Node.js)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### CI/CD Pipeline with GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy Full-Stack Application

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # Deploy Frontend
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

      # Deploy Backend
      - name: Deploy to Railway
        uses: railwayapp/cli@v2
        with:
          token: ${{ secrets.RAILWAY_TOKEN }}
          command: deploy

      # Update Database
      - name: Run Database Migrations
        run: |
          npm run migrate:prod
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Environment Configuration Management

```typescript
// config/environment.ts
interface EnvironmentConfig {
  API_BASE_URL: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  UPLOAD_BUCKET: string;
  WEBSOCKET_URL: string;
  PAYMENT_KEY: string;
}

const environments = {
  development: {
    API_BASE_URL: "http://localhost:3000/api",
    DATABASE_URL: "postgresql://localhost:5432/dev_db",
    JWT_SECRET: "dev-secret",
    UPLOAD_BUCKET: "dev-uploads",
    WEBSOCKET_URL: "ws://localhost:8080",
    PAYMENT_KEY: "pk_test_...",
  },
  staging: {
    API_BASE_URL: "https://staging-api.yourapp.com",
    DATABASE_URL: process.env.STAGING_DATABASE_URL!,
    JWT_SECRET: process.env.STAGING_JWT_SECRET!,
    UPLOAD_BUCKET: "staging-uploads",
    WEBSOCKET_URL: "wss://staging-ws.yourapp.com",
    PAYMENT_KEY: process.env.STAGING_PAYMENT_KEY!,
  },
  production: {
    API_BASE_URL: "https://api.yourapp.com",
    DATABASE_URL: process.env.DATABASE_URL!,
    JWT_SECRET: process.env.JWT_SECRET!,
    UPLOAD_BUCKET: "prod-uploads",
    WEBSOCKET_URL: "wss://ws.yourapp.com",
    PAYMENT_KEY: process.env.PAYMENT_KEY!,
  },
};

export const config =
  environments[process.env.NODE_ENV as keyof typeof environments] ||
  environments.development;
```

### Monitoring and Analytics Setup

```typescript
// monitoring/logger.ts
import * as Sentry from "@sentry/vue";

// Initialize Sentry for error tracking
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});

// Custom logger
export class Logger {
  static info(message: string, extra?: any) {
    console.log(`[INFO] ${message}`, extra);
    // Send to logging service
    this.sendToService("info", message, extra);
  }

  static error(message: string, error?: Error, extra?: any) {
    console.error(`[ERROR] ${message}`, error, extra);
    Sentry.captureException(error || new Error(message), {
      extra,
      tags: {
        component: "frontend",
      },
    });
  }

  static performance(metricName: string, duration: number) {
    console.log(`[PERF] ${metricName}: ${duration}ms`);
    // Send to analytics service
    analytics.track(metricName, { duration });
  }

  private static sendToService(level: string, message: string, extra?: any) {
    // Integration with external logging service
    fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        level,
        message,
        timestamp: new Date().toISOString(),
        extra,
      }),
    });
  }
}

// Vue 3 Performance monitoring composable
import { onMounted, onUnmounted } from 'vue'

export function usePerformanceMonitoring(componentName: string) {
  let startTime: number;

  onMounted(() => {
    startTime = Date.now();
  });

  onUnmounted(() => {
    const endTime = Date.now();
    Logger.performance(`${componentName}_render_time`, endTime - startTime);
  });
}
```

## Lab Exercises

### Exercise 1: Full-Stack Architecture Setup

1. Design application architecture diagram
2. Set up development environment with Docker
3. Configure API gateway and microservices
4. Implement service discovery
5. Set up database connections (MongoDB)

### Exercise 2: File Upload System

1. Build multi-file upload component with drag & drop
2. Implement server-side upload handling (Node.js/Express)
3. Add image processing and thumbnail generation
4. Create file management dashboard
5. Implement secure file serving with authentication

### Exercise 3: Real-Time Features

1. Set up WebSocket server (Socket.io or native WebSockets)
2. Build real-time chat system
3. Implement live notifications
4. Add real-time data synchronization
5. Create collaborative editing features

### Exercise 4: Production Deployment Pipeline

1. Set up CI/CD pipeline with GitHub Actions
2. Configure containerization with Docker
3. Deploy to cloud platform (Vercel, Netlify, or AWS)
4. Set up monitoring and logging
5. Configure automatic scaling and load balancing

### Final Project: Complete E-Learning Platform

Build a comprehensive platform with:

- User authentication and role management
- Course management with file uploads
- Real-time discussion forums
- Live streaming integration
- Payment processing
- Analytics dashboard
- Mobile-responsive design

## Project Structure

```
src/
├── components/
│   ├── LazyComponent.vue
│   └── OptimizedList.vue
├── hooks/
│   └── usePerformance.js
├── utils/
│   ├── monitoring.js
│   └── optimization.js
└── config/
    ├── build.js
    └── deploy.js
```

## Additional Resources

- [Vue Performance Guide](https://vuejs.org/guide/best-practices/performance.html)
- [Web Vitals](https://web.dev/vitals/)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)

## 📊 **Final Knowledge Assessment**

Complete this self-assessment to validate your full-stack development skills:

### **Full-Stack Architecture (Must Know)**

- [ ] I understand how Vue communicates with Node.js backends
- [ ] I can design API endpoints for CRUD operations
- [ ] I know how to handle file uploads and media management
- [ ] I can implement proper error handling across the stack

### **Real-Time Features (Good to Know)**

- [ ] I understand WebSockets for real-time communication
- [ ] I can implement live data updates in Vue components
- [ ] I know how to handle connection states and reconnection
- [ ] I understand when to use WebSockets vs polling

### **Production Deployment (Must Know)**

- [ ] I can build and optimize Vue apps for production
- [ ] I understand environment variables and configuration management
- [ ] I know how to deploy to cloud platforms (Vercel, Netlify, etc.)
- [ ] I can set up basic CI/CD pipelines

### **Performance & Monitoring (Important to Know)**

- [ ] I can identify and fix performance bottlenecks
- [ ] I know how to implement lazy loading and code splitting
- [ ] I understand how to monitor application performance
- [ ] I can set up error tracking and logging

**🎯 Goal: Check at least 12/16 items to be ready for final projects**

### **Self-Reflection Questions**

1. What's the most complex part of full-stack development for you?
2. How would you deploy a production application?
3. What monitoring and error tracking would be essential for your application?

---

## 🎓 **Course Complete!**

**Congratulations!** You've completed the Modern Vue 3 Development Course. You now have the skills to:

- Build professional Vue 3 applications with TypeScript
- Integrate with Node.js/Express/MongoDB backends
- Implement authentication and routing
- Deploy production-ready applications
- Follow industry best practices and patterns

**Ready for Professional Development?** You have all the tools needed to build impressive, scalable applications that will stand out in your portfolio.

**What's Next?**

- Apply these skills to your own projects
- Contribute to open source Vue projects
- Build and deploy your own full-stack applications
- Stay updated with the Vue ecosystem

## Homework

1. Optimize Your Project

   - Profile your application
   - Implement performance improvements
   - Measure improvements
   - Document optimizations

2. Set Up Deployment

   - Choose a hosting platform
   - Configure automatic deployment
   - Set up monitoring
   - Add error tracking

3. Create Documentation
   - Performance optimization guide
   - Deployment instructions
   - Monitoring setup
   - Troubleshooting guide
