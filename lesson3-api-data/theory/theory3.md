# Vue 3 API Integration & Data Management

## Theory 3: API Integration & Data Management 🌐

### Quick Reference 📋

*For detailed learning objectives, prerequisites, and concepts, see [readme.md](../readme.md)*

---

## Why API Integration Matters? 🤔

**Modern Full-Stack Architecture:**

```
Your Modern Stack:
┌─────────────┐    ┌──────────┐    ┌─────────────┐    ┌─────────┐
│   Vue 3     │    │   HTTP   │    │ Node.js     │    │ MongoDB │
│ (Frontend)  │◄──►│   API    │◄──►│ Express     │◄──►│         │
│             │    │          │    │ (Backend)   │    │         │
└─────────────┘    └──────────┘    └─────────────┘    └─────────┘
   Clean Separation of Concerns
```

**Key Benefits:**

- **Scalability**: Each layer scales independently
- **Maintainability**: Clear frontend/backend separation
- **Team Collaboration**: Independent development workflows
- **Modern UX**: Real-time updates without page refreshes

---

## Understanding REST APIs with Node.js/MongoDB 📡

### From Database to API Response

```javascript
// Node.js/Express backend endpoint
app.get("/api/students", async (req, res) => {
  try {
    // 1. Query MongoDB database
    const students = await Student.find();

    // 2. Send JSON response to Vue
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Vue Frontend Consumption

```vue
<!-- Vue component using the API -->
<template>
  <div>
    <div v-for="student in students" :key="student._id">
      {{ student.name }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const students = ref([])

onMounted(async () => {
  // 1. Send HTTP request to your Node.js backend
  const response = await fetch('http://localhost:5000/api/students')
  const data = await response.json()

  // 2. Update Vue state with database data
  students.value = data
})
</script>
```

---

## Mapping Node.js Endpoints to Vue Functions

**Your Node.js API Structure:**

```javascript
// server/routes/students.js - Your backend API
const express = require("express");
const Student = require("../models/Student");
const router = express.Router();

// GET /api/students - List all students
router.get("/", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// POST /api/students - Create student
router.post("/", async (req, res) => {
  const student = new Student(req.body);
  await student.save();
  res.json(student);
});
```

**Vue Frontend Implementation:**

```javascript
// composables/useStudents.js - Vue composable calling your Node.js API
import { ref } from 'vue'

export function useStudents() {
  const students = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchStudents = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch("http://localhost:5000/api/students")
      const data = await response.json()
      students.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  const addStudent = async (studentData) => {
    try {
      const response = await fetch("http://localhost:5000/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      })
      const newStudent = await response.json()
      students.value = [...students.value, newStudent]
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add student'
    }
  }

  return { students, loading, error, fetchStudents, addStudent }
}
```

---

## Professional Data Fetching with Composables 🔄

### Basic Setup

```javascript
// composables/useApi.ts
import { ref, computed } from 'vue'

interface ApiState<T> {
  data: T | null
  loading: boolean
export function useApi(url) {
  const state = ref({
    data: null,
    loading: false,
    error: null
  })

  const isSuccess = computed(() => !state.value.loading && !state.value.error)
  const isEmpty = computed(() => !state.value.loading && !state.value.data)

  const execute = async () => {
    state.value.loading = true
    state.value.error = null

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      state.value.data = await response.json()
    } catch (err) {
      state.value.error = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      state.value.loading = false
    }
  }

  const refetch = () => execute()

  return {
    ...state.value,
    isSuccess,
    isEmpty,
    execute,
    refetch
  }
}
```

### Query Implementation

```vue
<!-- components/StudentsList.vue - Using custom composable -->
<template>
  <div>
    <div v-if="loading">Loading students...</div>
    <div v-else-if="error" class="error-state">
      <h3>Error: {{ error }}</h3>
      <button @click="refetch">Try Again</button>
    </div>
    <div v-else>
      <div v-for="student in data" :key="student._id" class="student-card">
        {{ student.name }} - {{ student.major }}
      </div>
      <button @click="addStudent({ name: 'New Student', major: 'CS', email: 'new@example.com' })">
        Add Student
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import { useStudents } from '@/composables/useStudents'

// Fetch students with automatic caching and error handling
const { data, loading, error, refetch } = useApi('http://localhost:5000/api/students')
const { addStudent } = useStudents()

// Execute on component mount
onMounted(() => {
  refetch()
})
</script>
```

---

## Advanced CRUD Operations with MongoDB 📝

### Search and Filtering

```vue
<template>
  <div>
    <div class="filters">
      <input
        v-model="searchTerm"
        placeholder="Search students..."
        class="search-input"
      />
      <select v-model="major" class="major-select">
        <option value="">All Majors</option>
        <option value="Computer Science">Computer Science</option>
        <option value="Information Technology">Information Technology</option>
      </select>
    </div>

    <div class="results">
      {{ loading ? "Searching..." : `${filteredStudents.length} students found` }}
    </div>

    <div class="students-grid">
      <StudentCard
        v-for="student in filteredStudents"
        :key="student._id"
        :student="student"
        @update="handleUpdate"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useStudents } from '@/composables/useStudents'

const { students, loading, fetchStudents, updateStudent, deleteStudent } = useStudents()

const searchTerm = ref("")
const major = ref("")

const filteredStudents = computed(() => {
  let filtered = students.value

  if (searchTerm.value) {
    filtered = filtered.filter(student =>
      student.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }

  if (major.value) {
    filtered = filtered.filter(student => student.major === major.value)
  }

  return filtered
})

// Watch for changes and refetch
watch([searchTerm, major], () => {
  fetchStudents()
}, { deep: true })

const handleUpdate = async (id, data) => {
  await updateStudent(id, data)
}

const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this student?')) {
    await deleteStudent(id)
  }
}

onMounted(() => {
  fetchStudents()
})
</script>
```

### Update Operations

```vue
<template>
  <form @submit.prevent="handleSubmit" class="update-form">
    <div class="form-group">
      <label>Name:</label>
      <input
        v-model="formData.name"
        :class="{ error: errors.name }"
        placeholder="Student name"
      />
      <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
    </div>

    <div class="form-group">
      <label>Email:</label>
      <input
        v-model="formData.email"
        :class="{ error: errors.email }"
        placeholder="Email"
      />
      <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
    </div>

    <div class="form-group">
      <label>Major:</label>
      <select v-model="formData.major">
        <option value="Computer Science">Computer Science</option>
        <option value="Information Technology">Information Technology</option>
      </select>
    </div>

    <button type="submit" :disabled="isSubmitting" class="submit-btn">
      {{ isSubmitting ? "Updating..." : "Update Student" }}
    </button>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useStudents } from '@/composables/useStudents'

const props = defineProps({
  studentId: {
    type: String,
    required: true
  },
  initialData: {
    type: Object,
    required: true
  }
})

const { updateStudent } = useStudents()

const formData = reactive({ ...props.initialData })
const errors = reactive({})
const isSubmitting = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true

  // Clear previous errors
  Object.keys(errors).forEach(key => delete errors[key])

  // Simple validation
  if (!formData.name.trim()) {
    errors.name = 'Name is required'
  }

  if (!formData.email.trim()) {
    errors.email = 'Email is required'
  } else if (!formData.email.includes('@')) {
    errors.email = 'Please enter a valid email'
  }

  // If no errors, submit
  if (Object.keys(errors).length === 0) {
    try {
      await updateStudent(props.studentId, formData)
      // Emit success event or close modal
    } catch (err) {
      console.error('Update error:', err)
    }
  }

  isSubmitting.value = false
}
</script>
```

### Delete Operations

```vue
<template>
  <div class="delete-confirmation">
    <h3>Delete Student</h3>
    <p>Are you sure you want to delete {{ student.name }}?</p>
    <p class="warning">This action cannot be undone.</p>

    <div class="actions">
      <button @click="handleDelete" :disabled="isDeleting" class="delete-btn">
        {{ isDeleting ? "Deleting..." : "Delete" }}
      </button>
      <button @click="$emit('cancel')" class="cancel-btn">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStudents } from '@/composables/useStudents'

const props = defineProps({
  student: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['cancel', 'deleted'])

const { deleteStudent } = useStudents()
const isDeleting = ref(false)

const handleDelete = async () => {
  isDeleting.value = true

  try {
    await deleteStudent(props.student._id)
    emit('deleted')
  } catch (err) {
    console.error('Delete error:', err)
  } finally {
    isDeleting.value = false
  }
}
</script>
```

---

## Professional Error Handling & Loading States 🚨

### Error Boundaries for API Failures

```vue
<!-- components/ErrorBoundary.vue -->
<template>
  <div v-if="hasError" class="error-boundary">
    <h2>Something went wrong with the API</h2>
    <details>{{ error && error.toString() }}</details>
    <button @click="reloadPage">Reload Page</button>
  </div>
  <slot v-else />
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const error = ref(null)

onErrorCaptured((err, instance, info) => {
  console.error("API Error caught by boundary:", err, info)
  hasError.value = true
  error.value = err
  return false // Prevent the error from propagating further
})

const reloadPage = () => {
  window.location.reload()
}
</script>

<style scoped>
.error-boundary {
  padding: 20px;
  border: 1px solid #dc3545;
  border-radius: 8px;
  background: #f8d7da;
  color: #721c24;
  text-align: center;
}

.error-boundary h2 {
  color: #721c24;
  margin-bottom: 10px;
}

.error-boundary button {
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}
</style>
```

### Advanced Loading States

```vue
<template>
  <div>
    <div v-if="loading" class="loading-skeleton">
      <div class="skeleton-item" v-for="i in 3" :key="i"></div>
    </div>

    <div v-else-if="error" class="error-state">
      <h3>Unable to load students</h3>
      <p>{{ error }}</p>
      <button @click="refetch">Try Again</button>
    </div>

    <div v-else>
      <div v-if="isFetching" class="background-loading">Updating...</div>
      <div class="students-grid">
        <StudentCard
          v-for="student in students"
          :key="student._id"
          :student="student"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useApi } from '@/composables/useApi'

const { data: students, loading, error, refetch, isFetching } = useApi('http://localhost:5000/api/students')

onMounted(() => {
  refetch()
})
</script>

<style scoped>
.loading-skeleton {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-item {
  height: 60px;
  background: #f0f0f0;
  border-radius: 4px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.error-state {
  text-align: center;
  padding: 40px;
  color: #dc3545;
}

.background-loading {
  position: fixed;
  top: 10px;
  right: 10px;
  background: #007bff;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.875rem;
}

.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}
</style>
```

---

## Best Practices for Production Apps 🏗️

### 1. Environment Configuration

```javascript
// config/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const apiClient = {
  get: (endpoint: string) => fetch(`${API_BASE_URL}${endpoint}`),
  post: (endpoint: string, data: any) =>
    fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  put: (endpoint: string, data: any) =>
    fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  delete: (endpoint: string) =>
    fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
    }),
}
```

### 2. Optimistic Updates

```javascript
// composables/useOptimisticStudents.ts
import { ref } from 'vue'
import { apiClient } from '@/config/api'

export function useOptimisticStudents() {
  const students = ref<Student[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const addStudent = async (newStudent: Omit<Student, '_id'>) => {
    // Optimistically add to UI
    const optimisticStudent = { ...newStudent, _id: Date.now().toString(), isOptimistic: true }
    students.value = [...students.value, optimisticStudent]

    try {
      // Make API call
      const response = await apiClient.post('/students', newStudent)
      const realStudent = await response.json()

      // Replace optimistic with real data
      students.value = students.value.map(student =>
        student.isOptimistic ? realStudent : student
      )
    } catch (err) {
      // Remove optimistic on error
      students.value = students.value.filter(student => !student.isOptimistic)
      error.value = 'Failed to add student'
    }
  }

  return { students, loading, error, addStudent }
}
```

### 3. Request Caching and Deduplication

```javascript
// composables/useStudent.ts
import { ref, computed } from 'vue'

const cache = new Map<string, { data: Student; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function useStudent(id: string) {
  const data = ref<Student | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchStudent = async () => {
    // Check cache first
    const cached = cache.get(id)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      data.value = cached.data
      return
    }

    loading.value = true
    error.value = null

    try {
      const response = await apiClient.get(`/students/${id}`)
      const student = await response.json()

      data.value = student
      cache.set(id, { data: student, timestamp: Date.now() })
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch student'
    } finally {
      loading.value = false
    }
  }

  const isStale = computed(() => {
    const cached = cache.get(id)
    return cached ? Date.now() - cached.timestamp > CACHE_DURATION : true
  })

  return { data, loading, error, fetchStudent, isStale }
}
```

---

## Lab Exercise Preview 🧪

**What You'll Build:**

1. **Node.js/Express API**
   - MongoDB connection with Mongoose
   - CRUD endpoints for tasks
   - Error handling middleware

2. **Vue 3 Frontend Integration**
   - Custom composables for API calls
   - Task list with CRUD operations
   - Loading states and error handling

3. **Testing & Polish**
   - Test all functionality
   - Add optimistic updates

**Result:** A fully functional task management system with modern architecture!

---

## Next: Hands-On Practice 👨‍💻

Ready to put theory into practice? Let's build a real application that connects Vue 3 to a Node.js/MongoDB backend!

**In the next session:**

- Set up your development environment
- Build API endpoints with Express/MongoDB
- Implement Vue composables for data management
- Add professional error handling and loading states