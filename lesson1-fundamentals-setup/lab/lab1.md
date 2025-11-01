# Lab 1: Building Your First Professional Vue 3 Application

## Overview

Create a Student Dashboard application using JavaScript and Vue 3. This demonstrates building a professional management system with Vue 3's Composition API.

## Exercises

- Exercise 1: Project Setup
- Exercise 2: JavaScript Components
- Exercise 3: Interactive Dashboard
- Exercise 4: Professional Styling

## Pre-Lab Checklist

- [ ] Node.js v18+ installed
- [ ] VS Code with Vue extensions installed
- [ ] Basic understanding of JavaScript ES6+
- [ ] Familiarity with HTML/CSS

---

## Exercise 1: Professional Project Setup

### Step 1: Create Vue 3 Project

```bash
npm create vue@latest student-dashboard
# Select: ❌ TypeScript, ✓ Vue Router, ✓ Pinia, ✓ ESLint, ✓ Prettier
cd student-dashboard
npm install
npm install lucide-vue-next clsx
npm run dev
```

### Step 2: Configure Vite

Update `vite.config.js`:

```javascript
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
  server: {
    port: 3000,
    open: true
  }
})
```

---

## Exercise 2: Building Components

### Step 1: Create Data File

Create `src/data/students.js`:

```javascript
export const students = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@university.edu',
    major: 'Computer Science',
    year: 3,
    gpa: 3.8,
    isActive: true
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@university.edu',
    major: 'Mathematics',
    year: 2,
    gpa: 3.9,
    isActive: true
  }
];
```

### Step 2: Create StudentCard Component

Create `src/components/StudentCard.vue`:

```vue
<template>
  <div class="student-card">
    <div class="student-header">
      <h3>{{ student.name }}</h3>
      <span :class="`status ${student.isActive ? 'active' : 'inactive'}`">
        {{ student.isActive ? 'Active' : 'Inactive' }}
      </span>
    </div>
    <div class="student-info">
      <p>{{ student.email }}</p>
      <p>Year {{ student.year }} • {{ student.major }}</p>
      <p>GPA: {{ student.gpa.toFixed(2) }}</p>
    </div>
    <div class="student-actions">
      <button @click="handleEdit" class="btn-edit">Edit</button>
      <button @click="handleDelete" class="btn-delete">Delete</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  student: {
    type: Object,
    required: true
  },
  onEdit: Function,
  onDelete: Function
})

const handleEdit = () => {
  if (props.onEdit) {
    props.onEdit(props.student)
  }
}

const handleDelete = () => {
  if (props.onDelete && confirm(`Delete ${props.student.name}?`)) {
    props.onDelete(props.student.id)
  }
}
</script>

<style scoped>
.student-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}
.student-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.status.active {
  background: #d4edda;
  color: #155724;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}
.btn-edit, .btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  margin-right: 0.5rem;
}
.btn-edit {
  background: #007bff;
  color: white;
}
.btn-delete {
  background: #dc3545;
  color: white;
}
</style>
```

### Step 3: Create StatsCard Component

Create `src/components/StatsCard.vue`:

```vue
<template>
  <div class="stats-card">
    <h3>{{ title }}</h3>
    <p class="stats-value">{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number]
})
</script>

<style scoped>
.stats-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.stats-value {
  font-size: 2rem;
  font-weight: bold;
  margin: 0.5rem 0;
}
</style>
```

---

## Exercise 3: Interactive Dashboard

### Update App.vue

```vue
<template>
  <div class="app">
    <header>
      <h1>Student Dashboard</h1>
    </header>

    <div class="dashboard-stats">
      <StatsCard title="Total Students" :value="stats.totalStudents" />
      <StatsCard title="Active Students" :value="stats.activeStudents" />
      <StatsCard title="Average GPA" :value="stats.averageGPA" />
    </div>

    <div class="dashboard-controls">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search students..."
        class="search-input"
      />
    </div>

    <div class="students-grid">
      <StudentCard
        v-for="student in filteredStudents"
        :key="student.id"
        :student="student"
        :on-edit="handleEditStudent"
        :on-delete="handleDeleteStudent"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import StudentCard from './components/StudentCard.vue'
import StatsCard from './components/StatsCard.vue'
import { students as sampleStudents } from './data/students.js'

const students = ref(sampleStudents)
const searchTerm = ref('')

const stats = computed(() => ({
  totalStudents: students.value.length,
  activeStudents: students.value.filter(s => s.isActive).length,
  averageGPA: (students.value.reduce((sum, s) => sum + s.gpa, 0) / students.value.length).toFixed(2)
}))

const filteredStudents = computed(() => {
  if (!searchTerm.value) return students.value
  const term = searchTerm.value.toLowerCase()
  return students.value.filter(s =>
    s.name.toLowerCase().includes(term) ||
    s.email.toLowerCase().includes(term) ||
    s.major.toLowerCase().includes(term)
  )
})

const handleEditStudent = (student) => {
  console.log('Edit:', student)
  // TODO: Implement edit
}

const handleDeleteStudent = (id) => {
  students.value = students.value.filter(s => s.id !== id)
}
</script>

<style scoped>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}
.dashboard-controls {
  margin: 2rem 0;
}
.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
}
.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}
</style>
```

---

## Exercise 4: Professional Styling

Update `src/style.css`:

```css
:root {
  --primary: #3b82f6;
  --success: #22c55e;
  --danger: #ef4444;
  --gray: #64748b;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f8fafc;
  color: #1e293b;
}
```

---

## Learning Outcomes

After completing this lab, you should be able to:

- ✅ Set up a Vue 3 project with JavaScript
- ✅ Create reusable Vue components
- ✅ Manage reactive state
- ✅ Implement search and filtering
- ✅ Style components professionally

---

## Next Steps

In the next lesson, you'll learn:
- More complex component patterns
- State management with Pinia
- Form handling and validation
- API integration

---

## Troubleshooting

**Common Issues:**
- Import errors: Check file paths and extensions
- Reactive not working: Ensure using `ref()` or `reactive()`
- Styling issues: Verify CSS class names match

**Need Help?**
- Check `example/` folder for reference
- Review `reference/reference1.md` for quick lookup
- See `troubleshooting-guide.md` in extras/

---