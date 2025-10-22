<template>
  <div class="layout">
    <header class="header">
      <nav class="nav">
        <router-link to="/" class="nav-logo">
          Vue Shop
        </router-link>

        <div class="nav-links">
          <router-link to="/products" class="nav-link">
            Products
          </router-link>

          <template v-if="authStore.isAuthenticated">
            <router-link to="/profile" class="nav-link">
              <span class="nav-link-icon">👤</span>
              Profile
            </router-link>
            <router-link to="/cart" class="nav-link cart-link">
              <span class="nav-link-icon">🛒</span>
              Cart
              <span v-if="cartItemCount > 0" class="cart-badge">
                {{ cartItemCount }}
              </span>
            </router-link>

            <div class="user-menu">
              <button class="user-avatar" @click="toggleUserMenu">
                <img
                  v-if="authStore.user?.avatar"
                  :src="authStore.user.avatar"
                  :alt="authStore.user.username"
                  class="avatar-image"
                />
                <span v-else class="avatar-initials">
                  {{ authStore.userInitials }}
                </span>
              </button>

              <div v-if="showUserMenu" class="user-dropdown">
                <div class="user-info">
                  <p class="user-name">{{ authStore.user?.username }}</p>
                  <p class="user-email">{{ authStore.user?.email }}</p>
                </div>
                <hr>
                <router-link to="/profile" class="dropdown-item" @click="closeUserMenu">
                  Settings
                </router-link>
                <button @click="handleLogout" class="dropdown-item logout-btn">
                  Logout
                </button>
              </div>
            </div>
          </template>

          <router-link v-else to="/login" class="nav-button">
            Login
          </router-link>
        </div>

        <!-- Mobile menu button -->
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <span class="hamburger"></span>
        </button>
      </nav>

      <!-- Mobile menu -->
      <div v-if="showMobileMenu" class="mobile-menu">
        <router-link to="/products" class="mobile-link" @click="closeMobileMenu">
          Products
        </router-link>

        <template v-if="authStore.isAuthenticated">
          <router-link to="/profile" class="mobile-link" @click="closeMobileMenu">
            Profile
          </router-link>
          <router-link to="/cart" class="mobile-link" @click="closeMobileMenu">
            Cart
          </router-link>
          <button @click="handleLogout" class="mobile-link logout-btn">
            Logout
          </button>
        </template>

        <router-link v-else to="/login" class="mobile-link" @click="closeMobileMenu">
          Login
        </router-link>
      </div>
    </header>

    <main class="main">
      <slot />
    </main>

    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2025 Vue Shop. All rights reserved.</p>
        <div class="footer-links">
          <a href="#" class="footer-link">Privacy Policy</a>
          <a href="#" class="footer-link">Terms of Service</a>
          <a href="#" class="footer-link">Contact</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// State
const showUserMenu = ref(false);
const showMobileMenu = ref(false);
const cartItemCount = ref(3); // Mock cart count

// Methods
const handleLogout = () => {
  authStore.logout();
  closeUserMenu();
  closeMobileMenu();
  router.push('/');
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const closeUserMenu = () => {
  showUserMenu.value = false;
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const closeMobileMenu = () => {
  showMobileMenu.value = false;
};

// Close menus when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as Element;

  if (!target.closest('.user-menu')) {
    showUserMenu.value = false;
  }

  if (!target.closest('.mobile-menu-btn') && !target.closest('.mobile-menu')) {
    showMobileMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header Styles */
.header {
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3498db;
  text-decoration: none;
  transition: color 0.3s;
}

.nav-logo:hover {
  color: #2980b9;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: #333;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-link:hover {
  background: #f8f9fa;
  color: #3498db;
}

.nav-link.router-link-active {
  background: #3498db;
  color: white;
}

.nav-link-icon {
  font-size: 1.1rem;
}

.cart-link {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #e74c3c;
  color: white;
  font-size: 0.75rem;
  padding: 0.2rem 0.4rem;
  border-radius: 50%;
  min-width: 1.2rem;
  height: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-button {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.3s;
  font-size: 0.9rem;
}

.nav-button:hover {
  background: #2980b9;
}

/* User Menu */
.user-menu {
  position: relative;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background: #3498db;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.user-avatar:hover {
  background: #2980b9;
  transform: scale(1.05);
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-initials {
  font-weight: bold;
  font-size: 0.9rem;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 0.5rem;
  min-width: 200px;
  z-index: 1000;
  margin-top: 0.5rem;
}

.user-info {
  padding: 0.5rem;
}

.user-name {
  font-weight: bold;
  margin: 0;
  color: #333;
}

.user-email {
  font-size: 0.85rem;
  margin: 0;
  color: #666;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.75rem;
  color: #333;
  text-decoration: none;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.3s;
  font-size: 0.9rem;
}

.dropdown-item:hover {
  background: #f8f9fa;
}

.logout-btn {
  color: #e74c3c;
}

.logout-btn:hover {
  background: #fee;
}

/* Mobile Menu */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.hamburger {
  width: 25px;
  height: 3px;
  background: #333;
  position: relative;
  transition: all 0.3s;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 25px;
  height: 3px;
  background: #333;
  transition: all 0.3s;
}

.hamburger::before {
  top: -8px;
}

.hamburger::after {
  top: 8px;
}

.mobile-menu {
  display: none;
  flex-direction: column;
  background: white;
  border-top: 1px solid #eee;
  padding: 1rem;
}

.mobile-link {
  color: #333;
  text-decoration: none;
  padding: 0.75rem;
  border-radius: 4px;
  transition: background 0.3s;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
}

.mobile-link:hover {
  background: #f8f9fa;
}

.mobile-link.router-link-active {
  background: #3498db;
  color: white;
}

/* Main Content */
.main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Footer */
.footer {
  background: #2c3e50;
  color: white;
  padding: 2rem;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-links {
  display: flex;
  gap: 1rem;
}

.footer-link {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-link:hover {
  color: white;
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav {
    padding: 1rem;
  }

  .nav-links {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .mobile-menu {
    display: flex;
  }

  .main {
    padding: 1rem;
  }

  .footer-content {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .nav-logo {
    font-size: 1.2rem;
  }

  .main {
    padding: 0.5rem;
  }
}
</style>