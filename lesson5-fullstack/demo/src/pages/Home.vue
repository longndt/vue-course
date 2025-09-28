<template>
  <div class="home">
    <nav class="navbar">
      <div class="nav-container">
        <h1 class="nav-title">Vue Fullstack</h1>
        <div class="nav-links">
          <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
          <router-link to="/upload" class="nav-link">Upload</router-link>
          <router-link to="/chat" class="nav-link">Chat</router-link>
          <router-link to="/analytics" class="nav-link">Analytics</router-link>
        </div>
      </div>
    </nav>

    <div class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Modern Vue 3 Fullstack Application</h1>
        <p class="hero-description">
          Experience the power of Vue 3 with real-time features, file uploads, and production-ready architecture.
        </p>
        <div class="hero-buttons">
          <router-link to="/dashboard" class="btn btn-primary">Get Started</router-link>
          <router-link to="/chat" class="btn btn-secondary">Try Live Chat</router-link>
        </div>
      </div>
    </div>

    <div class="features">
      <div class="container">
        <h2>Key Features</h2>
        <div class="feature-grid">
          <div class="feature">
            <div class="feature-icon">📊</div>
            <h3>Real-time Analytics</h3>
            <p>Live data updates with WebSocket integration</p>
          </div>
          <div class="feature">
            <div class="feature-icon">📁</div>
            <h3>File Management</h3>
            <p>Advanced file upload with progress tracking</p>
          </div>
          <div class="feature">
            <div class="feature-icon">💬</div>
            <h3>Live Chat</h3>
            <p>Real-time messaging with Socket.io</p>
          </div>
          <div class="feature">
            <div class="feature-icon">🚀</div>
            <h3>Production Ready</h3>
            <p>Optimized build with modern deployment</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Home page - static content
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.navbar {
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 1rem 0;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-title {
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 700;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #3b82f6;
}

.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6rem 2rem;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.hero-description {
  font-size: 1.25rem;
  margin-bottom: 3rem;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.features {
  padding: 6rem 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.features h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 4rem;
  color: #2c3e50;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
}

.feature {
  text-align: center;
  padding: 2rem;
  border-radius: 12px;
  background: white;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.feature:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.feature p {
  color: #64748b;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 1rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }
}
</style>