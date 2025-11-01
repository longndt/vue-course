# Advanced Vue 3 Patterns & Architecture

## 🎯 For Final-Year IT Students Ready to Master Professional Vue 3

This guide covers advanced Vue 3 patterns, architectural decisions, and enterprise-level practices that will set your capstone project apart and prepare you for senior developer roles.

**Prerequisites:** Complete Lessons 1-5 and feel confident with Vue 3 fundamentals.

---

## 🏗️ **Advanced Component Patterns**

### 1. Compound Components Pattern

Create components that work together as a cohesive unit, using Vue's provide/inject and slots.

```vue
<!-- Modal.vue - Parent Component -->
<script setup>
import { provide } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})
const emit = defineEmits(['close'])

function onClose() {
  emit('close')
}

// Provide modal context to children
provide('modal', {
  isOpen: props.isOpen,
  onClose
})
</script>

<template>
  <Teleport to="body" v-if="isOpen">
    <div class="modal-overlay" @click="onClose">
      <div class="modal-content" @click.stop>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
```

```vue
<!-- ModalHeader.vue - Child Component -->
<script setup>
import { inject } from 'vue'

const modal = inject('modal')
if (!modal) {
  throw new Error('ModalHeader must be used within Modal')
}
</script>

<template>
  <div class="modal-header">
    <slot />
    <button @click="modal.onClose" class="close-btn">×</button>
  </div>
</template>

<!-- ModalBody.vue -->
<template>
  <div class="modal-body">
    <slot />
  </div>
</template>

<!-- ModalFooter.vue -->
<template>
  <div class="modal-footer">
    <slot />
  </div>
</template>

<!-- Usage - Clean and Intuitive -->
<script setup>
import { ref } from 'vue'
import Modal from './components/Modal.vue'

const isOpen = ref(false)

const handleDelete = () => {
  // Delete logic here
  isOpen.value = false
}
</script>

<template>
  <Modal :is-open="isOpen" @close="isOpen = false">
    <template #header>
      <h2>Confirm Action</h2>
    </template>

    <template #body>
      <p>Are you sure you want to delete this item?</p>
    </template>

    <template #footer>
      <button @click="isOpen = false">Cancel</button>
      <button @click="handleDelete">Delete</button>
    </template>
  </Modal>
</template>
```

### 2. Scoped Slots Pattern

Share data between components using Vue's scoped slots for flexible rendering.

```vue
<!-- DataFetcher.vue with Scoped Slots -->
<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  url: {
    type: String,
    required: true
  }
})

const data = ref(null)
const loading = ref(true)
const error = ref(null)

const fetchData = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await fetch(props.url)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const result = await response.json()
    data.value = result
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <slot
    :data="data"
    :loading="loading"
    :error="error"
    :refetch="fetchData"
  />
</template>

<!-- Usage - Flexible Rendering -->
<script setup lang="ts">
interface User {
  id: string
  name: string
  email: string
  avatar: string
}

interface Props {
  userId: string
}

const props = defineProps<Props>()
</script>

<template>
  <DataFetcher :url="`/api/users/${userId}`">
    <template #default="{ data: user, loading, error, refetch }">
      <UserSkeleton v-if="loading" />
      <ErrorMessage v-else-if="error" :error="error" @retry="refetch" />
      <NotFound v-else-if="!user" />
      <div v-else class="user-profile">
        <img :src="user.avatar" :alt="user.name" />
        <h1>{{ user.name }}</h1>
        <p>{{ user.email }}</p>
      </div>
    </template>
  </DataFetcher>
</template>
```

### 3. Higher-Order Components (HOCs)

Enhance components with additional functionality.

```tsx
// HOC for Authentication
function withAuth<P extends object>(
  WrappedComponent: Component<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { user, isLoading } = useAuth();

    if (isLoading) return <LoadingSpinner />;
    if (!user) return <LoginPrompt />;

    return <WrappedComponent {...props} />;
  };
}

// HOC for Error Boundary
function withErrorBoundary<P extends object>(
  WrappedComponent: Component<P>,
  fallback?: Component<{ error: Error; reset: () => void }>
) {
  return function ComponentWithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

// Usage - Compose HOCs
const SecureUserDashboard = withAuth(
  withErrorBoundary(UserDashboard, ErrorFallback)
);
```

---

## 🏛️ **Advanced Architecture Patterns**

### 1. Feature-Based Folder Structure

Organize code by features, not by file types.

```
src/
├── shared/              # Shared utilities and components
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Reusable custom hooks
│   ├── utils/           # Helper functions
│   └── types/           # Shared TypeScript types
├── features/            # Feature-specific code
│   ├── auth/
│   │   ├── components/  # Auth-specific components
│   │   ├── hooks/       # Auth-specific hooks
│   │   ├── services/    # Auth API calls
│   │   ├── types/       # Auth-specific types
│   │   └── index.ts     # Feature exports
│   ├── dashboard/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   └── projects/
├── pages/               # Route components
└── app/                 # App-level configuration
    ├── store/           # Global state management
    ├── router/          # Routing configuration
    └── providers/       # Context providers
```

### 2. Dependency Injection Pattern

Make components testable and modular by injecting dependencies.

```tsx
// Service Interface
interface UserService {
  getUser(id: string): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
}

// API Implementation
class ApiUserService implements UserService {
  constructor(private apiClient: ApiClient) {}

  async getUser(id: string): Promise<User> {
    return this.apiClient.get(`/users/${id}`);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.apiClient.put(`/users/${id}`, data);
  }

  async deleteUser(id: string): Promise<void> {
    await this.apiClient.delete(`/users/${id}`);
  }
}

// Service Provider
const ServiceKey = Symbol('services') as InjectionKey<{
  userService: UserService;
}>;

<!-- ServiceProvider.vue -->
<script setup>
import { provide } from 'vue'
import { ApiUserService, ApiClient } from './services'

const services = {
  userService: new ApiUserService(new ApiClient())
}

provide(ServiceKey, services)
</script>

<template>
  <slot />
</template>

// Custom Composable for Service Access
export function useServices() {
  const services = inject(ServiceKey)
  if (!services) throw new Error('useServices must be used within ServiceProvider')
  return services
}

<!-- Component Using Injected Service -->
<script setup lang="ts">
interface Props {
  userId: string
}

const props = defineProps<Props>()
const { userService } = useServices()
const user = ref<User | null>(null)

  onMounted(() => {
    userService.getUser(userId).then(setUser);
  }, [userId, userService]);

  return user ? h(UserCard, { user }) : h(Loading);
}
```

### 3. CQRS (Command Query Responsibility Segregation)

Separate read and write operations for better scalability.

```tsx
// Commands (Write Operations)
interface CreateUserCommand {
  type: 'CREATE_USER';
  payload: { name: string; email: string };
}

interface UpdateUserCommand {
  type: 'UPDATE_USER';
  payload: { id: string; data: Partial<User> };
}

type UserCommand = CreateUserCommand | UpdateUserCommand;

// Command Handlers
class UserCommandHandler {
  constructor(private apiClient: ApiClient) {}

  async handle(command: UserCommand): Promise<void> {
    switch (command.type) {
      case 'CREATE_USER':
        await this.apiClient.post('/users', command.payload);
        break;
      case 'UPDATE_USER':
        await this.apiClient.put(`/users/${command.payload.id}`, command.payload.data);
        break;
    }
  }
}

// Queries (Read Operations)
interface GetUserQuery {
  type: 'GET_USER';
  payload: { id: string };
}

interface GetUsersQuery {
  type: 'GET_USERS';
  payload: { filters?: UserFilters };
}

type UserQuery = GetUserQuery | GetUsersQuery;

// Query Handlers
class UserQueryHandler {
  constructor(private apiClient: ApiClient) {}

  async handle(query: UserQuery): Promise<any> {
    switch (query.type) {
      case 'GET_USER':
        return this.apiClient.get(`/users/${query.payload.id}`);
      case 'GET_USERS':
        return this.apiClient.get('/users', { params: query.payload.filters });
    }
  }
}

// Usage in Components
function UserManagement() {
  const commandHandler = useCommandHandler();
  const queryHandler = useQueryHandler();

  const createUser = async (userData: CreateUserData) => {
    await commandHandler.handle({
      type: 'CREATE_USER',
      payload: userData
    });
    // Trigger refetch of user list
  };

  return (
    <div>
      <CreateUserForm onSubmit={createUser} />
      <UserList queryHandler={queryHandler} />
    </div>
  );
}
```

---

## 🚀 **Performance Optimization Patterns**

### 1. Advanced Memoization Strategies

```tsx
// Memoize Expensive Calculations
function ExpensiveComponent({ items, filters }: Props) {
  // Only recalculate when items or filters change
  const processedItems = computed(() => {
    return items.value
      .filter(item => matchesFilters(item, filters.value))
      .sort((a, b) => a.priority - b.priority)
      .map(item => ({ ...item, computedValue: expensiveCalculation(item) }));
  });

  // Memoize callback to prevent unnecessary re-renders
  const handleItemClick = (itemId: string) => {
    // Handle click logic
  }

  return {
    processedItems,
    handleItemClick
  }
}
</script>

<template>
  <div>
    <MemoizedItemCard
      v-for="item in processedItems"
      :key="item.id"
      :item="item"
      @click="handleItemClick"
    />
  </div>
</template>

<!-- Memoized Component with Vue's shallowRef -->
<script setup lang="ts">
interface Props {
  item: Item
}

const props = defineProps<Props>()

// Use shallowRef for performance when dealing with complex objects
const memoizedItem = shallowRef(props.item)

// Custom comparison logic using watch
watch(() => props.item, (newItem, oldItem) => {
  // Only update if meaningful properties changed
  if (newItem.id !== oldItem?.id ||
      newItem.updatedAt !== oldItem?.updatedAt) {
    memoizedItem.value = newItem
  }
}, { deep: false })
</script>
```

### 2. Virtual Scrolling for Large Lists

```ts
// Virtual Scrolling Composable
export function useVirtualScrolling<T>(options: {
  items: Ref<T[]>
  itemHeight: number
  containerHeight: number
  overscan?: number
}) {
  const { items, itemHeight, containerHeight, overscan = 5 } = options
  const scrollTop = ref(0)

  const visibleStart = computed(() => Math.floor(scrollTop.value / itemHeight))
  const visibleEnd = computed(() => Math.min(
    visibleStart.value + Math.ceil(containerHeight / itemHeight),
    items.value.length - 1
  ))

  const startIndex = computed(() => Math.max(0, visibleStart.value - overscan))
  const endIndex = computed(() => Math.min(items.value.length - 1, visibleEnd.value + overscan))

  const visibleItems = computed(() => items.value.slice(startIndex.value, endIndex.value + 1))

  return {
    visibleItems,
    startIndex,
  const totalHeight = computed(() => items.value.length * itemHeight)
  const offsetY = computed(() => startIndex.value * itemHeight)

  const setScrollTop = (value: number) => {
    scrollTop.value = value
  }

  return {
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
    setScrollTop
  }
}

// Virtual List Component
<template>
  <div
    ref="containerRef"
    :style="{ height: containerHeight + 'px', overflow: 'auto' }"
    @scroll="handleScroll"
  >
    <div :style="{ height: totalHeight + 'px', position: 'relative' }">
      <div
        v-for="item in visibleItems"
        :key="item.index"
        :style="{
          position: 'absolute',
          top: (item.index * itemHeight) + 'px',
          height: itemHeight + 'px',
          width: '100%'
        }"
      >
        <slot :item="item.data" :index="item.index" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

interface VirtualListProps<T> {
  items: T[];
  itemHeight?: number;
}

const props = withDefaults(defineProps<VirtualListProps<any>>(), {
  itemHeight: 50
});

const containerRef = ref<HTMLDivElement>();
  const [containerHeight, setContainerHeight] = ref(400);

  const {
    visibleItems,
    startIndex,
    totalHeight,
    offsetY,
    setScrollTop
  } = useVirtualScrolling({
    items,
    itemHeight,
    containerHeight
  });

  const handleScroll = (e: Event<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      class="virtual-list"
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) =>
            renderItem(item, startIndex + index)
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## 🔄 **Advanced State Management**

### 1. State Machines with XState

```tsx
import { createMachine, interpret } from 'xstate';

// Define state machine
const userMachine = createMachine({
  id: 'user',
  initial: 'idle',
  context: {
    user: null,
    error: null,
  },
  states: {
    idle: {
      on: {
        FETCH: 'loading'
      }
    },
    loading: {
      invoke: {
        id: 'fetchUser',
        src: 'fetchUserService',
        onDone: {
          target: 'success',
          actions: 'assignUser'
        },
        onError: {
          target: 'failure',
          actions: 'assignError'
        }
      }
    },
    success: {
      on: {
        FETCH: 'loading',
        EDIT: 'editing'
      }
    },
    editing: {
      on: {
        SAVE: 'saving',
        CANCEL: 'success'
      }
    },
    saving: {
      invoke: {
        id: 'saveUser',
        src: 'saveUserService',
        onDone: 'success',
        onError: 'failure'
      }
    },
    failure: {
      on: {
        RETRY: 'loading'
      }
    }
  }
});

// Vue Composable for State Machine
function useUserMachine(userId: string) {
  const [state, send] = useMachine(userMachine, {
    services: {
      fetchUserService: () => fetch(`/api/users/${userId}`).then(r => r.json()),
      saveUserService: (context) =>
        fetch(`/api/users/${userId}`, {
          method: 'PUT',
          body: JSON.stringify(context.user)
        })
    },
    actions: {
      assignUser: (context, event) => {
        context.user = event.data;
      },
      assignError: (context, event) => {
        context.error = event.data;
      }
    }
  });

  return [state, send];
}
```

### 2. Advanced Zustand Patterns

```tsx
// Slice Pattern for Large Stores
interface UserSlice {
  users: User[];
  selectedUser: User | null;
  fetchUsers: () => Promise<void>;
  selectUser: (id: string) => void;
}

interface ProjectSlice {
  projects: Project[];
  activeProject: Project | null;
  createProject: (data: CreateProjectData) => Promise<void>;
}

// Create User Slice
const createUserSlice: StateCreator<AppState, [], [], UserSlice> = (set, get) => ({
  users: [],
  selectedUser: null,

  fetchUsers: async () => {
    const users = await api.getUsers();
    set(state => ({ ...state, users }));
  },

  selectUser: (id: string) => {
    const user = get().users.find(u => u.id === id);
    set(state => ({ ...state, selectedUser: user || null }));
  }
});

// Create Project Slice
const createProjectSlice: StateCreator<AppState, [], [], ProjectSlice> = (set) => ({
  projects: [],
  activeProject: null,

  createProject: async (data) => {
    const project = await api.createProject(data);
    set(state => ({
      ...state,
      projects: [...state.projects, project],
      activeProject: project
    }));
  }
});

// Combine Slices
type AppState = UserSlice & ProjectSlice;

const useAppStore = create<AppState>()(
  devtools(
    persist(
      (...args) => ({
        ...createUserSlice(...args),
        ...createProjectSlice(...args)
      }),
      { name: 'app-store' }
    )
  )
);
```

---

## 🧪 **Advanced Testing Patterns**

### 1. Component Integration Testing

```tsx
// Test Utils with Custom Render
function createTestWrapper({ initialState, services }: TestWrapperOptions) {
  return function TestWrapper({ children }: { children: VueNode }) {
    return (
      <QueryClient client={createTestQueryClient()}>
        <MemoryRouter>
          <ServiceProvider services={services}>
            <StateProvider initialState={initialState}>
              {children}
            </StateProvider>
          </ServiceProvider>
        </MemoryRouter>
      </QueryClient>
    );
  };
}

// Integration Test
describe('UserProfile Integration', () => {
  it('should display user data and handle updates', async () => {
    const mockUserService = {
      getUser: jest.fn().mockResolvedValue(mockUser),
      updateUser: jest.fn().mockResolvedValue({ ...mockUser, name: 'Updated Name' })
    };

    const wrapper = createTestWrapper({
      services: { userService: mockUserService }
    });

    render(<UserProfile userId="123" />, { wrapper });

    // Wait for data to load
    expect(await screen.findByText('John Doe')).toBeInTheDocument();

    // Test user interaction
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    // Verify service was called
    expect(mockUserService.updateUser).toHaveBeenCalledWith('123', {
      name: 'Updated Name'
    });

    // Verify UI updates
    expect(await screen.findByText('Updated Name')).toBeInTheDocument();
  });
});
```

---

## 📈 **Scalability Considerations**

### 1. Micro-Frontend Architecture

```tsx
// Module Federation Setup (webpack.config.js)
const ModuleFederationPlugin = require('@module-federation/webpack');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      remotes: {
        userModule: 'userModule@http://localhost:3001/remoteEntry.js',
        projectModule: 'projectModule@http://localhost:3002/remoteEntry.js'
      }
    })
  ]
};

// Dynamic Module Loading
const UserModule = lazy(() => import('userModule/UserDashboard'));
const ProjectModule = lazy(() => import('projectModule/ProjectBoard'));

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/users/*" element={<UserModule />} />
          <Route path="/projects/*" element={<ProjectModule />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
```

### 2. Code Splitting Strategies

```tsx
// Route-based Code Splitting
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const UserPage = lazy(() => import('../pages/UserPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));

// Component-based Code Splitting
const HeavyChart = lazy(() => import('../components/HeavyChart'));

function Dashboard() {
  const [showChart, setShowChart] = ref(false);

  return (
    <div>
      <h1>Dashboard</h1>
      {showChart && (
        <Suspense fallback={<ChartSkeleton />}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
}

// Feature-based Code Splitting
const AdminPanel = lazy(() =>
  import('../features/admin').then(module => ({ default: module.AdminPanel }))
);
```

---

## 🛡️ **Security Best Practices**

### 1. XSS Prevention

```tsx
// Safe HTML Rendering
import DOMPurify from 'dompurify';

function SafeHTML({ html }: { html: string }) {
  const cleanHTML = DOMPurify.sanitize(html);

  return (
    <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />
  );
}

// Content Security Policy Hook
function useCSP() {
  onMounted(() => {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline'";
    document.head.appendChild(meta);

    return () => document.head.removeChild(meta);
  }, []);
}
```

### 2. Authentication & Authorization Patterns

```tsx
// Role-based Access Control
interface RBACProps {
  roles: string[];
  children: VueNode;
  fallback?: VueNode;
}

function RBAC({ roles, children, fallback }: RBACProps) {
  const { user } = useAuth();

  const hasRequiredRole = roles.some(role =>
    user?.roles?.includes(role)
  );

  if (!hasRequiredRole) {
    return fallback || <AccessDenied />;
  }

  return children;
}

// Usage
function AdminPanel() {
  return (
    <RBAC roles={['admin']} fallback={<NotAuthorized />}>
      <AdminDashboard />
    </RBAC>
  );
}
```

---

## 🎯 **When to Use These Patterns**

### For Capstone Projects:

**Essential (Must Use):**
- Feature-based folder structure
- Advanced memoization
- Error boundaries
- Basic compound components

**Good to Have:**
- Render props for data fetching
- State machines for complex flows
- Virtual scrolling for large datasets

**Advanced (Bonus Points):**
- Micro-frontend architecture
- CQRS pattern
- Advanced testing strategies

### Career Preparation:

These patterns demonstrate:
- **Senior-level thinking**
- **Scalability awareness**
- **Performance optimization**
- **Maintainable code architecture**
- **Enterprise development experience**

---

## 📚 **Further Reading**

- [Vue Design Patterns](https://vuejs.org/guide/)
- [Advanced Vue Component Patterns](https://vuejs.org/guide/reusability/composables.html)
- [XState Documentation](https://xstate.js.org/docs/)
- [Vue Performance](https://vuejs.org/guide/best-practices/performance.html)
- [Micro-Frontend Architecture](https://micro-frontends.org/)

---

*🚀 Master these patterns and you'll be ready for senior Vue developer roles straight out of university!*