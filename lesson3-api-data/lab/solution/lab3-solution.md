# Lab 3 Solution - API Integration & CRUD Operations

## Complete Solution Structure

```
task-manager/
├── server/
│   ├── index.js
│   ├── models/
│   │   └── Task.js
│   └── routes/
│       └── tasks.js
├── src/
│   ├── components/
│   │   ├── TaskList.vue
│   │   └── TaskForm.vue
│   ├── composables/
│   │   └── useTasks.js
│   └── App.vue
└── package.json
```

---

## Complete Code Solutions

### server/index.js

```javascript
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/task_management')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err))

// Routes
app.use('/api/tasks', (await import('./routes/tasks.js')).default)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

### server/models/Task.js

```javascript
import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  },
  { timestamps: true }
)

export default mongoose.model('Task', taskSchema)
```

### server/routes/tasks.js

```javascript
import express from 'express'
import Task from '../models/Task.js'

const router = express.Router()

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 })
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }
    res.json(task)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST create task
router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body)
    const savedTask = await task.save()
    res.status(201).json(savedTask)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// PUT update task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }
    res.json(task)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// DELETE task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)
    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }
    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
```

### src/composables/useTasks.js

```javascript
import { ref, computed } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api/tasks'

export function useTasks() {
  const tasks = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const completedTasks = computed(() =>
    tasks.value.filter(task => task.completed)
  )
  
  const activeTasks = computed(() =>
    tasks.value.filter(task => !task.completed)
  )

  // Methods
  const fetchTasks = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(API_URL)
      tasks.value = response.data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching tasks:', err)
    } finally {
      loading.value = false
    }
  }

  const createTask = async (taskData) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.post(API_URL, taskData)
      tasks.value.unshift(response.data)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTask = async (id, updates) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.put(`${API_URL}/${id}`, updates)
      const index = tasks.value.findIndex(t => t._id === id)
      if (index !== -1) {
        tasks.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTask = async (id) => {
    loading.value = true
    error.value = null
    try {
      await axios.delete(`${API_URL}/${id}`)
      tasks.value = tasks.value.filter(t => t._id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const toggleTask = async (task) => {
    return updateTask(task._id, { completed: !task.completed })
  }

  return {
    tasks,
    loading,
    error,
    completedTasks,
    activeTasks,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTask
  }
}
```

### src/components/TaskList.vue

```vue
<template>
  <div class="task-list">
    <div v-if="loading" class="loading">Loading tasks...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div
        v-for="task in tasks"
        :key="task._id"
        class="task-item"
        :class="{ completed: task.completed }"
      >
        <input
          type="checkbox"
          :checked="task.completed"
          @change="handleToggle(task)"
        />
        <span class="task-title">{{ task.title }}</span>
        <span class="task-priority">{{ task.priority }}</span>
        <button @click="handleDelete(task._id)" class="delete-btn">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  tasks: {
    type: Array,
    required: true
  },
  loading: Boolean,
  error: String
})

const emit = defineEmits(['toggle', 'delete'])

const handleToggle = (task) => {
  emit('toggle', task)
}

const handleDelete = (id) => {
  if (confirm('Are you sure you want to delete this task?')) {
    emit('delete', id)
  }
}
</script>

<style scoped>
.task-list {
  margin-top: 2rem;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.task-item.completed {
  opacity: 0.6;
}

.task-item.completed .task-title {
  text-decoration: line-through;
}

.task-title {
  flex: 1;
}

.task-priority {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.delete-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
}
</style>
```

### src/components/TaskForm.vue

```vue
<template>
  <form @submit="handleSubmit" class="task-form">
    <input
      v-model="title"
      type="text"
      placeholder="Enter task title..."
      class="task-input"
      required
    />
    <select v-model="priority" class="priority-select">
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>
    <button type="submit" class="submit-btn">Add Task</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('')
const priority = ref('medium')

const emit = defineEmits(['submit'])

const handleSubmit = (e) => {
  e.preventDefault()
  if (title.value.trim()) {
    emit('submit', {
      title: title.value.trim(),
      priority: priority.value
    })
    title.value = ''
    priority.value = 'medium'
  }
}
</script>

<style scoped>
.task-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.task-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
}

.priority-select {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
}
</style>
```

### src/App.vue

```vue
<template>
  <div class="app">
    <h1>Task Manager</h1>
    <TaskForm @submit="handleCreateTask" />
    <TaskList
      :tasks="tasks"
      :loading="loading"
      :error="error"
      @toggle="handleToggleTask"
      @delete="handleDeleteTask"
    />
    <div class="stats">
      <p>Total: {{ tasks.length }}</p>
      <p>Completed: {{ completedTasks.length }}</p>
      <p>Active: {{ activeTasks.length }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTasks } from './composables/useTasks'
import TaskForm from './components/TaskForm.vue'
import TaskList from './components/TaskList.vue'

const {
  tasks,
  loading,
  error,
  completedTasks,
  activeTasks,
  fetchTasks,
  createTask,
  toggleTask,
  deleteTask
} = useTasks()

onMounted(() => {
  fetchTasks()
})

const handleCreateTask = async (taskData) => {
  try {
    await createTask(taskData)
  } catch (err) {
    alert('Failed to create task')
  }
}

const handleToggleTask = async (task) => {
  try {
    await toggleTask(task)
  } catch (err) {
    alert('Failed to update task')
  }
}

const handleDeleteTask = async (id) => {
  try {
    await deleteTask(id)
  } catch (err) {
    alert('Failed to delete task')
  }
}
</script>

<style>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.stats {
  margin-top: 2rem;
  display: flex;
  gap: 2rem;
}
</style>
```

---

## Key Learning Points

1. **API Integration**: Using axios for HTTP requests
2. **CRUD Operations**: Complete Create, Read, Update, Delete
3. **Error Handling**: Proper error states and user feedback
4. **Loading States**: Loading indicators during API calls
5. **Composables**: Reusable API logic extraction

---
