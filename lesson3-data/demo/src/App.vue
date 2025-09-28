<template>
  <div class="app">
    <header class="app-header">
      <h1>Task Management App</h1>
      <p>Vue 3 + Vue Query + MongoDB Integration Demo</p>
    </header>

    <main class="app-main">
      <div class="app-controls">
        <button
          class="btn btn-primary"
          @click="toggleForm"
        >
          {{ showForm ? "Hide Form" : "Add New Task" }}
        </button>

        <button
          v-if="editingTask && showForm"
          class="btn btn-secondary"
          @click="cancelEdit"
        >
          Cancel Edit
        </button>
      </div>

      <div v-if="showForm" class="form-section">
        <TaskForm
          :editing-task="editingTask"
          @task-created="handleTaskCreated"
          @task-updated="handleTaskUpdated"
          @cancel="cancelEdit"
        />
      </div>

      <div class="tasks-section">
        <TaskList @edit-task="handleEditTask" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TaskList from './components/TaskList.vue';
import TaskForm from './components/TaskForm.vue';
import './App.css';

interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

const showForm = ref(false);
const editingTask = ref<Task | null>(null);

const toggleForm = () => {
  showForm.value = !showForm.value;
  if (!showForm.value) {
    editingTask.value = null;
  }
};

const handleTaskCreated = () => {
  showForm.value = false;
  editingTask.value = null;
};

const handleTaskUpdated = () => {
  showForm.value = false;
  editingTask.value = null;
};

const handleEditTask = (task: Task) => {
  editingTask.value = task;
  showForm.value = true;
};

const cancelEdit = () => {
  editingTask.value = null;
  showForm.value = false;
};
</script>