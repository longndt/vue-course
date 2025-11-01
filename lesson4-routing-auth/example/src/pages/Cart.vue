<template>
  <div class="cart">
    <div class="cart-header">
      <h1>Shopping Cart</h1>
      <p v-if="cartItems.length > 0">
        {{ cartItems.length }} item{{ cartItems.length !== 1 ? 's' : '' }} in your cart
      </p>
    </div>

    <div v-if="cartItems.length === 0" class="empty-cart">
      <div class="empty-cart-icon">🛒</div>
      <h2>Your cart is empty</h2>
      <p>Add some products to get started!</p>
      <router-link to="/products" class="continue-shopping-btn">
        Continue Shopping
      </router-link>
    </div>

    <div v-else class="cart-content">
      <div class="cart-items">
        <div
          v-for="item in cartItems"
          :key="item.id"
          class="cart-item"
        >
          <img :src="item.image" :alt="item.name" class="item-image" />

          <div class="item-details">
            <h3 class="item-name">{{ item.name }}</h3>
            <p class="item-description">{{ item.description }}</p>
            <div class="item-price">${{ item.price }}</div>
          </div>

          <div class="item-quantity">
            <label>Quantity:</label>
            <div class="quantity-controls">
              <button
                @click="updateQuantity(item.id, item.quantity - 1)"
                :disabled="item.quantity <= 1"
                class="quantity-btn"
              >
                -
              </button>
              <span class="quantity-display">{{ item.quantity }}</span>
              <button
                @click="updateQuantity(item.id, item.quantity + 1)"
                class="quantity-btn"
              >
                +
              </button>
            </div>
          </div>

          <div class="item-total">
            ${{ (item.price * item.quantity).toFixed(2) }}
          </div>

          <button
            @click="removeItem(item.id)"
            class="remove-btn"
            title="Remove item"
          >
            🗑️
          </button>
        </div>
      </div>

      <div class="cart-summary">
        <div class="summary-card">
          <h2>Order Summary</h2>

          <div class="summary-row">
            <span>Subtotal:</span>
            <span>${{ subtotal.toFixed(2) }}</span>
          </div>

          <div class="summary-row">
            <span>Shipping:</span>
            <span v-if="subtotal >= 100" class="free-shipping">FREE</span>
            <span v-else>${{ shipping.toFixed(2) }}</span>
          </div>

          <div class="summary-row">
            <span>Tax:</span>
            <span>${{ tax.toFixed(2) }}</span>
          </div>

          <hr class="summary-divider">

          <div class="summary-row total">
            <span>Total:</span>
            <span>${{ total.toFixed(2) }}</span>
          </div>

          <div v-if="subtotal < 100" class="free-shipping-notice">
            Add ${{ (100 - subtotal).toFixed(2) }} more for free shipping!
          </div>

          <button
            @click="proceedToCheckout"
            class="checkout-btn"
            :disabled="isProcessing"
          >
            <span v-if="isProcessing" class="loading-spinner"></span>
            {{ isProcessing ? 'Processing...' : 'Proceed to Checkout' }}
          </button>

          <button
            @click="clearCart"
            class="clear-cart-btn"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="message.text" class="message" :class="message.type">
      {{ message.text }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// State
const isProcessing = ref(false);
const message = reactive({
  text: '',
  type: 'success'
});

// Mock cart data
const cartItems = ref([
  {
    id: 1,
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation.",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    quantity: 1
  },
  {
    id: 2,
    name: "Smart Watch",
    description: "Feature-rich smartwatch with health monitoring.",
    price: 399.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
    quantity: 2
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    description: "Portable Bluetooth speaker with amazing sound quality.",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
    quantity: 1
  }
]);

// Computed properties
const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const shipping = computed(() => {
  return subtotal.value >= 100 ? 0 : 15.00;
});

const tax = computed(() => {
  return subtotal.value * 0.08; // 8% tax
});

const total = computed(() => {
  return subtotal.value + shipping.value + tax.value;
});

// Methods
const updateQuantity = (itemId, newQuantity) => {
  if (newQuantity < 1) return;

  const item = cartItems.value.find(item => item.id === itemId);
  if (item) {
    item.quantity = newQuantity;
    showMessage(`Quantity updated`, 'success');
  }
};

const removeItem = (itemId) => {
  const index = cartItems.value.findIndex(item => item.id === itemId);
  if (index > -1) {
    const removedItem = cartItems.value[index];
    cartItems.value.splice(index, 1);
    showMessage(`${removedItem.name} removed from cart`, 'success');
  }
};

const clearCart = () => {
  if (confirm('Are you sure you want to clear your cart?')) {
    cartItems.value = [];
    showMessage('Cart cleared', 'success');
  }
};

const proceedToCheckout = async () => {
  isProcessing.value = true;

  try {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock success
    showMessage('Order placed successfully!', 'success');
    cartItems.value = []; // Clear cart after successful order

    // Redirect to orders page
    setTimeout(() => {
      router.push('/profile?tab=orders');
    }, 1000);

  } catch (error) {
    showMessage('Payment failed. Please try again.', 'error');
  } finally {
    isProcessing.value = false;
  }
};

const showMessage = (text, type) => {
  message.text = text;
  message.type = type;

  setTimeout(() => {
    message.text = '';
  }, 3000);
};
</script>

<style scoped>
.cart {
  max-width: 1200px;
  margin: 0 auto;
}

.cart-header {
  text-align: center;
  margin-bottom: 3rem;
}

.cart-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.cart-header p {
  color: #666;
  font-size: 1.1rem;
}

.empty-cart {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.empty-cart-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-cart h2 {
  color: #333;
  margin-bottom: 1rem;
}

.empty-cart p {
  color: #666;
  margin-bottom: 2rem;
}

.continue-shopping-btn {
  display: inline-block;
  background: #667eea;
  color: white;
  padding: 1rem 2rem;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s;
}

.continue-shopping-btn:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
}

.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  align-items: start;
}

.cart-items {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr auto auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid #eee;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.item-details {
  min-width: 0; /* Allow text to wrap */
}

.item-name {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.item-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.item-price {
  font-weight: bold;
  color: #667eea;
  font-size: 1.1rem;
}

.item-quantity label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: all 0.3s;
}

.quantity-btn:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #667eea;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-display {
  min-width: 30px;
  text-align: center;
  font-weight: bold;
}

.item-total {
  font-weight: bold;
  font-size: 1.2rem;
  color: #333;
  text-align: right;
}

.remove-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s;
}

.remove-btn:hover {
  background: #fee;
}

.cart-summary {
  position: sticky;
  top: 2rem;
}

.summary-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.summary-card h2 {
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: #666;
}

.summary-row.total {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.free-shipping {
  color: #28a745;
  font-weight: bold;
}

.summary-divider {
  border: none;
  border-top: 1px solid #eee;
  margin: 1.5rem 0;
}

.free-shipping-notice {
  background: #e8f5e8;
  color: #155724;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
}

.checkout-btn,
.clear-cart-btn {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.checkout-btn {
  background: #28a745;
  color: white;
}

.checkout-btn:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-1px);
}

.checkout-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.clear-cart-btn {
  background: #6c757d;
  color: white;
}

.clear-cart-btn:hover {
  background: #545b62;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.message {
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

.message.success {
  background: #28a745;
}

.message.error {
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
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-item {
    grid-template-columns: 1fr;
    gap: 1rem;
    text-align: center;
  }

  .item-details {
    order: -1;
  }

  .quantity-controls {
    justify-content: center;
  }

  .summary-card {
    position: static;
  }
}

@media (max-width: 480px) {
  .cart {
    padding: 1rem;
  }

  .cart-header h1 {
    font-size: 2rem;
  }
}
</style>