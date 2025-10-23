# JavaScript ES6+ Prerequisites for Vue

## Theory 0 - Essential JavaScript Knowledge

---

### Learning Objectives

By the end of this theory session, you will be able to:

- Master modern JavaScript ES6+ features essential for Vue
- Understand arrow functions, destructuring, and template literals
- Apply async/await patterns for API integration
- Use modules and imports effectively
- Implement modern JavaScript patterns in Vue applications

---

### Why JavaScript ES6+ is Critical for Vue? 🎯

**Foundation for Modern Vue Development:**

- Vue is built on modern JavaScript features
- Composition API heavily relies on ES6+ patterns
- TypeScript integration requires solid JS fundamentals
- Modern tooling (Vite, ESLint) expects ES6+ syntax

**Career and Academic Benefits:**

- 90%+ of modern web development uses ES6+ features
- Essential for understanding Vue source code
- Required for professional development workflows
- Foundation for learning TypeScript and advanced patterns

---

## 1. Arrow Functions 🏹

### **What are Arrow Functions?**

Arrow functions provide a concise syntax for writing functions in JavaScript.

```javascript
// Traditional function
function greet(name) {
  return `Hello, ${name}!`;
}

// Arrow function
const greet = (name) => `Hello, ${name}!`;

// Multiple parameters
const add = (a, b) => a + b;

// No parameters
const sayHello = () => console.log('Hello!');

// Object return (need parentheses)
const createUser = (name, age) => ({ name, age });
```

### **Key Differences from Regular Functions**

| Feature | Regular Function | Arrow Function |
|---------|------------------|----------------|
| `this` binding | Own `this` context | Inherits `this` from parent scope |
| `arguments` object | Available | Not available |
| Constructor | Can be used as constructor | Cannot be used as constructor |
| Hoisting | Hoisted | Not hoisted |

### **Vue Usage Examples**

```javascript
// In Vue Composition API
import { ref, computed } from 'vue'

export default {
  setup() {
    const count = ref(0)

    // Arrow function for computed
    const doubleCount = computed(() => count.value * 2)

    // Arrow function for methods
    const increment = () => count.value++

    return { count, doubleCount, increment }
  }
}
```

---

## 2. Destructuring Assignment 🎯

### **Object Destructuring**

```javascript
// Basic destructuring
const user = { name: 'John', age: 30, email: 'john@example.com' }
const { name, age, email } = user

// Renaming variables
const { name: userName, age: userAge } = user

// Default values
const { name, age, city = 'Unknown' } = user

// Nested destructuring
const user = {
  name: 'John',
  address: {
    street: '123 Main St',
    city: 'New York'
  }
}
const { address: { city } } = user
```

### **Array Destructuring**

```javascript
// Basic array destructuring
const colors = ['red', 'green', 'blue']
const [first, second, third] = colors

// Skipping elements
const [first, , third] = colors

// Rest operator
const [first, ...rest] = colors

// Default values
const [first = 'default', second] = colors
```

### **Vue Usage Examples**

```javascript
// Destructuring Vue imports
import { ref, reactive, computed, watch } from 'vue'

// Destructuring props
export default {
  props: {
    title: String,
    count: Number
  },
  setup(props) {
    const { title, count } = props

    // Destructuring reactive object
    const state = reactive({
      name: 'Vue',
      version: '3.0'
    })
    const { name, version } = state

    return { name, version }
  }
}
```

---

## 3. Template Literals 📝

### **Basic Template Literals**

```javascript
// String interpolation
const name = 'John'
const age = 30
const message = `Hello, ${name}! You are ${age} years old.`

// Multi-line strings
const html = `
  <div class="container">
    <h1>${title}</h1>
    <p>${description}</p>
  </div>
`

// Expressions in template literals
const price = 19.99
const tax = 0.08
const total = `Total: $${(price * (1 + tax)).toFixed(2)}`
```

### **Tagged Template Literals**

```javascript
// Custom tag function
function highlight(strings, ...values) {
  return strings.reduce((result, string, i) => {
    const value = values[i] ? `<mark>${values[i]}</mark>` : ''
    return result + string + value
  }, '')
}

const name = 'John'
const age = 30
const highlighted = highlight`Hello ${name}, you are ${age} years old!`
// Result: "Hello <mark>John</mark>, you are <mark>30</mark> years old!"
```

### **Vue Usage Examples**

```javascript
// Dynamic CSS classes
const isActive = ref(true)
const className = `button ${isActive.value ? 'active' : 'inactive'}`

// Dynamic URLs
const baseUrl = 'https://api.example.com'
const endpoint = 'users'
const url = `${baseUrl}/${endpoint}/${userId}`

// Component templates
const template = `
  <div class="user-card">
    <h2>${user.name}</h2>
    <p>Email: ${user.email}</p>
    <p>Age: ${user.age}</p>
  </div>
`
```

---

## 4. Spread and Rest Operators 🔄

### **Spread Operator (...)**

```javascript
// Array spreading
const arr1 = [1, 2, 3]
const arr2 = [4, 5, 6]
const combined = [...arr1, ...arr2] // [1, 2, 3, 4, 5, 6]

// Object spreading
const obj1 = { a: 1, b: 2 }
const obj2 = { c: 3, d: 4 }
const combined = { ...obj1, ...obj2 } // { a: 1, b: 2, c: 3, d: 4 }

// Function arguments
const numbers = [1, 2, 3, 4, 5]
const max = Math.max(...numbers)

// Array copying
const original = [1, 2, 3]
const copy = [...original]
```

### **Rest Operator (...)**

```javascript
// Function parameters
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0)
}
sum(1, 2, 3, 4, 5) // 15

// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5]
// first: 1, second: 2, rest: [3, 4, 5]

// Object destructuring
const { name, age, ...otherProps } = user
```

### **Vue Usage Examples**

```javascript
// Props spreading
export default {
  props: {
    title: String,
    ...otherProps
  }
}

// Event handling
const handleClick = (event, ...args) => {
  console.log('Clicked!', event, args)
}

// State updates
const updateUser = (updates) => {
  user.value = { ...user.value, ...updates }
}
```

---

## 5. Modules and Imports 📦

### **ES6 Module Syntax**

```javascript
// Named exports
export const PI = 3.14159
export function calculateArea(radius) {
  return PI * radius * radius
}

// Default export
export default class Calculator {
  add(a, b) {
    return a + b
  }
}

// Mixed exports
const PI = 3.14159
function calculateArea(radius) {
  return PI * radius * radius
}
export { PI, calculateArea }
export default Calculator
```

### **Import Syntax**

```javascript
// Named imports
import { PI, calculateArea } from './math.js'

// Default import
import Calculator from './calculator.js'

// Mixed imports
import Calculator, { PI, calculateArea } from './math.js'

// Namespace import
import * as Math from './math.js'
// Usage: Math.PI, Math.calculateArea

// Renaming imports
import { calculateArea as calcArea } from './math.js'
```

### **Vue Usage Examples**

```javascript
// Vue Composition API imports
import { ref, reactive, computed, watch, onMounted } from 'vue'

// Component imports
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

// Utility imports
import { formatDate, validateEmail } from './utils/helpers.js'

// Store imports
import { useUserStore } from './stores/user.js'
```

---

## 6. Async/Await and Promises ⚡

### **Promise Basics**

```javascript
// Creating a Promise
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Data fetched successfully!')
    }, 1000)
  })
}

// Using Promises
fetchData()
  .then(data => console.log(data))
  .catch(error => console.error(error))
  .finally(() => console.log('Request completed'))
```

### **Async/Await Syntax**

```javascript
// Async function
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`)
    const user = await response.json()
    return user
  } catch (error) {
    console.error('Error fetching user:', error)
    throw error
  }
}

// Using async/await
const loadUser = async () => {
  try {
    const user = await fetchUserData(123)
    console.log('User loaded:', user)
  } catch (error) {
    console.error('Failed to load user:', error)
  }
}
```

### **Vue Usage Examples**

```javascript
// In Vue Composition API
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const users = ref([])
    const loading = ref(false)
    const error = ref(null)

    const fetchUsers = async () => {
      loading.value = true
      error.value = null

      try {
        const response = await fetch('/api/users')
        const data = await response.json()
        users.value = data
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchUsers()
    })

    return { users, loading, error, fetchUsers }
  }
}
```

---

## 7. Array Methods 🗂️

### **Essential Array Methods**

```javascript
const numbers = [1, 2, 3, 4, 5]
const users = [
  { id: 1, name: 'John', age: 30 },
  { id: 2, name: 'Jane', age: 25 },
  { id: 3, name: 'Bob', age: 35 }
]

// map() - Transform each element
const doubled = numbers.map(n => n * 2)
const userNames = users.map(user => user.name)

// filter() - Filter elements
const evenNumbers = numbers.filter(n => n % 2 === 0)
const adults = users.filter(user => user.age >= 18)

// find() - Find first matching element
const user = users.find(u => u.id === 2)

// reduce() - Reduce to single value
const sum = numbers.reduce((total, n) => total + n, 0)
const totalAge = users.reduce((total, user) => total + user.age, 0)

// some() - Check if any element matches
const hasAdults = users.some(user => user.age >= 18)

// every() - Check if all elements match
const allAdults = users.every(user => user.age >= 18)
```

### **Vue Usage Examples**

```javascript
// Computed properties with array methods
const filteredUsers = computed(() => {
  return users.value.filter(user =>
    user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Event handlers
const handleUserSelect = (userId) => {
  const selectedUser = users.value.find(user => user.id === userId)
  if (selectedUser) {
    // Handle selection
  }
}
```

---

## 8. Object Methods and Properties 🏗️

### **Object.keys(), Object.values(), Object.entries()**

```javascript
const user = { name: 'John', age: 30, email: 'john@example.com' }

// Get keys
const keys = Object.keys(user) // ['name', 'age', 'email']

// Get values
const values = Object.values(user) // ['John', 30, 'john@example.com']

// Get entries
const entries = Object.entries(user) // [['name', 'John'], ['age', 30], ['email', 'john@example.com']]
```

### **Object.assign() and Object.freeze()**

```javascript
// Object.assign() - Copy properties
const target = { a: 1 }
const source = { b: 2, c: 3 }
const result = Object.assign(target, source) // { a: 1, b: 2, c: 3 }

// Object.freeze() - Make object immutable
const frozen = Object.freeze({ name: 'John' })
// frozen.name = 'Jane' // This won't work in strict mode
```

### **Vue Usage Examples**

```javascript
// Form validation
const validateForm = (formData) => {
  const errors = {}

  Object.entries(formData).forEach(([key, value]) => {
    if (!value) {
      errors[key] = `${key} is required`
    }
  })

  return errors
}

// State management
const updateUser = (updates) => {
  user.value = Object.assign({}, user.value, updates)
}
```

---

## 9. Classes and Inheritance 🏛️

### **ES6 Classes**

```javascript
// Basic class
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }

  greet() {
    return `Hello, I'm ${this.name}`
  }

  get info() {
    return `${this.name} is ${this.age} years old`
  }
}

// Inheritance
class Student extends Person {
  constructor(name, age, grade) {
    super(name, age)
    this.grade = grade
  }

  study() {
    return `${this.name} is studying`
  }

  greet() {
    return `${super.greet()} and I'm a student`
  }
}
```

### **Vue Usage Examples**

```javascript
// Service classes
class ApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  async get(endpoint) {
    const response = await fetch(`${this.baseUrl}${endpoint}`)
    return response.json()
  }

  async post(endpoint, data) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    return response.json()
  }
}

// In Vue component
const apiService = new ApiService('https://api.example.com')
```

---

## 10. Modern JavaScript Features 🚀

### **Optional Chaining (?.)**

```javascript
const user = {
  name: 'John',
  address: {
    street: '123 Main St',
    city: 'New York'
  }
}

// Safe property access
const street = user.address?.street // '123 Main St'
const zipCode = user.address?.zipCode // undefined (no error)

// Safe method calls
const result = user.getName?.() // undefined if method doesn't exist
```

### **Nullish Coalescing (??)**

```javascript
// Only use default if value is null or undefined
const name = user.name ?? 'Anonymous'
const age = user.age ?? 0

// vs || operator (falsy values)
const count = user.count || 10 // 10 if count is 0, false, '', etc.
const count2 = user.count ?? 10 // 10 only if count is null or undefined
```

### **Logical Assignment Operators**

```javascript
// ||= (logical OR assignment)
user.name ||= 'Anonymous'

// &&= (logical AND assignment)
user.address &&= { ...user.address, updated: true }

// ??= (nullish coalescing assignment)
user.email ??= 'no-email@example.com'
```

### **Vue Usage Examples**

```javascript
// Safe reactive updates
const updateUser = (updates) => {
  user.value = {
    ...user.value,
    ...updates,
    updatedAt: new Date().toISOString()
  }
}

// Safe computed properties
const displayName = computed(() => {
  return user.value?.name ?? 'Unknown User'
})

// Safe method calls
const handleClick = () => {
  user.value?.onClick?.()
}
```

---

## 11. Best Practices and Common Patterns 💡

### **Modern JavaScript Patterns**

```javascript
// Destructuring with defaults
const { name = 'Anonymous', age = 0 } = user

// Array destructuring with rest
const [first, ...rest] = items

// Object destructuring with renaming
const { name: userName, age: userAge } = user

// Conditional object properties
const user = {
  name: 'John',
  age: 30,
  ...(isAdmin && { role: 'admin' })
}
```

### **Error Handling Patterns**

```javascript
// Try-catch with async/await
const fetchData = async () => {
  try {
    const response = await fetch('/api/data')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}

// Promise error handling
fetchData()
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error))
  .finally(() => console.log('Request completed'))
```

### **Vue Integration Patterns**

```javascript
// Composable pattern
export function useApi() {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchData = async (url) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(url)
      data.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, fetchData }
}
```

---

## 12. Common Pitfalls and How to Avoid Them ⚠️

### **Arrow Function Pitfalls**

```javascript
// ❌ Wrong: Arrow functions don't have their own 'this'
const obj = {
  name: 'John',
  greet: () => {
    console.log(this.name) // undefined
  }
}

// ✅ Correct: Use regular functions for methods
const obj = {
  name: 'John',
  greet() {
    console.log(this.name) // 'John'
  }
}
```

### **Destructuring Pitfalls**

```javascript
// ❌ Wrong: Destructuring undefined
const { name } = undefined // Error!

// ✅ Correct: Provide default value
const { name = 'Anonymous' } = user || {}

// ❌ Wrong: Mutating original object
const user = { name: 'John', age: 30 }
const { name, ...rest } = user
rest.name = 'Jane' // This mutates the original object!

// ✅ Correct: Create new object
const { name, ...rest } = user
const newUser = { ...rest, name: 'Jane' }
```

### **Async/Await Pitfalls**

```javascript
// ❌ Wrong: Not awaiting async operations
const fetchData = async () => {
  const data = fetch('/api/data') // Missing await!
  return data
}

// ✅ Correct: Properly await async operations
const fetchData = async () => {
  const response = await fetch('/api/data')
  const data = await response.json()
  return data
}
```

---

## 13. Practice Exercises 🏋️

### **Exercise 1: Arrow Functions**
Convert the following functions to arrow functions:

```javascript
// Convert these to arrow functions
function multiply(a, b) {
  return a * b
}

function greetUser(user) {
  return `Hello, ${user.name}!`
}

function createCounter() {
  let count = 0
  return function() {
    return ++count
  }
}
```

### **Exercise 2: Destructuring**
Extract data using destructuring:

```javascript
const user = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  address: {
    street: '123 Main St',
    city: 'New York',
    country: 'USA'
  },
  hobbies: ['reading', 'coding', 'gaming']
}

// Extract: name, email, street, city, first hobby
```

### **Exercise 3: Async/Await**
Create an async function that fetches user data:

```javascript
// Create a function that:
// 1. Fetches user data from '/api/users/1'
// 2. Fetches user posts from '/api/users/1/posts'
// 3. Returns combined data
// 4. Handles errors properly
```

---

## 14. Next Steps 🚀

### **What You've Learned**

- ✅ Modern JavaScript ES6+ features
- ✅ Arrow functions and their use cases
- ✅ Destructuring assignment patterns
- ✅ Template literals and string manipulation
- ✅ Spread and rest operators
- ✅ Module system and imports
- ✅ Async/await and Promise handling
- ✅ Array and object methods
- ✅ Classes and inheritance
- ✅ Modern JavaScript features (optional chaining, nullish coalescing)
- ✅ Best practices and common patterns

### **Ready for Vue!**

You now have the JavaScript foundation needed to:

- Understand Vue's Composition API
- Work with reactive data and computed properties
- Handle async operations in Vue components
- Use modern JavaScript patterns in Vue applications
- Integrate with TypeScript effectively

### **Next Lesson**

Proceed to [Lesson 1: Vue Fundamentals & TypeScript Setup](../lesson1-fundamentals-setup/) to start building Vue applications!

---

## Additional Resources 📚

- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [ES6 Features](https://es6-features.org/)
- [JavaScript.info](https://javascript.info/)
- [Vue Documentation](https://vuejs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
