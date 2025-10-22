# Quick Start Guide - Lesson 1

## Build Your First Vue 3 Application

### 1. Create New Vue 3 Project

```bash
# Create new project with TypeScript template
npm create vue@latest my-first-vue-app

# Navigate to project
cd my-first-vue-app

# Install dependencies
npm install

# Install useful libraries for modern development
npm install @vueuse/core  # For Vue composables
npm install clsx          # For conditional classes

# Start development server
npm run dev
```

### 2. Create Your First Component

Replace the content of `src/App.vue`:

```vue
<template>
  <div class="app">
    <header class="app-header">
      <div class="logo">⭐</div>
      <h1>Welcome to Vue 3 with TypeScript!</h1>
      <p>Hello, {{ user.name }} - {{ user.role }}</p>
    </header>

    <main class="app-main">
      <div class="card">
        <h2>Your First Vue Component</h2>
        <p>This component demonstrates:</p>
        <ul>
          <li>TypeScript interfaces</li>
          <li>Reactive data with ref</li>
          <li>Event handling</li>
          <li>Template syntax</li>
        </ul>

        <button @click="handleLike" class="like-button">
          👍 Like this ({{ likes }})
        </button>
      </div>

      <div class="info-card">
        <div class="heart">❤️</div>
        <p>You're ready to build amazing Vue applications!</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface User {
  id: number
  name: string
  role: string
}

const likes = ref(0)
const user = ref<User>({
  id: 1,
  name: 'Vue Developer',
  role: 'Student'
})

const handleLike = () => {
  likes.value++
}
</script>

### 3. Add Some Styles

Update `src/App.css`:

```css
.app {
  text-align: center;
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.app-header {
  margin-bottom: 2rem;
}

.app-header h1 {
  font-size: 2.5rem;
  margin: 1rem 0;
}

.app-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.card {
  background: white;
  color: #333;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.card h2 {
  color: #667eea;
  margin-bottom: 1rem;
}

.card ul {
  text-align: left;
  margin: 1rem 0;
}

.card li {
  margin: 0.5rem 0;
}

.like-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  margin-top: 1rem;
}

.like-button:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
}

.info-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

/* Responsive design */
@media (max-width: 768px) {
  .app {
    padding: 1rem;
  }

  .app-header h1 {
    font-size: 2rem;
  }

  .card {
    padding: 1.5rem;
  }
}
```

### 4. Test Your Application

Your app should now show:
- A beautiful gradient background
- A welcome header with your name
- A card explaining React concepts
- A like button that counts clicks
- Icons from Lucide React
- Responsive design

### 5. Understanding What You Built

**Key React Concepts Demonstrated:**
- **Components**: Reusable UI building blocks
- **TypeScript**: Type safety with interfaces
- **State**: Managing data with useState
- **Events**: Handling user interactions
- **Props**: (Not shown yet, but you'll learn in next lesson)

### 6. Next Steps

Now you're ready for:
- **Lesson 2**: Building component libraries
- **Lesson 3**: Connecting to APIs
- **Lab 1**: Building a complete student dashboard

### Common Issues & Solutions

**Port already in use:**
```bash
npx kill-port 5173
npm run dev
```

**TypeScript errors:**
- Make sure all imports are correct
- Check that interface properties match usage
- Restart your development server

**Styling issues:**
- Clear browser cache
- Check CSS class names match
- Ensure CSS file is imported in component

### What's Next?

You've successfully:
- ✅ Set up a React TypeScript project
- ✅ Created your first functional component
- ✅ Used React hooks (useState)
- ✅ Handled events and state updates
- ✅ Applied modern CSS styling
- ✅ Used external icon libraries

**Ready for Lesson 2?** You'll learn about component composition, props, and building reusable component libraries.