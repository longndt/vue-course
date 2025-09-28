<template>
  <div class="analytics">
    <header class="analytics-header">
      <h1>Analytics Dashboard</h1>
      <div class="time-period-selector">
        <button
          v-for="period in timePeriods"
          :key="period.value"
          @click="selectedPeriod = period.value"
          :class="{ active: selectedPeriod === period.value }"
          class="period-btn"
        >
          {{ period.label }}
        </button>
      </div>
    </header>

    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-header">
          <h3>Page Views</h3>
          <span class="metric-icon">📊</span>
        </div>
        <div class="metric-value">{{ formatNumber(metrics.pageViews) }}</div>
        <div class="metric-change positive">
          <span>↑ {{ metrics.pageViewsChange }}%</span>
          <span class="change-label">vs last {{ selectedPeriod }}</span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <h3>Unique Visitors</h3>
          <span class="metric-icon">👥</span>
        </div>
        <div class="metric-value">{{ formatNumber(metrics.uniqueVisitors) }}</div>
        <div class="metric-change positive">
          <span>↑ {{ metrics.visitorsChange }}%</span>
          <span class="change-label">vs last {{ selectedPeriod }}</span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <h3>Bounce Rate</h3>
          <span class="metric-icon">⏱️</span>
        </div>
        <div class="metric-value">{{ metrics.bounceRate }}%</div>
        <div class="metric-change negative">
          <span>↓ {{ metrics.bounceRateChange }}%</span>
          <span class="change-label">vs last {{ selectedPeriod }}</span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <h3>Conversion Rate</h3>
          <span class="metric-icon">🎯</span>
        </div>
        <div class="metric-value">{{ metrics.conversionRate }}%</div>
        <div class="metric-change positive">
          <span>↑ {{ metrics.conversionChange }}%</span>
          <span class="change-label">vs last {{ selectedPeriod }}</span>
        </div>
      </div>
    </div>

    <div class="charts-section">
      <div class="chart-container">
        <h2>Traffic Overview</h2>
        <div class="chart-placeholder">
          <div class="chart-bars">
            <div v-for="(bar, index) in chartData" :key="index" class="chart-bar">
              <div class="bar-fill" :style="{ height: bar.height + '%' }"></div>
              <span class="bar-label">{{ bar.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="traffic-sources">
        <h2>Traffic Sources</h2>
        <div class="sources-list">
          <div v-for="source in trafficSources" :key="source.name" class="source-item">
            <div class="source-info">
              <span class="source-name">{{ source.name }}</span>
              <span class="source-percentage">{{ source.percentage }}%</span>
            </div>
            <div class="source-bar">
              <div class="source-fill" :style="{ width: source.percentage + '%' }"></div>
            </div>
            <span class="source-visits">{{ formatNumber(source.visits) }} visits</span>
          </div>
        </div>
      </div>
    </div>

    <div class="real-time-section">
      <h2>Real-Time Activity</h2>
      <div class="real-time-stats">
        <div class="real-time-item">
          <span class="real-time-label">Users Online</span>
          <span class="real-time-value">{{ realtimeUsers }}</span>
        </div>
        <div class="real-time-item">
          <span class="real-time-label">Page Views (Last Hour)</span>
          <span class="real-time-value">{{ realtimePageViews }}</span>
        </div>
        <div class="real-time-item">
          <span class="real-time-label">Active Pages</span>
          <span class="real-time-value">{{ realtimeActivePages }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

interface TimePeriod {
  value: string
  label: string
}

interface ChartBar {
  height: number
  label: string
}

interface TrafficSource {
  name: string
  percentage: number
  visits: number
}

// Reactive state
const selectedPeriod = ref('week')
const realtimeUsers = ref(23)
const realtimePageViews = ref(156)
const realtimeActivePages = ref(8)

const timePeriods: TimePeriod[] = [
  { value: 'day', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' }
]

const metrics = reactive({
  pageViews: 45678,
  pageViewsChange: 12.5,
  uniqueVisitors: 8934,
  visitorsChange: 8.3,
  bounceRate: 34.2,
  bounceRateChange: 2.1,
  conversionRate: 3.8,
  conversionChange: 0.7
})

const chartData = ref<ChartBar[]>([
  { height: 80, label: 'Mon' },
  { height: 65, label: 'Tue' },
  { height: 90, label: 'Wed' },
  { height: 75, label: 'Thu' },
  { height: 95, label: 'Fri' },
  { height: 60, label: 'Sat' },
  { height: 70, label: 'Sun' }
])

const trafficSources = ref<TrafficSource[]>([
  { name: 'Organic Search', percentage: 45, visits: 20520 },
  { name: 'Direct', percentage: 32, visits: 14592 },
  { name: 'Social Media', percentage: 15, visits: 6840 },
  { name: 'Email', percentage: 5, visits: 2280 },
  { name: 'Referral', percentage: 3, visits: 1368 }
])

// Computed
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num)
}

// Real-time updates simulation
let realtimeInterval: NodeJS.Timeout

const startRealtimeUpdates = () => {
  realtimeInterval = setInterval(() => {
    // Simulate fluctuating real-time data
    realtimeUsers.value += Math.floor(Math.random() * 6) - 3 // -3 to +2
    realtimeUsers.value = Math.max(1, realtimeUsers.value)

    realtimePageViews.value += Math.floor(Math.random() * 10)

    if (Math.random() > 0.7) {
      realtimeActivePages.value += Math.floor(Math.random() * 3) - 1
      realtimeActivePages.value = Math.max(1, realtimeActivePages.value)
    }
  }, 3000)
}

// Lifecycle
onMounted(() => {
  startRealtimeUpdates()
})

onUnmounted(() => {
  if (realtimeInterval) {
    clearInterval(realtimeInterval)
  }
})
</script>

<style scoped>
.analytics {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.analytics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.analytics-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 0;
}

.time-period-selector {
  display: flex;
  background: #f8fafc;
  border-radius: 8px;
  padding: 0.25rem;
  gap: 0.25rem;
}

.period-btn {
  background: transparent;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  color: #64748b;
  transition: all 0.2s;
}

.period-btn:hover {
  color: #2c3e50;
}

.period-btn.active {
  background: white;
  color: #3b82f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.metric-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.metric-header h3 {
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metric-icon {
  font-size: 1.5rem;
}

.metric-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.metric-change {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metric-change span:first-child {
  font-weight: 600;
  font-size: 0.875rem;
}

.metric-change.positive span:first-child {
  color: #059669;
}

.metric-change.negative span:first-child {
  color: #dc2626;
}

.change-label {
  font-size: 0.75rem;
  color: #9ca3af;
}

.charts-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.chart-container,
.traffic-sources {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.chart-container h2,
.traffic-sources h2 {
  margin: 0 0 2rem 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: end;
  justify-content: center;
}

.chart-bars {
  display: flex;
  align-items: end;
  gap: 1rem;
  height: 200px;
  width: 100%;
  max-width: 400px;
}

.chart-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(to top, #3b82f6, #60a5fa);
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
  min-height: 4px;
}

.bar-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

.sources-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.source-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.source-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.source-name {
  font-weight: 500;
  color: #2c3e50;
}

.source-percentage {
  font-weight: 600;
  color: #3b82f6;
}

.source-bar {
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
}

.source-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.source-visits {
  font-size: 0.875rem;
  color: #64748b;
}

.real-time-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.real-time-section h2 {
  margin: 0 0 2rem 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.real-time-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.real-time-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.real-time-label {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.real-time-value {
  font-size: 2rem;
  font-weight: 700;
  color: #10b981;
}

@media (max-width: 1024px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .analytics {
    padding: 1rem;
  }

  .analytics-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .real-time-stats {
    grid-template-columns: 1fr;
  }
}
</style>