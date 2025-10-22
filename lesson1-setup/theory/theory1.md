# Vue 3 Fundamentals & TypeScript Setup

## Theory 1 - Building Modern Vue 3 Applications

---

### Learning Objectives

By the end of this theory session, you will be able to:

- Understand Vue 3's role in modern full-stack development
- Set up a professional TypeScript-based Vue 3 development environment
- Create well-structured, type-safe Vue 3 components with Composition API
- Apply Vue 3 concepts to build modern web applications
- Integrate modern JavaScript features with Vue 3 and TypeScript

---

### Why Vue 3 for Modern Development? 🎯

**Building on Your Academic Foundation:**

- You've learned web development with server-side technologies
- Vue 3 provides the modern frontend framework for impressive UIs
- Same programming concepts: components = reusable functions, reactivity = data management
- Better user experience than traditional page-based applications

**Academic and Career Benefits:**

- 40%+ of companies use Vue or similar frameworks
- Perfect for building impressive application demos
- Excellent for dashboards, student portals, management systems
- Shows you understand modern development practices
- Integrates with any backend technology you choose
- Easier learning curve compared to React/Angular

---

### Vue 3 vs Traditional Web Development

| Traditional Web Apps   | Modern Vue 3 Apps      |
| ---------------------- | ---------------------- |
| Server-side rendering  | Client-side rendering  |
| Page refreshes         | Dynamic updates        |
| Mixed HTML/Server code | Separated concerns     |
| Form submissions       | Real-time interactions |

**Perfect for Modern Applications:**

- Use Vue 3 for impressive frontend interfaces
- Connect to any backend API you build
- Create modern, responsive user experiences
- Show understanding of current industry practices
- Progressive framework - use as much or as little as needed

---

### TypeScript: Why It Matters for Your Projects

**Think of TypeScript as:**

- JavaScript with better error checking and development tools
- Your safety net for large applications and complex projects
- A way to write more maintainable, professional code

**Benefits for Academic and Professional Development:**

```typescript
// Without TypeScript - Runtime errors
function createStudent(name, age, email) {
  // What if age is a string? What if email is missing?
  return { name, age, email };
}

// With TypeScript - Compile-time safety
interface Student {
  name: string;
  age: number;
  email: string;
}

function createStudent(name: string, age: number, email: string): Student {
  return { name, age, email };
}
```

---

### Setting Up Your Professional Environment

**Required Tools (Install in Order):**

1. **Node.js (v18+)**

   ```bash
   # Download from nodejs.org
   node --version  # Verify: v18+
   npm --version   # Verify: v9+
   ```

2. **Visual Studio Code**

   - Download from code.visualstudio.com
   - Essential for Vue 3 development

3. **Git (if not installed)**
   ```bash
   git --version  # Should show version number
   ```

---

### Essential VS Code Extensions for Vue 3

**Must-Have Extensions:**

```
1. Vue - Official (Volar)
2. TypeScript Vue Plugin (Volar)
3. ESLint
4. Prettier - Code formatter
5. Auto Rename Tag
6. Bracket Pair Colorizer
7. Thunder Client (for API testing)
8. Vue VSCode Snippets
```

**Installation:**

- Open VS Code → Extensions (Ctrl+Shift+X)
- Search and install each extension
- Restart VS Code after installation

---

### Project Creation: Vite vs Vue CLI

**Recommended: Vite (Faster, Modern)**

```bash
# Create new TypeScript Vue 3 project
npm create vue@latest my-student-app

# Choose options:
# ✓ TypeScript
# ✓ JSX Support
# ✓ Vue Router
# ✓ Pinia
# ✓ Vitest
# ✓ ESLint
# ✓ Prettier

# Navigate and install
cd my-student-app
npm install

# Start development server
npm run dev
```

**Alternative: Vue CLI (More Traditional)**

```bash
# Create new TypeScript Vue 3 project
npm install -g @vue/cli
vue create my-student-app

# Choose:
# - TypeScript
# - Router
# - Vuex
# - Linter / Formatter
```

**Why Vite for Your Projects?**

- ⚡ 10x faster development server
- 🔥 Hot Module Replacement (instant updates)
- 📦 Optimized builds
- 🎯 Perfect for modern web development
- 🚀 Built-in TypeScript support

---

### Project Structure Best Practices

```
src/
├── components/    # Reusable UI components
├── views/         # Route components
├── composables/   # Custom composables
├── services/      # API/external services
├── stores/        # Pinia stores
├── utils/         # Helper functions
├── types/         # TypeScript type definitions
└── assets/        # Static assets
```

---

### Vue 3 Key Features

**Composition API:**
- Better TypeScript support
- More flexible code organization
- Easier testing and reusability
- Better performance

**Reactivity System:**
- Proxy-based reactivity
- Fine-grained updates
- Better performance than Vue 2

**Multiple Root Elements:**
- No need for single root element
- More flexible template structure

**Teleport:**
- Render components outside their parent
- Perfect for modals and overlays

**Suspense:**
- Handle async components
- Better loading states

---

### Modern JavaScript with Vue 3

```vue
<!-- Single File Component with TypeScript -->
<script setup lang="ts">
interface User {
  id: number;
  name: string;
  age: number;
  email: string;
}

interface Props {
  users: User[];
}

const props = defineProps<Props>();

// Using modern JavaScript features
const activeUsers = computed(() =>
  props.users.filter(user => user.age >= 18)
);

const handleUserClick = (user: User) => {
  console.log('User clicked:', user.name);
};
</script>

<template>
  <div class="user-list">
    <h2>Active Users ({{ activeUsers.length }})</h2>
    <div v-for="user in activeUsers" :key="user.id"
         @click="handleUserClick(user)"
         class="user-card">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
      <span class="age">{{ user.age }} years old</span>
    </div>
  </div>
</template>

<style scoped>
.user-list {
  padding: 20px;
}

.user-card {
  border: 1px solid #ddd;
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-card:hover {
  background-color: #f5f5f5;
  transform: translateY(-2px);
}
</style>
```

---

### Vue 3 Composition API Patterns

**Basic Setup:**
```vue
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

// Reactive data
const count = ref(0)
const message = ref('Hello Vue 3!')

// Computed properties
const doubleCount = computed(() => count.value * 2)

// Watchers
watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`)
})

// Lifecycle hooks
onMounted(() => {
  console.log('Component mounted')
})

// Methods
const increment = () => {
  count.value++
}
</script>
```

**Props and Emits:**
```vue
<script setup lang="ts">
interface Props {
  title: string
  count?: number
}

interface Emits {
  update: [value: string]
  delete: [id: number]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleUpdate = (value: string) => {
  emit('update', value)
}
</script>
```

---

### Common Patterns

- **Single File Components (SFC)**
- **Composition API with script setup**
- **Props & Emits with TypeScript**
- **Reactive State Management**
- **Computed Properties**
- **Watchers**
- **Lifecycle Hooks**
- **Custom Composables**

---

### Best Practices

1. **Use Composition API with script setup**
2. **Define TypeScript interfaces for props**
3. **Use reactive() for objects, ref() for primitives**
4. **Extract reusable logic into composables**
5. **Follow Vue 3 naming conventions**
6. **Use scoped styles**
7. **Implement proper error handling**
8. **Write clean, readable code**

---

### Common Pitfalls

- **Not using script setup syntax**
- **Mixing Options API and Composition API**
- **Forgetting .value with refs in script**
- **Not defining proper TypeScript interfaces**
- **Poor component organization**
- **Ignoring ESLint warnings**
- **Inconsistent code formatting**
- **Using outdated Vue 2 patterns**

---

### Practical Exercise

Create a Profile Card Component:

```vue
<!-- ProfileCard.vue -->
<script setup lang="ts">
interface User {
  id: number
  name: string
  role: string
  bio: string
  avatar: string
}

interface Props {
  user: User
}

const props = defineProps<Props>()

const emit = defineEmits<{
  edit: [user: User]
  delete: [id: number]
}>()

const handleEdit = () => {
  emit('edit', props.user)
}

const handleDelete = () => {
  emit('delete', props.user.id)
}
</script>

<template>
  <div class="profile-card">
    <img :src="user.avatar" :alt="user.name" class="avatar" />
    <h2>{{ user.name }}</h2>
    <h3>{{ user.role }}</h3>
    <p>{{ user.bio }}</p>
    <div class="actions">
      <button @click="handleEdit" class="btn-edit">Edit</button>
      <button @click="handleDelete" class="btn-delete">Delete</button>
    </div>
  </div>
</template>

<style scoped>
.profile-card {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  max-width: 300px;
  margin: 20px auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 15px;
}

.actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn-edit, .btn-delete {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-edit {
  background: #007bff;
  color: white;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.btn-edit:hover, .btn-delete:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
```

**Usage:**
```vue
<!-- App.vue -->
<script setup lang="ts">
import ProfileCard from './components/ProfileCard.vue'

const user = {
  id: 1,
  name: 'John Doe',
  role: 'Vue Developer',
  bio: 'Passionate about building user interfaces',
  avatar: '/john-avatar.jpg'
}

const handleEdit = (user: any) => {
  console.log('Edit user:', user)
}

const handleDelete = (id: number) => {
  console.log('Delete user:', id)
}
</script>

<template>
  <ProfileCard
    :user="user"
    @edit="handleEdit"
    @delete="handleDelete"
  />
</template>
```

---

### Additional Resources

- [Vue 3 Documentation](https://vuejs.org/guide/)
- [Vue 3 Composition API](https://vuejs.org/guide/composition-api-introduction.html)
- [TypeScript with Vue 3](https://vuejs.org/guide/typescript/overview.html)
- [Vite Guide](https://vitejs.dev/guide/)
- [ESLint Documentation](https://eslint.org/)
- [Vue 3 Examples](https://github.com/vuejs/awesome-vue#examples)