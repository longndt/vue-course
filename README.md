# Vue Course

## Course Overview

This course teaches Vue 3 app development with industry-standard practices through hands-on examples.

**Audience**: IT students and developers looking to master Vue 3

**Format**: Theory, hands-on practice, and project-based learning

## Prerequisites

- HTML, CSS, and JavaScript fundamentals
- Basic programming concepts (variables, functions, loops, objects)
- Command line operations
- Experience with at least one backend technology
- Basic understanding of databases and APIs

## What You'll Learn

- Build modern Vue 3 applications with Composition API and script setup
- Create reusable component architectures with Vue's component system
- Manage application state with Pinia and reactive patterns
- Implement client-side routing with Vue Router and authentication
- Handle forms, validation, and user interactions with Vue's reactivity
- Integrate Vue frontends with REST APIs
- Implement JWT-based authentication
- Build real-time features with WebSockets
- Use modern development tools (Git, ESLint, TypeScript, Vite)
- Write tests for Vue components with Vitest
- Deploy applications to production

## Course Structure

### Lesson 0: Prerequisites & JavaScript ES6+ Refresher (Optional)
- Modern JavaScript features essential for Vue 3
- [Go to Prerequisites Review](./lesson0-prerequisites)

### Lesson 1: Vue 3 Fundamentals & TypeScript Setup
- Setting up development environment with Vite
- Component-based architecture and Vue templates
- **Lab Project**: Create a component library with TypeScript
- [Go to Lesson 1](./lesson1-setup)

### Lesson 2: Component Architecture & Reactive State
- Advanced component patterns and composition
- State management (ref, reactive, computed, Pinia)
- Composables and form handling
- **Lab Project**: Build a data management interface with CRUD operations
- [Go to Lesson 2](./lesson2-components)

### Lesson 3: API Integration & Data Management
- Connecting Vue to Node.js/Express/MongoDB backends
- RESTful API consumption and error handling
- **Lab Project**: CRUD application with API integration
- [Go to Lesson 3](./lesson3-data)

### Lesson 4: Routing, Authentication & Advanced Patterns
- Vue Router and JWT authentication
- Protected routes and advanced Vue patterns
- **Lab Project**: Authentication system with protected routes
- [Go to Lesson 4](./lesson4-routing-auth)

### Lesson 5: Full-Stack Integration & Production Deployment
- Full-stack architecture with VENM stack (Vue/Express/Node/MongoDB)
- File uploads, WebSockets, and deployment
- **Lab Project**: Complete application deployment
- [Go to Lesson 5](./lesson5-fullstack)

## Additional Resources

- [**Advanced State Management Guide**](./extras/state-management.md) - Pinia, Vuex, and reactive patterns
- [**Testing Guide**](./extras/testing-guide.md) - Unit, integration, and e2e testing with Vitest
- [**Modern Vue Stack 2025**](./extras/modern-stack.md) - Latest tools and technologies
- [**Troubleshooting Guide**](./extras/troubleshooting-guide.md) - Common issues and solutions
- [**Advanced Vue Patterns**](./extras/advanced-patterns.md) - Enterprise-level patterns

## 🚀 Getting Started

### Step 1: Check and Install Development Environment

**📋 First, ensure you have all required software installed:**

👉 **[Go to Environment Setup Guide](./extras/environment-setup.md)**

Make sure you have installed:
- Node.js (version 18 or higher)
- Visual Studio Code
- Git
- Required VS Code extensions

### Step 2: Install Markdown Reading Support Extension

**📖 For the best documentation reading experience:**

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search and install: **"Markdown Preview Enhanced"**
4. After installation, you can:
   - Press `Ctrl+Shift+V` to open markdown preview
   - Or click the "Open Preview to the Side" icon when viewing .md files

### Step 3: Clone Repository

```bash
git clone https://github.com/longndt/vue-course
cd vue-course
```

### Step 4: Recommended Learning Path

**🎯 Follow this exact order for the best learning experience:**

#### 1️⃣ **Start with Prerequisites** (If needed)
👉 **[Lesson 0: Essential JavaScript ES6+ Knowledge](./lesson0-prerequisites/readme.md)**
- Review modern JavaScript features
- Master concepts that will be used in Vue 3

#### 2️⃣ **Learn Lessons 1-5** (In sequence)
- 👉 **[Lesson 1: Vue 3 Fundamentals & TypeScript Setup](./lesson1-setup/readme.md)**
- 👉 **[Lesson 2: Component Architecture & Reactive State](./lesson2-components/readme.md)**
- 👉 **[Lesson 3: API Integration & Data Management](./lesson3-data/readme.md)**
- 👉 **[Lesson 4: Routing, Authentication & Advanced Patterns](./lesson4-routing-auth/readme.md)**
- 👉 **[Lesson 5: Full-Stack Integration & Production Deployment](./lesson5-fullstack/readme.md)**

#### 3️⃣ **Advanced Materials** (After completing core lessons)
📚 **The `extras/` folder contains advanced documentation:**
- **[State Management Guide](./extras/state-management.md)** - Advanced state management with Pinia
- **[Testing Guide](./extras/testing-guide.md)** - Testing strategies with Vitest
- **[Modern Vue Stack 2025](./extras/modern-stack.md)** - Latest technologies
- **[Advanced Vue Patterns](./extras/advanced-patterns.md)** - Enterprise-level patterns
- **[Troubleshooting Guide](./extras/troubleshooting-guide.md)** - Common issues and solutions

### Step 5: Start Learning

```bash
# Start with Lesson 0 (if you need to review fundamentals)
cd lesson0-prerequisites

# Or start directly with Lesson 1
cd lesson1-setup
npm install
npm run dev
```

### 💡 Learning Tips

- **Read the readme.md** of each lesson carefully before starting
- **Complete all labs** to solidify your understanding
- **Use Markdown Preview Enhanced** for better documentation reading experience
- **Refer to the extras section** when you want to dive deeper
- **Follow the "example" folder** to see complete examples

## Development Tools

### Required Software
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/)

### Essential VS Code Extensions
- **Vue - Official** - Official Vue.js extension with TypeScript support
- **ESLint** - Code error checking
- **Prettier** - Automatic code formatting
- **TypeScript Vue Plugin (Volar)** - Enhanced TypeScript support for Vue
- **Markdown Preview Enhanced** - Enhanced markdown reading (Highly recommended!)

### Browser Extensions
- [Vue DevTools](https://devtools.vuejs.org/) - Official Vue.js developer tools
- [Vue DevTools Legacy](https://chrome.google.com/webstore/detail/vuejs-devtools) - For Vue 2/3 debugging
