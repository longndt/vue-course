# Lab 1: Building Your First Professional Vue 3 Application

## Overview

In this lab session, you'll create a Student Dashboard application using JavaScript and Vue 3. This project demonstrates building a professional management system with multiple views and data handling using Vue 3's Composition API and modern development practices.

## Exercises

- Exercise 1: Project Setup
- Exercise 2: JavaScript Components
- Exercise 3: Interactive Dashboard
- Exercise 4: Advanced Features

## Pre-Lab Checklist

- [ ] Node.js v18+ installed
- [ ] VS Code with Vue extensions installed
- [ ] Basic understanding of JavaScript ES6+
- [ ] Familiarity with HTML/CSS

---

## Exercise 1: Professional Project Setup

### Step 1: Create JavaScript Vue 3 Project

```bash
# Create new project with JavaScript template
npm create vue@latest student-dashboard

# Choose options:
# ❌ TypeScript
# ❌ JSX Support
# ✓ Vue Router
# ✓ Pinia
# ✓ Vitest
# ✓ ESLint
# ✓ Prettier

# Navigate to project
cd student-dashboard

# Install dependencies
npm install

# Install additional useful libraries
npm install lucide-vue-next  # For icons
npm install clsx             # For conditional classes

# Start development server
npm run dev
```

### Step 2: Understand Project Structure

```
student-dashboard/
├── src/
│   ├── App.vue             # Main application component
│   ├── main.ts             # Application entry point
│   ├── style.css           # Global styles
│   ├── components/         # Reusable components
│   ├── views/              # Route components
│   ├── stores/             # Pinia stores
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
├── package.json            # Project configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build configuration
```

### Step 3: Configure Development Environment

**📚 Learning Note:** JavaScript configuration is simpler and focuses on modern development practices.

Update your `vite.config.js` for better development experience:

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
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

---

## Exercise 2: Building JavaScript Components

### Step 1: Define Data Structure

Create `src/data/students.js`:

```javascript
// Sample student data
export const students = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@university.edu',
    major: 'Computer Science',
    year: 3,
    gpa: 3.8,
    isActive: true,
    enrollmentDate: '2022-09-01'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@university.edu',
    major: 'Mathematics',
    year: 2,
    gpa: 3.9,
    isActive: true,
    enrollmentDate: '2023-09-01'
  }
];

// Sample course data
export const courses = [
  {
    id: 1,
    name: 'Introduction to Programming',
    code: 'CS101',
    credits: 3,
    instructor: 'Dr. Johnson'
  },
  {
    id: 2,
    name: 'Data Structures',
    code: 'CS201',
    credits: 4,
    instructor: 'Dr. Williams'
  }
];

// Dashboard statistics
export const dashboardStats = {
  totalStudents: 150,
  activeStudents: 142,
  averageGPA: 3.6,
  totalCourses: 25
};
```

### Step 2: Create Student Card Component

**💡 Architecture Note:** Notice that we define component-specific props in the component file, while domain data (`students`, `courses`) are in separate files. This separates UI concerns from business logic.

Create `src/components/StudentCard.vue`:

```vue
<template>
  <div class="student-card">
    <div class="student-header">
      <User :size="24" />
      <h3>{{ student.name }}</h3>
      <span :class="`status ${student.isActive ? 'active' : 'inactive'}`">
        {{ student.isActive ? 'Active' : 'Inactive' }}
      </span>
    </div>

    <div class="student-info">
      <div class="info-item">
        <Mail :size="16" />
        <span>{{ student.email }}</span>
      </div>
      <div class="info-item">
        <Calendar :size="16" />
        <span>
          Year {{ student.year }} • {{ student.major }}
        </span>
      </div>
      <div class="info-item">
        <span>GPA: {{ student.gpa.toFixed(2) }}</span>
      </div>
    </div>

    <div class="student-actions">
      <button @click="handleEdit" class="btn-edit">
        Edit
      </button>
      <button @click="handleDelete" class="btn-delete">
        Delete
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, Mail, Calendar } from 'lucide-vue-next'
import type { Student } from '@/types/Student'

interface Props {
  student: Student
  onEdit?: (student: Student) => void
  onDelete?: (studentId: number) => void
}

const props = defineProps<Props>()

const handleEdit = () => {
  if (props.onEdit) {
    props.onEdit(props.student)
  }
}

const handleDelete = () => {
  if (
    props.onDelete &&
    confirm(`Are you sure you want to delete ${props.student.name}?`)
  ) {
    props.onDelete(props.student.id)
  }
}
</script>

<style scoped>
.student-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

.student-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #22c55e);
}

.student-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}

.student-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.student-header h3 {
  margin: 0;
  flex: 1;
  color: #0f172a;
  font-size: 1.25rem;
  font-weight: 700;
}

.status {
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.status.active {
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.status.inactive {
  background: linear-gradient(135deg, #fef2f2, #f1f5f9);
  color: #dc2626;
  border: 1px solid #fecaca;
}

.status.active::before {
  content: '●';
  color: #22c55e;
}

.status.inactive::before {
  content: '●';
  color: #ef4444;
}

.student-info {
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  color: #64748b;
  font-size: 0.9rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.15s ease;
}

.info-item:hover {
  background: #f8fafc;
  color: #1e293b;
}

.student-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: auto;
}

.btn-edit,
.btn-delete {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-edit {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.btn-edit:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

.btn-delete {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.btn-delete:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
</style>
```

### Step 3: Create Stats Card Component

Create `src/components/StatsCard.vue`:

```vue
<template>
  <div class="stats-card">
    <div class="stats-header">
      <div class="stats-icon">
        <component :is="icon" :size="24" />
      </div>
      <div class="stats-info">
        <h3>{{ title }}</h3>
        <p class="stats-value">{{ value }}</p>
      </div>
    </div>
    <!-- Only show trend if it exists (conditional rendering) -->
    <div
      v-if="trend"
      :class="`stats-trend ${trend.isPositive ? 'positive' : 'negative'}`"
    >
      {{ trend.isPositive ? '↗' : '↘' }} {{ Math.abs(trend.value) }}%
    </div>
  </div>
</template>

<script setup lang="ts">
interface Trend {
  value: number
  isPositive: boolean
}

interface Props {
  title: string
  value: string | number
  icon: any // Vue component
  trend?: Trend
}

defineProps<Props>()
</script>

<style scoped>
.stats-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

.stats-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  border-radius: 1.5rem 1.5rem 0 0;
}

.stats-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}

.stats-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.stats-icon {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  padding: 0.75rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 48px;
}

.stats-info {
  flex: 1;
}

.stats-info h3 {
  font-size: 0.875rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.stats-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stats-trend {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
}

.stats-trend.positive {
  background: #f0fdf4;
  color: #16a34a;
}

.stats-trend.negative {
  background: #fef2f2;
  color: #dc2626;
}
</style>
```

---

## Exercise 3: Interactive Dashboard

### Step 1: Create Sample Data

First, create the data directory and file:

```bash
# Create the data directory
mkdir src/data
```

Then create `src/data/mockData.ts`:

```typescript
import type { Student, Course, DashboardStats } from '@/types/Student'

export const sampleStudents: Student[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@university.edu",
    major: "Computer Science",
    year: 3,
    gpa: 3.8,
    isActive: true,
    enrollmentDate: "2022-09-01",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob.smith@university.edu",
    major: "Information Technology",
    year: 4,
    gpa: 3.6,
    isActive: true,
    enrollmentDate: "2021-09-01",
  },
  {
    id: 3,
    name: "Carol Davis",
    email: "carol.davis@university.edu",
    major: "Software Engineering",
    year: 2,
    gpa: 3.9,
    isActive: false,
    enrollmentDate: "2023-09-01",
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david.wilson@university.edu",
    major: "Computer Science",
    year: 3,
    gpa: 3.4,
    isActive: true,
    enrollmentDate: "2022-09-01",
  },
]

export const sampleCourses: Course[] = [
  {
    id: 1,
    name: "Vue 3 Development",
    code: "CS301",
    credits: 3,
    instructor: "Dr. Johnson",
  },
  {
    id: 2,
    name: "Database Systems",
    code: "CS302",
    credits: 4,
    instructor: "Prof. Smith",
  },
  {
    id: 3,
    name: "Software Engineering",
    code: "CS401",
    credits: 3,
    instructor: "Dr. Brown",
  },
]

export function calculateStats(students: Student[]): DashboardStats {
  const totalStudents = students.length
  const activeStudents = students.filter((s) => s.isActive).length
  const averageGPA =
    students.reduce((sum, s) => sum + s.gpa, 0) / totalStudents

  return {
    totalStudents,
    activeStudents,
    averageGPA: Math.round(averageGPA * 100) / 100,
    totalCourses: sampleCourses.length,
  }
}
```

### Step 2: Create Main Dashboard Component

Update `src/App.vue`:

```vue
<template>
  <div class="app">
    <header class="app-header">
      <h1>Student Dashboard</h1>
      <p>Manage your student records efficiently</p>
    </header>

    <div class="dashboard-stats">
      <StatsCard
        title="Total Students"
        :value="stats.totalStudents"
        :icon="Users"
        :trend="{ value: 12, isPositive: true }"
      />
      <StatsCard
        title="Active Students"
        :value="stats.activeStudents"
        :icon="UserCheck"
        :trend="{ value: 8, isPositive: true }"
      />
      <StatsCard
        title="Average GPA"
        :value="stats.averageGPA"
        :icon="GraduationCap"
        :trend="{ value: 3, isPositive: false }"
      />
      <StatsCard
        title="Total Courses"
        :value="stats.totalCourses"
        :icon="BookOpen"
      />
    </div>

    <div class="dashboard-controls">
      <div class="search-container">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search students..."
          class="search-input"
        />
      </div>

      <div class="filter-container">
        <button
          @click="filterActive = null"
          :class="`filter-btn ${filterActive === null ? 'active' : ''}`"
        >
          All
        </button>
        <button
          @click="filterActive = true"
          :class="`filter-btn ${filterActive === true ? 'active' : ''}`"
        >
          Active
        </button>
        <button
          @click="filterActive = false"
          :class="`filter-btn ${filterActive === false ? 'active' : ''}`"
        >
          Inactive
        </button>
      </div>
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

    <div v-if="filteredStudents.length === 0" class="no-results">
      <p>No students found matching your criteria.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import StudentCard from '@/components/StudentCard.vue'
import StatsCard from '@/components/StatsCard.vue'
import type { Student, DashboardStats } from '@/types/Student'
import { sampleStudents, calculateStats } from '@/data/mockData'
import { Users, UserCheck, GraduationCap, BookOpen } from 'lucide-vue-next'

const students = ref<Student[]>(sampleStudents)
const searchTerm = ref('')
const filterActive = ref<boolean | null>(null)

const stats = computed<DashboardStats>(() => calculateStats(students.value))

const filteredStudents = computed(() => {
  return students.value.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      student.major.toLowerCase().includes(searchTerm.value.toLowerCase())

    const matchesFilter =
      filterActive.value === null || student.isActive === filterActive.value

    return matchesSearch && matchesFilter
  })
})

const handleEditStudent = (student: Student) => {
  console.log('Edit student:', student)
  // TODO: Implement edit functionality
}

const handleDeleteStudent = (studentId: number) => {
  students.value = students.value.filter((s) => s.id !== studentId)
}
</script>

<style scoped>
.app {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem;
  min-height: 100vh;
}

.app-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
}

.app-header h1 {
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  font-weight: 800;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.75rem;
  letter-spacing: -0.025em;
}

.app-header p {
  color: #64748b;
  font-size: 1.2rem;
  font-weight: 500;
  max-width: 600px;
  margin: 0 auto;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.dashboard-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  padding: 1.25rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.search-container {
  flex: 1;
  max-width: 450px;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  padding-left: 2.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 1rem;
  background: white;
  transition: all 0.25s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px #eff6ff;
  transform: translateY(-1px);
}

.search-container::before {
  content: '🔍';
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: #94a3b8;
  pointer-events: none;
}

.filter-container {
  display: flex;
  gap: 0.5rem;
  background: #f1f5f9;
  padding: 0.25rem;
  border-radius: 0.75rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.15s ease;
  color: #64748b;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.8);
  color: #1e293b;
  transform: translateY(-1px);
}

.filter-btn.active {
  background: #3b82f6;
  color: white;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  align-items: start;
}

.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 1.5rem;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  border: 2px dashed #cbd5e1;
  margin: 2rem 0;
}

.no-results p {
  font-size: 1.25rem;
  color: #64748b;
  margin-bottom: 1rem;
  font-weight: 500;
}

.no-results::before {
  content: '🔍';
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* Responsive Design */
@media (max-width: 768px) {
  .app {
    padding: 1rem;
  }

  .dashboard-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-container {
    max-width: none;
    margin-bottom: 0.75rem;
  }

  .students-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .dashboard-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
```

---

## Exercise 4: Professional Styling

Update `src/style.css` with professional styles:

```css
/* Modern CSS Variables for Design System */
:root {
  /* Color Palette */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;

  --gray-50: #f8fafc;
  --gray-100: #f1f5f9;
  --gray-200: #e2e8f0;
  --gray-300: #cbd5e1;
  --gray-400: #94a3b8;
  --gray-500: #64748b;
  --gray-600: #475569;
  --gray-700: #334155;
  --gray-800: #1e293b;
  --gray-900: #0f172a;

  --success-50: #f0fdf4;
  --success-500: #22c55e;
  --success-600: #16a34a;

  --danger-50: #fef2f2;
  --danger-500: #ef4444;
  --danger-600: #dc2626;

  /* Typography */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;

  /* Spacing Scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 250ms ease-in-out;
  --transition-slow: 350ms ease-in-out;
}

/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-primary);
  background: linear-gradient(135deg, var(--gray-50) 0%, var(--primary-50) 100%);
  color: var(--gray-900);
  line-height: 1.6;
  min-height: 100vh;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    --gray-50: #0f172a;
    --gray-100: #1e293b;
    --gray-200: #334155;
    --gray-900: #f8fafc;
  }

  body {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .stats-card,
  .student-card,
  .dashboard-controls {
    border: 2px solid var(--gray-800);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Learning Outcomes Assessment

After completing this lab, you should be able to:

**✅ Technical Skills:**

- [ ] Set up a TypeScript Vue 3 project with Vite
- [ ] Define TypeScript interfaces for complex data structures
- [ ] Create reusable, typed Vue 3 components with Composition API
- [ ] Implement event handling and reactive state management
- [ ] Apply conditional rendering and list rendering
- [ ] Style components with modern CSS techniques

**✅ Professional Skills:**

- [ ] Structure a project like a real-world application
- [ ] Use meaningful component names and organization
- [ ] Implement user-friendly interfaces with loading states
- [ ] Apply responsive design principles
- [ ] Handle user interactions gracefully

**✅ Professional Development Skills:**

- [ ] Understand how to build admin dashboards
- [ ] Know how to manage lists of data (students, products, users)
- [ ] Experience with search and filtering functionality
- [ ] Foundation for integrating with backend APIs

## Final Project Structure 📁

After completing all exercises in Lab 1, your project should have the following structure:

```
student-dashboard/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── components/
│   │   ├── StudentCard.vue
│   │   └── StatsCard.vue
│   ├── data/
│   │   └── mockData.ts
│   ├── types/
│   │   └── Student.ts
│   ├── App.vue
│   ├── main.ts
│   └── style.css
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── readme.md
```

### Key Features Implemented:
- ✅ **Modern Vue 3 with TypeScript**: Type-safe components and interfaces
- ✅ **Component Architecture**: Modular, reusable components
- ✅ **CSS Styling**: Professional UI with responsive design
- ✅ **State Management**: Reactive state for search, filters, and data management
- ✅ **Interactive Features**: Search, filtering, and dynamic content
- ✅ **Data Handling**: TypeScript interfaces and mock data
- ✅ **Professional Structure**: Organized folders and clean code

### Expected Functionality:
1. **Dashboard Overview**: Statistics cards showing student counts
2. **Student Management**: List view with search and filter capabilities
3. **Interactive UI**: Hover effects, smooth transitions, loading states
4. **Responsive Design**: Works on desktop, tablet, and mobile devices
5. **Type Safety**: All components properly typed with TypeScript

## Next Steps

In the next lesson, you'll learn how to:

- Create more complex component hierarchies
- Manage state across multiple components with Pinia
- Handle forms and user input validation
- Connect your Vue 3 frontend to real APIs (like your Node.js backends)

## Troubleshooting Common Issues

**TypeScript Errors:**

- Make sure all interfaces are properly imported
- Check that all required props are passed to components
- Verify that event handler types match expected signatures

**Vue 3 Specific Issues:**

- Ensure you're using the Composition API with `<script setup>`
- Check that components are properly registered
- Verify that reactive data is properly defined with `ref()` or `reactive()`

**Styling Issues:**

- Ensure CSS classes match between components and stylesheets
- Check that Lucide Vue Next icons are properly installed
- Verify that responsive breakpoints work on different screen sizes

**Build Errors:**

- Clear node_modules and reinstall if dependencies seem corrupted
- Check that all imports have correct file extensions
- Ensure TypeScript configuration matches project structure