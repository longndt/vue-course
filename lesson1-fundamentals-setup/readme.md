# Lesson 1: Vue Fundamentals & Project Setup

## Overview

**Difficulty**: Beginner
**Status**: Required

This lesson introduces Vue fundamentals with a focus on modern development practices. We'll set up a professional development environment with Vite, understand Vue's core concepts, and build components with JavaScript from day one.

---

## 🎯 Learning Objectives

After completing this lesson, you will be able to:

- ✅ Understand Vue's component-based architecture and reactivity system
- ✅ Set up a modern Vue development environment with Vite and JavaScript
- ✅ Create components using Composition API and script setup
- ✅ Manage reactive state and handle events
- ✅ Build reusable component patterns
- ✅ Apply modern JavaScript features in Vue

---

## 📋 Prerequisites

- ✅ Basic programming knowledge (variables, functions, loops, conditionals)
- ✅ Familiarity with HTML and CSS
- ✅ Understanding of modern JavaScript (ES6+)
- ✅ Node.js installed on your system

---

## 🤔 Why Vue 3 Instead of Vue 2?

### Key Differences and Improvements

| Feature | Vue 2 | Vue 3 | Why This Matters |
|---------|-------|-------|------------------|
| **API Design** | Options API only | Composition API + Options API | Better code organization and reusability |
| **Performance** | ~2x slower | ~2x faster | Better user experience, especially on mobile |
| **Bundle Size** | Larger bundle | 41% smaller | Faster loading times |
| **Modern JS** | Limited support | First-class support | Better developer experience and modern features |
| **Tree Shaking** | Limited | Full support | Smaller production bundles |
| **Multiple Root Nodes** | Not supported | Supported | More flexible component structure |
| **Teleport** | Not available | Built-in | Better modal/portal management |
| **Fragments** | Not supported | Supported | Cleaner component templates |

### Why We Teach Vue 3

1. **Future-Proof**: Vue 2 reached end-of-life in December 2023
2. **Better Developer Experience**: Composition API makes code more maintainable
3. **Industry Standard**: Most companies are migrating to Vue 3
4. **Performance**: Significantly faster rendering and smaller bundles
5. **Modern Features**: Built for modern JavaScript and TypeScript
6. **Ecosystem**: All major libraries now support Vue 3

### Migration Path
- **New Projects**: Always start with Vue 3
- **Existing Vue 2 Projects**: Gradual migration using Composition API
- **Learning**: Understanding Vue 3 concepts helps with Vue 2 maintenance

---

## 🚀 Quick Start

> 🎯 Goal: Master Vue fundamentals with TypeScript for modern development

### Setup
```bash
# 1. Check your setup
node --version  # Should be 18+
npm --version   # Should be 9+

# 2. Create Vue project
npm create vue@latest my-first-vue-app
# Select: TypeScript ❌, Router ❌, Pinia ❌, Testing ❌, ESLint ✅, Prettier ✅

# 3. Start development
cd my-first-vue-app
npm install
npm run dev
```

### Learning Path (Choose Your Style)
- 📖 **Theory First**: Start with [Theory](./theory/theory1.md) → [Example](./example/) → [Lab](./lab/lab1.md)
- ⚡ **Hands-On**: Start with [Reference](./reference/reference1.md) → [Example](./example/) → [Theory](./theory/theory1.md)
- 🎯 **Quick Review**: [Reference](./reference/reference1.md) → [Quiz](./quiz/quiz1.html) → Focus on weak areas

---

## What's Next

### Ready to Continue?
- **Completed this lesson?** → Proceed to [Lesson 2: Component Architecture & Vue Composition API](../lesson2-component-composition/)

### Need More Practice?
- **Study theory** → [theory1.md](./theory/theory1.md) - Deep dive into Vue concepts
- **View examples** → [example/](./example/) - See Vue in action
- **Practice exercises** → [lab1.md](./lab/lab1.md) - Student Dashboard project

### Additional Resources
- **Quiz yourself** → [quiz1.html](./quiz/quiz1.html) - Test your Vue knowledge
- **General questions?** → Review the reference guide
- **Still confused?** → [Check Troubleshooting Guide](../../extras/troubleshooting-guide.md)

---

## Resources & References

### Official Documentation
- [Vue Guide](https://vuejs.org/guide/) - Complete Vue documentation
- [Vue API Reference](https://vuejs.org/api/) - Detailed API documentation
- [Vue Examples](https://vuejs.org/examples/) - Interactive examples

### Video Tutorials
- [Vue Crash Course](https://www.youtube.com/watch?v=qZXt1Aom3Cs) - Traversy Media
- [Vue Composition API](https://www.youtube.com/watch?v=Vdn5gUfO6Kk) - Vue Mastery

### Practice Resources
- [Vue Playground](https://play.vuejs.org/) - Online Vue editor
- [Vue Challenges](https://github.com/vuejs/vue-next/tree/master/packages/vue/examples) - Vue examples

---