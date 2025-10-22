<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  count: number
}

interface Emits {
  (e: 'update:count', value: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localCount = ref(props.count)

// Watch for external changes
watch(() => props.count, (newValue) => {
  localCount.value = newValue
})

// Watch for local changes and emit
watch(localCount, (newValue) => {
  emit('update:count', newValue)
})

const increment = () => {
  localCount.value++
}

const decrement = () => {
  localCount.value--
}

const reset = () => {
  localCount.value = 0
}

const double = () => {
  localCount.value *= 2
}

const isEven = (value: number) => value % 2 === 0
const isPrime = (value: number) => {
  if (value < 2) return false
  for (let i = 2; i <= Math.sqrt(value); i++) {
    if (value % i === 0) return false
  }
  return true
}
</script>

<template>
  <div class="counter-card">
    <div class="card-header">
      <h3>Interactive Counter</h3>
      <p>Demonstrates reactive state and event handling</p>
    </div>

    <div class="counter-display">
      <div class="counter-value" :class="{
        'even': isEven(localCount),
        'odd': !isEven(localCount),
        'prime': isPrime(localCount)
      }">
        {{ localCount }}
      </div>

      <div class="counter-info">
        <span v-if="isEven(localCount)" class="info-badge even">Even</span>
        <span v-else class="info-badge odd">Odd</span>
        <span v-if="isPrime(localCount)" class="info-badge prime">Prime</span>
        <span v-if="localCount === 0" class="info-badge zero">Zero</span>
      </div>
    </div>

    <div class="counter-controls">
      <button @click="decrement" class="btn btn-secondary">
        <span class="btn-icon">−</span>
        Decrement
      </button>

      <button @click="increment" class="btn btn-primary">
        <span class="btn-icon">+</span>
        Increment
      </button>

      <button @click="double" class="btn btn-accent">
        <span class="btn-icon">×2</span>
        Double
      </button>

      <button @click="reset" class="btn btn-danger">
        <span class="btn-icon">↺</span>
        Reset
      </button>
    </div>

    <div class="counter-actions">
      <button
        @click="localCount = Math.floor(Math.random() * 100)"
        class="btn btn-outline"
      >
        Random
      </button>

      <button
        @click="localCount = Math.abs(localCount)"
        class="btn btn-outline"
      >
        Absolute
      </button>
    </div>
  </div>
</template>

<style scoped>
.counter-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.counter-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.card-header h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.card-header p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.counter-display {
  text-align: center;
  margin-bottom: 2rem;
}

.counter-value {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  display: inline-block;
  min-width: 120px;
  padding: 1rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.counter-value.even {
  color: #27ae60;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.counter-value.odd {
  color: #e74c3c;
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}

.counter-value.prime {
  color: #8e44ad;
  background: linear-gradient(135deg, #d299c2 0%, #fef9d7 100%);
  animation: pulse 1s ease-in-out;
}

.counter-value.zero {
  color: #95a5a6;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
}

.counter-info {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.info-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-badge.even {
  background: #d5f4e6;
  color: #27ae60;
}

.info-badge.odd {
  background: #fadbd8;
  color: #e74c3c;
}

.info-badge.prime {
  background: #e8daef;
  color: #8e44ad;
}

.info-badge.zero {
  background: #ebf3fd;
  color: #3498db;
}

.counter-controls {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.counter-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  text-decoration: none;
  justify-content: center;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn:active {
  transform: translateY(0);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-secondary {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.btn-accent {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.btn-danger {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

.btn-outline {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-outline:hover {
  background: #667eea;
  color: white;
}

.btn-icon {
  font-size: 1.1rem;
  font-weight: bold;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@media (max-width: 768px) {
  .counter-card {
    padding: 1.5rem;
  }

  .counter-value {
    font-size: 3rem;
  }

  .counter-controls {
    grid-template-columns: 1fr;
  }

  .counter-actions {
    flex-direction: column;
  }
}
</style>
