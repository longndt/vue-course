# Lab 1 Solution - Student Dashboard

## Complete Solution Structure

```
student-dashboard/
├── src/
│   ├── data/
│   │   └── students.js
│   ├── components/
│   │   ├── StudentCard.vue
│   │   └── StatsCard.vue
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── package.json
└── vite.config.js
```

---

## Complete Code Solutions

### src/data/students.js

```javascript
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
  },
  {
    id: 3,
    name: 'Bob Wilson',
    email: 'bob.wilson@university.edu',
    major: 'Physics',
    year: 4,
    gpa: 3.6,
    isActive: false,
    enrollmentDate: '2021-09-01'
  }
];

export function calculateStats(students) {
  return {
    totalStudents: students.length,
    activeStudents: students.filter(s => s.isActive).length,
    averageGPA: (students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2),
    totalCourses: 25
  };
}
```

### src/components/StudentCard.vue

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
      <div class="info-item">
        <span>📧 {{ student.email }}</span>
      </div>
      <div class="info-item">
        <span>📅 Year {{ student.year }} • {{ student.major }}</span>
      </div>
      <div class="info-item">
        <span>⭐ GPA: {{ student.gpa.toFixed(2) }}</span>
      </div>
    </div>

    <div class="student-actions">
      <button @click="handleEdit" class="btn btn-edit">Edit</button>
      <button @click="handleDelete" class="btn btn-delete">Delete</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
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
  if (props.onDelete && confirm(`Are you sure you want to delete ${props.student.name}?`)) {
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
  transition: transform 0.2s;
}
.student-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}
.student-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}
.student-header h3 {
  margin: 0;
  color: #1f2937;
}
.status {
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}
.status.active {
  background: #d1fae5;
  color: #065f46;
}
.status.inactive {
  background: #fee2e2;
  color: #991b1b;
}
.student-info {
  margin-bottom: 1rem;
}
.info-item {
  margin: 0.5rem 0;
  color: #6b7280;
}
.student-actions {
  display: flex;
  gap: 0.5rem;
}
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}
.btn-edit {
  background: #3b82f6;
  color: white;
}
.btn-edit:hover {
  background: #2563eb;
}
.btn-delete {
  background: #ef4444;
  color: white;
}
.btn-delete:hover {
  background: #dc2626;
}
</style>
```

### src/components/StatsCard.vue

```vue
<template>
  <div class="stats-card">
    <h3 class="stats-title">{{ title }}</h3>
    <p class="stats-value">{{ value }}</p>
    <div v-if="trend" class="stats-trend" :class="trend.isPositive ? 'positive' : 'negative'">
      {{ trend.isPositive ? '↑' : '↓' }} {{ Math.abs(trend.value) }}%
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  trend: Object
})
</script>

<style scoped>
.stats-card {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}
.stats-card:hover {
  transform: translateY(-4px);
}
.stats-title {
  font-size: 0.875rem;
  color: #6b7280;
  text-transform: uppercase;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}
.stats-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}
.stats-trend {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}
.stats-trend.positive {
  color: #059669;
}
.stats-trend.negative {
  color: #dc2626;
}
</style>
```

### src/App.vue (Complete)

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
        :trend="{ value: 12, isPositive: true }"
      />
      <StatsCard
        title="Active Students"
        :value="stats.activeStudents"
        :trend="{ value: 8, isPositive: true }"
      />
      <StatsCard
        title="Average GPA"
        :value="stats.averageGPA"
        :trend="{ value: 3, isPositive: false }"
      />
    </div>

    <div class="dashboard-controls">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search students..."
        class="search-input"
      />
      <div class="filter-container">
        <button
          @click="filterActive = null"
          :class="['filter-btn', { active: filterActive === null }]"
        >
          All
        </button>
        <button
          @click="filterActive = true"
          :class="['filter-btn', { active: filterActive === true }]"
        >
          Active
        </button>
        <button
          @click="filterActive = false"
          :class="['filter-btn', { active: filterActive === false }]"
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

<script setup>
import { ref, computed } from 'vue'
import StudentCard from './components/StudentCard.vue'
import StatsCard from './components/StatsCard.vue'
import { students as sampleStudents, calculateStats } from './data/students.js'

const students = ref(sampleStudents)
const searchTerm = ref('')
const filterActive = ref(null)

const stats = computed(() => calculateStats(students.value))

const filteredStudents = computed(() => {
  let filtered = students.value

  // Apply search filter
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(student =>
      student.name.toLowerCase().includes(term) ||
      student.email.toLowerCase().includes(term) ||
      student.major.toLowerCase().includes(term)
    )
  }

  // Apply active/inactive filter
  if (filterActive.value !== null) {
    filtered = filtered.filter(student => student.isActive === filterActive.value)
  }

  return filtered
})

const handleEditStudent = (student) => {
  console.log('Edit student:', student)
  // In real app, this would open an edit modal
  alert(`Edit: ${student.name}`)
}

const handleDeleteStudent = (id) => {
  students.value = students.value.filter(s => s.id !== id)
}
</script>

<style scoped>
.app {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
}

.app-header {
  text-align: center;
  margin-bottom: 3rem;
}

.app-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.dashboard-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  max-width: 400px;
}

.filter-container {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: #3b82f6;
}

.filter-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

@media (max-width: 768px) {
  .app {
    padding: 1rem;
  }
  .students-grid {
    grid-template-columns: 1fr;
  }
  .dashboard-controls {
    flex-direction: column;
  }
}
</style>
```

### src/style.css

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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  color: #1e293b;
  line-height: 1.6;
  min-height: 100vh;
}
```

---

## Key Learning Points

1. **Component Structure**: Separate components for reusability
2. **Reactive State**: Using `ref()` and `computed()` for reactive data
3. **Props & Events**: Passing data down, events up
4. **Filtering Logic**: Computed properties for dynamic filtering
5. **Styling**: Scoped styles and CSS variables

---

## Testing Your Solution

1. Run `npm run dev`
2. Test search functionality
3. Test filter buttons
4. Test add/edit/delete operations
5. Verify responsive design on mobile

---

## Common Mistakes to Avoid

- ❌ Forgetting to use `.value` with refs in script setup
- ❌ Not handling edge cases in filtering
- ❌ Missing prop validation
- ❌ Not using key in v-for loops
- ❌ Forgetting scoped styles

---
