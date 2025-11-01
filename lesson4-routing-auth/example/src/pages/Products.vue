<template>
  <div class="products">
    <div class="products-header">
      <h1>Our Products</h1>
      <p>Discover amazing products at great prices</p>

      <div class="search-filter">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          class="search-input"
        />
        <select v-model="selectedCategory" class="filter-select">
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
          <option value="home">Home & Garden</option>
        </select>
      </div>
    </div>

    <div v-if="isLoading" class="loading">
      <div class="loading-spinner"></div>
      <p>Loading products...</p>
    </div>

    <div v-else class="products-grid">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-card"
      >
        <img :src="product.image" :alt="product.name" class="product-image" />
        <div class="product-info">
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-description">{{ product.description }}</p>
          <div class="product-footer">
            <span class="product-price">${{ product.price }}</span>
            <button
              @click="addToCart(product)"
              class="add-to-cart-btn"
              :disabled="isAddingToCart === product.id"
            >
              <span v-if="isAddingToCart === product.id" class="loading-spinner small"></span>
              {{ isAddingToCart === product.id ? 'Adding...' : 'Add to Cart' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!isLoading && filteredProducts.length === 0" class="no-products">
      <h3>No products found</h3>
      <p>Try adjusting your search or filter criteria.</p>
    </div>

    <!-- Toast notification -->
    <div v-if="showToast" class="toast" :class="toastType">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// State
const searchQuery = ref('');
const selectedCategory = ref('');
const isLoading = ref(true);
const isAddingToCart = ref(null);
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('success');

// Mock products data
const products = ref([
  {
    id: 1,
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation.",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    category: "electronics"
  },
  {
    id: 2,
    name: "Smart Watch",
    description: "Feature-rich smartwatch with health monitoring.",
    price: 399.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
    category: "electronics"
  },
  {
    id: 3,
    name: "Cotton T-Shirt",
    description: "Comfortable 100% cotton t-shirt in various colors.",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
    category: "clothing"
  },
  {
    id: 4,
    name: "JavaScript Guide",
    description: "Comprehensive guide to modern JavaScript development.",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop",
    category: "books"
  },
  {
    id: 5,
    name: "Plant Pot Set",
    description: "Beautiful ceramic plant pots for your home garden.",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=300&h=300&fit=crop",
    category: "home"
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    description: "Portable Bluetooth speaker with amazing sound quality.",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
    category: "electronics"
  }
]);

// Computed
const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCategory = !selectedCategory.value || product.category === selectedCategory.value;

    return matchesSearch && matchesCategory;
  });
});

// Methods
const addToCart = async (product) => {
  isAddingToCart.value = product.id;

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock success
    showToastMessage(`${product.name} added to cart!`, 'success');
  } catch (error) {
    showToastMessage('Failed to add item to cart', 'error');
  } finally {
    isAddingToCart.value = null;
  }
};

const showToastMessage = (message, type) => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;

  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

const loadProducts = async () => {
  try {
    // Simulate API loading
    await new Promise(resolve => setTimeout(resolve, 1500));
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    showToastMessage('Failed to load products', 'error');
  }
};

// Lifecycle
onMounted(() => {
  loadProducts();
});
</script>

<style scoped>
.products {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.products-header {
  text-align: center;
  margin-bottom: 3rem;
}

.products-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.products-header p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.search-filter {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 600px;
  margin: 0 auto;
}

.search-input,
.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  min-width: 200px;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.loading-spinner.small {
  width: 16px;
  height: 16px;
  border-width: 2px;
  margin: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.product-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.product-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.product-info {
  padding: 1.5rem;
}

.product-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.product-description {
  color: #666;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.product-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
}

.add-to-cart-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 120px;
  justify-content: center;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #5a6fd8;
  transform: translateY(-1px);
}

.add-to-cart-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.no-products {
  text-align: center;
  padding: 4rem;
  color: #666;
}

.no-products h3 {
  margin-bottom: 1rem;
  color: #333;
}

.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

.toast.success {
  background: #28a745;
}

.toast.error {
  background: #dc3545;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .products {
    padding: 1rem;
  }

  .products-header h1 {
    font-size: 2rem;
  }

  .search-filter {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input,
  .filter-select {
    min-width: auto;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  .product-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .add-to-cart-btn {
    width: 100%;
  }
}
</style>