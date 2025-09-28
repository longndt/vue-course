# Theory 3: API Integration & Data Management 🌐

## Quick Reference 📋

_For detailed learning objectives, prerequisites, and concepts, see [readme.md](../readme.md)_

---

## Why API Integration Matters? 🤔

**Modern Full-Stack Architecture:**

```
Your Modern Stack:
┌─────────────┐    ┌──────────┐    ┌─────────────┐    ┌─────────┐
│   React     │    │   HTTP   │    │ Node.js     │    │ MongoDB │
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

    // 2. Send JSON response to React
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

```js
// Vue composable calling your Node.js API
import { ref } from 'vue'

export function useStudents() {
  const students = ref([])

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/students")
      const data = await response.json()
      students.value = data
    } catch (error) {
      console.error("Error fetching students:", error)
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
    } catch (error) {
      console.error("Error adding student:", error)
    }
  }

  return { students, fetchStudents, addStudent }
}
```

---

## Professional Data Fetching with Vue Query 🔄

### Basic Setup

```js
// main.js - Configure Vue Query
import { createApp } from 'vue'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import App from './App.vue'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})

const app = createApp(App)
app.use(VueQueryPlugin, { queryClient })
app.mount('#app')
```

### Query Implementation

```vue
<!-- components/StudentsList.vue - Using Vue Query -->
<script setup>
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query"

function StudentsList() {
  const queryClient = useQueryClient();

const queryClient = useQueryClient()

// Fetch students with automatic caching and error handling
const {
  data: students = [],
  isPending: isLoading,
  error,
} = useQuery({
  queryKey: ["students"],
  queryFn: async () => {
    const response = await fetch("http://localhost:5000/api/students")
    if (!response.ok) throw new Error("Failed to fetch students")
    return response.json()
  },
})

// Create mutation for adding students
const createMutation = useMutation({
  mutationFn: async (studentData) => {
    const response = await fetch("http://localhost:5000/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentData),
    })
    return response.json()
  },
  onSuccess: () => {
    // Automatically refetch students list
    queryClient.invalidateQueries({ queryKey: ["students"] })
  },
})
</script>

<template>
  <div>
    <div v-if="isLoading">Loading students...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>
      <div v-for="student in students" :key="student._id">
        {{ student.name }} - {{ student.major }}
      </div>
      <button @click="createMutation.mutate({ name: 'New Student', major: 'CS' })">
        Add Student {{ createMutation.isPending ? '...' : '' }}
      </button>
    </div>
  </div>
</template>
```

---

## Advanced CRUD Operations with MongoDB 📝

### Search and Filtering

```vue
<script setup>
import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'

const searchTerm = ref("")
const major = ref("")

const { data: students = [], isPending: isLoading } = useQuery({
  queryKey: computed(() => ["students", { search: searchTerm.value, major: major.value }]),
  queryFn: async () => {
    const params = new URLSearchParams()
    if (searchTerm.value) params.append("search", searchTerm.value)
    if (major.value) params.append("major", major.value)

    const response = await fetch(
      `http://localhost:5000/api/students?${params}`
    )
    return response.json()
  },
  enabled: computed(() => searchTerm.value.length >= 2 || major.value !== ""), // Only search when criteria met
})
</script>

<template>
  <div>
    <input
      v-model="searchTerm"
      placeholder="Search students..."
    />
    <select v-model="major">
      <option value="">All Majors</option>
      <option value="Computer Science">Computer Science</option>
      <option value="Information Technology">Information Technology</option>
    </select>
    <div>{{ isLoading ? "Searching..." : students.length + " students found" }}</div>
  </div>
</template>
```

### Update Operations

```vue
<script setup>
import { defineProps } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

const props = defineProps(['studentId'])
const queryClient = useQueryClient()

const updateMutation = useMutation({
  mutationFn: async ({ id, data }) => {
    const response = await fetch(`http://localhost:5000/api/students/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },
  onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });

  const handleUpdate = (updatedData) => {
    updateMutation.mutate({ id: studentId, data: updatedData });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        handleUpdate(Object.fromEntries(formData));
      }}
    >
      <input name="name" placeholder="Student name" />
      <input name="email" placeholder="Email" />
      <select name="major">
        <option value="Computer Science">Computer Science</option>
        <option value="Information Technology">IT</option>
      </select>
      <button type="submit" disabled={updateMutation.isPending}>
        {updateMutation.isPending ? "Updating..." : "Update Student"}
      </button>
    </form>
  );
}
```

### Delete Operations

```vue
<script setup>
import { defineProps } from 'vue'
import { useMutation } from '@tanstack/vue-query'

const props = defineProps(['studentId'])
const deleteMutation = useMutation({
```

---

## Professional Error Handling & Loading States 🚨

### Error Boundaries for API Failures

```vue
<!-- components/ErrorBoundary.vue -->
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

<template>
  <div v-if="hasError" class="error-boundary">
    <h2>Something went wrong with the API</h2>
    <details>{{ error && error.toString() }}</details>
    <button @click="reloadPage">Reload Page</button>
  </div>
  <slot v-else />

    return this.props.children;
  }
}
```

### Advanced Loading States

```vue
<script setup>
import { useQuery } from '@tanstack/vue-query'
import StudentCard from './StudentCard.vue'

const {
  data: students,
  isPending: isLoading,
  error,
  isFetching,
} = useQuery({
  queryKey: ["students"],
  queryFn: fetchStudents,
})

const reloadPage = () => {
  window.location.reload()
}
</script>

<template>
  <div>
    <div v-if="isLoading" class="loading-skeleton">
      <div class="skeleton-item"></div>
      <div class="skeleton-item"></div>
      <div class="skeleton-item"></div>
    </div>

    <div v-else-if="error" class="error-state">
      <h3>Unable to load students</h3>
      <p>{{ error.message }}</p>
      <button @click="reloadPage">Try Again</button>
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
```

---

## Best Practices for Production Apps 🏗️

### 1. Environment Configuration

```javascript
// config/api.js
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-api.com/api"
    : "http://localhost:5000/api";

export const apiClient = {
  get: (endpoint) => fetch(`${API_BASE_URL}${endpoint}`),
  post: (endpoint, data) =>
    fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
};
```

### 2. Optimistic Updates

```js
// composables/useOptimisticStudents.js
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { createStudent } from '../api/students'

export function useOptimisticStudents() {
  const queryClient = useQueryClient()

  const addStudentMutation = useMutation({
    mutationFn: createStudent,
    onMutate: async (newStudent) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["students"] })

      // Snapshot previous value
      const previousStudents = queryClient.getQueryData(["students"])

      // Optimistically update the cache
      queryClient.setQueryData(["students"], (old) => [
        ...old,
        { ...newStudent, _id: Date.now(), isOptimistic: true },
      ])

      return { previousStudents }
    },
    onError: (err, newStudent, context) => {
      // Rollback on error
      queryClient.setQueryData(["students"], context.previousStudents)
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["students"] })
    },
  })

  return addStudentMutation;
}
```

### 3. Request Caching and Deduplication

```js
// composables/useStudent.js
import { useQuery } from '@tanstack/vue-query'
import { fetchStudent } from '../api/students'

export function useStudent(id) {
  return useQuery({
    queryKey: ["student", id],
    queryFn: () => fetchStudent(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    retry: (failureCount, error) => {
      // Don't retry on 404s
      if (error.status === 404) return false
      // Retry up to 3 times for other errors
      return failureCount < 3
    },
  })
}
```

---

## Lab Exercise Preview 🧪

**What You'll Build:**

1. **Node.js/Express API**

   - MongoDB connection with Mongoose
   - CRUD endpoints for tasks
   - Error handling middleware

2. **React Frontend Integration**

   - React Query setup
   - Task list with CRUD operations
   - Loading states and error handling

3. **Testing & Polish**
   - Test all functionality
   - Add optimistic updates

**Result:** A fully functional task management system with modern architecture!

---

## Next: Hands-On Practice 👨‍💻

Ready to put theory into practice? Let's build a real application that connects React to a Node.js/MongoDB backend!

**In the next session:**

- Set up your development environment
- Build API endpoints with Express/MongoDB
- Implement React Query for data management
- Add professional error handling and loading states
