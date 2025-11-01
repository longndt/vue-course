<template>
  <div class="home">
    <div class="hero-section">
      <h1 class="hero-title">Welcome to Vue Shop</h1>
      <p class="hero-description">
        Browse our collection of products and find the perfect items for your needs.
      </p>
      <router-link to="/products" class="cta-button">
        Shop Now
      </router-link>
    </div>

    <div class="feature-grid">
      <div class="feature">
        <div class="feature-icon">🏆</div>
        <h3>Quality Products</h3>
        <p>We offer only the highest quality items from trusted manufacturers.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">🚚</div>
        <h3>Fast Shipping</h3>
        <p>Get your items delivered quickly and reliably.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">💬</div>
        <h3>Customer Service</h3>
        <p>Our support team is here to help you 24/7.</p>
      </div>
    </div>

    <div class="stats-section">
      <div class="stat">
        <h3>10,000+</h3>
        <p>Happy Customers</p>
      </div>
      <div class="stat">
        <h3>500+</h3>
        <p>Products</p>
      </div>
      <div class="stat">
        <h3>24/7</h3>
        <p>Support</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Home page component - no reactive logic needed
</script>

<style scoped>
.home {
  text-align: center;
}

.hero-section {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin: -2rem -2rem 3rem -2rem;
}

.hero-title {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.hero-description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-button {
  display: inline-block;
  background: white;
  color: #667eea;
  padding: 1rem 2rem;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

.feature {
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.feature p {
  color: #666;
  line-height: 1.6;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin: 4rem 0;
  padding: 3rem 2rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.stat h3 {
  font-size: 2.5rem;
  color: #667eea;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.stat p {
  color: #666;
  font-size: 1.1rem;
  margin: 0;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 1rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .feature-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .stats-section {
    grid-template-columns: 1fr;
    padding: 2rem 1rem;
  }
}
</style>
