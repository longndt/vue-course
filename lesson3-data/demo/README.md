# Lesson 3 Demo: Vue 3 + Node.js + MongoDB Integration

This demo shows how to integrate a Vue 3 frontend with a Node.js/Express backend and MongoDB database using modern tools and patterns.

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB (local installation or MongoDB Atlas)
- VS Code with Vue 3 and Node.js extensions

### Installation

1. **Install frontend dependencies:**

   ```bash
   npm install
   ```

2. **Install backend dependencies:**

   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Set up MongoDB:**

   - Local: Start MongoDB service
   - Cloud: Create MongoDB Atlas cluster and get connection string

4. **Environment setup:**

   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   ```

5. **Run the application:**

   ```bash
   # Start backend (in one terminal)
   cd server
   npm start

   # Start frontend (in another terminal)
   npm run dev
   ```

   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## Project Structure

```
demo/
├── server/                 # Node.js/Express backend
│   ├── index.js           # Server entry point
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── package.json       # Backend dependencies
├── src/                   # Vue 3 frontend
│   ├── components/        # Vue components
│   │   ├── TaskList.vue   # Task display component
│   │   └── TaskForm.vue   # Task form component
│   ├── App.vue           # Main application component
│   ├── App.css           # Application styles
│   ├── main.ts           # Application entry point
│   └── index.css         # Global styles
├── package.json          # Frontend dependencies
├── vite.config.js        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── index.html           # HTML template
```

## Features Demonstrated

- **Backend (Node.js/Express/MongoDB):**

  - RESTful API endpoints
  - MongoDB integration with Mongoose
  - CRUD operations
  - Error handling middleware
  - CORS configuration
  - ES modules support

- **Frontend (Vue 3):**
  - Vue Query (@tanstack/vue-query) for server state management
  - Composition API with `<script setup>` syntax
  - TypeScript integration
  - Reactive data binding
  - Loading states and error handling
  - Form handling with validation
  - Responsive UI components
  - Modern CSS with custom properties

## Technologies Used

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **Vue Query** - Data fetching and state management
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Key Vue 3 Concepts

### Composition API
```vue
<script setup lang="ts">
import { ref, reactive } from 'vue';

// Reactive state
const tasks = ref([]);
const isLoading = ref(false);

// Reactive object
const form = reactive({
  title: '',
  description: '',
  priority: 'medium'
});
</script>
```

### Vue Query Integration
```vue
<script setup lang="ts">
import { useQuery, useMutation } from '@tanstack/vue-query';

// Fetch data
const { data: tasks, isLoading } = useQuery({
  queryKey: ['tasks'],
  queryFn: fetchTasks
});

// Create mutation
const { mutate: createTask } = useMutation({
  mutationFn: createTaskAPI,
  onSuccess: () => {
    // Invalidate and refetch
  }
});
</script>
```

### Template Syntax
```vue
<template>
  <div class="task-list">
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>
      <div v-for="task in tasks" :key="task._id" class="task-card">
        <h3>{{ task.title }}</h3>
        <button @click="updateTask(task)">Update</button>
      </div>
    </div>
  </div>
</template>
```

## Learning Objectives

By completing this lesson, you will understand:

1. **Vue 3 Modern Development**
   - Composition API and `<script setup>` syntax
   - Reactive state management
   - TypeScript integration

2. **Server State Management**
   - Vue Query for data fetching
   - Cache management and invalidation
   - Loading states and error handling

3. **Full-Stack Integration**
   - API design and implementation
   - Frontend-backend communication
   - Error handling across the stack

4. **Modern Tooling**
   - Vite for fast development
   - TypeScript for type safety
   - ES modules for clean imports

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure both servers are running and CORS is configured
2. **MongoDB Connection**: Check MongoDB service and connection string
3. **Port Conflicts**: Update ports in configuration if already in use
4. **TypeScript Errors**: Ensure all dependencies are installed

### Development Tips

- Use Vue DevTools for debugging
- Check browser console for errors
- Monitor network requests in DevTools
- Use TypeScript for better development experience
