<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import vueLogo from './assets/vue.svg'
import WelcomeCard from './components/WelcomeCard.vue'
import Counter from './components/Counter.vue'
import TodoList from './components/TodoList.vue'

// Reactive state
const count = ref(0)
const todos = ref([
  { id: 1, text: 'Learn Vue 3 Composition API', completed: false },
  { id: 2, text: 'Build amazing applications', completed: false },
  { id: 3, text: 'Master TypeScript with Vue', completed: true }
])

// Computed properties
const completedTodos = computed(() => 
  todos.value.filter(todo => todo.completed).length
)

const totalTodos = computed(() => todos.value.length)

// Methods
const addTodo = (text: string) => {
  const newTodo = {
    id: Date.now(),
    text,
    completed: false
  }
  todos.value.push(newTodo)
}

const toggleTodo = (id: number) => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
  }
}

const removeTodo = (id: number) => {
  const index = todos.value.findIndex(t => t.id === id)
  if (index > -1) {
    todos.value.splice(index, 1)
  }
}

// Lifecycle
onMounted(() => {
  console.log('Vue 3 app mounted successfully!')
})
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="logo-container">
        <a href="https://vite.dev" target="_blank" rel="noopener">
          <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://vuejs.org/" target="_blank" rel="noopener">
          <img :src="vueLogo" class="logo vue" alt="Vue logo" />
        </a>
      </div>
      <h1 class="app-title">Vue 3 + TypeScript + Vite</h1>
      <p class="app-subtitle">Modern frontend development stack</p>
    </header>

    <main class="app-main">
      <WelcomeCard 
        :count="count"
        :completed-todos="completedTodos"
        :total-todos="totalTodos"
      />
      
      <div class="features-grid">
        <Counter v-model:count="count" />
        <TodoList 
          :todos="todos"
          @add-todo="addTodo"
          @toggle-todo="toggleTodo"
          @remove-todo="removeTodo"
        />
      </div>
    </main>

    <footer class="app-footer">
      <p>
        Edit <code>src/App.vue</code> and save to test HMR (Hot Module Replacement)
      </p>
      <p class="read-the-docs">
        Click on the Vite and Vue logos to learn more
      </p>
    </footer>
  </div>
</template>

<style scoped>
#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  margin-bottom: 2rem;
}

.logo-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
  border-radius: 8px;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
  transform: scale(1.05);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
  transform: scale(1.05);
}

.app-title {
  font-size: 3.2em;
  line-height: 1.1;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(45deg, #42b883, #35495e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.app-subtitle {
  color: #666;
  font-size: 1.2em;
  margin: 0 0 2rem 0;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.app-footer {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

.app-footer p {
  margin: 0.5rem 0;
  color: #666;
}

.read-the-docs {
  color: #888;
}

code {
  background-color: #f4f4f4;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

@media (max-width: 768px) {
  #app {
    padding: 1rem;
  }
  
  .app-title {
    font-size: 2.4em;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>