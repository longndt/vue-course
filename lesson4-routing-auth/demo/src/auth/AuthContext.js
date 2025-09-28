// Vue 3 Auth Store using Pinia
import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'

export const useAuthStore = defineStore('auth', () => {
   const user = ref(null)
   const loading = ref(false)
   const error = ref(null)

   const isAuthenticated = computed(() => !!user.value)

   // Initialize auth state on store creation
   const initializeAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
         fetchUser(token);
      }
   };

   const fetchUser = async (token) => {
      try {
         loading.value = true;
         const response = await fetch("/api/user", {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         if (!response.ok) {
            throw new Error("Failed to fetch user");
         }

         const userData = await response.json();
         user.value = userData;
      } catch (err) {
         error.value = err instanceof Error ? err.message : "An error occurred";
         localStorage.removeItem("token");
         user.value = null;
      } finally {
         loading.value = false;
      }
   };

   const login = async (email, password) => {
      try {
         loading.value = true;
         error.value = null;

         const response = await fetch("/api/login", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
         });

         if (!response.ok) {
            throw new Error("Invalid credentials");
         }

         const { token, user: userData } = await response.json();

         localStorage.setItem("token", token);
         user.value = userData;
      } catch (err) {
         error.value = err instanceof Error ? err.message : "Login failed";
         throw err;
      } finally {
         loading.value = false;
      }
   };

   const logout = () => {
      localStorage.removeItem("token");
      user.value = null;
      error.value = null;
   };

   const register = async (email, password, name) => {
      try {
         loading.value = true;
         error.value = null;

         const response = await fetch("/api/register", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, name }),
         });

         if (!response.ok) {
            throw new Error("Registration failed");
         }

         const { token, user: userData } = await response.json();

         localStorage.setItem("token", token);
         user.value = userData;
      } catch (err) {
         error.value = err instanceof Error ? err.message : "Registration failed";
         throw err;
      } finally {
         loading.value = false;
      }
   };

   // Initialize when store is created
   initializeAuth();

   return {
      // State
      user: readonly(user),
      loading: readonly(loading),
      error: readonly(error),

      // Getters
      isAuthenticated,

      // Actions
      login,
      logout,
      register,
      fetchUser,
   };
});

// Composable for easier usage in components
export function useAuth() {
   return useAuthStore();
}
