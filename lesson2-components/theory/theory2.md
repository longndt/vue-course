# Vue 3 Component Architecture & Advanced State Management

## Theory 2: Advanced Component Patterns & State Management 🛡️

### Quick Reference 📋

*For detailed learning objectives and prerequisites, see [README.md](../README.md)*

---

## Why Component Architecture Matters? 🤔

**Think Beyond Simple Components:**

Modern Vue 3 applications need:

- **Reusable Components** → Consistent UI across pages
- **Scalable Architecture** → Easy to maintain and extend
- **Professional Patterns** → Industry-standard approaches

**Visual Example - E-commerce Dashboard:**

```
E-commerce Dashboard 🏪
├── Sidebar Navigation (Reusable)
│   ├── Navigation Item (Atomic)
│   └── User Profile (Compound)
├── Main Content Area
│   ├── Stats Cards (Reusable Grid)
│   ├── Data Table (Complex Component)
│   │   ├── Table Header (Sortable)
│   │   ├── Table Row (Actions)
│   │   └── Pagination (Stateful)
│   └── Modal Forms (Overlay)
└── Footer (Static)
```

**Building Blocks Approach:**
- **Atomic Components**: Button, Input, Icon
- **Molecule Components**: SearchBox, Card, FormField
- **Organism Components**: Header, ProductList, DataTable
- **Page Components**: Dashboard, ProductManagement, UserProfile

---

## What Will You Learn? 🎯

After this lesson, you will:

- Master advanced component patterns used in production applications
- Build complex state management systems for modern applications
- Create reusable component libraries
- Implement forms and validation like industry standards
- Design scalable component architectures
- Apply patterns used by companies like Alibaba, GitLab, and Adobe

---

## Advanced State Management Patterns 🧠

### 1. Local Component State (ref/reactive)

**Best for:** Component-specific data that doesn't need to be shared

```vue
<template>
  <div>
    <span>Count: {{ count }} ({{ isEven ? 'Even' : 'Odd' }})</span>
    <button @click="handleIncrement">+</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Simple counter - perfect for local state
const count = ref(0);
const isEven = computed(() => count.value % 2 === 0);

const handleIncrement = () => {
  count.value++;
};
</script>
```

**Complex form state - still local but more sophisticated:**

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue';

interface FormData {
  name: string;
  email: string;
  courses: string[];
  preferences: {
    notifications: boolean;
    theme: string;
  };
}

const formData = reactive<FormData>({
  name: '',
  email: '',
  courses: [],
  preferences: {
    notifications: true,
    theme: 'light'
  }
});

const errors = ref<Record<string, string>>({});
const isSubmitting = ref(false);

const handleFieldChange = (field: string, value: any) => {
  formData[field] = value;

  // Clear error when user starts typing
  if (errors.value[field]) {
    delete errors.value[field];
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <!-- Form fields -->
  </form>
</template>
```

### 2. Pinia Store for Complex State Logic

**Best for:** Complex state updates, multiple related state variables

```typescript
// State management for a shopping cart using Pinia
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Discount {
  id: string;
  amount: number;
  type: 'percentage' | 'fixed';
}

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItem[]>([]);
  const discounts = ref<Discount[]>([]);
  const isLoading = ref(false);

  // Computed
  const total = computed(() => {
    return items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  });

  const itemCount = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0);
  });

  // Actions
  const addItem = (newItem: CartItem) => {
    const existingItem = items.value.find(item => item.id === newItem.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.value.push(newItem);
    }
  };

  const removeItem = (itemId: string) => {
    const index = items.value.findIndex(item => item.id === itemId);
    if (index > -1) {
      items.value.splice(index, 1);
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    const item = items.value.find(item => item.id === itemId);
    if (item) {
      item.quantity = quantity;
    }
  };

  const applyDiscount = (discount: Discount) => {
    discounts.value.push(discount);
  };

  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  return {
    // State
    items,
    discounts,
    isLoading,
    // Getters
    total,
    itemCount,
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    applyDiscount,
    setLoading,
  };
});

// Usage in component
```

```vue
<script setup lang="ts">
import { useCartStore } from './stores/cart';

const cartStore = useCartStore();

const addToCart = (product: Product) => {
  cartStore.addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 1,
  });
};
</script>

<template>
  <div>
    <!-- Cart UI -->
    <div v-for="item in cartStore.items" :key="item.id">
      {{ item.name }} - {{ item.quantity }}
    </div>
    <p>Total: {{ cartStore.total }}</p>
  </div>
</template>
```

### When to Use State?

Use state when something needs to change:

- Counter numbers
- Form inputs
- Toggle switches
- Lists that change
- User preferences

---

## Working with Forms 📝

### Simple Form Example:

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <!-- Name Input -->
    <div>
      <label>Name:</label>
      <input
        type="text"
        v-model="name"
        :class="{ error: errors.name }"
      />
      <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
    </div>

    <!-- Email Input -->
    <div>
      <label>Email:</label>
      <input
        type="email"
        v-model="email"
        :class="{ error: errors.email }"
      />
      <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
    </div>

    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Signing Up...' : 'Sign Up' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

// Store form data in refs
const name = ref('');
const email = ref('');
const isSubmitting = ref(false);
const errors = reactive<Record<string, string>>({});

// Handle form submission
const handleSubmit = async () => {
  isSubmitting.value = true;

  // Clear previous errors
  Object.keys(errors).forEach(key => delete errors[key]);

  // Simple validation
  if (!name.value.trim()) {
    errors.name = 'Name is required';
  }

  if (!email.value.trim()) {
    errors.email = 'Email is required';
  } else if (!email.value.includes('@')) {
    errors.email = 'Please enter a valid email';
  }

  // If no errors, submit
  if (Object.keys(errors).length === 0) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Hello ${name.value}!`);
    } catch (error) {
      console.error('Submission error:', error);
    }
  }

  isSubmitting.value = false;
};
</script>

<style scoped>
form {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

input.error {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: -10px;
  margin-bottom: 10px;
  display: block;
}

button {
  background: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

button:hover:not(:disabled) {
  background: #0056b3;
}

button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}
</style>
```

---

## Making Components Work Together 🤝

### Passing Data Between Components:

```vue
<!-- Parent Component -->
<template>
  <div>
    <h1>Game Score: {{ score }}</h1>

    <!-- Pass score to child -->
    <ScoreDisplay :score="score" />

    <!-- Pass function to child -->
    <ScoreButtons @update-score="updateScore" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ScoreDisplay from './ScoreDisplay.vue';
import ScoreButtons from './ScoreButtons.vue';

const score = ref(0);

const updateScore = (newScore: number) => {
  score.value = newScore;
};
</script>

<!-- ScoreDisplay.vue -->
<template>
  <div class="score">Points: {{ score }}</div>
</template>

<script setup lang="ts">
interface Props {
  score: number;
}

defineProps<Props>();
</script>

<style scoped>
.score {
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
  text-align: center;
  margin: 20px 0;
}
</style>

<!-- ScoreButtons.vue -->
<template>
  <div class="score-buttons">
    <button @click="addPoint">Add Point</button>
    <button @click="removePoint">Remove Point</button>
    <button @click="resetScore">Reset</button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  'update-score': [value: number];
}>();

const addPoint = () => {
  emit('update-score', 1);
};

const removePoint = () => {
  emit('update-score', -1);
};

const resetScore = () => {
  emit('update-score', 0);
};
</script>

<style scoped>
.score-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 20px 0;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

button:first-child {
  background: #28a745;
  color: white;
}

button:nth-child(2) {
  background: #dc3545;
  color: white;
}

button:last-child {
  background: #6c757d;
  color: white;
}

button:hover {
  opacity: 0.8;
}
</style>
```

---

## Advanced Component Patterns 🏗️

### 1. Compound Components Pattern

```vue
<!-- Modal.vue -->
<template>
  <div v-if="isOpen" class="modal-overlay" @click="close">
    <div class="modal-content" @click.stop>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue';

interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();

const close = () => {
  emit('close');
};

// Provide context to child components
provide('modal', {
  close
});
</script>

<!-- ModalHeader.vue -->
<template>
  <div class="modal-header">
    <h2><slot /></h2>
    <button @click="close" class="close-btn">&times;</button>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';

const modal = inject('modal') as { close: () => void };
const close = modal.close;
</script>

<!-- ModalBody.vue -->
<template>
  <div class="modal-body">
    <slot />
  </div>
</template>

<!-- ModalFooter.vue -->
<template>
  <div class="modal-footer">
    <slot />
  </div>
</template>

<!-- Usage -->
<template>
  <Modal :is-open="showModal" @close="showModal = false">
    <ModalHeader>Edit User</ModalHeader>
    <ModalBody>
      <form>
        <!-- Form content -->
      </form>
    </ModalBody>
    <ModalFooter>
      <button @click="save">Save</button>
      <button @click="showModal = false">Cancel</button>
    </ModalFooter>
  </Modal>
</template>
```

### 2. Render Props Pattern with Slots

```vue
<!-- DataFetcher.vue -->
<template>
  <div>
    <slot
      :data="data"
      :loading="loading"
      :error="error"
      :refetch="refetch"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Props {
  url: string;
}

const props = defineProps<Props>();

const data = ref(null);
const loading = ref(false);
const error = ref(null);

const fetchData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch(props.url);
    data.value = await response.json();
  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
};

const refetch = () => {
  fetchData();
};

onMounted(() => {
  fetchData();
});
</script>

<!-- Usage -->
<template>
  <DataFetcher url="/api/users">
    <template #default="{ data, loading, error, refetch }">
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">Error: {{ error.message }}</div>
      <div v-else>
        <h2>Users ({{ data.length }})</h2>
        <button @click="refetch">Refresh</button>
        <ul>
          <li v-for="user in data" :key="user.id">
            {{ user.name }}
          </li>
        </ul>
      </div>
    </template>
  </DataFetcher>
</template>
```

---

## Common Mistakes to Avoid ⚠️

### 1. Changing State Directly

```vue
<script setup lang="ts">
import { ref } from 'vue';

// ❌ Wrong - Don't reassign ref itself
const score = ref(0);
score = 10; // Don't do this!

// ✅ Correct - Use .value
score.value = 10;
</script>
```

### 2. Forgetting .value with refs

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';

const count = ref(0);

// ❌ Wrong - Missing .value
const doubleCount = computed(() => count * 2);

// ✅ Correct - Use .value
const doubleCount = computed(() => count.value * 2);
</script>
```

### 3. Complex State Updates

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue';

// ❌ Wrong - too complex for single ref
const user = ref({
  name: 'John',
  scores: [1, 2, 3],
  settings: { theme: 'dark' }
});

// ✅ Better - split into smaller refs or use reactive
const name = ref('John');
const scores = ref([1, 2, 3]);
const theme = ref('dark');

// ✅ Or use reactive for related data
const user = reactive({
  name: 'John',
  scores: [1, 2, 3],
  settings: { theme: 'dark' }
});
</script>
```

---

## Practice Time! 💪

### Exercise 1: Todo List App

Create a simple todo list:

```vue
<template>
  <div class="todo-app">
    <h1>My Todo List</h1>

    <div class="add-todo">
      <input
        v-model="input"
        @keyup.enter="addTodo"
        placeholder="Add new todo..."
        class="todo-input"
      />
      <button @click="addTodo" class="add-btn">Add</button>
    </div>

    <ul class="todo-list">
      <li
        v-for="todo in todos"
        :key="todo.id"
        :class="{ completed: todo.completed }"
        class="todo-item"
      >
        <span class="todo-text">{{ todo.text }}</span>
        <div class="todo-actions">
          <button @click="toggleTodo(todo.id)" class="toggle-btn">
            {{ todo.completed ? 'Undo' : 'Complete' }}
          </button>
          <button @click="deleteTodo(todo.id)" class="delete-btn">Delete</button>
        </div>
      </li>
    </ul>

    <div class="todo-stats">
      <p>Total: {{ todos.length }}</p>
      <p>Completed: {{ completedCount }}</p>
      <p>Remaining: {{ remainingCount }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const todos = ref<Todo[]>([]);
const input = ref('');

const completedCount = computed(() =>
  todos.value.filter(todo => todo.completed).length
);

const remainingCount = computed(() =>
  todos.value.filter(todo => !todo.completed).length
);

const addTodo = () => {
  if (input.value.trim()) {
    todos.value.push({
      id: Date.now(),
      text: input.value,
      completed: false
    });
    input.value = ''; // Clear input
  }
};

const toggleTodo = (id: number) => {
  const todo = todos.value.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
  }
};

const deleteTodo = (id: number) => {
  const index = todos.value.findIndex(t => t.id === id);
  if (index > -1) {
    todos.value.splice(index, 1);
  }
};
</script>

<style scoped>
.todo-app {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.add-todo {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.todo-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.add-btn {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.todo-item.completed {
  opacity: 0.6;
  text-decoration: line-through;
}

.todo-text {
  flex: 1;
}

.todo-actions {
  display: flex;
  gap: 5px;
}

.toggle-btn, .delete-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.875rem;
}

.toggle-btn {
  background: #28a745;
  color: white;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.todo-stats {
  margin-top: 20px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
  display: flex;
  gap: 20px;
}
</style>
```

### Exercise 2: Theme Switcher

Create a button that switches between light and dark theme:

```vue
<template>
  <div :class="isDark ? 'dark' : 'light'" class="theme-container">
    <h1>My App</h1>
    <button @click="toggleTheme" class="theme-btn">
      Switch to {{ isDark ? 'Light' : 'Dark' }} Mode
    </button>
    <p>Current theme: {{ isDark ? 'Dark' : 'Light' }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isDark = ref(false);

const toggleTheme = () => {
  isDark.value = !isDark.value;
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    isDark.value = savedTheme === 'dark';
  }
});
</script>

<style scoped>
.theme-container {
  min-height: 100vh;
  padding: 20px;
  transition: all 0.3s ease;
}

.light {
  background: white;
  color: black;
}

.dark {
  background: #1a1a1a;
  color: white;
}

.theme-btn {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 10px 0;
}

.theme-btn:hover {
  background: #0056b3;
}
</style>
```

---

## Need Help? 🆘

### Common Problems:

1. **Component not updating?**
   - Check if you're using `.value` with refs
   - Make sure props are passed correctly
   - Check for typos in prop names

2. **Form not working?**
   - Add `@submit.prevent` to form
   - Check your `v-model` bindings
   - Verify state updates

3. **List items not showing?**
   - Make sure to add `:key` prop
   - Check if array is empty
   - Verify `v-for` syntax

### Where to Get Help:

- [Vue 3 Documentation](https://vuejs.org/guide/)
- [Vue 3 Composition API](https://vuejs.org/guide/composition-api-introduction.html)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/vuejs)
- Ask your teacher!

---

## Homework 📝

### Create a Mini Shopping Cart

Build a simple shopping cart with:

1. Product list
2. Add to cart button
3. Cart total
4. Remove from cart

**Tips:**
- Start small
- Test each feature
- Style it nicely
- Ask for help when stuck!

**Bonus Features:**
- Quantity controls
- Cart persistence (localStorage)
- Empty cart state
- Total price calculation