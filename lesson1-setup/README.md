# Lesson 1: Vue 3 Fundamentals & TypeScript Setup

## Overview

This lesson introduces Vue 3 fundamentals with a focus on modern development practices. We'll set up a professional developm## Your First Components 🏢️

### 1. Simple Welcome Component

```vue
<!-- src/components/Welcome.vue -->
<script setup>
// No need for explicit props or state here
</script>

<template>
  <div class="welcome">
    <h1>Hello Vue!</h1>
    <p>This is my first component</p>
  </div>
</template>

<style scoped>
.welcome {
  text-align: center;
  padding: 20px;
}
</style>
```ith Vite, understand Vue's core concepts, and build components with TypeScript from day one.

## Learning Objectives

By the end of this lesson, you will be able to:

- Understand Vue's component-based architecture and reactivity system
- Set up a modern Vue 3 development environment with Vite and TypeScript
- Create components using Composition API and script setup
- Manage reactive state and handle events
- Build reusable component patterns
- Apply modern JavaScript/TypeScript features in Vue 3

## Prerequisites

- Solid understanding of HTML, CSS, and JavaScript (ES6+)
- Experience with modern JavaScript features (destructuring, modules, async/await)
- Basic familiarity with command line operations
- Understanding of programming fundamentals and web technologies (DOM, events, HTTP)

**📚 Need a refresher?** Complete [Lesson 0: JavaScript ES6+ Review](../lesson0-prerequisites/) first.

## Understanding Vue 3

### Vue's Core Philosophy

Vue 3 is a progressive, component-based framework for building user interfaces. Vue provides:

- **Reactive System**: Fine-grained reactivity with Proxy-based observation
- **Component-Based Architecture**: Encapsulated, reusable UI pieces
- **Template Syntax**: Intuitive template-based approach with directives
- **Declarative Programming**: Describe what the UI should look like

### Vue vs Other Approaches

```javascript
// Traditional DOM manipulation
const button = document.getElementById("myButton");
button.addEventListener("click", function () {
  const counter = document.getElementById("counter");
  counter.textContent = parseInt(counter.textContent) + 1;
});

// Vue 3 approach
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">Count: {{ count }}</button>
</template>
```

### Modern Vue 3 with TypeScript

```vue
<script setup lang="ts">
interface User {
  id: number
  name: string
  email: string
}

interface Props {
  user: User
}

defineProps<Props>()

const emit = defineEmits<{
  edit: [user: User]
}>()
</script>

<template>
  <div class="user-card">
    <h3>{{ user.name }}</h3>
    <p>{{ user.email }}</p>
    <button @click="emit('edit', user)">Edit User</button>
  </div>
</template>
```
```

## Prerequisites Check ✅

Before diving into React concepts, ensure your development environment is properly set up:

> 📋 **Important**: Complete the [Comprehensive Environment Setup Guide](../setup/environment-setup.md) first if you haven't already. It provides detailed instructions for installing Node.js, VS Code, Git, and all necessary development tools.

**Quick Verification:**

```bash
node --version    # Should show v18.0.0 or higher
npm --version     # Should show v9.0.0 or higher
git --version     # Should show installed version
code --version    # Should show VS Code version
```

**Required Extensions in VS Code:**

- ES7+ React/Redux/React-Native snippets
- ESLint
- Prettier
- React Developer Tools (browser extension)

## Creating Your First Vue App 🎉

### Step-by-Step Guide

#### 1. Create New Project

Open terminal (Command Prompt on Windows) and type:

```bash
npm create vue@latest my-first-app
```

This will prompt you with several options. Choose:
- TypeScript: Yes
- JSX: No
- Vue Router: No (we'll add it later)
- Pinia: No (we'll add it later)
- Vitest: No (we'll add it later)
- ESLint: Yes
- Prettier: Yes

This creates a new folder called "my-first-app"

#### 2. Go to Project Folder

```bash
cd my-first-app
```

#### 3. Install Required Files

```bash
npm install
```

Wait until you see a green checkmark ✅

#### 4. Start the Project

```bash
npm run dev
```

You'll see a link (like http://localhost:5173) - hold Ctrl (Windows) or Cmd (Mac) and click it!

### Understanding Your Project Files 📁

```
my-first-app/
├── src/           👈 Your code goes here!
│   ├── App.vue    👈 Main component
│   ├── main.ts    👈 Starting point
│   └── style.css  👈 Main styles
├── public/        👈 Static assets go here
└── index.html     👈 Main HTML file
```

Remember:

- Always work in the `src` folder
- Put images and static files in `public`
- Vue components use `.vue` extension
- Don't touch files you don't understand yet!

## 🔍 **Knowledge Checkpoint 1**

Before moving on, make sure you can answer:

1. **What is the difference between `src` and `public` folders?**
2. **What does the `export default` statement do?**
3. **Why do we use `.vue` file extensions?**

_💡 Tip: If you're unsure about any answer, review the section above before continuing._

---

## Your First Components 🏗️

### 1. Simple Welcome Component

```jsx
// src/components/Welcome.jsx
function Welcome() {
  return (
    <div className="welcome">
      <h1>Hello React!</h1>
      <p>This is my first component</p>
    </div>
  );
}

export default Welcome; // Makes component available to other files
```

### 2. Button Component with Props

```vue
<!-- src/components/Button.vue -->
<script setup lang="ts">
interface Props {
  text: string
  color: string
}

defineProps<Props>()
</script>

<template>
  <button :class="`button ${color}`">
    {{ text }}
  </button>
</template>

<style scoped>
.button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
```

```vue
<!-- Using the Button: -->
<Button text="Click me!" color="blue" />
<Button text="Delete" color="red" />
```

### 3. Profile Card Component

```vue
<!-- src/components/ProfileCard.vue -->
<script setup lang="ts">
interface Props {
  name: string
  image: string
  role: string
}

defineProps<Props>()
</script>

<template>
  <div class="profile-card">
    <img :src="image" :alt="name" class="profile-image" />
    <h2>{{ name }}</h2>
    <p>{{ role }}</p>
  </div>
</template>

<style scoped>
.profile-card {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.profile-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>
```

```vue
<!-- Using ProfileCard: -->
<ProfileCard name="John Doe" image="/john.jpg" role="Vue Developer" />
```

### 4. Global Styling (Optional)

Vue components can have scoped styles, but you can also create global styles:

```css
/* src/style.css */
.button.blue {
  background: #007bff;
  color: white;
}

.button.red {
  background: #dc3545;
  color: white;
}

.button.green {
  background: #28a745;
  color: white;
}

/* Global utility classes */
.text-center {
  text-align: center;
}

.mt-4 {
  margin-top: 1rem;
}
```

## 🔍 **Knowledge Checkpoint 2**

Test your understanding of Vue components:

1. **How do you pass data to a component?**
2. **What is the syntax for using JavaScript expressions in Vue templates?**
3. **How do you apply CSS classes to Vue elements?**

_💡 Review the component examples above if you need help._

---

## Practice Time! 💪

### Exercise 1: Setup

1. Install all required tools
2. Create your first React project
3. Make it run in your browser
4. Try to understand the files

### Exercise 2: Simple Components

Create these basic components:

1. Header with title
2. Button that shows an alert
3. Card with some text
4. Image with caption

Example:

```vue
<!-- Header.vue -->
<script setup>
// No logic needed for simple header
</script>

<template>
  <header>
    <h1>My Vue App</h1>
  </header>
</template>

<style scoped>
header {
  padding: 20px;
  background: #f5f5f5;
}
</style>
```

### Exercise 3: Profile Card

Create a nice profile card that shows:

- Your photo
- Your name
- Your hobbies
- Favorite quote

Bonus:

- Add nice styles
- Make it colorful
- Add hover effects

## 🚫 Common Mistakes to Avoid

### 1. Component Names

```vue
<!-- ❌ Wrong - starts with lowercase -->
<!-- button.vue -->

<!-- ✅ Correct - starts with uppercase -->
<!-- Button.vue -->
```

### 2. Template Structure

```vue
<!-- ❌ Wrong - multiple root elements -->
<template>
  <div>First div</div>
  <div>Second div</div>
</template>

<!-- ✅ Correct - single root or use fragments -->
<template>
  <div>
    <div>First div</div>
    <div>Second div</div>
  </div>
</template>
```

### 3. Reactive Data

```vue
<!-- ❌ Wrong - not reactive -->
<script setup>
let count = 0 // This won't trigger updates
</script>

<!-- ✅ Correct - reactive -->
<script setup>
import { ref } from 'vue'
const count = ref(0) // This will trigger updates
</script>
```

## 📚 Extra Help

### Good Resources for Beginners

1. [Vue 3 Official Guide](https://vuejs.org/guide/)
2. [Vue 3 Composition API](https://vuejs.org/guide/composition-api-introduction.html)
3. [Vue Examples](https://github.com/vuejs/awesome-vue#examples)

### When You're Stuck

1. Check the error message carefully
2. Google the error message
3. Ask on [Stack Overflow](https://stackoverflow.com)
4. Ask your teacher!

## 🏠 Homework

Create a simple personal website using Vue 3:

1. Header with your name
2. About Me section
3. Your skills list (use v-for)
4. Contact information

## 📊 **Final Knowledge Assessment**

Complete this self-assessment to check your understanding:

### **Basic Concepts (Must Know)**

- [ ] I can explain what Vue 3 is and why it's useful
- [ ] I understand the difference between components and regular functions
- [ ] I can create a simple Vue component with template syntax
- [ ] I know how to pass props to components
- [ ] I understand Vue's reactive system basics

### **Setup & Tools (Must Know)**

- [ ] I can create a new Vue project with create-vue
- [ ] I know how to start the development server
- [ ] I understand the basic folder structure
- [ ] I can import and use components

### **TypeScript Basics (Good to Know)**

- [ ] I understand why TypeScript is helpful
- [ ] I can define basic interfaces for props
- [ ] I know how to type Vue components with script setup

### **Practical Skills (Must Demonstrate)**

- [ ] I built and ran my first Vue 3 application
- [ ] I created multiple reusable components
- [ ] I applied CSS styling to components (scoped styles)
- [ ] I can troubleshoot basic Vue errors

**🎯 Goal: Check at least 10/13 items before moving to Lesson 2**

### **Self-Reflection Questions**

1. What was the most challenging concept to understand?
2. Which part felt most similar to previous programming experience?
3. What would you like to build with React in future projects?

---

## 🎓 **Ready for Lesson 2?**

If you completed the assessment above and feel comfortable with Vue 3 basics, you're ready to move on to [Lesson 2: Component Architecture & Reactive State](../lesson2-components/).

**Still need practice?** That's totally normal! Consider:

- Reviewing the sections you found challenging
- Completing the homework assignment
- Building additional simple components
- Asking questions in class or during office hoursRemember:

- Break it into small components
- Style each part separately
- Ask for help if needed!

## 🤔 Check Your Understanding

1. What is a Vue component?
2. Why do we use components?
3. What's the difference between props and reactive data?
4. How do you create a new Vue project?
5. What's the purpose of the public folder?
6. What is the Composition API and script setup?
