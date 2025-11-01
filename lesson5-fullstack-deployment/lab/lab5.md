# Lab 5: MEVN Stack Full-Stack Application Development

## Overview

In this comprehensive lab exercise, you'll build a complete full-stack application using the MEVN stack (MongoDB, Express.js, Vue.js, Node.js). This demonstrates real-world full-stack development patterns and production deployment strategies.

_For detailed learning objectives and full-stack concepts, see [../readme.md](../readme.md)_

## Exercises

- MEVN Stack Project Setup
- Backend API Development with Express.js
- Frontend Integration with Vue.js
- Database Integration with MongoDB
- Real-time Features with WebSockets
- Production Deployment

## Exercises

### Exercise 1: MEVN Stack Project Setup

1. Create MEVN stack project structure:

```bash
# Create project directory
mkdir mevn-todo-app && cd mevn-todo-app

# Initialize frontend (Vue.js)
npm create vue@latest frontend
cd frontend
npm install axios socket.io-client

# Initialize backend (Node.js + Express.js)
cd ..
mkdir backend && cd backend
npm init -y
npm install express mongoose cors dotenv socket.io multer
npm install -D nodemon

# Install MongoDB (if not already installed)
# macOS: brew install mongodb-community
# Windows: Download from MongoDB website
# Linux: sudo apt-get install mongodb
```

2. Set up project structure:

```
mevn-todo-app/
├── frontend/          # Vue.js application
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # Express.js API
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── README.md
```

3. Configure backend server (Express.js + MongoDB):

```javascript
// backend/server.js
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const http = require('http')
const socketIo = require('socket.io')

dotenv.config()

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mevn-todo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// Routes
app.use('/api/todos', require('./routes/todos'))
app.use('/api/auth', require('./routes/auth'))

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

### Exercise 2: Backend API Development with Express.js

1. Create MongoDB models:

```javascript
// backend/models/Todo.js
const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
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
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Todo', todoSchema)
```

2. Create API routes:

```javascript
// backend/routes/todos.js
const express = require('express')
const router = express.Router()
const Todo = require('../models/Todo')

// GET /api/todos - Get all todos for a user
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.id })
    res.json(todos)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// POST /api/todos - Create a new todo
router.post('/', async (req, res) => {
  try {
    const todo = new Todo({
      ...req.body,
      userId: req.user.id
    })
    await todo.save()
    res.status(201).json(todo)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// PUT /api/todos/:id - Update a todo
router.put('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    )
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' })
    }
    res.json(todo)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// DELETE /api/todos/:id - Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    })
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' })
    }
    res.json({ message: 'Todo deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
```

### Exercise 3: Frontend Integration with Vue.js

1. Create Vue.js components:

```vue
<!-- frontend/src/components/TodoList.vue -->
<template>
  <div class="todo-list">
    <div class="todo-header">
      <h2>My Todos</h2>
      <button @click="showAddForm = true" class="btn-primary">
        Add Todo
      </button>
    </div>

    <div class="todo-filters">
      <select v-model="filter" @change="filterTodos">
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
      </select>
    </div>

    <div class="todos">
      <div v-for="todo in filteredTodos" :key="todo._id" class="todo-item">
        <input
          type="checkbox"
          v-model="todo.completed"
          @change="updateTodo(todo)"
        />
        <div class="todo-content">
          <h3 :class="{ completed: todo.completed }">{{ todo.title }}</h3>
          <p v-if="todo.description">{{ todo.description }}</p>
          <div class="todo-meta">
            <span class="priority" :class="todo.priority">{{ todo.priority }}</span>
            <span v-if="todo.dueDate" class="due-date">
              Due: {{ formatDate(todo.dueDate) }}
            </span>
          </div>
        </div>
        <button @click="deleteTodo(todo._id)" class="btn-danger">
          Delete
        </button>
      </div>
    </div>

    <TodoForm
      v-if="showAddForm"
      @close="showAddForm = false"
      @add="addTodo"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import TodoForm from './TodoForm.vue'
import { todoService } from '../services/todoService'

export default {
  name: 'TodoList',
  components: {
    TodoForm
  },
  setup() {
    const todos = ref([])
    const filter = ref('all')
    const showAddForm = ref(false)

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
        const newTodo = await todoService.createTodo(todoData)
        todos.value.push(newTodo)
        showAddForm.value = false
      } catch (error) {
        console.error('Error adding todo:', error)
      }
    }

    const updateTodo = async (todo) => {
      try {
        await todoService.updateTodo(todo._id, todo)
      } catch (error) {
        console.error('Error updating todo:', error)
      }
    }

    const deleteTodo = async (id) => {
      try {
        await todoService.deleteTodo(id)
        todos.value = todos.value.filter(t => t._id !== id)
      } catch (error) {
        console.error('Error deleting todo:', error)
      }
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString()
    }

onMounted(() => {
      loadTodos()
    })

    return {
      todos,
      filter,
      showAddForm,
      filteredTodos,
      addTodo,
      updateTodo,
      deleteTodo,
      formatDate
    }
  }
}
</script>
```

2. Create API service:

```javascript
// frontend/src/services/todoService.js
import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
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

### Exercise 4: Real-time Features with WebSockets

1. Set up Socket.io in Vue.js:

```javascript
// frontend/src/composables/useSocket.js
import { ref, onMounted, onUnmounted } from 'vue'
import io from 'socket.io-client'

export function useSocket() {
  const socket = ref(null)
  const isConnected = ref(false)

  const connect = () => {
    socket.value = io('http://localhost:3000')

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

2. Integrate real-time updates in TodoList:

```vue
<!-- Add to TodoList.vue script section -->
<script>
import { useSocket } from '../composables/useSocket'

export default {
  setup() {
    const { on, emit } = useSocket()

    // Listen for real-time updates
    on('todoAdded', (todo) => {
      todos.value.push(todo)
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

    // Emit events when making changes
    const addTodo = async (todoData) => {
      try {
        const newTodo = await todoService.createTodo(todoData)
        emit('todoAdded', newTodo)
        showAddForm.value = false
      } catch (error) {
        console.error('Error adding todo:', error)
      }
    }

    // ... rest of the setup
  }
}
</script>
```

### Exercise 5: Production Deployment

1. Create Docker configuration:

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. Create docker-compose.yml:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:5.0
    container_name: mevn-mongodb
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./backend
    container_name: mevn-backend
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://admin:password@mongodb:27017/mevn-todo?authSource=admin
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    container_name: mevn-frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

3. Deploy to production:

```bash
# Build and start all services
docker-compose up -d

# Check logs
docker-compose logs -f

# Scale services if needed
docker-compose up -d --scale backend=3
```

## Summary

In this lab, you've learned how to:

1. **Set up MEVN stack** - MongoDB, Express.js, Vue.js, Node.js
2. **Build RESTful APIs** with Express.js and MongoDB
3. **Create reactive Vue.js frontend** with Composition API
4. **Implement real-time features** using WebSockets
5. **Deploy full-stack applications** using Docker

This comprehensive MEVN stack application demonstrates modern full-stack development patterns and production deployment strategies.

## Next Steps

- Add user authentication and authorization
- Implement file upload functionality
- Add data validation and error handling
- Set up CI/CD pipelines
- Add monitoring and logging
- Implement caching strategies