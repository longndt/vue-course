<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Dashboard</h1>
      <div class="header-actions">
        <button class="refresh-btn" @click="refreshData" :disabled="isLoading">
          {{ isLoading ? 'Refreshing...' : 'Refresh Data' }}
        </button>
      </div>
    </header>

    <div class="dashboard-stats">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <h3>{{ stats.users.toLocaleString() }}</h3>
          <p>Active Users</p>
          <span class="stat-change positive">+12% from last month</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <h3>${{ stats.revenue.toLocaleString() }}</h3>
          <p>Total Revenue</p>
          <span class="stat-change positive">+8.5% from last month</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📦</div>
        <div class="stat-content">
          <h3>{{ stats.orders.toLocaleString() }}</h3>
          <p>Orders Completed</p>
          <span class="stat-change negative">-2.1% from last month</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">⚡</div>
        <div class="stat-content">
          <h3>{{ stats.performance }}%</h3>
          <p>Performance Score</p>
          <span class="stat-change positive">+5.2% from last month</span>
        </div>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="chart-section">
        <h2>Performance Overview</h2>
        <div class="chart-placeholder">
          <p>📈 Chart visualization would go here</p>
          <p>Integration with Chart.js or similar library</p>
        </div>
      </div>

      <div class="activity-section">
        <h2>Recent Activity</h2>
        <div class="activity-list">
          <div v-for="activity in activities" :key="activity.id" class="activity-item">
            <div class="activity-icon">{{ activity.icon }}</div>
            <div class="activity-content">
              <p>{{ activity.message }}</p>
              <span class="activity-time">{{ formatTime(activity.timestamp) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// Reactive state
const isLoading = ref(false)
const stats = reactive({
  users: 1234,
  revenue: 45678,
  orders: 890,
  performance: 94
})

const activities = ref([
  {
    id: 1,
    icon: '👤',
    message: 'New user registered: john.doe@email.com',
    timestamp: new Date(Date.now() - 300000) // 5 min ago
  },
  {
    id: 2,
    icon: '💳',
    message: 'Payment received: $299.99',
    timestamp: new Date(Date.now() - 900000) // 15 min ago
  },
  {
    id: 3,
    icon: '📦',
    message: 'Order #1234 shipped successfully',
    timestamp: new Date(Date.now() - 1800000) // 30 min ago
  },
  {
    id: 4,
    icon: '⚠️',
    message: 'Server maintenance completed',
    timestamp: new Date(Date.now() - 3600000) // 1 hour ago
  }
])

// Methods
const refreshData = async () => {
  isLoading.value = true

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Update stats with random values
  stats.users += Math.floor(Math.random() * 50)
  stats.revenue += Math.floor(Math.random() * 1000)
  stats.orders += Math.floor(Math.random() * 20)
  stats.performance = Math.min(100, stats.performance + Math.floor(Math.random() * 3))

  isLoading.value = false
}

const formatTime = (date) => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

// Lifecycle
onMounted(() => {
  // Initialize dashboard data
  console.log('Dashboard mounted')
})
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.dashboard-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 0;
}

.refresh-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  background: #2563eb;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 2.5rem;
  background: #f1f5f9;
  padding: 1rem;
  border-radius: 12px;
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.stat-content p {
  color: #64748b;
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-change {
  font-size: 0.875rem;
  font-weight: 500;
}

.stat-change.positive {
  color: #059669;
}

.stat-change.negative {
  color: #dc2626;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
}

.chart-section h2,
.activity-section h2 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.chart-placeholder {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  text-align: center;
  color: #64748b;
}

.activity-list {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  font-size: 1.5rem;
  background: #f1f5f9;
  padding: 0.75rem;
  border-radius: 8px;
  flex-shrink: 0;
}

.activity-content p {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
  font-weight: 500;
}

.activity-time {
  font-size: 0.875rem;
  color: #64748b;
}

@media (max-width: 1024px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .dashboard-stats {
    grid-template-columns: 1fr;
  }
}
</style>