<template>
  <div class="task-form">
    <h2>{{ editingTask ? 'Edit Task' : 'Create New Task' }}</h2>

    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="title" class="label">Title *</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          class="input"
          :class="{ 'input-error': errors.title }"
          placeholder="Enter task title"
          required
        />
        <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
      </div>

      <div class="form-group">
        <label for="description" class="label">Description</label>
        <textarea
          id="description"
          v-model="form.description"
          class="textarea"
          :class="{ 'input-error': errors.description }"
          placeholder="Enter task description"
          rows="4"
        ></textarea>
        <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
      </div>

      <div class="form-group">
        <label for="priority" class="label">Priority</label>
        <select
          id="priority"
          v-model="form.priority"
          class="select"
          :class="{ 'input-error': errors.priority }"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <span v-if="errors.priority" class="error-message">{{ errors.priority }}</span>
      </div>

      <div v-if="editingTask" class="form-group">
        <label class="checkbox-container">
          <input
            v-model="form.completed"
            type="checkbox"
            class="checkbox"
          />
          <span class="checkmark"></span>
          Mark as completed
        </label>
      </div>

      <div class="form-actions">
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="isSubmitting || !isFormValid"
        >
          {{ isSubmitting ? 'Saving...' : (editingTask ? 'Update Task' : 'Create Task') }}
        </button>

        <button
          v-if="editingTask"
          type="button"
          class="btn btn-secondary"
          @click="cancelEdit"
          :disabled="isSubmitting"
        >
          Cancel
        </button>

        <button
          type="button"
          class="btn btn-outline"
          @click="resetForm"
          :disabled="isSubmitting"
        >
          Reset
        </button>
      </div>
    </form>

    <!-- Success/Error Messages -->
    <div v-if="submitMessage" class="message" :class="messageType">
      {{ submitMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import axios from 'axios';

const props = defineProps({
  editingTask: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['taskCreated', 'taskUpdated', 'cancel']);

// Form state
const form = reactive({
  title: '',
  description: '',
  priority: 'medium',
  completed: false,
});

// Validation errors
const errors = reactive({
  title: '',
  description: '',
  priority: '',
});

// UI state
const isSubmitting = ref(false);
const submitMessage = ref('');
const messageType = ref('success');

// API functions
const createTask = async (taskData) => {
  const response = await axios.post('/api/tasks', taskData);
  return response.data;
};

const updateTask = async (task) => {
  const response = await axios.put(`/api/tasks/${task._id}`, task);
  return response.data;
};

// Handle task creation
const handleCreateTask = async (taskData) => {
  try {
    isSubmitting.value = true;
    clearMessages();
    const data = await createTask(taskData);
    showMessage('Task created successfully!', 'success');
    emit('taskCreated', data);
    resetForm();
    isSubmitting.value = false;
  } catch (error) {
    console.error('Failed to create task:', error);
    showMessage('Failed to create task. Please try again.', 'error');
    isSubmitting.value = false;
  }
};

// Handle task update
const handleUpdateTask = async (task) => {
  try {
    isSubmitting.value = true;
    clearMessages();
    const data = await updateTask(task);
    showMessage('Task updated successfully!', 'success');
    emit('taskUpdated', data);
    isSubmitting.value = false;
  } catch (error) {
    console.error('Failed to update task:', error);
    showMessage('Failed to update task. Please try again.', 'error');
    isSubmitting.value = false;
  }
};

// Computed properties
const isFormValid = computed(() => {
  return form.title.trim().length > 0 && !Object.values(errors).some(error => error);
});

// Methods
const validateForm = () => {
  // Reset errors
  errors.title = '';
  errors.description = '';
  errors.priority = '';

  let isValid = true;

  // Title validation
  if (!form.title.trim()) {
    errors.title = 'Title is required';
    isValid = false;
  } else if (form.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters long';
    isValid = false;
  } else if (form.title.trim().length > 100) {
    errors.title = 'Title must be less than 100 characters';
    isValid = false;
  }

  // Description validation
  if (form.description && form.description.length > 500) {
    errors.description = 'Description must be less than 500 characters';
    isValid = false;
  }

  // Priority validation
  if (!['low', 'medium', 'high'].includes(form.priority)) {
    errors.priority = 'Please select a valid priority';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = () => {
  if (!validateForm()) {
    return;
  }

  const taskData = {
    title: form.title.trim(),
    description: form.description.trim(),
    priority: form.priority,
    completed: form.completed,
  };

  if (props.editingTask) {
    // Update existing task
    handleUpdateTask({
      ...props.editingTask,
      ...taskData,
    });
  } else {
    // Create new task
    handleCreateTask(taskData);
  }
};

const resetForm = () => {
  form.title = '';
  form.description = '';
  form.priority = 'medium';
  form.completed = false;

  // Reset errors
  errors.title = '';
  errors.description = '';
  errors.priority = '';

  clearMessages();
};

const cancelEdit = () => {
  resetForm();
  emit('cancel');
};

const showMessage = (message, type) => {
  submitMessage.value = message;
  messageType.value = type;

  // Auto-clear message after 5 seconds
  setTimeout(() => {
    clearMessages();
  }, 5000);
};

const clearMessages = () => {
  submitMessage.value = '';
};

// Watch for editing task changes
watch(
  () => props.editingTask,
  (newTask) => {
    if (newTask) {
      form.title = newTask.title;
      form.description = newTask.description;
      form.priority = newTask.priority;
      form.completed = newTask.completed;
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

// Clear messages when form values change
watch(
  () => [form.title, form.description, form.priority],
  () => {
    clearMessages();
  }
);
</script>

<style scoped>
.task-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
}

.input,
.textarea,
.select {
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.input:focus,
.textarea:focus,
.select:focus {
  outline: none;
  border-color: #007bff;
}

.input-error {
  border-color: #dc3545 !important;
}

.error-message {
  color: #dc3545;
  font-size: 0.85rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
}

.checkbox {
  width: 1.1rem;
  height: 1.1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
  flex: 1;
  min-width: 120px;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #545b62;
}

.btn-outline {
  background: transparent;
  border: 2px solid #6c757d;
  color: #6c757d;
}

.btn-outline:hover:not(:disabled) {
  background: #6c757d;
  color: white;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.message {
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
  text-align: center;
  font-weight: 500;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

@media (max-width: 768px) {
  .task-form {
    margin: 0;
    padding: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    min-width: auto;
  }
}
</style>