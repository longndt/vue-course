# Vue 3 Prerequisites - Quick Reference

## 🎯 Essential JavaScript ES6+ for Vue 3

### **Arrow Functions**
```javascript
// Traditional function
function greet(name) {
  return `Hello, ${name}!`;
}

// Arrow function
const greet = (name) => `Hello, ${name}!`;

// Arrow function with multiple parameters
const add = (a, b) => a + b;

// Arrow function with object return
const createUser = (name, age) => ({ name, age });
```

### **Destructuring Assignment**
```javascript
// Object destructuring
const user = { name: 'John', age: 30, email: 'john@example.com' };
const { name, age } = user;
const { name: userName, age: userAge } = user; // Renaming

// Array destructuring
const colors = ['red', 'green', 'blue'];
const [first, second, third] = colors;
const [primary, ...rest] = colors; // Rest operator

// Function parameter destructuring
function greetUser({ name, age }) {
  return `Hello ${name}, you are ${age} years old`;
}
```

### **Template Literals**
```javascript
// String interpolation
const name = 'Vue';
const version = 3;
const message = `Welcome to ${name} ${version}!`;

// Multi-line strings
const html = `
  <div class="container">
    <h1>${title}</h1>
    <p>${description}</p>
  </div>
`;

// Expression evaluation
const price = 19.99;
const tax = 0.08;
const total = `Total: $${(price * (1 + tax)).toFixed(2)}`;
```

### **Modules (ES6)**
```javascript
// Exporting
export const API_URL = 'https://api.example.com';
export function fetchData() { /* ... */ }
export default class User { /* ... */ }

// Named exports
export { fetchData, API_URL };

// Importing
import User, { fetchData, API_URL } from './user.js';
import * as utils from './utils.js';
import { fetchData as getData } from './api.js';
```

### **Promises & Async/Await**
```javascript
// Promise
fetch('/api/users')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

// Async/Await
async function fetchUsers() {
  try {
    const response = await fetch('/api/users');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// Multiple async operations
async function fetchUserData(userId) {
  const [user, posts, comments] = await Promise.all([
    fetch(`/api/users/${userId}`).then(r => r.json()),
    fetch(`/api/users/${userId}/posts`).then(r => r.json()),
    fetch(`/api/users/${userId}/comments`).then(r => r.json())
  ]);

  return { user, posts, comments };
}
```

### **Array Methods**
```javascript
const users = [
  { id: 1, name: 'John', age: 30, active: true },
  { id: 2, name: 'Jane', age: 25, active: false },
  { id: 3, name: 'Bob', age: 35, active: true }
];

// map - Transform array
const names = users.map(user => user.name);
const userCards = users.map(user => ({ id: user.id, name: user.name }));

// filter - Filter array
const activeUsers = users.filter(user => user.active);
const adults = users.filter(user => user.age >= 18);

// find - Find single item
const user = users.find(user => user.id === 2);
const firstActive = users.find(user => user.active);

// reduce - Accumulate values
const totalAge = users.reduce((sum, user) => sum + user.age, 0);
const userGroups = users.reduce((groups, user) => {
  const key = user.active ? 'active' : 'inactive';
  groups[key] = groups[key] || [];
  groups[key].push(user);
  return groups;
}, {});

// some/every - Test conditions
const hasAdults = users.some(user => user.age >= 18);
const allActive = users.every(user => user.active);
```

### **Object Methods**
```javascript
const user = { name: 'John', age: 30, email: 'john@example.com' };

// Object.keys()
const keys = Object.keys(user); // ['name', 'age', 'email']

// Object.values()
const values = Object.values(user); // ['John', 30, 'john@example.com']

// Object.entries()
const entries = Object.entries(user); // [['name', 'John'], ['age', 30], ...]

// Object.assign() - Merge objects
const updatedUser = Object.assign({}, user, { age: 31 });
const newUser = { ...user, age: 31 }; // Spread operator (preferred)

// Object.freeze() - Immutable object
const frozenUser = Object.freeze(user);
```

### **Spread Operator**
```javascript
// Array spreading
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// Object spreading
const user = { name: 'John', age: 30 };
const updatedUser = { ...user, age: 31 }; // { name: 'John', age: 31 }

// Function arguments
function sum(...numbers) {
  return numbers.reduce((sum, num) => sum + num, 0);
}
sum(1, 2, 3, 4); // 10
```

### **Optional Chaining & Nullish Coalescing**
```javascript
// Optional chaining (?.)
const user = { profile: { name: 'John' } };
const userName = user?.profile?.name; // 'John'
const userAge = user?.profile?.age; // undefined (no error)

// Nullish coalescing (??)
const name = user?.name ?? 'Anonymous';
const age = user?.age ?? 0;

// Combined usage
const displayName = user?.profile?.name ?? 'Unknown User';
```

### **Classes (ES6)**
```javascript
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.createdAt = new Date();
  }

  greet() {
    return `Hello, I'm ${this.name}`;
  }

  // Getter
  get displayName() {
    return `${this.name} (${this.email})`;
  }

  // Setter
  set email(newEmail) {
    if (newEmail.includes('@')) {
      this._email = newEmail;
    } else {
      throw new Error('Invalid email');
    }
  }

  // Static method
  static createAdmin(name, email) {
    const admin = new User(name, email);
    admin.isAdmin = true;
    return admin;
  }
}

// Inheritance
class Admin extends User {
  constructor(name, email, permissions) {
    super(name, email);
    this.permissions = permissions;
  }

  deleteUser(userId) {
    return `User ${userId} deleted`;
  }
}
```

### **Common Patterns for Vue 3**
```javascript
// Computed properties pattern
const users = ref([]);
const activeUsers = computed(() =>
  users.value.filter(user => user.active)
);

// Watchers pattern
watch(users, (newUsers, oldUsers) => {
  console.log('Users changed:', newUsers.length);
}, { deep: true });

// Event handlers pattern
const handleClick = (event) => {
  event.preventDefault();
  console.log('Button clicked');
};

// API calls pattern
const fetchData = async () => {
  loading.value = true;
  try {
    const response = await fetch('/api/data');
    data.value = await response.json();
  } catch (error) {
    error.value = error.message;
  } finally {
    loading.value = false;
  }
};
```

## 🎯 **Quick Tips for Vue 3**

1. **Always use `const` and `let`** instead of `var`
2. **Prefer arrow functions** for short functions
3. **Use destructuring** for cleaner code
4. **Template literals** for string interpolation
5. **Async/await** over Promise chains
6. **Spread operator** for object/array manipulation
7. **Optional chaining** for safe property access
8. **Modules** for code organization

## 📚 **Next Steps**

After mastering these JavaScript ES6+ concepts, you'll be ready for:
- Vue 3 Composition API
- TypeScript integration
- Modern development tools
- Component-based architecture
