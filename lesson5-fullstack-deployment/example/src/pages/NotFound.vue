<template>
  <div class="not-found">
    <div class="error-container">
      <div class="error-animation">
        <div class="error-number">4</div>
        <div class="error-icon">🔍</div>
        <div class="error-number">4</div>
      </div>

      <h1>Page Not Found</h1>
      <p class="error-message">
        Oops! The page you're looking for seems to have wandered off.
        Don't worry, it happens to the best of us.
      </p>

      <div class="error-actions">
        <router-link to="/" class="btn btn-primary">
          🏠 Go Home
        </router-link>
        <button @click="goBack" class="btn btn-secondary">
          ← Go Back
        </button>
      </div>

      <div class="suggestions">
        <h3>Here are some helpful links:</h3>
        <ul class="suggestions-list">
          <li>
            <router-link to="/dashboard">📊 Dashboard</router-link>
          </li>
          <li>
            <router-link to="/upload">📁 File Upload</router-link>
          </li>
          <li>
            <router-link to="/chat">💬 Live Chat</router-link>
          </li>
          <li>
            <router-link to="/analytics">📈 Analytics</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.error-container {
  text-align: center;
  background: white;
  padding: 4rem 3rem;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
}

.error-animation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.error-number {
  font-size: 8rem;
  font-weight: 900;
  color: #e2e8f0;
  line-height: 1;
  animation: bounce 2s ease-in-out infinite;
}

.error-icon {
  font-size: 4rem;
  animation: rotate 3s linear infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  font-weight: 700;
}

.error-message {
  font-size: 1.1rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 3rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.btn {
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: #f1f5f9;
  color: #64748b;
  border: 2px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #e2e8f0;
  color: #2c3e50;
}

.suggestions {
  text-align: left;
  background: #f8fafc;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.suggestions h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.suggestions-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.suggestions-list li {
  background: white;
  border-radius: 8px;
  transition: transform 0.2s;
}

.suggestions-list li:hover {
  transform: translateY(-2px);
}

.suggestions-list a {
  display: block;
  padding: 1rem;
  text-decoration: none;
  color: #3b82f6;
  font-weight: 500;
  border-radius: 8px;
  transition: background 0.2s;
}

.suggestions-list a:hover {
  background: #eff6ff;
  color: #2563eb;
}

@media (max-width: 768px) {
  .not-found {
    padding: 1rem;
  }

  .error-container {
    padding: 2rem 1.5rem;
  }

  .error-number {
    font-size: 4rem;
  }

  .error-icon {
    font-size: 2rem;
  }

  h1 {
    font-size: 1.8rem;
  }

  .error-actions {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 100%;
    max-width: 200px;
    justify-content: center;
  }

  .suggestions-list {
    grid-template-columns: 1fr;
  }
}
</style>