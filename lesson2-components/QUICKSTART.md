# Quick Start Guide - Lesson 2

## Build Your First Component Library

### 1. Setup From Previous Lesson

```bash
# Continue with your React app from Lesson 1 or create new
cd my-react-app  # or create new with: npm create vite@latest

# Make sure you're running
npm run dev
```

### 2. Create a Button Component

Create `src/components/Button.vue`:

```vue
<template>
  <button
    :class="buttonClasses"
    @click="handleClick"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup>
import { ref, computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  disabled: false
})

const emit = defineEmits<{
  click: []
}>()

const isClicked = ref(false)

const buttonClasses = computed(() => [
  'btn',
  `btn-${props.variant}`,
  `btn-${props.size}`,
  { clicked: isClicked.value }
])

const handleClick = () => {
  isClicked.value = true
  setTimeout(() => (isClicked.value = false), 200)
  emit('click')
}
  );
}

export default Button;
```

### 3. Add Button Styles

Create `src/components/Button.css`:

```css
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn.clicked {
  transform: scale(0.98);
}

/* Variants */
.btn-primary {
  background: #007bff;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

/* Sizes */
.btn-small {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.btn-large {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}
```

### 4. Create a Form Component

Create `src/components/UserForm.vue`:

```vue
<template>
  <form @submit.prevent="handleSubmit" class="user-form">
    <div class="form-group">
      <label for="name">Nom:</label>
      <input
        id="name"
        v-model="formData.name"
        type="text"
        :class="{ error: errors.name }"
      />
      <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
    </div>

    <div class="form-group">
      <label for="email">Email:</label>
      <input
        id="email"
        v-model="formData.email"
        type="email"
        :class="{ error: errors.email }"
      />
      <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
    </div>

    <div class="form-group">
      <label for="role">Rôle:</label>
      <select id="role" v-model="formData.role">
        <option value="user">Utilisateur</option>
        <option value="admin">Administrateur</option>
      </select>
    </div>

    <Button type="submit">Ajouter Utilisateur</Button>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue';
import Button from './Button.vue';

defineProps(['onSubmit']);

const formData = reactive({
  name: '',
  email: '',
  role: 'user',
});

const errors = ref({});

const validateForm = () => {
  const newErrors = {};

  if (!formData.name.trim()) {
    newErrors.name = "Name is required";
  }

  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = "Email is invalid";
  }

  return newErrors;
};

const handleSubmit = () => {
  const newErrors = validateForm();

  if (Object.keys(newErrors).length > 0) {
    errors.value = newErrors;
    return;
  }

  errors.value = {};
  onSubmit?.(formData);

  // Reset form
  Object.assign(formData, { name: "", email: "", role: "user" });
};
</script>

<style scoped>
.user-form {
  max-width: 400px;
  margin: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-group input.error,
.form-group select.error {
            border: errors.name ? "2px solid red" : "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        {errors.name && (
          <span style={{ color: "red", fontSize: "0.8em" }}>{errors.name}</span>
        )}
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "5px",
            border: errors.email ? "2px solid red" : "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        {errors.email && (
          <span style={{ color: "red", fontSize: "0.8em" }}>
            {errors.email}
          </span>
        )}
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="role">Role:</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "5px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <option value="developer">Developer</option>
          <option value="designer">Designer</option>
          <option value="manager">Manager</option>
          <option value="student">Student</option>
        </select>
      </div>

      <Button type="submit" variant="primary" size="large">
        Add User
      </Button>
    </form>
  );
}

export default UserForm;
```

### 5. Use Components in App

Update `src/App.vue`:

```vue
<template>
  <div class="app">
    <h1>User Management System</h1>

    <div class="button-container">
      <Button
        variant="primary"
        @click="showForm = !showForm"
      >
        {{ showForm ? "Hide Form" : "Add New User" }}
      </Button>
    </div>

    <UserForm
      v-if="showForm"
      :on-submit="handleAddUser"
    />

    <div class="users-section">
      <h2>Users ({{ users.length }})</h2>
      <p v-if="users.length === 0">No users yet. Add some!</p>
      <div v-else class="users-grid">
        <div
          v-for="user in users"
          :key="user.id"
          class="user-card"
        >
          <div class="user-info">
            <strong>{{ user.name }}</strong> ({{ user.email }})
            <br>
            <small>Role: {{ user.role }}</small>
          </div>
          <Button
            variant="danger"
            size="small"
            @click="handleDeleteUser(user.id)"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Button from './components/Button.vue';
import UserForm from './components/UserForm.vue';

const users = ref([]);
const showForm = ref(false);

const handleAddUser = (userData) => {
  users.value.push({ ...userData, id: Date.now() });
  showForm.value = false;
};

const handleDeleteUser = (id) => {
  users.value = users.value.filter(user => user.id !== id);
};
</script>

<style scoped>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.button-container {
  margin-bottom: 20px;
}

.users-section {
  margin-top: 30px;
}

.users-grid {
  display: grid;
  gap: 10px;
}

.user-card {
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  flex: 1;
}
</style>
```

## 🎉 Congratulations!

You now have:

- ✅ A reusable Button component with variants
- ✅ A UserForm component with validation
- ✅ Component composition patterns
- ✅ Form handling with controlled inputs
- ✅ State management with arrays

## Next Steps

1. Read the full [Lesson 2 README](./readme.md)
2. Complete the lab exercises
3. Try building more complex forms

## Need Help?

- Check the demo code in `./demo/` folder
- Review component patterns in the README
- Experiment with different component props!
