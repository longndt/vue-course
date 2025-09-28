# Vue 3 Course Project Templates for Final Year Students

## Overview

These project templates are specifically designed for final-year IT students across various disciplines working on their capstone projects. Each template provides a complete full-stack application architecture that demonstrates modern web development practices with Vue 3 and can serve as inspiration for academic projects in Computer Science, Software Engineering, Information Systems, and Web Development programs.

**Skill Level Progression:**

- **Project 1 (Beginner)**: Student Information Management System
- **Project 2 (Intermediate)**: E-Learning Platform with Course Management
- **Project 3 (Advanced)**: Real-Time Collaborative Project Management System

**Academic Focus:**

- ✅ Suitable for capstone project requirements across IT disciplines
- ✅ Demonstrates technical proficiency expected at university level
- ✅ Includes documentation and testing appropriate for academic evaluation
- ✅ Shows understanding of modern software development practices

---

## Project 1: Student Management System (Beginner)

### 🎯 Learning Goals

- Master Vue 3 fundamentals with TypeScript and Composition API
- Implement CRUD operations with Node.js/Express/MongoDB backend
- Build responsive, professional user interfaces with Vue 3
- Practice form validation and error handling with VeeValidate
- Understand component architecture and reactive state management with Pinia

### 📋 Project Requirements

#### Core Features

1. **Student Registration & Profile Management**

   - Student registration form with validation
   - Profile editing with photo upload
   - Academic information tracking (courses, GPA, year)
   - Contact information management

2. **Course Management**

   - Course catalog with search and filtering
   - Course enrollment and withdrawal
   - Prerequisites checking
   - Schedule conflict detection

3. **Academic Records**

   - Grade tracking and GPA calculation
   - Transcript generation (PDF export)
   - Academic progress visualization
   - Semester-wise performance analysis

4. **Administrative Dashboard**

   - Student statistics and analytics
   - Bulk operations (import/export students)
   - Course capacity management
   - Academic calendar management

5. **Notification System**
   - Registration deadline reminders
   - Grade publication alerts
   - System announcements
   - Email integration

#### Technical Requirements

**Frontend (Vue 3 + TypeScript):**

```typescript
// Key components structure
src/
├── components/
│   ├── forms/
│   │   ├── StudentRegistrationForm.tsx
│   │   ├── CourseEnrollmentForm.tsx
│   │   └── ProfileEditForm.tsx
│   ├── layout/
│   │   ├── DashboardLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── tables/
│   │   ├── StudentsTable.tsx
│   │   ├── CoursesTable.tsx
│   │   └── GradesTable.tsx
│   └── charts/
│       ├── GPAChart.tsx
│       └── EnrollmentChart.tsx
├── hooks/
│   ├── useStudents.ts
│   ├── useCourses.ts
│   └── useGrades.ts
├── services/
│   ├── studentService.ts
│   ├── courseService.ts
│   └── gradeService.ts
└── types/
    ├── Student.ts
    ├── Course.ts
    └── Grade.ts
```

**Backend (Node.js + Express + MongoDB):**

```javascript
// API structure
server/
├── models/
│   ├── Student.js        // Student schema and model
│   ├── Course.js         // Course schema and model
│   ├── Enrollment.js     // Enrollment schema and model
│   ├── Grade.js          // Grade schema and model
│   └── Notification.js   // Notification schema and model
├── routes/
│   ├── students.js       // CRUD operations for students
│   ├── courses.js        // Course management
│   ├── enrollments.js    // Course enrollments
│   ├── grades.js         // Grade management
│   ├── analytics.js      // Dashboard statistics
│   └── notifications.js  // Notification system
└── index.js              // Express server setup

// MongoDB Collections
- students: { name, email, studentId, major, year, gpa, photoUrl }
- courses: { code, name, credits, instructor, capacity, semester }
- enrollments: { studentId, courseId, enrollmentDate, status }
- grades: { studentId, courseId, grade, points, semester }
- notifications: { userId, message, type, readStatus, createdAt }
```

#### Bonus Features

- **Mobile App**: Quasar/NativeScript-Vue version for students
- **QR Code Integration**: Student ID cards with QR codes
- **Attendance Tracking**: Integration with course schedules
- **Payment Integration**: Fee payment processing
- **Multi-language Support**: English and local language options

### 💻 Implementation Example

```typescript
// StudentDashboard.tsx - Main dashboard component
function StudentDashboard() {
  const { user } = useAuth();
  const { data: studentInfo } = useStudent(user.id);
  const { data: enrolledCourses } = useEnrolledCourses(user.id);
  const { data: grades } = useGrades(user.id);

  const currentGPA = calculateGPA(grades);
  const upcomingDeadlines = getUpcomingDeadlines(enrolledCourses);

  return (
    <DashboardLayout>
      <div class="dashboard-grid">
        <StatsCards
          gpa={currentGPA}
          enrolledCourses={enrolledCourses?.length}
          completedCredits={calculateCredits(grades)}
        />

        <CourseSchedule courses={enrolledCourses} />

        <RecentGrades grades={grades?.slice(0, 5)} />

        <UpcomingDeadlines deadlines={upcomingDeadlines} />

        <AcademicProgress
          currentYear={studentInfo?.year}
          totalCredits={calculateTotalCredits(grades)}
        />
      </div>
    </DashboardLayout>
  );
}
```

---

## Project 2: E-Learning Platform with Course Management (Intermediate)

### 🎯 Learning Goals

- Build complex multi-user applications
- Implement real-time features with WebSockets
- Handle file uploads and media management
- Create advanced search and filtering systems
- Integrate payment processing
- Implement role-based access control

### 📋 Project Requirements

#### Core Features

1. **Multi-Role User System**

   - Student accounts with learning progress tracking
   - Instructor accounts with course creation tools
   - Administrator accounts with platform management
   - Role-based dashboard customization

2. **Course Creation & Management**

   - Rich course content editor (videos, documents, quizzes)
   - Course categories and tags
   - Pricing and discount management
   - Course preview and free trials
   - Certificate generation upon completion

3. **Interactive Learning Features**

   - Video streaming with progress tracking
   - Interactive quizzes with immediate feedback
   - Discussion forums for each course
   - Live virtual classrooms (WebRTC integration)
   - Assignment submission and grading

4. **Payment & Enrollment System**

   - Shopping cart for multiple courses
   - Multiple payment methods (credit card, PayPal, local options)
   - Enrollment management and access control
   - Refund processing and policies

5. **Analytics & Reporting**
   - Student progress analytics
   - Instructor revenue dashboards
   - Course performance metrics
   - Platform usage statistics

#### Technical Requirements

**Frontend Architecture:**

```typescript
// Advanced component structure
src/
├── features/
│   ├── auth/
│   │   ├── components/ (LoginForm, RegisterForm, ForgotPassword)
│   │   ├── hooks/ (useAuth, useProfile)
│   │   └── services/ (authService.ts)
│   ├── courses/
│   │   ├── components/ (CourseCard, CoursePlayer, QuizComponent)
│   │   ├── hooks/ (useCourses, useEnrollment)
│   │   └── services/ (courseService.ts)
│   ├── payment/
│   │   ├── components/ (CheckoutForm, PaymentMethods)
│   │   ├── hooks/ (usePayment)
│   │   └── services/ (paymentService.ts)
│   └── communication/
│       ├── components/ (ChatRoom, VideoCall, Forum)
│       ├── hooks/ (useWebSocket, useWebRTC)
│       └── services/ (communicationService.ts)
├── shared/
│   ├── components/ (UI components, layouts)
│   ├── hooks/ (common hooks)
│   ├── utils/ (helpers, constants)
│   └── contexts/ (global state)
└── pages/
    ├── DashboardPage.tsx
    ├── CoursePage.tsx
    ├── CheckoutPage.tsx
    └── InstructorStudio.tsx
```

**Real-time Features Implementation:**

```typescript
// useWebSocket hook for live features
export function useWebSocket(roomId: string) {
  const [socket, setSocket] = ref<WebSocket | null>(null);
  const [messages, setMessages] = ref<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = ref<User[]>([]);

  onMounted(() => {
    const ws = new WebSocket(`ws://localhost:8080/room/${roomId}`);

    ws.onopen = () => {
      console.log("Connected to room:", roomId);
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "new_message":
          setMessages((prev) => [...prev, data.message]);
          break;
        case "user_joined":
          setOnlineUsers((prev) => [...prev, data.user]);
          break;
        case "user_left":
          setOnlineUsers((prev) => prev.filter((u) => u.id !== data.userId));
          break;
      }
    };

    return () => ws.close();
  }, [roomId]);

  const sendMessage = (message: string) => {
    if (socket) {
      socket.send(
        JSON.stringify({
          type: "send_message",
          message,
          roomId,
        })
      );
    }
  };

  return { messages, onlineUsers, sendMessage };
}

// Live classroom component
function LiveClassroom({ courseId }: { courseId: string }) {
  const { messages, onlineUsers, sendMessage } = useWebSocket(
    `course-${courseId}`
  );
  const { localStream, remoteStreams, startCall } = useWebRTC();

  return (
    <div class="live-classroom">
      <div class="video-grid">
        <video ref={localStream} autoPlay muted />
        {remoteStreams.map((stream) => (
          <video key={stream.id} ref={stream.ref} autoPlay />
        ))}
      </div>

      <div class="classroom-sidebar">
        <OnlineUsers users={onlineUsers} />
        <ChatPanel messages={messages} onSendMessage={sendMessage} />
      </div>
    </div>
  );
}
```

#### Advanced Features

- **AI-Powered Recommendations**: Course suggestions based on learning history
- **Gamification**: Points, badges, and leaderboards
- **Mobile Learning App**: Quasar companion app
- **Offline Support**: Progressive Web App with offline content
- **Multi-language Support**: Internationalization for global audience

---

## Project 3: Real-Time Collaborative Project Management System (Advanced)

### 🎯 Learning Goals

- Build enterprise-grade applications with microservices architecture
- Implement real-time collaboration features
- Handle complex state management across multiple modules
- Create advanced data visualization and reporting
- Deploy scalable applications with CI/CD pipelines

### 📋 Project Requirements

#### Core Features

1. **Project & Team Management**

   - Multi-tenant organization support
   - Project creation with templates and methodologies (Agile, Kanban)
   - Team formation with role assignments
   - Resource allocation and capacity planning

2. **Real-Time Collaboration**

   - Live document editing (like Google Docs)
   - Real-time kanban board updates
   - Instant messaging and video calls
   - Screen sharing and collaborative whiteboarding
   - Conflict resolution for simultaneous edits

3. **Advanced Task Management**

   - Hierarchical task breakdown (epics, stories, subtasks)
   - Dependency tracking and critical path analysis
   - Time tracking with detailed logging
   - Automated workflow triggers
   - Custom field definitions

4. **Reporting & Analytics**

   - Interactive project dashboards
   - Velocity tracking and burndown charts
   - Resource utilization reports
   - Predictive project completion dates
   - Export to multiple formats (PDF, Excel, PowerPoint)

5. **Integration Ecosystem**
   - Git repository integration (GitHub, GitLab, Bitbucket)
   - CI/CD pipeline monitoring
   - Third-party tool integrations (Slack, Jira, Trello)
   - REST API for external applications

#### Advanced Technical Architecture

**Microservices Backend:**

```typescript
// Service architecture
services/
├── auth-service/          // Authentication & authorization
├── project-service/       // Project management
├── collaboration-service/ // Real-time features
├── notification-service/  // Notifications & emails
├── reporting-service/     // Analytics & reports
├── integration-service/   // Third-party integrations
└── file-service/         // File storage & management

// Event-driven communication
interface ProjectEvent {
  type: 'task_created' | 'task_updated' | 'team_member_added';
  payload: any;
  timestamp: Date;
  userId: string;
  projectId: string;
}
```

**Advanced Vue Architecture:**

```typescript
// State management with Zustand
interface ProjectStore {
  projects: Project[];
  currentProject: Project | null;
  tasks: Task[];
  teamMembers: User[];

  // Actions
  loadProject: (id: string) => Promise<void>;
  createTask: (taskData: CreateTaskRequest) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  reorderTasks: (source: number, destination: number) => void;

  // Real-time subscriptions
  subscribeToProject: (projectId: string) => () => void;
  handleRealTimeUpdate: (event: ProjectEvent) => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  currentProject: null,
  tasks: [],
  teamMembers: [],

  loadProject: async (id: string) => {
    const project = await projectService.getProject(id);
    const tasks = await taskService.getProjectTasks(id);
    const members = await teamService.getProjectMembers(id);

    set({
      currentProject: project,
      tasks,
      teamMembers: members,
    });
  },

  subscribeToProject: (projectId: string) => {
    const socket = new WebSocket(`ws://localhost:8080/projects/${projectId}`);

    socket.onmessage = (event) => {
      const projectEvent: ProjectEvent = JSON.parse(event.data);
      get().handleRealTimeUpdate(projectEvent);
    };

    return () => socket.close();
  },

  handleRealTimeUpdate: (event: ProjectEvent) => {
    switch (event.type) {
      case "task_created":
        set((state) => ({
          tasks: [...state.tasks, event.payload],
        }));
        break;
      case "task_updated":
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === event.payload.id ? { ...task, ...event.payload } : task
          ),
        }));
        break;
    }
  },
}));
```

**Real-Time Collaborative Editor:**

```typescript
// Collaborative text editor using Operational Transform
export function CollaborativeEditor({ documentId }: { documentId: string }) {
  const [content, setContent] = ref("");
  const [cursors, setCursors] = ref<Map<string, CursorPosition>>(
    new Map()
  );
  const editorRef = ref<HTMLDivElement>();

  const { socket, sendOperation, onOperation } = useCollaboration(documentId);

  onMounted(() => {
    onOperation((operation: TextOperation) => {
      // Apply operation transform
      const transformedOp = transformOperation(operation, content);
      const newContent = applyOperation(content, transformedOp);
      setContent(newContent);
    });
  }, [content, onOperation]);

  const handleTextChange = (newContent: string) => {
    const operation = generateOperation(content, newContent);
    setContent(newContent);
    sendOperation(operation);
  };

  const handleCursorMove = (position: CursorPosition) => {
    socket.emit("cursor_move", {
      documentId,
      position,
      userId: getCurrentUser().id,
    });
  };

  return (
    <div class="collaborative-editor">
      <div class="editor-toolbar">
        <FormatButtons />
        <OnlineUsers cursors={cursors} />
      </div>

      <div
        ref={editorRef}
        contentEditable
        class="editor-content"
        onInput={(e) => handleTextChange(e.currentTarget.textContent || "")}
        onSelectionChange={handleCursorMove}
      >
        {content}
      </div>

      <CursorLayer cursors={cursors} />
    </div>
  );
}
```

#### Enterprise Features

- **Single Sign-On (SSO)**: SAML/OAuth integration
- **Audit Logging**: Complete activity tracking for compliance
- **Advanced Security**: Role-based permissions, data encryption
- **Multi-cloud Deployment**: Support for AWS, Azure, GCP
- **Performance Monitoring**: Application performance monitoring (APM)
- **Scalability**: Horizontal scaling with load balancers

### 🚀 Deployment & DevOps

```yaml
# docker-compose.yml for local development
version: "3.8"
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:8000

  api-gateway:
    build: ./api-gateway
    ports:
      - "8000:8000"
    depends_on:
      - auth-service
      - project-service

  auth-service:
    build: ./services/auth
    environment:
      - DB_URL=postgresql://user:pass@postgres:5432/auth_db

  project-service:
    build: ./services/project
    environment:
      - DB_URL=postgresql://user:pass@postgres:5432/project_db

  postgres:
    image: postgres:13
    environment:
      - POSTGRES_DB=projectmanager
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass

  redis:
    image: redis:6-alpine

  elasticsearch:
    image: elasticsearch:7.9.3
    environment:
      - discovery.type=single-node
```

---

## Assessment Criteria for Capstone Projects

### Technical Excellence (40%)

- **Code Quality**: Clean, maintainable, well-documented code
- **Architecture**: Proper separation of concerns, scalable design
- **Performance**: Optimized loading times, efficient data handling
- **Security**: Input validation, authentication, data protection

### Innovation & Complexity (25%)

- **Advanced Features**: Real-time collaboration, AI integration, complex algorithms
- **Technology Integration**: Multiple technologies working together seamlessly
- **Problem Solving**: Novel solutions to real-world problems

### User Experience (20%)

- **Interface Design**: Intuitive, accessible, responsive design
- **User Journey**: Smooth workflows, minimal friction
- **Accessibility**: WCAG compliance, keyboard navigation

### Documentation & Presentation (15%)

- **Technical Documentation**: Clear setup instructions, API documentation
- **Project Report**: Comprehensive analysis of requirements, design, implementation
- **Demo & Presentation**: Effective demonstration of features and capabilities

## Getting Started with Your Project

### Step 1: Choose Your Project Template

Select based on your current skill level and final year project requirements.

### Step 2: Set Up Development Environment

Follow the [Comprehensive Environment Setup Guide](../setup/environment-setup.md) and install all necessary development tools, including Node.js, VS Code, Git, and MongoDB.

### Step 3: Plan Your Implementation

- Break down features into manageable sprints
- Create user stories and acceptance criteria
- Design your database schema and API endpoints

### Step 4: Start with MVP

Focus on core features first, then add advanced functionality.

### Step 5: Iterate and Improve

Regular testing, code reviews, and feature additions.

These project templates provide a solid foundation for impressive final year projects that demonstrate both technical skill and practical application of modern web development practices.

- Task counter (active/total)
- Edit existing tasks
- Task priorities (high, medium, low)
- Local storage persistence
- Drag and drop reordering

### 🏗️ Implementation Guide

#### 1. Project Structure

```
todo-app/
├── src/
│   ├── components/
│   │   ├── TodoApp.vue
│   │   ├── TodoForm.vue
│   │   ├── TodoList.vue
│   │   ├── TodoItem.vue
│   │   └── TodoFilter.vue
│   ├── hooks/
│   │   └── useTodos.js
│   ├── styles/
│   │   └── TodoApp.css
│   └── utils/
│       └── helpers.js
```

#### 2. Component Breakdown

```vue
// components/TodoApp.vue
import { ref } from "vue";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import TodoFilter from "./TodoFilter";

function TodoApp() {
  const [todos, setTodos] = ref([]);
  const [filter, setFilter] = ref("all"); // 'all', 'active', 'completed'

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div class="todo-app">
      <h1>My Todo List</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoFilter filter={filter} onFilterChange={setFilter} />
      <TodoList
        todos={filteredTodos}
        onToggleTodo={toggleTodo}
        onDeleteTodo={deleteTodo}
      />
    </div>
  );
}

export default TodoApp;
```

#### 3. Custom Hook Example

```vue
// hooks/useTodos.js
import { ref, onMounted } from "vue";

export function useTodos() {
  const [todos, setTodos] = ref([]);

  // Load from localStorage on mount
  onMounted(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save to localStorage when todos change
  onMounted(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  const stats = {
    total: todos.length,
    active: todos.filter((todo) => !todo.completed).length,
    completed: todos.filter((todo) => todo.completed).length,
  };

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    stats,
  };
}
```

### 📚 Concepts Practiced

- Functional components and Vue SFC
- State management with ref
- Event handling and forms
- Conditional rendering
- List rendering with keys
- Props passing and composition
- CSS styling and classes

---

## Project 4: E-commerce Store (Intermediate)

### 🎯 Learning Goals

- Complex state management
- API integration with Vue Query (TanStack Query)
- Routing with Vue Router
- Authentication and protected routes
- Context API for global state
- Form validation and error handling

### 📋 Project Requirements

#### Core Features

1. **Product Catalog**

   - Display products in grid layout
   - Product search and filtering
   - Category-based navigation
   - Product detail pages

2. **Shopping Cart**

   - Add/remove products
   - Update quantities
   - Cart persistence
   - Total calculation

3. **User Authentication**

   - Registration and login forms
   - JWT token management
   - Protected routes
   - User profile page

4. **Checkout Process**
   - Order form with validation
   - Order confirmation
   - Order history

#### Bonus Features

- Product reviews and ratings
- Wishlist functionality
- Responsive design
- Loading states and skeletons
- Error boundaries

### 🏗️ Implementation Guide

#### 1. Project Structure

```
ecommerce-store/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── products/
│   │   ├── cart/
│   │   └── auth/
│   ├── pages/
│   │   ├── HomePage.vue
│   │   ├── ProductsPage.vue
│   │   ├── ProductDetailPage.vue
│   │   ├── CartPage.vue
│   │   └── CheckoutPage.vue
│   ├── context/
│   │   ├── AuthContext.vue
│   │   └── CartContext.vue
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   └── useProducts.js
│   ├── services/
│   │   └── api.js
│   └── utils/
│       ├── validation.js
│       └── helpers.js
```

#### 2. API Integration Example

```vue
// services/api.js
const API_BASE = "https://your-mock-api.com/api";

export const api = {
  // Products
  getProducts: async () => {
    const response = await fetch(`${API_BASE}/products`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  },

  getProduct: async (id) => {
    const response = await fetch(`${API_BASE}/products/${id}`);
    if (!response.ok) throw new Error("Product not found");
    return response.json();
  },

  // Auth
  login: async (credentials) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error("Login failed");
    return response.json();
  },

  // Orders
  createOrder: async (orderData) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error("Order creation failed");
    return response.json();
  },
};
```

#### 3. Cart Context Implementation

```vue
// context/CartContext.vue
import { defineStore } from "pinia";

const cartSymbol = Symbol('cart')

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: action.payload.quantity }
              : item
          )
          .filter((item) => item.quantity > 0),
      };

    case "CLEAR_CART":
      return { ...state, items: [] };

    default:
      return state;
  }
};

// Store Pinia version
export const useCartStore = defineStore('cart', () => {
  const state = reactive({ items: [] });

  const addItem = (product) => {
    state.items.push(product);
  };

  const removeItem = (productId) => {
    const index = state.items.findIndex(item => item.id === productId);
    if (index > -1) {
      state.items.splice(index, 1);
    }
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const totalItems = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const totalPrice = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const value = {
    items: state.items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const store = inject('cart');
  if (!store) {
    throw new Error("useCart must be used within CartProvider");
  }
  return store;
};
```

### 📚 Concepts Practiced

- Vue Router navigation
- Context API for global state
- Vue Query for API management
- Form validation and error handling
- Authentication and protected routes
- Complex state management patterns

---

## Project 5: Social Media Dashboard (Advanced)

### 🎯 Learning Goals

- Real-time data with WebSockets
- Advanced state management (Redux/Zustand)
- Performance optimization
- Testing implementation
- Deployment and CI/CD
- Advanced Vue patterns

### 📋 Project Requirements

#### Core Features

1. **Real-time Feed**

   - Live post updates
   - Real-time notifications
   - Infinite scrolling
   - Like and comment functionality

2. **User Management**

   - User profiles and settings
   - Follow/unfollow system
   - Profile customization
   - Activity tracking

3. **Content Creation**

   - Rich text editor
   - Image/video uploads
   - Post scheduling
   - Draft management

4. **Analytics Dashboard**
   - Engagement metrics
   - User activity charts
   - Performance insights
   - Export functionality

#### Bonus Features

- Dark/light theme system
- PWA capabilities
- Push notifications
- Advanced search with filters
- Admin panel
- Moderation tools

### 🏗️ Implementation Guide

#### 1. Project Structure

```
social-dashboard/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── feed/
│   │   ├── profile/
│   │   ├── analytics/
│   │   └── admin/
│   ├── pages/
│   ├── store/
│   │   ├── slices/
│   │   └── index.js
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   ├── types/
│   └── __tests__/
```

#### 2. WebSocket Integration

```vue
// hooks/useWebSocket.js
import { onMounted, ref } from "vue";

export function useWebSocket(url) {
  const socket = ref(null);
  const isConnected = ref(false);
  const lastMessage = ref(null);
  const reconnectTimeoutRef = ref();

  onMounted(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        setIsConnected(true);
        setSocket(ws);
        console.log("WebSocket connected");
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setLastMessage(message);
      };

      ws.onclose = () => {
        setIsConnected(false);
        setSocket(null);
        console.log("WebSocket disconnected, attempting to reconnect...");

        // Reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };

    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket) {
        socket.close();
      }
    };
  }, [url]);

  const sendMessage = (message) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
    }
  };

  return { socket, isConnected, lastMessage, sendMessage };
}
```

#### 3. Performance Optimization Example

```vue
// components/VirtualizedFeed.vue
import { RecycleScroller } from "vue-virtual-scroller";
import { defineComponent } from "vue";

const PostItem = memo(({ index, style, data }) => (
  <div style={style}>
    <Post post={data[index]} />
  </div>
));

function VirtualizedFeed({ posts }) {
  return (
    <List height={600} itemCount={posts.length} itemSize={200} itemData={posts}>
      {PostItem}
    </List>
  );
}

export default VirtualizedFeed;
```

### 📚 Concepts Practiced

- Advanced state management
- Real-time data handling
- Performance optimization
- Testing strategies
- Deployment pipelines
- Advanced Vue patterns

---

## Getting Started

### Choose Your Project Level

1. **Beginner**: Start with the Todo Application
2. **Intermediate**: Move to the E-commerce Store
3. **Advanced**: Challenge yourself with the Social Media Dashboard

### Setup Instructions

```bash
# Create new Vue project
npm create vue@latest my-project

# Navigate to project
cd my-project

# Install additional dependencies (as needed)
npm install vue-router @tanstack/vue-query pinia

# Start development server
npm run dev
```

### Submission Guidelines

Each project should include:

1. **Complete source code** with proper file organization
2. **readme.md** with setup instructions and feature list
3. **Live demo** deployed to Netlify/Vercel
4. **Test coverage** for critical components
5. **Documentation** of key decisions and challenges

### Evaluation Criteria

- **Functionality**: All core features working correctly
- **Code Quality**: Clean, readable, and well-organized code
- **Best Practices**: Following Vue conventions and patterns
- **User Experience**: Intuitive and responsive design
- **Documentation**: Clear setup and usage instructions
