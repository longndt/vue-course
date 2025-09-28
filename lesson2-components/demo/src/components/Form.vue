<template>
  <form @submit.prevent="handleSubmit" class="form">
    <div
      v-for="field in fields"
      :key="field.name"
      class="form-field"
    >
      <label class="form-label">
        {{ field.label }}
        <span v-if="field.required" class="required-mark">*</span>
      </label>

      <!-- Text Input -->
      <input
        v-if="!field.type || field.type === 'text' || field.type === 'email'"
        :type="field.type || 'text'"
        :value="formData[field.name]"
        @input="updateField(field.name, $event.target.value)"
        @blur="validateField(field.name)"
        :class="`text-input ${errors[field.name] ? 'has-error' : ''}`"
        :required="field.required"
      />

      <!-- Select Input -->
      <select
        v-else-if="field.type === 'select'"
        :value="formData[field.name]"
        @change="updateField(field.name, $event.target.value)"
        @blur="validateField(field.name)"
        :class="`select-input ${errors[field.name] ? 'has-error' : ''}`"
        :required="field.required"
      >
        <option
          v-for="option in field.options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>

      <div v-if="errors[field.name]" class="error-message">
        {{ errors[field.name] }}
      </div>
    </div>

    <div class="form-actions">
      <button type="submit" class="submit-button" :disabled="!isValid">
        {{ submitText }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import './Form.css';

interface FormField {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'select';
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  validate?: (value: any) => string | undefined;
}

interface Props {
  fields: FormField[];
  initialValues: Record<string, any>;
  submitText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  submitText: 'Submit'
});

const emit = defineEmits<{
  submit: [values: Record<string, any>];
}>();

// Reactive state
const formData = reactive({ ...props.initialValues });
const errors = reactive<Record<string, string>>({});
const touched = reactive<Record<string, boolean>>({});

// Computed
const isValid = computed(() => {
  // Check if all required fields are filled
  const requiredFieldsValid = props.fields
    .filter(field => field.required)
    .every(field => formData[field.name]);

  // Check if there are no validation errors
  const noErrors = Object.keys(errors).length === 0;

  return requiredFieldsValid && noErrors;
});

// Methods
const updateField = (fieldName: string, value: any) => {
  formData[fieldName] = value;

  // Clear error when user starts typing
  if (errors[fieldName]) {
    delete errors[fieldName];
  }
};

const validateField = (fieldName: string) => {
  touched[fieldName] = true;

  const field = props.fields.find(f => f.name === fieldName);
  if (!field) return;

  const value = formData[fieldName];

  // Required validation
  if (field.required && (!value || value.toString().trim() === '')) {
    errors[fieldName] = `${field.label} is required`;
    return;
  }

  // Custom validation
  if (field.validate && value) {
    const validationError = field.validate(value);
    if (validationError) {
      errors[fieldName] = validationError;
      return;
    }
  }

  // Clear error if validation passes
  if (errors[fieldName]) {
    delete errors[fieldName];
  }
};

const handleSubmit = () => {
  // Validate all fields
  props.fields.forEach(field => validateField(field.name));

  if (isValid.value) {
    emit('submit', { ...formData });
  }
};
</script>