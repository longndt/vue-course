<script setup lang="ts">
interface Props {
  count: number
  completedTodos: number
  totalTodos: number
}

defineProps<Props>()
</script>

<template>
  <div class="welcome-card">
    <div class="card-header">
      <h2>Welcome to Vue 3!</h2>
      <p>Experience the power of modern frontend development</p>
    </div>

    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-value">{{ count }}</div>
        <div class="stat-label">Counter Value</div>
      </div>

      <div class="stat-item">
        <div class="stat-value">{{ completedTodos }}/{{ totalTodos }}</div>
        <div class="stat-label">Tasks Completed</div>
      </div>

      <div class="stat-item">
        <div class="stat-value">{{ Math.round((completedTodos / totalTodos) * 100) || 0 }}%</div>
        <div class="stat-label">Progress</div>
      </div>
    </div>

    <div class="features-list">
      <h3>Key Features Demonstrated:</h3>
      <ul>
        <li>✅ Composition API with TypeScript</li>
        <li>✅ Reactive state management</li>
        <li>✅ Component composition</li>
        <li>✅ Event handling</li>
        <li>✅ Computed properties</li>
        <li>✅ Lifecycle hooks</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.card-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.card-header p {
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.9;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-item {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.features-list {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.features-list h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
}

.features-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.5rem;
}

.features-list li {
  padding: 0.5rem 0;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .welcome-card {
    padding: 1.5rem;
  }

  .card-header h2 {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .features-list ul {
    grid-template-columns: 1fr;
  }
}
</style>
