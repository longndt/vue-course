# Quick Start Guide - Lesson 3

## Connect React to Node.js API

### 1. Setup Backend API

Create a simple Express server in a new terminal:

```bash
# In a new directory or subfolder
mkdir lesson3-api && cd lesson3-api

# Initialize and install dependencies
npm init -y
npm install e### 7. Update App Component

Update `src/App.vue`:

```vue
<template>
  <div class="App">
    <TaskManager />
  </div>
</template>

<script setup>
import TaskManager from './components/TaskManager.vue'
</script>

<style>
.App {
  text-align: center;
  padding: 20px;se cors dotenv

# Create server.js
```

Create `server.js`:

```javascript
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data (we'll use MongoDB later)
let tasks = [
  { id: 1, title: "Learn React", completed: false },
  { id: 2, title: "Build API", completed: true },
  { id: 3, title: "Connect Frontend", completed: false },
];

// Routes
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const newTask = {
    id: Date.now(),
    title: req.body.title,
    completed: false,
  };
  tasks.push(newTask);
  res.json(newTask);
});

app.put("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = req.body.completed;
    res.json(task);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

app.delete("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter((t) => t.id !== id);
  res.json({ message: "Task deleted" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 2. Start Your Backend

```bash
# Start the API server
node server.js
# Should show: Server running on port 5000
```

### 3. Setup Frontend with React Query

In your React app directory:

```bash
# Install React Query and Axios
npm install @tanstack/react-query axios

# Start your React app (in another terminal)
npm run dev
```

### 4. Create API Service

Create `src/services/api.js`:

```javascript
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export const api = {
  // Get all tasks
  getTasks: () => axios.get(`${API_BASE}/tasks`).then((res) => res.data),

  // Create new task
  createTask: (taskData) =>
    axios.post(`${API_BASE}/tasks`, taskData).then((res) => res.data),

  // Update task
  updateTask: (id, updates) =>
    axios.put(`${API_BASE}/tasks/${id}`, updates).then((res) => res.data),

  // Delete task
  deleteTask: (id) =>
    axios.delete(`${API_BASE}/tasks/${id}`).then((res) => res.data),
};
```

### 5. Setup React Query Provider

Update `src/main.js`:

```javascript
import { createApp } from 'vue'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import App from './App.vue'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

const app = createApp(App)

app.use(VueQueryPlugin, {
  queryClient
})

app.mount('#root')
```

### 6. Create Task Component

Create `src/components/TaskManager.vue`:

```vue
<template>
  <div class="task-manager">
    <h2>Task Manager</h2>

    <!-- Create Task Form -->
    <form @submit.prevent="handleCreateTask">
      <input
        v-model="newTaskTitle"
        placeholder="Enter task title..."
        required
      />
      <button type="submit" :disabled="createMutation.isPending.value">
        {{ createMutation.isPending.value ? 'Creating...' : 'Add Task' }}
      </button>
    </form>

    <!-- Loading State -->
    <div v-if="isLoading">Loading tasks...</div>

    <!-- Error State -->
    <div v-else-if="error" class="error">
      Error: {{ error.message }}
    </div>

    <!-- Tasks List -->
    <div v-else class="tasks-list">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="task-item"
      >
        <span>{{ task.title }}</span>
        <button
          @click="handleDeleteTask(task.id)"
          :disabled="deleteMutation.isPending.value"
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
import { api } from '../services/api'

const newTaskTitle = ref('')
const queryClient = useQueryClient()

// Fetch tasks
const {
  data: tasks,
  isLoading,
  error,
} = useQuery({
  queryKey: ['tasks'],
  queryFn: api.getTasks,
  select: (data) => data || [],
})

// Create task mutation
const createMutation = useMutation({
  mutationFn: api.createTask,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
    newTaskTitle.value = ''
  },
})

// Update task mutation
const updateMutation = useMutation({
  mutationFn: ({ id, updates }) => api.updateTask(id, updates),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
})

// Delete task mutation
const deleteMutation = useMutation({
  mutationFn: api.deleteTask,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
})

const handleCreateTask = () => {
  if (newTaskTitle.value.trim()) {
    createMutation.mutate({ title: newTaskTitle.value })
  }
}

const handleToggleTask = (task) => {
  updateMutation.mutate({
    id: task.id,
    updates: { completed: !task.completed },
  })
}

const handleDeleteTask = (taskId) => {
  deleteMutation.mutate(taskId)
}
</script>

<style scoped>
.task-manager {
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
}

.error {
  color: red;
  padding: 10px;
}

.tasks-list {
  margin-top: 20px;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 5px;
}
</style>

### 7. Update App Component

Update `src/App.vue`:

```vue
<template>
  <div class="App">
    <h1>Vue 3 + Node.js Integration</h1>
    <TaskManager />
  </div>
</template>

<script setup>
import TaskManager from './components/TaskManager.vue'
</script>

<style>

</style>
```

## 🎉 Congratulations!

You now have:

- ✅ A working Node.js Express API
- ✅ React frontend consuming the API
- ✅ React Query for professional data management
- ✅ Full CRUD operations working
- ✅ Real-time updates with optimistic UI

## Test Your Setup

1. Open your React app (http://localhost:5173)
2. Add some tasks - they should appear instantly
3. Toggle task completion - updates immediately
4. Delete tasks - removes from list
5. Refresh page - data persists (stored in server memory)

## Next Steps

1. Read the full [Lesson 3 README](./readme.md)
2. Replace mock data with MongoDB
3. Add error handling and loading states
4. Complete the lab exercises

## Need Help?

- Make sure both servers are running (React on 5173, API on 5000)
- Check browser network tab for API calls
- Verify CORS is working (no console errors)
