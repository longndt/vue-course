# Lesson 4: Routing & Authentication

## Overview

**Difficulty**: Advanced
**Status**: Required

In this lesson, you'll learn how to create multi-page Vue applications using Vue Router and implement comprehensive authentication systems. We'll build complete authentication workflows with protected routes and explore advanced Vue patterns used in enterprise applications.

---

## 🎯 Learning Objectives

After completing this lesson, you will be able to:

- ✅ Set up complex routing architectures with Vue Router
- ✅ Create protected routes with navigation guards
- ✅ Implement JWT-based authentication systems
- ✅ Manage user sessions and role-based access control
- ✅ Apply advanced Vue patterns (Provide/Inject, Composables, Dynamic Components)
- ✅ Implement global state management with Pinia

---

## 📋 Prerequisites

- ✅ API integration and data management
- ✅ Understanding of HTTP requests and state management
- ✅ Experience with composables and Pinia
- ✅ Basic knowledge of authentication concepts

---

## 🚀 Quick Start

> 🎯 Goal: Master routing, authentication, and advanced Vue patterns

### Setup
```bash
# 1. Create authenticated app
npm create vue@latest auth-app
cd auth-app
npm install

# 2. Install routing and auth dependencies
npm install vue-router@4 pinia
npm install @vueuse/core

# 3. Set up routing
# Select Vue Router when prompted
npm run dev
```

### Learning Path (Choose Your Style)
- 📖 **Theory First**: Start with [Theory](./theory/theory4.md) → [Example](./example/) → [Lab](./lab/lab4.md)
- ⚡ **Hands-On**: Start with [Reference](./reference/reference4.md) → [Example](./example/) → [Theory](./theory/theory4.md)
- 🎯 **Quick Review**: [Reference](./reference/reference4.md) → [Quiz](./quiz/quiz4.html) → Focus on weak areas

---

## What's Next

### Ready to Continue?
- **Completed this lesson?** → Proceed to [Lesson 5: Full-Stack Integration & Production Deployment](../lesson5-fullstack-deployment/readme.md)

### Need More Practice?
- **Study theory** → [theory4.md](./theory/theory4.md) - Deep dive into routing and auth
- **View examples** → [example/](./example/) - See authentication in action
- **Practice exercises** → [lab4.md](./lab/lab4.md) - E-commerce project
- **Check solutions** → [lab4-solution.md](./lab/solution/lab4-solution.md) - Complete solutions

### Additional Resources
- **Quiz yourself** → [quiz4.html](./quiz/quiz4.html) - Test your routing knowledge
- **Quick reference** → [reference4.md](./reference/reference4.md) - Code snippets and patterns
- **General questions?** → Review the reference guide
- **Still confused?** → [Check Troubleshooting Guide](../../extras/troubleshooting-guide.md)

---

## Resources & References

### Official Documentation
- [Vue Router](https://router.vuejs.org/) - Official routing library
- [Pinia](https://pinia.vuejs.org/) - State management library
- [Vue Advanced Patterns](https://vuejs.org/guide/extras/composition-api-faq.html) - Advanced concepts

### Video Tutorials
- [Vue Router Tutorial](https://www.youtube.com/watch?v=2KBHvaAWJOA) - Vue Mastery
- [Pinia State Management](https://www.youtube.com/watch?v=JbIzmGQXjO4) - Vue School

### Practice Resources
- [Vue Authentication](https://github.com/vuejs/vue-next/tree/master/packages/vue/examples) - Auth examples
- [JWT.io](https://jwt.io/) - JWT token debugger

---