<template>
  <div class="profile">
    <div class="profile-header">
      <div class="avatar-section">
        <img
          v-if="authStore.user?.avatar"
          :src="authStore.user.avatar"
          :alt="authStore.user.username"
          class="profile-avatar"
        />
        <div v-else class="profile-avatar-placeholder">
          {{ authStore.userInitials }}
        </div>
        <button @click="toggleAvatarEdit" class="edit-avatar-btn">
          📷
        </button>
      </div>

      <div class="profile-info">
        <h1>{{ authStore.user?.username }}</h1>
        <p class="user-email">{{ authStore.user?.email }}</p>
        <span class="user-role" :class="authStore.user?.role">
          {{ authStore.user?.role?.toUpperCase() }}
        </span>
      </div>
    </div>

    <div class="profile-content">
      <div class="profile-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="tab-button"
          :class="{ active: activeTab === tab.id }"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Account Settings Tab -->
      <div v-if="activeTab === 'account'" class="tab-content">
        <div class="settings-section">
          <h2>Account Settings</h2>

          <form @submit.prevent="updateProfile" class="settings-form">
            <div class="form-row">
              <div class="form-group">
                <label for="username">Username</label>
                <input
                  id="username"
                  v-model="profileForm.username"
                  type="text"
                  class="form-input"
                  placeholder="Enter username"
                />
              </div>

              <div class="form-group">
                <label for="email">Email</label>
                <input
                  id="email"
                  v-model="profileForm.email"
                  type="email"
                  class="form-input"
                  placeholder="Enter email"
                />
              </div>
            </div>

            <div class="form-actions">
              <button
                type="submit"
                class="save-button"
                :disabled="authStore.isLoading"
              >
                <span v-if="authStore.isLoading" class="loading-spinner"></span>
                {{ authStore.isLoading ? 'Saving...' : 'Save Changes' }}
              </button>

              <button
                type="button"
                @click="resetForm"
                class="reset-button"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Order History Tab -->
      <div v-if="activeTab === 'orders'" class="tab-content">
        <div class="orders-section">
          <h2>Order History</h2>

          <div v-if="orders.length === 0" class="empty-state">
            <h3>No orders yet</h3>
            <p>You haven't placed any orders. Start shopping to see your order history!</p>
            <router-link to="/products" class="shop-now-btn">
              Shop Now
            </router-link>
          </div>

          <div v-else class="orders-list">
            <div
              v-for="order in orders"
              :key="order.id"
              class="order-card"
            >
              <div class="order-header">
                <span class="order-id">Order #{{ order.id }}</span>
                <span class="order-date">{{ formatDate(order.date) }}</span>
                <span class="order-status" :class="order.status">
                  {{ order.status.toUpperCase() }}
                </span>
              </div>

              <div class="order-items">
                <div
                  v-for="item in order.items"
                  :key="item.id"
                  class="order-item"
                >
                  <span>{{ item.name }} x{{ item.quantity }}</span>
                  <span>${{ item.price }}</span>
                </div>
              </div>

              <div class="order-total">
                <strong>Total: ${{ order.total }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Preferences Tab -->
      <div v-if="activeTab === 'preferences'" class="tab-content">
        <div class="preferences-section">
          <h2>Preferences</h2>

          <div class="preference-group">
            <h3>Notifications</h3>
            <label class="checkbox-label">
              <input
                v-model="preferences.emailNotifications"
                type="checkbox"
                class="checkbox-input"
              />
              <span class="checkbox-custom"></span>
              Email notifications for orders
            </label>

            <label class="checkbox-label">
              <input
                v-model="preferences.promotionalEmails"
                type="checkbox"
                class="checkbox-input"
              />
              <span class="checkbox-custom"></span>
              Promotional emails and offers
            </label>
          </div>

          <div class="preference-group">
            <h3>Privacy</h3>
            <label class="checkbox-label">
              <input
                v-model="preferences.publicProfile"
                type="checkbox"
                class="checkbox-input"
              />
              <span class="checkbox-custom"></span>
              Make profile public
            </label>
          </div>

          <button @click="savePreferences" class="save-button">
            Save Preferences
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

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

// State
const activeTab = ref('account');
const message = reactive({
  text: '',
  type: 'success' as 'success' | 'error'
});

const tabs = [
  { id: 'account', label: 'Account' },
  { id: 'orders', label: 'Orders' },
  { id: 'preferences', label: 'Preferences' }
];

// Profile form
const profileForm = reactive({
  username: '',
  email: ''
});

// Preferences
const preferences = reactive({
  emailNotifications: true,
  promotionalEmails: false,
  publicProfile: false
});

// Mock orders data
const orders = ref([
  {
    id: '12345',
    date: new Date('2025-01-15'),
    status: 'delivered',
    items: [
      { id: 1, name: 'Wireless Headphones', quantity: 1, price: 299.99 }
    ],
    total: 299.99
  },
  {
    id: '12346',
    date: new Date('2025-01-10'),
    status: 'shipped',
    items: [
      { id: 2, name: 'Smart Watch', quantity: 1, price: 399.99 },
      { id: 3, name: 'Cotton T-Shirt', quantity: 2, price: 59.98 }
    ],
    total: 459.97
  }
]);

// Methods
const updateProfile = async () => {
  try {
    const success = await authStore.updateProfile({
      username: profileForm.username,
      email: profileForm.email
    });

    if (success) {
      showMessage('Profile updated successfully!', 'success');
    }
  } catch (error) {
    showMessage('Failed to update profile', 'error');
  }
};

const resetForm = () => {
  if (authStore.user) {
    profileForm.username = authStore.user.username;
    profileForm.email = authStore.user.email;
  }
};

const savePreferences = () => {
  // Mock saving preferences
  showMessage('Preferences saved successfully!', 'success');
};

const toggleAvatarEdit = () => {
  // Mock avatar edit functionality
  showMessage('Avatar edit feature coming soon!', 'success');
};

const showMessage = (text: string, type: 'success' | 'error') => {
  message.text = text;
  message.type = type;

  setTimeout(() => {
    message.text = '';
  }, 3000);
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Initialize form with user data
onMounted(() => {
  resetForm();
});
</script>

<style scoped>
.profile {
  max-width: 1000px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.avatar-section {
  position: relative;
}

.profile-avatar,
.profile-avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #667eea;
}

.profile-avatar-placeholder {
  background: #667eea;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
}

.edit-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background: white;
  border: 2px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-info h1 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 2rem;
}

.user-email {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.user-role {
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}

.user-role.admin {
  background: #e74c3c;
  color: white;
}

.user-role.user {
  background: #3498db;
  color: white;
}

.profile-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.profile-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
}

.tab-button {
  flex: 1;
  padding: 1rem 2rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  color: #666;
  transition: all 0.3s;
}

.tab-button.active,
.tab-button:hover {
  background: #f8f9fa;
  color: #667eea;
  border-bottom: 2px solid #667eea;
}

.tab-content {
  padding: 2rem;
}

.settings-section h2,
.orders-section h2,
.preferences-section h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.settings-form {
  max-width: 600px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-input {
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.form-actions {
  display: flex;
  gap: 1rem;
}

.save-button,
.reset-button,
.shop-now-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  font-weight: 500;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.save-button {
  background: #667eea;
  color: white;
}

.save-button:hover:not(:disabled) {
  background: #5a6fd8;
}

.save-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.reset-button {
  background: #6c757d;
  color: white;
}

.reset-button:hover {
  background: #545b62;
}

.shop-now-btn {
  background: #28a745;
  color: white;
}

.shop-now-btn:hover {
  background: #218838;
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

/* Orders Section */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.empty-state h3 {
  margin-bottom: 1rem;
  color: #333;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.5rem;
  transition: box-shadow 0.3s;
}

.order-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.order-id {
  font-weight: bold;
  color: #333;
}

.order-date {
  color: #666;
}

.order-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}

.order-status.delivered {
  background: #d4edda;
  color: #155724;
}

.order-status.shipped {
  background: #cce7ff;
  color: #004085;
}

.order-status.pending {
  background: #fff3cd;
  color: #856404;
}

.order-items {
  margin-bottom: 1rem;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
  color: #666;
}

.order-total {
  text-align: right;
  color: #333;
  font-size: 1.1rem;
}

/* Preferences Section */
.preference-group {
  margin-bottom: 2rem;
}

.preference-group h3 {
  margin-bottom: 1rem;
  color: #333;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  cursor: pointer;
  color: #333;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 4px;
  position: relative;
  transition: all 0.3s;
}

.checkbox-input:checked + .checkbox-custom {
  background: #667eea;
  border-color: #667eea;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
}

/* Messages */
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

/* Responsive Design */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .profile-tabs {
    flex-wrap: wrap;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .order-header {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>