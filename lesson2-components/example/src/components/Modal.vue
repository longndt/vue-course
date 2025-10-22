<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="modal-overlay"
        @click="handleOverlayClick"
      >
        <div
          :class="`modal-content modal-${size}`"
          @click.stop
        >
          <div class="modal-header">
            <h2 class="modal-title">{{ title }}</h2>
            <button class="modal-close" @click="handleClose">
              ×
            </button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue';
import './Modal.css';

interface Props {
  isOpen: boolean;
  title: string;
  size?: 'small' | 'medium' | 'large';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium'
});

const emit = defineEmits<{
  close: [];
}>();

// Methods
const handleClose = () => {
  emit('close');
};

const handleOverlayClick = () => {
  handleClose();
};

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    handleClose();
  }
};

// Watch for isOpen changes to manage body overflow and escape key
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);
  } else {
    document.body.style.overflow = 'unset';
    document.removeEventListener('keydown', handleEscape);
  }
});

// Cleanup on component unmount
onUnmounted(() => {
  document.body.style.overflow = 'unset';
  document.removeEventListener('keydown', handleEscape);
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-content {
  transform: scale(1);
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}
</style>