import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import api from './api';

const USER_KEY = 'echotic_user';
const TOKEN_KEY = 'echotic_access_token';
const REFRESH_KEY = 'echotic_refresh_token';

export const authService = {
  /**
   * Login user via backend REST API
   */
  async login(email, password) {
    if (!email || !password) {
      throw new Error('Please fill in all fields');
    }
    if (!email.includes('@')) {
      throw new Error('Please enter a valid email');
    }

    try {
      const response = await api.post('/auth/login', { email, password });
      const result = response.data;

      if (result.success && result.data) {
        const { user, accessToken, refreshToken } = result.data;

        // Save tokens securely
        await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
        if (refreshToken) {
          await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
        }

        // Save user profile to AsyncStorage for fast offline access
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

        return user;
      } else {
        throw new Error(result.error || 'Login failed');
      }
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Login failed. Please check your credentials.';
      throw new Error(message);
    }
  },

  /**
   * Register new user via backend REST API
   */
  async register(username, email, password, confirmPassword) {
    if (!username || !email || !password || !confirmPassword) {
      throw new Error('Please fill in all fields');
    }
    if (!email.includes('@')) {
      throw new Error('Please enter a valid email');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    try {
      const response = await api.post('/auth/register', { username, email, password });
      const result = response.data;

      if (result.success && result.data) {
        const { user, accessToken, refreshToken } = result.data;

        await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
        if (refreshToken) {
          await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
        }
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

        return user;
      } else {
        throw new Error(result.error || 'Registration failed');
      }
    } catch (error) {
      const details = error.response?.data?.details;
      const message = details
        ? details.map((d) => d.message).join('. ')
        : error.response?.data?.error || error.message || 'Registration failed';
      throw new Error(message);
    }
  },

  /**
   * Get current authenticated user profile from backend (with AsyncStorage fallback)
   */
  async getCurrentUser() {
    try {
      // First try fetching fresh profile from backend
      const response = await api.get('/users/me');
      if (response.data?.success && response.data?.data) {
        const user = response.data.data;
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
        return user;
      }
    } catch (e) {
      // If network offline or failed, fallback to local storage
    }

    try {
      const stored = await AsyncStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Logout user and invalidate token
   */
  async logout() {
    try {
      const refreshToken = await SecureStore.getItemAsync(REFRESH_KEY);
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (e) {
      // Continue cleanup even if server request fails
    } finally {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_KEY);
      await AsyncStorage.removeItem(USER_KEY);
    }
  },
};

export default authService;
