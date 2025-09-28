<template>
  <div class="task-list">
    <h2>Tasks</h2>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading">
      <p>Loading tasks...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error">
      <p>Error loading tasks: {{ error.message }}</p>
      <button @click="refetch" class="btn btn-secondary">
        Try Again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="!tasks || tasks.length === 0" class="empty-state">
      <p>No tasks found. Create your first task!</p>
    </div>

    <!-- Tasks List -->
    <div v-else class="tasks-grid">
      <div
        v-for="task in tasks"
        :key="task._id"
        class="task-card"
        :class="{
          'task-completed': task.completed,
          'task-high': task.priority === 'high',
          'task-medium': task.priority === 'medium',
          'task-low': task.priority === 'low'
        }"
      >
        <div class="task-header">
          <h3 class="task-title">{{ task.title }}</h3>
          <div class="task-actions">
            <button
              @click="toggleComplete(task)"
              class="btn btn-sm"
              :class="task.completed ? 'btn-secondary' : 'btn-primary'"
            >
              {{ task.completed ? 'Undo' : 'Complete' }}
            </button>
            <button
              @click="deleteTask(task._id)"
              class="btn btn-sm btn-danger"
              :disabled="isDeletingTask"
            >
              {{ isDeletingTask ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>

        <p class="task-description">{{ task.description }}</p>

        <div class="task-meta">
          <span class="task-priority" :class="`priority-${task.priority}`">
            {{ task.priority.toUpperCase() }}
          </span>
          <span class="task-date">
            Created: {{ formatDate(task.createdAt) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Refresh Button -->
    <div class="task-actions-footer">
      <button @click="refetch" class="btn btn-outline" :disabled="isRefetching">
        {{ isRefetching ? 'Refreshing...' : 'Refresh Tasks' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import axios from 'axios';

interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

// API functions
const fetchTasks = async (): Promise<Task[]> => {
  const response = await axios.get('/api/tasks');
  return response.data;
};

const updateTask = async (task: Task): Promise<Task> => {
  const response = await axios.put(`/api/tasks/${task._id}`, task);
  return response.data;
};

const deleteTaskApi = async (taskId: string): Promise<void> => {
  await axios.delete(`/api/tasks/${taskId}`);
};

// Vue Query
const queryClient = useQueryClient();

const {
  data: tasks,
  isLoading,
  error,
  refetch,
  isRefetching
} = useQuery({
  queryKey: ['tasks'],
  queryFn: fetchTasks,
  staleTime: 1000 * 60 * 5, // 5 minutes
});

// Mutations
const { mutate: updateTaskMutation } = useMutation({
  mutationFn: updateTask,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  },
  onError: (error) => {
    console.error('Failed to update task:', error);
    alert('Failed to update task. Please try again.');
  },
});

const isDeletingTask = ref(false);

const { mutate: deleteTaskMutation } = useMutation({
  mutationFn: deleteTaskApi,
  onMutate: () => {
    isDeletingTask.value = true;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    isDeletingTask.value = false;
  },
  onError: (error) => {
    console.error('Failed to delete task:', error);
    alert('Failed to delete task. Please try again.');
    isDeletingTask.value = false;
  },
});

// Methods
const toggleComplete = (task: Task) => {
  updateTaskMutation({
    ...task,
    completed: !task.completed,
  });
};

const deleteTask = (taskId: string) => {
  if (confirm('Are you sure you want to delete this task?')) {
    deleteTaskMutation(taskId);
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};
</script>

<style scoped>
.task-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.loading, .error, .empty-state {
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 1rem 0;
}

.error {
  background: #fee;
  color: #c33;
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.task-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #ddd;
  transition: all 0.2s ease;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.task-completed {
  opacity: 0.7;
  border-left-color: #28a745;
}

.task-high {
  border-left-color: #dc3545;
}

.task-medium {
  border-left-color: #ffc107;
}

.task-low {
  border-left-color: #17a2b8;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.task-title {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.task-completed .task-title {
  text-decoration: line-through;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
}

.task-description {
  margin: 0.5rem 0;
  color: #666;
  line-height: 1.4;
}

.task-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #888;
}

.task-priority {
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.75rem;
}

.priority-high {
  background: #fee;
  color: #c33;
}

.priority-medium {
  background: #fff3cd;
  color: #856404;
}

.priority-low {
  background: #cff4fc;
  color: #055160;
}

.task-actions-footer {
  text-align: center;
  margin: 2rem 0;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.btn-outline {
  background: transparent;
  border: 2px solid #007bff;
  color: #007bff;
}

.btn-outline:hover {
  background: #007bff;
  color: white;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>