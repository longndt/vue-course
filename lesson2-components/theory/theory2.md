# Th## Theory 2: Advanced Component Patterns & State Management

_For detailed learning objectives and prerequisites, see [readme.md](../readme.md)_ory 2: Component Architecture & Advanced State Management 🛡️

## Quick Reference 📋

*For detailed learning objectives and prerequisites, see [README.md](../README.md)*

---

## Why Component Architecture Matters? 🤔

**Think Beyond Simple Components:**

Modern React applications need:

- **Reusable Components** → Consistent UI across pages
- **Scalable Architecture** → Easy to maintain and extend
- **Professional Patterns** → Industry-standard approaches

**Visual Example - E-commerce Dashboard:**

## What Will You Learn? 🎯

After this lesson, you will:

- Master advanced component patterns used in production applications
- Build complex state management systems for modern applications
- Create reusable component libraries
- Implement forms and validation like industry standards
- Design scalable component architectures
- Apply patterns used by companies like Facebook, Netflix, and Airbnb

---

## Why Component Architecture Matters for Your Projects? 🤔

**Think Beyond Simple Components:**

Professional applications need:
- **Admin Dashboards** → Reusable data tables, forms, modals
- **User Interfaces** → Consistent buttons, inputs, navigation
- **Complex Features** → Multi-step forms, data visualization, file uploads

**Real-World Example - E-commerce Admin Panel:**
```

E-commerce Dashboard �
├── Sidebar Navigation (Reusable)
│ ├── Navigation Item (Atomic)
│ └── User Profile (Compound)
├── Main Content Area
│ ├── Stats Cards (Reusable Grid)
│ ├── Data Table (Complex Component)
│ │ ├── Table Header (Sortable)
│ │ ├── Table Row (Actions)
│ │ └── Pagination (Stateful)
│ └── Modal Forms (Overlay)
└── Footer (Static)

````

**Building Blocks Approach:**
- **Atomic Components**: Button, Input, Icon
- **Molecule Components**: SearchBox, Card, FormField
- **Organism Components**: Header, ProductList, DataTable
- **Page Components**: Dashboard, ProductManagement, UserProfile

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

<script setup>
import { ref, computed } from 'vue';

// Simple counter - perfect for local state
const count = ref(0);
const isEven = computed(() => count.value % 2 === 0);

const handleIncrement = () => {
  count.value++;
};
</script>
```

// Complex form state - still local but more sophisticated
```vue
<script setup>
import { reactive, ref } from 'vue';

const formData = reactive({
  name: '',
  email: '',
  courses: [],
  preferences: {
    notifications: true,
    theme: 'light'
  }
});

const errors = ref({});
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
````

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
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    applyDiscount,
    setLoading,
  };
});

// Usage in component
```vue
<script setup>
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
```

### When to Use State?

Use state when something needs to change:

- Counter numbers
- Form inputs
- Toggle switches
- Lists that change
- User preferences

````

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
      />
    </div>

    <!-- Email Input -->
    <div>
      <label>Email:</label>
      <input
        type="email"
        v-model="email"
      />
    </div>

    <button type="submit">Sign Up</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';

// Store form data in refs
const name = ref('');
const email = ref('');

// Handle form submission
const handleSubmit = () => {
  alert(`Hello ${name.value}!`);
};
</script>


      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <button type="submit">Sign Up</button>
    </form>
  );
}
````

### Form Styling:

```css
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
}

input {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}
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

<script setup>
import { ref } from 'vue';
import ScoreDisplay from './ScoreDisplay.vue';
import ScoreButtons from './ScoreButtons.vue';

const score = ref(0);

const updateScore = (newScore) => {
  score.value = newScore;
};
</script>

<!-- ScoreDisplay.vue -->
<template>
  <div class="score">Points: {{ score }}</div>
</template>

<script setup>
defineProps(['score']);
</script>

<!-- ScoreButtons.vue -->
<template>
  <div>
    <button @click="$emit('updateScore', (prev) => prev + 1)">Add Point</button>
    <button @click="$emit('updateScore', (prev) => prev - 1)">Remove Point</button>
  </div>
</template>

<script setup>
defineEmits(['updateScore']);
</script>
```

## Common Mistakes to Avoid ⚠️

### 1. Changing State Directly

```vue
<script setup>
import { ref } from 'vue';

// ❌ Wrong - Don't reassign ref itself
const score = ref(0);
score = 10; // Don't do this!

// ✅ Correct - Use .value
score.value = 10;
</script>
```

### 2. Forgetting State Updates Are Async

```jsx
// ❌ Wrong
setCount(count + 1);
setCount(count + 1); // Won't work as expected

// ✅ Correct
setCount((prev) => prev + 1);
setCount((prev) => prev + 1);
```

### 3. Complex State Updates

````vue
<script setup>
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

---

## Practice Time! 💪

### Exercise 1: Todo List App
Create a simple todo list:
1. Add new todos
2. Mark todos as complete
3. Delete todos

```vue
<template>
  <div>
    <input
      v-model="input"
      @keyup.enter="addTodo"
      placeholder="Add new todo..."
    />
    <button @click="addTodo">Add</button>

    <ul>
      <li
        v-for="todo in todos"
        :key="todo.id"
        :class="{ completed: todo.completed }"
      >
        <span>{{ todo.text }}</span>
        <button @click="toggleTodo(todo.id)">
          {{ todo.completed ? 'Undo' : 'Complete' }}
        </button>
        <button @click="deleteTodo(todo.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const todos = ref([]);
const input = ref('');

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

const toggleTodo = (id) => {
  const todo = todos.value.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
  }
};

const deleteTodo = (id) => {
  const index = todos.value.findIndex(t => t.id === id);
  if (index > -1) {
    todos.value.splice(index, 1);
  }
};
</script>

<style scoped>
.completed {
  text-decoration: line-through;
  opacity: 0.6;
}
</style>
}
````

### Exercise 2: Theme Switcher

Create a button that switches between light and dark theme:

```vue
<template>
  <div :class="isDark ? 'dark' : 'light'">
    <h1>My App</h1>
    <button @click="toggleTheme">
      Switch to {{ isDark ? 'Light' : 'Dark' }} Mode
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isDark = ref(false);

const toggleTheme = () => {
  isDark.value = !isDark.value;
};
</script>
```

## Need Help? 🆘

### Common Problems:

1. Component not updating?

   - Check if you're using setState
   - Make sure props are passed correctly
   - Check for typos in prop names

2. Form not working?

   - Add event.preventDefault()
   - Check your onChange handlers
   - Verify state updates

3. List items not showing?
   - Make sure to add 'key' prop
   - Check if array is empty
   - Verify map function

### Where to Get Help:

- [React Documentation](https://react.dev/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/reactjs)
- Ask your teacher!

## Homework 📝

### Create a Mini Shopping Cart

Build a simple shopping cart with:

1. Product list
2. Add to cart button
3. Cart total
4. Remove from cart

Tips:

- Start small
- Test each feature
- Style it nicely
- Ask for help when stuck!
