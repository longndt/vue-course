# Vue 3 Fundamentals & JavaScript Setup - Quick Reference

## 🎯 **Vue 3 Core Concepts**

### **Single File Component (SFC) Structure**
```vue
<template>
  <!-- HTML template -->
  <div class="component">
    <h1>{{ title }}</h1>
    <button @click="handleClick">Click me</button>
  </div>
</template>

<script setup>
// JavaScript logic
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click', 'Hello from component')
}
</script>

<style scoped>
/* Scoped CSS */
.component {
  padding: 20px;
}
</style>
```

### **Reactive Data with Composition API**
```javascript
import { ref, reactive, computed, watch } from 'vue'

// Primitive values
const count = ref(0)
const message = ref('Hello Vue 3')

// Objects
const user = reactive({
  name: 'John',
  age: 30,
  email: 'john@example.com'
})

// Computed properties
const doubleCount = computed(() => count.value * 2)
const userDisplay = computed(() => `${user.name} (${user.age})`)

// Watchers
watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`)
})

// Deep watcher
watch(user, (newUser) => {
  console.log('User changed:', newUser)
}, { deep: true })
```

### **Props & Emits with JavaScript**
```javascript
// Props definition
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  },
  items: {
    type: Array,
    required: true
  },
  user: {
    type: Object,
    default: null
  }
})

// Emits definition
const emit = defineEmits(['update', 'delete', 'user-change'])

// Usage
emit('update', 'new value')
emit('delete', 123)
emit('user-change', { name: 'Jane', email: 'jane@example.com' })
```

### **Event Handling**
```vue
<template>
  <!-- Click events -->
  <button @click="handleClick">Click me</button>
  <button @click="handleClickWithEvent($event)">With event</button>

  <!-- Input events -->
  <input
    v-model="inputValue"
    @input="handleInput"
    @keyup.enter="handleEnter"
  />

  <!-- Custom events -->
  <button @click="emitCustomEvent">Emit custom</button>
</template>

<script setup>
const inputValue = ref('')

const handleClick = () => {
  console.log('Button clicked')
}

const handleClickWithEvent = (event) => {
  console.log('Event:', event)
}

const handleInput = (event) => {
  const target = event.target
  console.log('Input value:', target.value)
}

const handleEnter = () => {
  console.log('Enter pressed')
}

const emitCustomEvent = () => {
  emit('custom-event', { data: 'value' })
}
</script>
```

### **Conditional Rendering**
```vue
<template>
  <!-- v-if / v-else-if / v-else -->
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="hasError">Error occurred</div>
  <div v-else>Content loaded</div>

  <!-- v-show (CSS display toggle) -->
  <div v-show="isVisible">This div can be hidden</div>

  <!-- Multiple conditions -->
  <div v-if="user && user.isActive">Active user</div>
  <div v-else-if="user && !user.isActive">Inactive user</div>
  <div v-else>No user</div>
</template>
```

### **List Rendering**
```vue
<template>
  <!-- Basic list -->
  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item.name }}
    </li>
  </ul>

  <!-- List with index -->
  <ul>
    <li v-for="(item, index) in items" :key="item.id">
      {{ index + 1 }}. {{ item.name }}
    </li>
  </ul>

  <!-- Object iteration -->
  <ul>
    <li v-for="(value, key) in user" :key="key">
      {{ key }}: {{ value }}
    </li>
  </ul>

  <!-- Nested lists -->
  <div v-for="category in categories" :key="category.id">
    <h3>{{ category.name }}</h3>
    <ul>
      <li v-for="item in category.items" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>
```

### **Form Handling**
```vue
<template>
  <form @submit.prevent="handleSubmit">
    <!-- Text input -->
    <input
      v-model="form.name"
      type="text"
      placeholder="Name"
      required
    />

    <!-- Email input -->
    <input
      v-model="form.email"
      type="email"
      placeholder="Email"
      required
    />

    <!-- Select -->
    <select v-model="form.role">
      <option value="">Select role</option>
      <option value="admin">Admin</option>
      <option value="user">User</option>
    </select>

    <!-- Checkbox -->
    <label>
      <input v-model="form.agreed" type="checkbox" />
      I agree to terms
    </label>

    <!-- Radio buttons -->
    <div>
      <label>
        <input v-model="form.gender" type="radio" value="male" />
        Male
      </label>
      <label>
        <input v-model="form.gender" type="radio" value="female" />
        Female
      </label>
    </div>

    <!-- Textarea -->
    <textarea
      v-model="form.message"
      placeholder="Message"
    ></textarea>

    <button type="submit" :disabled="!isFormValid">
      Submit
    </button>
  </form>
</template>

<script setup>
const form = reactive({
  name: '',
  email: '',
  role: '',
  agreed: false,
  gender: '',
  message: ''
})

const isFormValid = computed(() => {
  return form.name && form.email && form.role && form.agreed
})

const handleSubmit = () => {
  if (isFormValid.value) {
    console.log('Form submitted:', form)
    // Handle form submission
  }
}
</script>
```

### **Component Communication**
```javascript
// Parent Component
<template>
  <ChildComponent
    :title="parentTitle"
    :items="parentItems"
    @update="handleUpdate"
    @delete="handleDelete"
  />
</template>

<script setup>
const parentTitle = ref('Parent Title')
const parentItems = ref(['item1', 'item2', 'item3'])

const handleUpdate = (value) => {
  console.log('Updated:', value)
}

const handleDelete = (index) => {
  parentItems.value.splice(index, 1)
}
</script>

// Child Component
<template>
  <div>
    <h2>{{ title }}</h2>
    <ul>
      <li v-for="(item, index) in items" :key="index">
        {{ item }}
        <button @click="deleteItem(index)">Delete</button>
      </li>
    </ul>
    <input v-model="newItem" @keyup.enter="addItem" />
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update', 'delete'])

const newItem = ref('')

const addItem = () => {
  if (newItem.value.trim()) {
    emit('update', newItem.value)
    newItem.value = ''
  }
}

const deleteItem = (index) => {
  emit('delete', index)
}
</script>
```

### **Lifecycle Hooks**
```javascript
import {
  onMounted,
  onUpdated,
  onUnmounted,
  onBeforeMount,
  onBeforeUpdate,
  onBeforeUnmount
} from 'vue'

// Component lifecycle
onBeforeMount(() => {
  console.log('Before component is mounted')
})

onMounted(() => {
  console.log('Component is mounted')
  // Good place for API calls, DOM manipulation
})

onBeforeUpdate(() => {
  console.log('Before component updates')
})

onUpdated(() => {
  console.log('Component updated')
})

onBeforeUnmount(() => {
  console.log('Before component unmounts')
  // Cleanup timers, event listeners
})

onUnmounted(() => {
  console.log('Component unmounted')
})
```

### **JavaScript Configuration**
```javascript
// vite.config.js
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

### **Common Patterns**
```javascript
// Loading state pattern
const isLoading = ref(false)
const data = ref(null)
const error = ref(null)

const fetchData = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await fetch('/api/data')
    data.value = await response.json()
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

// Toggle pattern
const isVisible = ref(false)
const toggle = () => {
  isVisible.value = !isVisible.value
}

// Counter pattern
const count = ref(0)
const increment = () => count.value++
const decrement = () => count.value--
const reset = () => count.value = 0
```

## 🎯 **Quick Tips**

1. **Always use `<script setup>`** for Composition API
2. **Define interfaces** for props and emits
3. **Use `ref()` for primitives**, `reactive()` for objects
4. **Prefer `computed()`** for derived state
5. **Use `watch()`** for side effects
6. **Always provide `key`** in v-for loops
7. **Use `.value`** to access ref values in script
8. **Template automatically unwraps** refs
9. **Use TypeScript** for better development experience
10. **Follow Vue 3 naming conventions**

## 📚 **Next Steps**

- Component composition patterns
- State management with Pinia
- Routing with Vue Router
- API integration
- Testing strategies
