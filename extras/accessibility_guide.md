# Vue Accessibility Guide ♿

## Overview

This guide covers essential accessibility practices for Vue 3 applications, ensuring your apps are usable by everyone, including users with disabilities.

## Table of Contents

1. [ARIA Attributes & Roles](#aria-attributes--roles)
2. [Keyboard Navigation](#keyboard-navigation)
3. [Screen Reader Compatibility](#screen-reader-compatibility)
4. [Focus Management](#focus-management)
5. [Color & Contrast](#color--contrast)
6. [Semantic HTML](#semantic-html)
7. [Testing Accessibility](#testing-accessibility)
8. [Common Patterns](#common-patterns)
9. [Tools & Resources](#tools--resources)

## ARIA Attributes & Roles

### Basic ARIA Implementation

```vue
<template>
  <div>
    <!-- Button with proper ARIA attributes -->
    <button
      @click="toggleMenu"
      :aria-expanded="isMenuOpen"
      aria-haspopup="true"
      aria-controls="menu"
    >
      Menu
    </button>

    <!-- Menu with proper ARIA attributes -->
    <ul
      id="menu"
      v-show="isMenuOpen"
      role="menu"
      :aria-hidden="!isMenuOpen"
    >
      <li role="none">
        <a href="#" role="menuitem">Home</a>
      </li>
      <li role="none">
        <a href="#" role="menuitem">About</a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>
```

### Form Accessibility

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <!-- Label properly associated with input -->
    <label for="email">Email Address</label>
    <input
      id="email"
      v-model="email"
      type="email"
      :aria-describedby="emailError ? 'email-error' : undefined"
      :aria-invalid="!!emailError"
      required
    />

    <!-- Error message with proper association -->
    <div
      v-if="emailError"
      id="email-error"
      role="alert"
      aria-live="polite"
    >
      {{ emailError }}
    </div>

    <button type="submit">Submit</button>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const email = ref('')
const emailError = computed(() => {
  if (!email.value) return 'Email is required'
  if (!email.value.includes('@')) return 'Please enter a valid email'
  return null
})

const handleSubmit = () => {
  if (!emailError.value) {
    // Submit form
    console.log('Form submitted:', email.value)
  }
}
</script>
```

## Keyboard Navigation

### Focus Management

```vue
<template>
  <div>
    <!-- Modal with focus trap -->
    <div
      v-if="isModalOpen"
      class="modal"
      @keydown.esc="closeModal"
      @keydown.tab="handleTab"
    >
      <div
        ref="modalContent"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h2 id="modal-title">Modal Title</h2>
        <p>Modal content here</p>
        <button @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'

const isModalOpen = ref(false)
const modalContent = ref<HTMLElement>()

let focusableElements: HTMLElement[] = []
let currentFocusIndex = 0

const openModal = async () => {
  isModalOpen.value = true
  await nextTick()

  // Focus the modal
  modalContent.value?.focus()

  // Get focusable elements
  focusableElements = Array.from(
    modalContent.value?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) || []
  ) as HTMLElement[]

  currentFocusIndex = 0
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleTab = (e: KeyboardEvent) => {
  if (!isModalOpen.value) return

  e.preventDefault()

  if (e.shiftKey) {
    currentFocusIndex = currentFocusIndex > 0
      ? currentFocusIndex - 1
      : focusableElements.length - 1
  } else {
    currentFocusIndex = currentFocusIndex < focusableElements.length - 1
      ? currentFocusIndex + 1
      : 0
  }

  focusableElements[currentFocusIndex]?.focus()
}

// Keyboard event listeners
onMounted(() => {
  document.addEventListener('keydown', handleTab)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleTab)
})
</script>
```

## Screen Reader Compatibility

### Live Regions for Dynamic Content

```vue
<template>
  <div>
    <!-- Live region for status updates -->
    <div
      aria-live="polite"
      aria-atomic="true"
      class="sr-only"
    >
      {{ statusMessage }}
    </div>

    <!-- Form with proper labeling -->
    <form>
      <fieldset>
        <legend>Contact Information</legend>

        <div>
          <label for="name">Full Name</label>
          <input
            id="name"
            v-model="name"
            type="text"
            :aria-describedby="name ? 'name-help' : undefined"
          />
          <div id="name-help" class="help-text">
            Enter your full name as it appears on official documents
          </div>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const name = ref('')
const statusMessage = computed(() => {
  if (name.value) {
    return `Name entered: ${name.value}`
  }
  return ''
})
</script>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.help-text {
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
}
</style>
```

## Focus Management

### Focus Restoration

```vue
<template>
  <div>
    <button @click="openDialog">Open Dialog</button>

    <div
      v-if="isDialogOpen"
      class="dialog-overlay"
      @click="closeDialog"
    >
      <div
        ref="dialog"
        class="dialog"
        @click.stop
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <h2 id="dialog-title">Dialog Title</h2>
        <p>Dialog content</p>
        <button @click="closeDialog">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

const isDialogOpen = ref(false)
const dialog = ref<HTMLElement>()
let previousActiveElement: HTMLElement | null = null

const openDialog = async () => {
  // Store the currently focused element
  previousActiveElement = document.activeElement as HTMLElement

  isDialogOpen.value = true
  await nextTick()

  // Focus the dialog
  dialog.value?.focus()
}

const closeDialog = () => {
  isDialogOpen.value = false

  // Restore focus to the previous element
  nextTick(() => {
    previousActiveElement?.focus()
  })
}
</script>
```

## Color & Contrast

### WCAG Compliance

```vue
<template>
  <div class="accessible-colors">
    <!-- High contrast text -->
    <h1 class="high-contrast">Main Heading</h1>

    <!-- Color is not the only indicator -->
    <div class="status-indicator">
      <span
        class="status-dot"
        :class="status"
        :aria-label="`Status: ${status}`"
      ></span>
      <span class="status-text">{{ statusText }}</span>
    </div>

    <!-- Form with proper contrast -->
    <form>
      <label for="input">Input Label</label>
      <input
        id="input"
        type="text"
        class="high-contrast-input"
        :class="{ 'error': hasError }"
      />
      <div v-if="hasError" class="error-message">
        This field has an error
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const status = ref('success')
const hasError = ref(false)

const statusText = computed(() => {
  switch (status.value) {
    case 'success': return 'Success'
    case 'warning': return 'Warning'
    case 'error': return 'Error'
    default: return 'Unknown'
  }
})
</script>

<style scoped>
.accessible-colors {
  /* Ensure sufficient contrast ratios */
  --text-primary: #000000; /* 21:1 contrast on white */
  --text-secondary: #333333; /* 12.6:1 contrast on white */
  --background: #ffffff;
  --border: #666666; /* 4.5:1 contrast on white */
}

.high-contrast {
  color: var(--text-primary);
}

.high-contrast-input {
  border: 2px solid var(--border);
  color: var(--text-primary);
  background: var(--background);
}

.high-contrast-input:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-dot.success {
  background-color: #28a745; /* Green with sufficient contrast */
}

.status-dot.warning {
  background-color: #ffc107; /* Yellow with sufficient contrast */
}

.status-dot.error {
  background-color: #dc3545; /* Red with sufficient contrast */
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
```

## Semantic HTML

### Proper Document Structure

```vue
<template>
  <main>
    <header>
      <nav aria-label="Main navigation">
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </header>

    <section aria-labelledby="features-heading">
      <h2 id="features-heading">Features</h2>
      <article>
        <h3>Feature 1</h3>
        <p>Description of feature 1</p>
      </article>
      <article>
        <h3>Feature 2</h3>
        <p>Description of feature 2</p>
      </article>
    </section>

    <aside aria-labelledby="sidebar-heading">
      <h3 id="sidebar-heading">Related Links</h3>
      <ul>
        <li><a href="#">Link 1</a></li>
        <li><a href="#">Link 2</a></li>
      </ul>
    </aside>

    <footer>
      <p>&copy; 2024 Your Company. All rights reserved.</p>
    </footer>
  </main>
</template>
```

## Testing Accessibility

### Automated Testing with Vue Test Utils

```vue
<!-- AccessibleButton.vue -->
<template>
  <button
    :disabled="disabled"
    :aria-pressed="pressed"
    :aria-expanded="expanded"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  disabled?: boolean
  pressed?: boolean
  expanded?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  emit('click', event)
}
</script>
```

```typescript
// AccessibleButton.test.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import AccessibleButton from './AccessibleButton.vue'

describe('AccessibleButton', () => {
  it('should have proper ARIA attributes', () => {
    const wrapper = mount(AccessibleButton, {
      props: {
        pressed: true,
        expanded: false
      },
      slots: {
        default: 'Click me'
      }
    })

    const button = wrapper.find('button')
    expect(button.attributes('aria-pressed')).toBe('true')
    expect(button.attributes('aria-expanded')).toBe('false')
  })

  it('should be disabled when disabled prop is true', () => {
    const wrapper = mount(AccessibleButton, {
      props: {
        disabled: true
      }
    })

    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()
  })
})
```

## Common Patterns

### Accessible Modal Component

```vue
<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="modal-overlay"
      @click="handleOverlayClick"
      @keydown.esc="close"
    >
      <div
        ref="modalRef"
        class="modal"
        role="dialog"
        :aria-modal="true"
        :aria-labelledby="titleId"
        :aria-describedby="descriptionId"
        tabindex="-1"
        @keydown.tab="handleTabKey"
      >
        <header class="modal-header">
          <h2 :id="titleId">{{ title }}</h2>
          <button
            @click="close"
            aria-label="Close modal"
            class="close-button"
          >
            ×
          </button>
        </header>

        <div :id="descriptionId" class="modal-content">
          <slot />
        </div>

        <footer class="modal-footer">
          <slot name="footer">
            <button @click="close">Close</button>
          </slot>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'

interface Props {
  isOpen: boolean
  title: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const modalRef = ref<HTMLElement>()
const titleId = `modal-title-${Math.random().toString(36).substr(2, 9)}`
const descriptionId = `modal-description-${Math.random().toString(36).substr(2, 9)}`

let previousActiveElement: HTMLElement | null = null

const close = () => {
  emit('close')
  // Restore focus
  nextTick(() => {
    previousActiveElement?.focus()
  })
}

const handleOverlayClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    close()
  }
}

const handleTabKey = (event: KeyboardEvent) => {
  if (!modalRef.value) return

  const focusableElements = modalRef.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )

  const firstElement = focusableElements[0] as HTMLElement
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

  if (event.shiftKey) {
    if (document.activeElement === firstElement) {
      lastElement.focus()
      event.preventDefault()
    }
  } else {
    if (document.activeElement === lastElement) {
      firstElement.focus()
      event.preventDefault()
    }
  }
}

onMounted(() => {
  if (props.isOpen) {
    previousActiveElement = document.activeElement as HTMLElement
    nextTick(() => {
      modalRef.value?.focus()
    })
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow: auto;
  outline: none;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
}

.modal-content {
  padding: 1rem;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>
```

## Tools & Resources

### Development Tools

1. **axe-core** - Automated accessibility testing
2. **Lighthouse** - Web vitals and accessibility auditing
3. **WAVE** - Web accessibility evaluation tool
4. **Screen readers** - NVDA, JAWS, VoiceOver

### Vue-Specific Tools

```bash
# Install accessibility testing tools
npm install --save-dev @axe-core/vue @testing-library/vue

# Install screen reader testing
npm install --save-dev @testing-library/jest-dom
```

### Testing Setup

```typescript
// setup.ts
import { config } from '@testing-library/vue'
import '@testing-library/jest-dom'

// Configure testing library
config.global.plugins = []
```

## Best Practices Summary

1. **Always use semantic HTML**
2. **Provide alternative text for images**
3. **Ensure keyboard navigation works**
4. **Use proper ARIA attributes**
5. **Test with screen readers**
6. **Maintain sufficient color contrast**
7. **Provide focus indicators**
8. **Use live regions for dynamic content**
9. **Test with real users when possible**
10. **Follow WCAG 2.1 AA guidelines**

---

**Remember**: Accessibility is not just about compliance—it's about creating inclusive experiences for all users. Test your applications with real assistive technologies and get feedback from users with disabilities.
