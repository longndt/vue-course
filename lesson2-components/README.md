# Lesson 2: Component Architecture & Reactive State

## Overview

In this lesson, you'll master Vue 3 component patterns, reactive state management, and build reusable component libraries. We'll cover modern component composition patterns, composables, and form handling techniques used in professional Vue applications.

## Learning Objectives

After this lesson, you will be able to:

- Design scalable component architectures
- Master reactive state management patterns (ref, reactive, computed, Pinia)
- Create composables for reusable business logic
- Build complex forms with validation
- Implement component composition patterns
- Handle performance optimization with Vue's reactivity

## 1. Understanding Components & Props

### Component Approaches

1. Script Setup (Recommended)

```vue
<script setup>
defineProps(['name'])
</script>

<template>
  <h1>Hello, {{ name }}!</h1>
</template>
```

2. Options API (Legacy)

```vue
<script>
export default {
  props: ['name'],
  template: '<h1>Hello, {{ name }}!</h1>'
}
</script>
```

### Props

Props are like arguments for components:

```vue
<!-- Component definition -->
<script setup>
defineProps({
  name: String,
  role: String,
  imageUrl: String
})
</script>

<template>
  <div class="card">
    <img :src="imageUrl" :alt="name" />
    <h2>{{ name }}</h2>
    <p>{{ role }}</p>
  </div>
</template>
```

```vue
<!-- Using the component -->
<UserCard name="John Doe" role="Developer" imageUrl="john.jpg" />
```

## 🔍 **Knowledge Checkpoint 1**

Before continuing, make sure you understand:

1. **What's the difference between script setup and Options API?**
2. **How do you pass multiple props to a component?**
3. **Can props be modified inside a component? Why or why not?**

_💡 Props are read-only - think of them as the "settings" for your component._

---

## 2. Managing Reactive State

### Using ref

```vue
<script setup>
import { ref } from 'vue'

// Declare reactive variable
const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```

### Using watchers and lifecycle

```vue
<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps(['userId'])
const user = ref(null)
const loading = ref(true)

async function fetchUser(id) {
  loading.value = true
  try {
    const response = await fetch(`/api/users/${id}`)
    user.value = await response.json()
  } finally {
    loading.value = false
  }
}

// Watch for userId changes
watch(() => props.userId, fetchUser, { immediate: true })
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else>
    <h2>{{ user.name }}</h2>
    <p>{{ user.email }}</p>
  </div>
</template>
```

## 🔍 **Knowledge Checkpoint 2**

Test your understanding of reactive state:

1. **When should you use ref vs reactive?**
2. **What happens if you forget to use .value with refs?**
3. **How does Vue's reactivity system detect changes?**

_💡 Vue's proxy-based reactivity automatically tracks dependencies and updates the DOM!_

---

## 3. Building Reusable Components

### 1. Button Component

```vue
<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary'
  }
})

const emit = defineEmits(['click'])

const buttonClass = computed(() => `button ${props.variant}`)
</script>

<template>
  <button :class="buttonClass" @click="emit('click')">
    <slot></slot>
  </button>
</template>
```

```vue
<!-- Usage -->
<Button variant="secondary" @click="() => alert('Clicked!')">
  Click Me
</Button>
```

### 2. Input Component

```vue
<script setup>
const props = defineProps({
  label: String,
  type: {
    type: String,
    default: 'text'
  },
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

function updateValue(event) {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <div class="input-group">
    <label>{{ label }}</label>
    <input
      :type="type"
      :value="modelValue"
      @input="updateValue"
    />
  </div>
</template>
```

```vue
<!-- Usage -->
<script setup>
import { ref } from 'vue'

const name = ref('')
</script>

<template>
  <Input label="Your Name" v-model="name" />
</template>
```

### 3. Card Component

```vue
<script setup>
defineProps({
  title: String
})
</script>

<template>
  <div class="card">
    <div class="card-header">
      <h3>{{ title }}</h3>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
```

```vue
<!-- Usage -->
<Card title="Welcome">
  <p>This is a reusable card component.</p>
  <template #footer>
    <Button>Learn More</Button>
  </template>
</Card>
```

## 4. Creating Composables

### 1. useLocalStorage

```ts
// composables/useLocalStorage.js
import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  // Get stored value or default value
  const storedValue = localStorage.getItem(key)
  const initialValue = storedValue ? JSON.parse(storedValue) : defaultValue

  const value = ref(initialValue)

  // Watch for changes and update localStorage
  watch(
    value,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    { deep: true }
  )

  return value
}
```

```vue
<!-- Usage -->
<script setup>
import { useLocalStorage } from './composables/useLocalStorage'

const theme = useLocalStorage('theme', 'light')

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <div :class="theme">
    <button @click="toggleTheme">
      Toggle Theme
    </button>
  </div>
</template>
```

### 2. useForm

```ts
// composables/useForm.js
import { reactive } from 'vue'

export function useForm(initialValues) {
  const values = reactive({ ...initialValues })

  const updateField = (name, value) => {
    values[name] = value
  }

  const reset = () => {
    Object.assign(values, initialValues)
  }

  return {
    values,
    updateField,
    reset
  }
}
```

```vue
<!-- Usage -->
<script setup>
import { useForm } from './composables/useForm'

const { values, updateField, reset } = useForm({
  username: '',
  email: '',
  password: ''
})

function handleSubmit() {
  console.log('Form values:', values)
  reset()
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <Input
      label="Username"
      v-model="values.username"
    />
    <!-- More inputs -->
    <button type="submit">Submit</button>
  </form>
</template>
```

## Lab Exercises

### Exercise 1: Component Library

Build a basic component library including:

1. Button (primary, secondary, danger variants)
2. Input (text, number, email types with v-model)
3. Card (with slots for header, body, footer)
4. Alert (success, warning, error variants)

### Exercise 2: Form Builder

Create a reusable form system with:

1. Form validation using computed properties
2. Error messages with conditional rendering
3. Submit handling with prevent modifier
4. Reset functionality using reactive state

### Exercise 3: Theme Switcher

Build a theme switching system using:

1. Composables (useLocalStorage)
2. Local storage persistence
3. CSS variables with dynamic binding
4. Smooth transitions

## Additional Resources

- [Vue 3 Components](https://vuejs.org/guide/essentials/component-basics.html)
- [Vue 3 Composables](https://vuejs.org/guide/reusability/composables.html)
- [Vue 3 Patterns](https://vue-patterns.surge.sh/)
- [CSS Modules with Vue](https://vue-loader.vuejs.org/guide/css-modules.html)

## 📊 **Final Knowledge Assessment**

Complete this self-assessment to check your readiness for lesson 3:

### **Component Architecture (Must Know)**

- [ ] I can create reusable components with props
- [ ] I understand when to break UI into smaller components
- [ ] I can use emit for event handling
- [ ] I know how to use slots for composition

### **Reactive State Management (Must Know)**

- [ ] I can use ref and reactive for component state
- [ ] I understand when and why to use watchers
- [ ] I know how to prevent infinite watcher loops
- [ ] I can manage form state with v-model

### **Advanced Patterns (Good to Know)**

- [ ] I can create and use composables
- [ ] I understand provide/inject for sharing state
- [ ] I know how to optimize components with computed properties
- [ ] I can implement compound component patterns with slots

### **Practical Skills (Must Demonstrate)**

- [ ] I built a component library with multiple variants
- [ ] I created composables for reusable logic
- [ ] I implemented form handling with validation
- [ ] I can debug Vue applications using Vue DevTools

**🎯 Goal: Check at least 12/16 items before moving to Lesson 3**

### **Self-Reflection Questions**

1. Which component pattern felt most natural to you?
2. What's the biggest difference between props and reactive state?
3. How would you design components for a large Vue application?

---

## 🎓 **Ready for Lesson 3?**

If you completed the assessment above and feel comfortable with component architecture, you're ready to move on to [Lesson 3: API Integration & Data Management](../lesson3-data/).

**Still need practice?** Consider:

- Building more complex component hierarchies
- Experimenting with different reactive state approaches
- Creating your own composables
- Reviewing the patterns that felt challenging

## Homework

Create a mini design system including:

1. Component library

   - Typography components
   - Layout components
   - Form components
   - Interactive components

2. Theme system

   - Light/dark modes
   - Color variables
   - Spacing system
   - Typography scale

3. Documentation
   - Usage examples
   - Props documentation
   - Theme customization guide
