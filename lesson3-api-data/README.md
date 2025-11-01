# Lesson 3: API Integration & Data Management

## Overview

**Difficulty**: Intermediate
**Status**: Required

In this lesson, you'll learn how to connect Vue applications to backend APIs, manage data fetching, handle asynchronous operations, and implement comprehensive error handling. We'll build full-stack applications by integrating Vue with Node.js/Express backend and MongoDB database.

---

## 🎯 Learning Objectives

After completing this lesson, you will be able to:

- ✅ Connect Vue applications to RESTful APIs
- ✅ Handle asynchronous data operations with async/await
- ✅ Implement proper error handling and loading states
- ✅ Manage API state and caching strategies
- ✅ Build CRUD operations with backend APIs
- ✅ Integrate Vue with Node.js/Express and MongoDB
- ✅ Handle form submissions and data validation
- ✅ Optimize API calls and data fetching patterns

---

## 📋 Prerequisites

- ✅ Component architecture and Vue Composition API
- ✅ Understanding of reactive state management
- ✅ Experience with composables and Pinia
- ✅ Basic knowledge of HTTP requests and REST APIs
- ✅ Familiarity with JavaScript async/await

---

## 🚀 Quick Start

> 🎯 Goal: Master API integration and data management in Vue

### Setup

```bash
# 1. Create API integration project
npm create vue@latest api-app
cd api-app
npm install

# 2. Install API dependencies
npm install axios

# 3. Initialize backend (optional, in separate folder)
mkdir backend && cd backend
npm init -y
npm install express mongoose cors dotenv
npm install -D nodemon

# 4. Start development
cd ..
npm run dev
```

### Learning Path (Choose Your Style)
- 📖 **Theory First**: Start with [Theory](./theory/theory3.md) → [Example](./example/) → [Lab](./lab/lab3.md)
- ⚡ **Hands-On**: Start with [Reference](./reference/reference3.md) → [Example](./example/) → [Theory](./theory/theory3.md)
- 🎯 **Quick Review**: [Reference](./reference/reference3.md) → [Quiz](./quiz/quiz3.html) → Focus on weak areas

---

## 📚 What You'll Learn

### 1. API Integration Fundamentals

- **HTTP Requests**: GET, POST, PUT, DELETE operations
- **Axios Setup**: Configuring HTTP client for Vue
- **RESTful APIs**: Understanding REST principles
- **API Service Patterns**: Creating reusable API services

### 2. Asynchronous Data Handling

- **async/await**: Modern async patterns in Vue
- **Loading States**: Managing UI during API calls
- **Error Handling**: Comprehensive error management
- **Data Fetching**: Patterns for fetching and updating data

### 3. State Management for API Data

- **Pinia Stores**: Managing API state with Pinia
- **Data Caching**: Caching strategies for API responses
- **Reactive Updates**: Keeping UI in sync with API data
- **Optimistic Updates**: Improving UX with optimistic UI

### 4. Backend Integration

- **Node.js/Express**: Setting up backend server
- **MongoDB Integration**: Connecting to MongoDB database
- **RESTful Routes**: Creating API endpoints
- **Middleware**: Handling CORS and authentication

### 5. CRUD Operations

- **Create**: Adding new resources
- **Read**: Fetching and displaying data
- **Update**: Modifying existing resources
- **Delete**: Removing resources
- **Validation**: Client and server-side validation

---

## 🔧 Key Technologies

### Frontend
- **Vue 3**: Composition API, reactive state
- **Axios**: HTTP client library
- **Pinia**: State management for API data
- **Vite**: Build tool

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **Mongoose**: MongoDB ODM
- **CORS**: Cross-origin resource sharing

### Database
- **MongoDB**: NoSQL database
- **MongoDB Atlas**: Cloud database hosting

---

## 💡 Core Concepts

### API Integration Flow

```
Vue Component → API Service → HTTP Request → Backend API → Database
     ↓                                                              ↓
UI Update ← State Management ← Response Handling ← JSON Response
```

### Data Fetching Pattern

```javascript
// Component
const { data, loading, error, fetchData } = useApiData()

onMounted(() => {
  fetchData()
})

// API Service
async function fetchData() {
  try {
    loading.value = true
    const response = await api.get('/api/items')
    data.value = response.data
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
```

---

## 🎓 Project Structure

A typical API integration project structure:

```
api-app/
├── src/
│   ├── components/        # Vue components
│   ├── services/          # API service layer
│   │   └── api.js        # Axios configuration
│   ├── stores/           # Pinia stores
│   │   └── items.js      # API data store
│   ├── composables/      # Reusable composables
│   │   └── useApi.js     # API composable
│   └── main.js
└── backend/              # Optional backend
    ├── models/           # MongoDB models
    ├── routes/           # API routes
    └── server.js         # Express server
```

---

## 📖 Exercises Overview

### Exercise 1: API Setup
- Configure Axios instance
- Create API service layer
- Set up error handling
- Implement loading states

### Exercise 2: Data Fetching
- Fetch data from API
- Display data in components
- Handle loading and error states
- Implement data refresh

### Exercise 3: CRUD Operations
- Create new resources (POST)
- Read data (GET)
- Update resources (PUT/PATCH)
- Delete resources (DELETE)

### Exercise 4: Backend Integration
- Set up Express.js server
- Create MongoDB connection
- Create API endpoints
- Test API with Postman/Thunder Client

### Exercise 5: Form Integration
- Connect forms to API
- Handle form submissions
- Implement validation
- Show success/error feedback

---

## 🛠️ Development Workflow

### Running Locally

**Frontend:**
```bash
cd api-app
npm run dev
# Runs on http://localhost:5173
```

**Backend (if using):**
```bash
cd backend
npm run dev
# Runs on http://localhost:3000
```

### Testing the API

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `cd api-app && npm run dev`
3. **Test API**: Use Postman or Thunder Client to test endpoints
4. **Verify Integration**: Check Vue app displays data from API

---

## 📚 Additional Resources

### Official Documentation
- [Vue 3 Data Fetching](https://vuejs.org/guide/best-practices/data-fetching.html) - Vue data fetching patterns
- [Axios Documentation](https://axios-http.com/) - HTTP client library
- [Express.js Documentation](https://expressjs.com/) - Express.js official docs
- [Mongoose Documentation](https://mongoosejs.com/) - MongoDB ODM

### Video Tutorials
- [Vue API Integration](https://www.youtube.com/watch?v=example) - Vue API patterns
- [Axios Tutorial](https://www.youtube.com/watch?v=example) - Axios usage guide
- [Express.js Tutorial](https://www.youtube.com/watch?v=example) - Backend setup

### Practice Resources
- [Vue API Examples](https://github.com/vuejs/vue-next/tree/master/packages/vue/examples) - Official examples
- [REST API Design](https://restfulapi.net/) - REST principles
- [MongoDB University](https://university.mongodb.com/) - MongoDB courses

---

## 🎯 What's Next

### Ready to Continue?
- **Completed this lesson?** → Proceed to [Lesson 4: Routing & Authentication](../lesson4-routing-auth/readme.md)

### Need More Practice?
- **Study theory** → [theory3.md](./theory/theory3.md) - Deep dive into API integration
- **View examples** → [example/](./example/) - See API integration in action
- **Practice exercises** → [lab3.md](./lab/lab3.md) - CRUD application with API
- **Check solutions** → [lab3-solution.md](./lab/solution/lab3-solution.md) - Complete solutions

### Additional Resources
- **Quiz yourself** → [quiz3.html](./quiz/quiz3.html) - Test your API knowledge
- **Quick reference** → [reference3.md](./reference/reference3.md) - Code snippets and patterns
- **General questions?** → Review the reference guide
- **Still confused?** → [Check Troubleshooting Guide](../../extras/troubleshooting-guide.md)

---

## 🏆 Success Criteria

By the end of this lesson, you should be able to:

- [ ] Set up Axios and configure API services
- [ ] Fetch and display data from APIs
- [ ] Implement complete CRUD operations
- [ ] Handle loading and error states properly
- [ ] Integrate Vue with Express.js backend
- [ ] Connect to MongoDB database
- [ ] Handle form submissions with API
- [ ] Optimize API calls and data fetching

---

## 📝 Lesson Checklist

- [ ] Read theory documentation
- [ ] Explore example projects
- [ ] Complete lab exercises
- [ ] Review solution files
- [ ] Take quiz assessment
- [ ] Build your own API-integrated app

---

## 🚨 Common Pitfalls

### API Integration Issues
- **CORS errors**: Configure CORS middleware in backend
- **Network errors**: Check API URL and server status
- **Authentication**: Include tokens in request headers
- **Data format**: Ensure JSON parsing is correct

### State Management Issues
- **Stale data**: Implement proper data refreshing
- **Loading states**: Handle async operations correctly
- **Error handling**: Show user-friendly error messages
- **Memory leaks**: Clean up subscriptions and watchers

---

## 🔗 Related Lessons

- **[Lesson 2: Component Architecture](../lesson2-component-composition/)** - Component patterns
- **[Lesson 4: Routing & Authentication](../lesson4-routing-auth/)** - Protected API routes

---

## 💬 Getting Help

If you encounter issues:

1. **Check Troubleshooting Guide**: [troubleshooting-guide.md](../../extras/troubleshooting-guide.md)
2. **Review Example Code**: Check `example/` folder for working implementations
3. **Check Solutions**: Review `lab/solution/` for complete solutions
4. **Search Documentation**: Use Ctrl+F to find specific topics in theory files

---