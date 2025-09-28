# Common Issues & Troubleshooting Guide

## Quick Solutions for Students

This guide addresses the most common problems students encounter when learning Vue 3. Keep this handy as you work through the course!

## 🚨 **Setup & Installation Issues**

### Problem: "npm command not found"

**Cause:** Node.js is not installed or not in PATH

**Solution:**

1. Download and install Node.js from [nodejs.org](https://nodejs.org/)
2. Restart your terminal/command prompt
3. Verify installation: `node --version` and `npm --version`

### Problem: "Permission denied" when running npm commands

**Cause:** Insufficient permissions (common on Mac/Linux)
**Solution:**

```bash
# Option 1: Use npx for Vue project
npx create-vue@latest my-app

# Option 2: Fix npm permissions (Mac/Linux)
sudo chown -R $(whoami) ~/.npm
```

### Problem: Project won't start - "Port 3000 already in use"

**Cause:** Another application is using the same port

**Solution:**

```bash
# Kill the process using port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- --port 3001
```

## 💻 **Vue 3 Development Issues**

### Problem: "Component is not defined" error

**Cause:** Forgot to import or register the component

**Solution:**

```vue
// ❌ Wrong - missing import
function App() {
  return <MyComponent />; // Error!
}

// ✅ Correct - with import
import MyComponent from "./MyComponent";

function App() {
  return <MyComponent />; // Works!
}
```

### Problem: "Cannot read property of undefined"

**Cause:** Trying to access props that don't exist

**Solution:**

```vue
// ❌ Dangerous - might crash if user is undefined
function UserProfile({ user }) {
  return <div>{user.name}</div>; // Error if user is undefined
}

// ✅ Safe - with default values and checks
function UserProfile({ user = {} }) {
  return <div>{user.name || "Guest"}</div>;
}

// ✅ Even safer - with conditional rendering
function UserProfile({ user }) {
  if (!user) return <div>Loading...</div>;

  return <div>{user.name}</div>;
}
```

### Problem: Components not re-rendering when data changes

**Cause:** Mutating state directly instead of creating new state

**Solution:**

```vue
<!-- ❌ Wrong - mutating reactive array directly -->
<script setup>
const items = ref([])

const addItem = (newItem) => {
  items.value.push(newItem) // This works in Vue but not recommended for complex updates
}
</script>

<!-- ✅ Correct - using reactive pattern -->
<script setup>
const items = ref([])

const addItem = (newItem) => {
  items.value = [...items.value, newItem] // Cleaner update pattern
}
</script>
```

## 🎨 **Styling & CSS Issues**

### Problem: CSS classes not applying

**Cause:** Using `class` instead of `className` or incorrect CSS import

**Solution:**

```vue
// ❌ Wrong - use 'class' attribute in Vue templates
<div class="container">Content</div>

<!-- ✅ Correct - use 'class' -->
<div class="container">Content</div>
```

```vue
<!-- Make sure to import your CSS -->
<template>
  <div class="my-style">Content</div>
</template>

<style src="./MyComponent.css"></style>
```

### Problem: Styles not loading

**Cause:** CSS file not imported or incorrect path

**Solution:**

```vue
// ✅ Import CSS at the top of your component file
import "./styles/MyComponent.css";
import "../shared/global.css";

// ✅ Or import in main.ts for global styles
// main.ts
import "./index.css";
```

## ⚡ **Performance Issues**

### Problem: App is slow when typing in forms

**Cause:** Re-rendering entire component tree on every keystroke

**Solution:**

```vue
// ❌ Inefficient - recreating function on every render
function SearchForm() {
  const [query, setQuery] = ref("");

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)} // New function every render
    />
  );
}

// ✅ Efficient - computed property and method
<template>
  <input v-model="query" @input="handleChange" />
</template>

<script setup>
import { ref, watch } from 'vue'

const query = ref("")

const handleChange = () => {
  // Optional: Additional handling logic
  console.log('Query changed:', query.value)
}

// Watch for changes if needed
watch(query, (newValue) => {
  console.log('Search query updated:', newValue)
})
</script>
```

## 🔧 **TypeScript Issues**

### Problem: "Type 'X' is not assignable to type 'Y'"

**Cause:** TypeScript type mismatch

**Solution:**

```tsx
// ❌ Wrong - string passed to number prop
interface Props {
  age: number;
}

<MyComponent age="25" /> // Error: string not assignable to number

// ✅ Correct - proper type
<MyComponent age={25} /> // Works: number

// ✅ Or convert string to number
<MyComponent age={parseInt("25")} />
```

### Problem: "Property does not exist on type"

**Cause:** Missing or incorrect interface definition

**Solution:**

```tsx
// ❌ Wrong - incomplete interface
interface User {
  name: string;
}

function UserCard({ user }: { user: User }) {
  return <div>{user.email}</div>; // Error: email doesn't exist on User
}

// ✅ Correct - complete interface
interface User {
  name: string;
  email: string;
}
```

## 🌐 **API & Data Fetching Issues**

### Problem: "CORS error" when calling APIs

**Cause:** Browser blocking cross-origin requests

**Solutions:**

```javascript
// Solution 1: Use a proxy in development
// In vite.config.js
export default {
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
};

// Solution 2: Enable CORS on your backend
// In Express.js backend
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173", // Your Vue app URL
  })
);
```

### Problem: Data not showing up from API

**Cause:** Not handling async operations properly

**Solution:**

```vue
// ❌ Wrong - not handling async properly
function UserList() {
  const [users, setUsers] = ref([]);

  fetch("/api/users")
    .then((res) => res.json())
    .then(setUsers); // This runs but component may not re-render correctly

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}

// ✅ Correct - using onMounted
function UserList() {
  const [users, setUsers] = ref([]);
  const [loading, setLoading] = ref(true);

  onMounted(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []); // Empty dependency array means this runs once

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

## 🎯 **Project-Specific Issues**

### Problem: Components are getting too large and complex

**Cause:** Trying to do too much in one component

**Solution:**

```vue
// ❌ Bad - one giant component
function StudentDashboard() {
  // 200+ lines of code handling:
  // - User authentication
  // - Data fetching
  // - Form handling
  // - Display logic
  // This is too much!
}

// ✅ Good - broken into smaller components
function StudentDashboard() {
  return (
    <div>
      <Header />
      <StudentList />
      <AddStudentForm />
      <Statistics />
    </div>
  );
}
```

### Problem: Hard to manage data between components

**Cause:** Passing props through too many levels

**Solution:**

```vue
// ❌ Prop drilling - passing props through many levels
<App>
  <Dashboard user={user} />
    <Sidebar user={user} />
      <UserProfile user={user} />

// ✅ Context API - share data across components
const userSymbol = Symbol('user')

function App() {
  const [user, setUser] = ref(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Dashboard />
    </UserContext.Provider>
  );
}

function UserProfile() {
  const { user } = inject('user');
  return <div>{user?.name}</div>;
}
```

## 🆘 **When All Else Fails**

### Debugging Steps:

1. **Check the browser console** for error messages
2. **Read the error message carefully** - it usually tells you what's wrong
3. **Use console.log()** to check if your data is what you expect
4. **Check your component props** with Vue Developer Tools
5. **Search the exact error message** on Google or Stack Overflow
6. **Ask for help** - show your code and the error message

### Helpful Browser Extensions:

- **Vue Developer Tools** - Inspect Vue components
- **Redux DevTools** - Debug state management
- **JSON Formatter** - View API responses nicely

### Online Resources:

- [Vue Documentation](https://vuejs.org/) - Official docs
- [Stack Overflow](https://stackoverflow.com/questions/tagged/vue.js) - Community help
- [Vue subreddit](https://reddit.com/r/vuejs) - Discussion and help
- [MDN Web Docs](https://developer.mozilla.org/) - JavaScript reference

## 📝 **Quick Reference Cheat Sheet**

### Most Common Vue Patterns:

```vue
// Component with props
function MyComponent({ title, children }) {
  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  );
}

<!-- Component with state -->
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>

// Component with effect
function UserProfile({ userId }) {
  const [user, setUser] = ref(null);

  onMounted(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  return user ? <div>{user.name}</div> : <div>Loading...</div>;
}

// List rendering
function UserList({ users }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Remember:

- **Always use `key` props** when rendering lists
- **Start component names with capital letters**
- **Use `className` not `class`**
- **Import components before using them**
- **Use `onMounted` for side effects** (API calls, subscriptions)
- **Don't mutate state directly** - always create new objects/arrays

---

_💡 Keep this guide bookmarked - you'll likely need it throughout your Vue learning journey!_
