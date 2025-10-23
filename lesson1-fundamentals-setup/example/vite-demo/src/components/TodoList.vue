<script setup lang="ts">
import { ref, computed } from 'vue'

interface Todo {
  id: number
  text: string
  completed: boolean
}

interface Props {
  todos: Todo[]
}

interface Emits {
  (e: 'add-todo', text: string): void
  (e: 'toggle-todo', id: number): void
  (e: 'remove-todo', id: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const newTodoText = ref('')
const filter = ref<'all' | 'active' | 'completed'>('all')

const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'active':
      return props.todos.filter(todo => !todo.completed)
    case 'completed':
      return props.todos.filter(todo => todo.completed)
    default:
      return props.todos
  }
})

const addTodo = () => {
  const text = newTodoText.value.trim()
  if (text) {
    emit('add-todo', text)
    newTodoText.value = ''
  }
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    addTodo()
  }
}

const toggleTodo = (id: number) => {
  emit('toggle-todo', id)
}

const removeTodo = (id: number) => {
  emit('remove-todo', id)
}

const clearCompleted = () => {
  props.todos
    .filter(todo => todo.completed)
    .forEach(todo => emit('remove-todo', todo.id))
}

const toggleAll = () => {
  const allCompleted = props.todos.every(todo => todo.completed)
  props.todos.forEach(todo => {
    if (todo.completed === allCompleted) {
      emit('toggle-todo', todo.id)
    }
  })
}

const completedCount = computed(() =>
  props.todos.filter(todo => todo.completed).length
)

const activeCount = computed(() =>
  props.todos.filter(todo => !todo.completed).length
)
</script>

<template>
  <div class="todo-card">
    <div class="card-header">
      <h3>Todo List</h3>
      <p>Manage your tasks with Vue 3 reactivity</p>
    </div>

    <!-- Add Todo Form -->
    <div class="add-todo-form">
      <div class="input-group">
        <input
          v-model="newTodoText"
          @keypress="handleKeyPress"
          type="text"
          placeholder="Add a new task..."
          class="todo-input"
        />
        <button @click="addTodo" class="btn btn-primary" :disabled="!newTodoText.trim()">
          <span class="btn-icon">+</span>
          Add
        </button>
      </div>
    </div>

    <!-- Todo Controls -->
    <div class="todo-controls">
      <div class="filter-buttons">
        <button
          @click="filter = 'all'"
          :class="{ active: filter === 'all' }"
          class="filter-btn"
        >
          All ({{ props.todos.length }})
        </button>
        <button
          @click="filter = 'active'"
          :class="{ active: filter === 'active' }"
          class="filter-btn"
        >
          Active ({{ activeCount }})
        </button>
        <button
          @click="filter = 'completed'"
          :class="{ active: filter === 'completed' }"
          class="filter-btn"
        >
          Completed ({{ completedCount }})
        </button>
      </div>

      <div class="bulk-actions">
        <button
          @click="toggleAll"
          class="btn btn-outline"
          :disabled="props.todos.length === 0"
        >
          Toggle All
        </button>
        <button
          @click="clearCompleted"
          class="btn btn-outline"
          :disabled="completedCount === 0"
        >
          Clear Completed
        </button>
      </div>
    </div>

    <!-- Todo List -->
    <div class="todo-list">
      <div v-if="filteredTodos.length === 0" class="empty-state">
        <div class="empty-icon">📝</div>
        <p v-if="filter === 'all'">No tasks yet. Add one above!</p>
        <p v-else-if="filter === 'active'">No active tasks. Great job!</p>
        <p v-else>No completed tasks yet.</p>
      </div>

      <div v-else class="todo-items">
        <div
          v-for="todo in filteredTodos"
          :key="todo.id"
          class="todo-item"
          :class="{ completed: todo.completed }"
        >
          <div class="todo-content">
            <button
              @click="toggleTodo(todo.id)"
              class="todo-checkbox"
              :class="{ checked: todo.completed }"
            >
              <span v-if="todo.completed" class="checkmark">✓</span>
            </button>

            <span class="todo-text" :class="{ completed: todo.completed }">
              {{ todo.text }}
            </span>
          </div>

          <button
            @click="removeTodo(todo.id)"
            class="todo-delete"
            title="Delete task"
          >
            <span class="delete-icon">×</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div v-if="props.todos.length > 0" class="progress-section">
      <div class="progress-info">
        <span>Progress: {{ completedCount }}/{{ props.todos.length }} tasks</span>
        <span>{{ Math.round((completedCount / props.todos.length) * 100) }}%</span>
      </div>
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: `${(completedCount / props.todos.length) * 100}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.todo-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.todo-card:hover {
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

.add-todo-form {
  margin-bottom: 1.5rem;
}

.input-group {
  display: flex;
  gap: 0.75rem;
}

.todo-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.todo-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.todo-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  font-weight: 500;
}

.filter-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.filter-btn.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.bulk-actions {
  display: flex;
  gap: 0.5rem;
}

.todo-list {
  margin-bottom: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.todo-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.todo-item:hover {
  background: #e9ecef;
  border-color: #dee2e6;
}

.todo-item.completed {
  background: #d4edda;
  border-color: #c3e6cb;
}

.todo-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.todo-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #dee2e6;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.todo-checkbox:hover {
  border-color: #667eea;
}

.todo-checkbox.checked {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.checkmark {
  font-size: 12px;
  font-weight: bold;
}

.todo-text {
  flex: 1;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.todo-text.completed {
  text-decoration: line-through;
  color: #6c757d;
}

.todo-delete {
  width: 32px;
  height: 32px;
  border: none;
  background: #dc3545;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  opacity: 0;
}

.todo-item:hover .todo-delete {
  opacity: 1;
}

.todo-delete:hover {
  background: #c82333;
  transform: scale(1.1);
}

.delete-icon {
  font-size: 18px;
  font-weight: bold;
}

.progress-section {
  border-top: 1px solid #e0e0e0;
  padding-top: 1rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  text-decoration: none;
  justify-content: center;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-outline {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-outline:hover:not(:disabled) {
  background: #667eea;
  color: white;
}

.btn-icon {
  font-size: 1rem;
  font-weight: bold;
}

@media (max-width: 768px) {
  .todo-card {
    padding: 1.5rem;
  }

  .todo-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-buttons {
    justify-content: center;
  }

  .bulk-actions {
    justify-content: center;
  }

  .input-group {
    flex-direction: column;
  }
}
</style>
