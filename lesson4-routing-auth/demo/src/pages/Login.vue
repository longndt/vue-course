<template>
  <div class="login">
    <div class="login-container">
      <div class="login-card">
        <h1>Welcome Back</h1>
        <p class="login-subtitle">Sign in to your Vue Shop account</p>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              class="form-input"
              :class="{ 'error': errors.username }"
              placeholder="Enter your username"
              required
            />
            <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              class="form-input"
              :class="{ 'error': errors.password }"
              placeholder="Enter your password"
              required
            />
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>

          <button
            type="submit"
            class="login-button"
            :disabled="authStore.isLoading"
          >
            <span v-if="authStore.isLoading" class="loading-spinner"></span>
            {{ authStore.isLoading ? 'Signing in...' : 'Sign In' }}
          </button>

          <div v-if="authStore.error" class="error-alert">
            {{ authStore.error }}
          </div>
        </form>

        <div class="demo-accounts">
          <h3>Demo Accounts</h3>
          <div class="demo-grid">
            <div class="demo-account">
              <strong>Admin Account</strong>
              <p>Username: admin</p>
              <p>Password: admin123</p>
              <button @click="fillDemo('admin')" class="demo-button">
                Use Admin
              </button>
            </div>
            <div class="demo-account">
              <strong>User Account</strong>
              <p>Username: user</p>
              <p>Password: user123</p>
              <button @click="fillDemo('user')" class="demo-button">
                Use User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// Form state
const form = reactive({
  username: '',
  password: ''
});

// Form errors
const errors = reactive({
  username: '',
  password: ''
});

// Methods
const handleLogin = async () => {
  // Clear previous errors
  errors.username = '';
  errors.password = '';
  authStore.clearError();

  // Validate form
  if (!form.username.trim()) {
    errors.username = 'Username is required';
    return;
  }

  if (!form.password.trim()) {
    errors.password = 'Password is required';
    return;
  }

  // Attempt login
  const success = await authStore.login({
    username: form.username.trim(),
    password: form.password
  });

  if (success) {
    // Redirect to intended page or home
    const redirectPath = route.query.redirect as string || '/';
    router.push(redirectPath);
  }
};

const fillDemo = (type: 'admin' | 'user') => {
  if (type === 'admin') {
    form.username = 'admin';
    form.password = 'admin123';
  } else {
    form.username = 'user';
    form.password = 'user123';
  }

  // Clear any existing errors
  errors.username = '';
  errors.password = '';
  authStore.clearError();
};

// Clear error when component mounts
onMounted(() => {
  authStore.clearError();
});
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
  margin: -2rem;
}

.login-container {
  width: 100%;
  max-width: 500px;
}

.login-card {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.login-card h1 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: 700;
}

.login-subtitle {
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.login-form {
  text-align: left;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.form-input.error {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.login-button {
  width: 100%;
  background: #667eea;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.login-button:hover:not(:disabled) {
  background: #5a6fd8;
  transform: translateY(-1px);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-alert {
  background: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
}

.demo-accounts {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.demo-accounts h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.demo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.demo-account {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
}

.demo-account strong {
  display: block;
  color: #333;
  margin-bottom: 0.5rem;
}

.demo-account p {
  margin: 0.25rem 0;
  color: #666;
}

.demo-button {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  margin-top: 0.5rem;
  width: 100%;
  transition: background 0.3s;
}

.demo-button:hover {
  background: #218838;
}

@media (max-width: 480px) {
  .login-card {
    padding: 2rem;
  }

  .demo-grid {
    grid-template-columns: 1fr;
  }
}
</style>