import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import jwtDecode from 'jwt-decode';

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface JWTPayload {
  sub: string;
  username: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters (computed)
  const isAuthenticated = computed(() => {
    return !!token.value && !!user.value;
  });

  const isAdmin = computed(() => {
    return user.value?.role === 'admin';
  });

  const userInitials = computed(() => {
    if (!user.value) return '';
    const { username } = user.value;
    return username.slice(0, 2).toUpperCase();
  });

  // Actions
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      isLoading.value = true;
      error.value = null;

      // Simulate API call - replace with actual API
      const response = await mockLogin(credentials);

      if (response.success) {
        token.value = response.token;
        user.value = response.user;

        // Store in localStorage
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user', JSON.stringify(response.user));

        return true;
      } else {
        error.value = response.message || 'Login failed';
        return false;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred during login';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    error.value = null;

    // Clear localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const initializeAuth = () => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      try {
        // Verify token is not expired
        const decoded = jwtDecode<JWTPayload>(storedToken);
        const currentTime = Date.now() / 1000;

        if (decoded.exp > currentTime) {
          token.value = storedToken;
          user.value = JSON.parse(storedUser);
        } else {
          // Token expired, clear storage
          logout();
        }
      } catch (error) {
        // Invalid token, clear storage
        logout();
      }
    }
  };

  const updateProfile = async (profileData: Partial<User>): Promise<boolean> => {
    try {
      isLoading.value = true;
      error.value = null;

      // Simulate API call
      const response = await mockUpdateProfile(profileData);

      if (response.success && user.value) {
        user.value = { ...user.value, ...profileData };
        localStorage.setItem('auth_user', JSON.stringify(user.value));
        return true;
      } else {
        error.value = response.message || 'Profile update failed';
        return false;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred during profile update';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    user,
    token,
    isLoading,
    error,
    // Getters
    isAuthenticated,
    isAdmin,
    userInitials,
    // Actions
    login,
    logout,
    initializeAuth,
    updateProfile,
    clearError,
  };
});

// Mock API functions - replace with actual API calls
const mockLogin = async (credentials: LoginCredentials) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock users database
  const users = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: '2',
      username: 'user',
      email: 'user@example.com',
      password: 'user123',
      role: 'user',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
      id: '3',
      username: 'john',
      email: 'john@example.com',
      password: 'john123',
      role: 'user',
      avatar: 'https://i.pravatar.cc/150?img=3'
    }
  ];

  const foundUser = users.find(
    u => u.username === credentials.username && u.password === credentials.password
  );

  if (foundUser) {
    const { password, ...userWithoutPassword } = foundUser;

    // Create mock JWT token
    const mockToken = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.${btoa(JSON.stringify({
      sub: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      role: foundUser.role,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours
      iat: Math.floor(Date.now() / 1000)
    }))}.mock_signature`;

    return {
      success: true,
      token: mockToken,
      user: userWithoutPassword
    };
  } else {
    return {
      success: false,
      message: 'Invalid username or password'
    };
  }
};

const mockUpdateProfile = async (profileData: Partial<User>) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    success: true,
    message: 'Profile updated successfully'
  };
};