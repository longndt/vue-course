<template>
  <div id="app">
    <div class="app">
      <header class="app-header">
        <img :src="logo" class="app-logo" alt="logo" />
        <p>
          Edit <code>src/App.vue</code> and save to reload.
        </p>
        <a
          class="app-link"
          href="https://vuejs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Vue
        </a>
      </header>
    </div>
  </div>
</template>

<script>
import logo from './assets/logo.svg'

export default {
  name: 'App',
  data() {
    return {
      logo
    }
  }
}
</script>

<style>
@import './App.css';
</style>