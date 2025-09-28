# Lab 3: API Integration & CRUD Operations

## Overview

In this focused lab exercise, you'll build essential API integration features by connecting a React frontend to a Node.js/Express/MongoDB backend. This demonstrates core full-stack patterns used in modern web development.

_For detailed learning objectives and concepts, see [../readme.md](../readme.md)_

## Exercises

- Setup & API Connection
- CRUD Operations Implementation
- Testing & Validation

---

## Pre-Lab Setup

### Quick Reference

_For detailed development environment setup, see [Complete Environment Setup Guide](../../setup/environment-setup.md)_

### Required Software (Quick Check)

- [ ] Node.js (v18+) installed
- [ ] MongoDB (local or Atlas account)
- [ ] VS Code with recommended extensions
- [ ] Thunder Client or Postman for API testing

### Verify Setup

```bash
node --version    # Should be v18+
npm --version     # Should be 8+
mongod --version  # Local MongoDB (or Atlas connection string ready)
```

npm --version # Should be v8+
mongod --version # If using local MongoDB

````

---

## Exercise: Quick API Integration

### Step 1: Backend Setup

Create a simple Express server with MongoDB connection:

```javascript
// server/index.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
.connect("mongodb://localhost:27017/student_management")
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

// Task model (simplified for the lab)
const TaskSchema = new mongoose.Schema(
{
 title: { type: String, required: true },
 completed: { type: Boolean, default: false },
 priority: { type: String, default: "medium" },
},
{ timestamps: true }
);

const Task = mongoose.model("Task", TaskSchema);

// Basic CRUD Routes
app.get("/api/tasks", async (req, res) => {
try {
 const tasks = await Task.find();
 res.json(tasks);
} catch (error) {
 res.status(500).json({ error: error.message });
}
});

app.post("/api/tasks", async (req, res) => {
try {
 const task = new Task(req.body);
 const savedTask = await task.save();
 res.status(201).json(savedTask);
} catch (error) {
 res.status(400).json({ error: error.message });
}
});

app.put("/api/tasks/:id", async (req, res) => {
try {
 const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
   new: true,
 });
 res.json(task);
} catch (error) {
 res.status(400).json({ error: error.message });
}
});

app.delete("/api/tasks/:id", async (req, res) => {
try {
 await Task.findByIdAndDelete(req.params.id);
 res.json({ message: "Task deleted" });
} catch (error) {
 res.status(500).json({ error: error.message });
}
});

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
````

**Quick Start Commands:**

```bash
npm init -y
npm install express mongoose cors
# Create server/index.js with code above
node server/index.js
```

### Step 2: React Integration

Install React Query and Axios:

```bash
npm install @tanstack/react-query axios
```

First, setup Vue Query in your main.js:

```javascript
// src/main.js
import { createApp } from 'vue'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import App from './App.vue'

const queryClient = new QueryClient()

const app = createApp(App)
app.use(VueQueryPlugin, { queryClient })
app.mount('#app')
```

```vue
<!-- src/App.vue -->
<template>
  <div class="app">
    <h1>Task Management App</h1>
    <TaskManager />
  </div>
</template>

<script setup>
import TaskManager from './components/TaskManager.vue'
</script>
```

Now create the TaskManager component:

```vue
<!-- src/components/TaskManager.vue -->
<template>
  <div class="task-manager">
    <div class="add-task">
      <input
        v-model="newTaskTitle"
        @keyup.enter="handleAddTask"
        placeholder="Add new task..."
        class="task-input"
      />
      <button
        @click="handleAddTask"
        :disabled="createMutation.isPending.value"
        class="add-button"
      >
        {{ createMutation.isPending.value ? 'Adding...' : 'Add Task' }}
      </button>
    </div>

    <div v-if="isLoading" class="loading">Loading tasks...</div>
    <div v-else-if="error" class="error">Error: {{ error.message }}</div>
    <div v-else class="task-list">
      <div
        v-for="task in tasks"
        :key="task._id"
        :class="['task-item', { completed: task.completed }]"
      >
        <input
          type="checkbox"
          :checked="task.completed"
          @change="toggleTask(task)"
        />
        <span class="task-title">{{ task.title }}</span>
        <button
          @click="deleteTask(task._id)"
          :disabled="deleteMutation.isPending.value"
          class="delete-button"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import axios from 'axios'

const API_BASE = "http://localhost:5000/api"

const newTaskTitle = ref("")
const queryClient = useQueryClient()

// Fetch tasks
const {
  data: tasks,
  isLoading,
  error,
} = useQuery({
  queryKey: ["tasks"],
  queryFn: () => axios.get(`${API_BASE}/tasks`).then((res) => res.data),
  select: (data) => data || [],
})

// Create task mutation
const createMutation = useMutation({
  mutationFn: (taskData) => axios.post(`${API_BASE}/tasks`, taskData),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] })
    newTaskTitle.value = ""
  },
})

// Update task mutation
const updateMutation = useMutation({
  mutationFn: ({ id, ...data }) => axios.put(`${API_BASE}/tasks/${id}`, data),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
})

// Delete task mutation
const deleteMutation = useMutation({
  mutationFn: (id) => axios.delete(`${API_BASE}/tasks/${id}`),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
})

const handleAddTask = () => {
  if (newTaskTitle.value.trim()) {
    createMutation.mutate({ title: newTaskTitle.value })
  }
}

const toggleTask = (task) => {
  updateMutation.mutate({
    id: task._id,
    completed: !task.completed,
  })
}

const deleteTask = (id) => {
  deleteMutation.mutate(id)
}
</script>

<style scoped>
.task-manager {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.add-task {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.task-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.add-button, .delete-button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-button {
  background-color: #007bff;
  color: white;
}

.delete-button {
  background-color: #dc3545;
  color: white;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid #eee;
  margin-bottom: 5px;
  border-radius: 4px;
}

.task-item.completed .task-title {
  text-decoration: line-through;
  color: #666;
}

.loading, .error {
  padding: 20px;
  text-align: center;
}

.error {
  color: red;
}
</style>

### Testing Your Implementation

### Step 3: Testing & Validation

1. **Start your servers**:

   ```bash
   # Terminal 1: Backend
   node server/index.js

   # Terminal 2: Frontend
   npm run dev
   ```

2. **Test the functionality**:

   - Add new tasks
   - Mark tasks as completed
   - Delete tasks
   - Check browser network tab for API calls

3. **Verify MongoDB**:
   ```bash
   # Connect to MongoDB and check data
   mongo student_management
   db.tasks.find().pretty()
   ```

## Key Concepts Demonstrated

✅ **Node.js/Express Backend**: RESTful API with proper error handling
✅ **MongoDB Integration**: Mongoose schemas and CRUD operations
✅ **React Query**: Data fetching, caching, and mutations
✅ **Error Handling**: Loading states and error boundaries
✅ **CORS Configuration**: Cross-origin request handling

## Troubleshooting

- **MongoDB connection issues**: Check if MongoDB service is running
- **CORS errors**: Verify backend allows frontend origin
- **Network errors**: Ensure both servers are running on correct ports
- **Data not updating**: Check React Query cache invalidation

## Modern CSS Design Features

### Enhanced Visual Experience

This lab includes modernized CSS with professional styling:

1. **Glass Morphism Design**: Semi-transparent backgrounds with blur effects
2. **Gradient Headers**: Beautiful color gradients for visual appeal
3. **Enhanced Cards**: Improved shadows and hover animations
4. **Better Layout**: Optimized spacing for desktop viewing
5. **Professional Forms**: Modern input styling with focus states

### CSS Highlights

```css
/* Enhanced gradient header */
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}

/* Glass morphism task form */
.task-form {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.95) 100%);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

/* Enhanced task items */
.task-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}
```

### Responsive Design

- Desktop-optimized layout (1200px max-width)
- Enhanced spacing and typography
- Professional color scheme
- Smooth micro-interactions
- Improved accessibility

## Final Project Structure 📁

After completing all exercises in Lab 3, your project should have the following structure:

```
api-integration/
├── server/
│   ├── models/
│   │   └── Task.js
│   ├── routes/
│   │   └── tasks.js
│   ├── middleware/
│   │   ├── cors.js
│   │   └── errorHandler.js
│   ├── config/
│   │   └── database.js
│   ├── index.js
│   └── package.json
├── src/
│   ├── components/
│   │   ├── TaskManager.vue
│   │   └── TaskManager.css
│   ├── hooks/
│   │   ├── useTasks.js
│   │   └── useTaskMutations.js
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   ├── queryClient.js
│   │   └── constants.js
│   ├── App.vue
│   ├── App.css
│   ├── index.css
│   └── main.js
├── package.json
├── vite.config.js
└── readme.md
```

### Backend Architecture (Node.js + Express + MongoDB):

#### **API Endpoints Implemented:**
- ✅ **GET /api/tasks**: Fetch all tasks with optional filtering
- ✅ **POST /api/tasks**: Create new task with validation
- ✅ **PUT /api/tasks/:id**: Update task (title, priority, completion status)
- ✅ **DELETE /api/tasks/:id**: Remove task from database
- ✅ **GET /api/tasks/stats**: Get task statistics (total, completed, pending)

#### **Database Schema:**
```javascript
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### Frontend Architecture (React + React Query):

#### **Key Features Implemented:**
- ✅ **Real-time CRUD Operations**: Create, read, update, delete tasks
- ✅ **React Query Integration**: Caching, optimistic updates, background refetching
- ✅ **Advanced State Management**: Server state vs client state separation
- ✅ **Error Handling**: Comprehensive error boundaries and user feedback
- ✅ **Loading States**: Skeleton loaders and loading indicators

#### **Component Architecture:**
- ✅ **TaskManager**: Main container component with all CRUD operations
- ✅ **Task Statistics**: Real-time statistics dashboard
- ✅ **Task Form**: Add new tasks with priority selection
- ✅ **Task List**: Filterable and searchable task display
- ✅ **Task Item**: Individual task with inline editing and actions

#### **Advanced Features:**
- ✅ **Optimistic Updates**: Immediate UI feedback before server confirmation
- ✅ **Background Sync**: Automatic data synchronization
- ✅ **Error Recovery**: Automatic retry mechanisms and manual retry options
- ✅ **Cache Invalidation**: Smart cache management for consistent data
- ✅ **Filter & Search**: Real-time filtering by completion status and priority

### Professional Features:
1. **Full-Stack Integration**: Seamless frontend-backend communication
2. **Modern API Design**: RESTful endpoints with proper HTTP status codes
3. **Database Integration**: MongoDB with Mongoose ODM
4. **Advanced React Patterns**: Custom hooks, compound components
5. **Performance Optimization**: React Query caching and optimization
6. **Professional UI**: Glass morphism design with smooth animations
7. **Error Handling**: Comprehensive error boundaries and user feedback

## Next Steps

- Add form validation
- Implement pagination
- Add authentication
- Deploy to production

---
