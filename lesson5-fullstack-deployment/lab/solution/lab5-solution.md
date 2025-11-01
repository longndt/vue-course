# Lab 5 Solution - MEVN Stack Full-Stack Application

## Complete Solution Structure

```
mevn-todo-app/
├── backend/
│   ├── server.js
│   ├── models/
│   │   └── Todo.js
│   └── routes/
│       └── todos.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TodoList.vue
│   │   │   └── TodoForm.vue
│   │   ├── composables/
│   │   │   └── useSocket.js
│   │   └── services/
│   │       └── todoService.js
│   └── package.json
└── README.md
```

---

## Complete Code Solutions

### backend/server.js

```javascript
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import todoRoutes from './routes/todos.js'

dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mevn-todo')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err))

// Routes
app.use('/api/todos', todoRoutes(io))

// Socket.io for real-time updates
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

### backend/models/Todo.js

```javascript
import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
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
    },
    dueDate: {
      type: Date
    }
  },
  { timestamps: true }
)

export default mongoose.model('Todo', todoSchema)
```

### backend/routes/todos.js

```javascript
import express from 'express'
import Todo from '../models/Todo.js'

export default function todoRoutes(io) {
  const router = express.Router()

  // GET all todos
  router.get('/', async (req, res) => {
    try {
      const todos = await Todo.find().sort({ createdAt: -1 })
      res.json(todos)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  // POST create todo
  router.post('/', async (req, res) => {
    try {
      const todo = new Todo(req.body)
      const savedTodo = await todo.save()
      // Emit real-time event
      io.emit('todoAdded', savedTodo)
      res.status(201).json(savedTodo)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  })

  // PUT update todo
  router.put('/:id', async (req, res) => {
    try {
      const todo = await Todo.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      )
      if (!todo) {
        return res.status(404).json({ error: 'Todo not found' })
      }
      // Emit real-time event
      io.emit('todoUpdated', todo)
      res.json(todo)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  })

  // DELETE todo
  router.delete('/:id', async (req, res) => {
    try {
      const todo = await Todo.findByIdAndDelete(req.params.id)
      if (!todo) {
        return res.status(404).json({ error: 'Todo not found' })
      }
      // Emit real-time event
      io.emit('todoDeleted', req.params.id)
      res.json({ message: 'Todo deleted successfully' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  return router
}
```

### frontend/src/services/todoService.js

```javascript
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const todoService = {
  async getTodos() {
    const response = await api.get('/todos')
    return response.data
  },

  async createTodo(todoData) {
    const response = await api.post('/todos', todoData)
    return response.data
  },

  async updateTodo(id, todoData) {
    const response = await api.put(`/todos/${id}`, todoData)
    return response.data
  },

  async deleteTodo(id) {
    const response = await api.delete(`/todos/${id}`)
    return response.data
  }
}
```

### frontend/src/composables/useSocket.js

```javascript
import { ref, onMounted, onUnmounted } from 'vue'
import { io } from 'socket.io-client'

export function useSocket() {
  const socket = ref(null)
  const isConnected = ref(false)

  const connect = () => {
    const serverUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'
    socket.value = io(serverUrl)

    socket.value.on('connect', () => {
      isConnected.value = true
      console.log('Connected to server')
    })

    socket.value.on('disconnect', () => {
      isConnected.value = false
      console.log('Disconnected from server')
    })
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      isConnected.value = false
    }
  }

  const emit = (event, data) => {
    if (socket.value) {
      socket.value.emit(event, data)
    }
  }

  const on = (event, callback) => {
    if (socket.value) {
      socket.value.on(event, callback)
    }
  }

  onMounted(() => {
    connect()
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    socket,
    isConnected,
    connect,
    disconnect,
    emit,
    on
  }
}
```

### frontend/src/components/TodoList.vue

```vue
<template>
  <div class="todo-list">
    <div class="todo-header">
      <h2>My Todos</h2>
      <button @click="showAddForm = true" class="btn-primary">Add Todo</button>
    </div>

    <div class="todo-filters">
      <select v-model="filter" class="filter-select">
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
      </select>
    </div>

    <div class="todos">
      <div v-for="todo in filteredTodos" :key="todo._id" class="todo-item">
        <input
          type="checkbox"
          :checked="todo.completed"
          @change="updateTodo(todo)"
        />
        <div class="todo-content">
          <h3 :class="{ completed: todo.completed }">{{ todo.title }}</h3>
          <p v-if="todo.description">{{ todo.description }}</p>
          <div class="todo-meta">
            <span class="priority" :class="todo.priority">{{ todo.priority }}</span>
          </div>
        </div>
        <button @click="deleteTodo(todo._id)" class="btn-danger">Delete</button>
      </div>
    </div>

    <TodoForm
      v-if="showAddForm"
      @close="showAddForm = false"
      @add="addTodo"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { todoService } from '../services/todoService'
import { useSocket } from '../composables/useSocket'
import TodoForm from './TodoForm.vue'

const todos = ref([])
const filter = ref('all')
const showAddForm = ref(false)
const { on } = useSocket()

const filteredTodos = computed(() => {
  if (filter.value === 'all') return todos.value
  if (filter.value === 'completed') return todos.value.filter(t => t.completed)
  if (filter.value === 'pending') return todos.value.filter(t => !t.completed)
  return todos.value
})

const loadTodos = async () => {
  try {
    todos.value = await todoService.getTodos()
  } catch (error) {
    console.error('Error loading todos:', error)
  }
}

const addTodo = async (todoData) => {
  try {
    await todoService.createTodo(todoData)
    // Real-time update handled by socket
  } catch (error) {
    console.error('Error adding todo:', error)
  }
}

const updateTodo = async (todo) => {
  try {
    await todoService.updateTodo(todo._id, { ...todo, completed: !todo.completed })
  } catch (error) {
    console.error('Error updating todo:', error)
  }
}

const deleteTodo = async (id) => {
  try {
    await todoService.deleteTodo(id)
  } catch (error) {
    console.error('Error deleting todo:', error)
  }
}

// Socket event listeners
on('todoAdded', (todo) => {
  todos.value.unshift(todo)
})

on('todoUpdated', (updatedTodo) => {
  const index = todos.value.findIndex(t => t._id === updatedTodo._id)
  if (index !== -1) {
    todos.value[index] = updatedTodo
  }
})

on('todoDeleted', (todoId) => {
  todos.value = todos.value.filter(t => t._id !== todoId)
})

onMounted(() => {
  loadTodos()
})
</script>

<style scoped>
.todo-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.todo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.todos {
  margin-top: 2rem;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.todo-content {
  flex: 1;
}

.todo-content h3.completed {
  text-decoration: line-through;
  opacity: 0.6;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

.btn-danger {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
}
</style>
```

### frontend/src/components/TodoForm.vue

```vue
<template>
  <div class="todo-form-overlay" @click.self="$emit('close')">
    <div class="todo-form">
      <h3>Add New Todo</h3>
      <form @submit.prevent="handleSubmit">
        <input
          v-model="title"
          type="text"
          placeholder="Todo title..."
          required
          class="form-input"
        />
        <textarea
          v-model="description"
          placeholder="Description (optional)"
          class="form-textarea"
        ></textarea>
        <select v-model="priority" class="form-select">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <div class="form-actions">
          <button type="submit" class="btn-submit">Add Todo</button>
          <button type="button" @click="$emit('close')" class="btn-cancel">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('')
const description = ref('')
const priority = ref('medium')

const emit = defineEmits(['add', 'close'])

const handleSubmit = () => {
  emit('add', {
    title: title.value,
    description: description.value,
    priority: priority.value
  })
  title.value = ''
  description.value = ''
  priority.value = 'medium'
  emit('close')
}
</script>

<style scoped>
.todo-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.todo-form {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 500px;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-submit {
  flex: 1;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

.btn-cancel {
  flex: 1;
  background: #e2e8f0;
  color: #1e293b;
  border: none;
  padding: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
}
</style>
```

---

## Key Learning Points

1. **Full-Stack Architecture**: MEVN stack integration
2. **Real-time Updates**: WebSocket with Socket.io
3. **REST API**: Complete CRUD operations
4. **State Synchronization**: Frontend-backend state sync
5. **Production Deployment**: Ready for deployment

---
