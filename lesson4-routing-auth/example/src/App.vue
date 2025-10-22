<template>
  <div class="app">
    <Layout>
      <router-view />
    </Layout>
  </div>
</template>

<script setup lang="ts">
import Layout from './components/Layout.vue';
</script>

<style>
/* Global app styles */
.app {
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Transitions */
.router-enter-active,
.router-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.router-enter-from,
.router-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Loading spinner */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Utility classes */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.mb-0 { margin-bottom: 0; }
.mb-1 { margin-bottom: 0.5rem; }
.mb-2 { margin-bottom: 1rem; }
.mb-3 { margin-bottom: 1.5rem; }
.mb-4 { margin-bottom: 2rem; }

.mt-0 { margin-top: 0; }
.mt-1 { margin-top: 0.5rem; }
.mt-2 { margin-top: 1rem; }
.mt-3 { margin-top: 1.5rem; }
.mt-4 { margin-top: 2rem; }

.p-0 { padding: 0; }
.p-1 { padding: 0.5rem; }
.p-2 { padding: 1rem; }
.p-3 { padding: 1.5rem; }
.p-4 { padding: 2rem; }

.d-flex { display: flex; }
.d-block { display: block; }
.d-inline { display: inline; }
.d-none { display: none; }

.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.align-center { align-items: center; }

.w-full { width: 100%; }
.h-full { height: 100%; }
</style>