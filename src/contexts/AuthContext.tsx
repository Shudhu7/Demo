import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/axios'; // Use your existing axios configuration instead of raw axios
import { User } from '@/types/event';

// Define your API base URL here for consistency
// Make sure this matches where your Spring Boot application is running
const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to extract user role from roles array
const extractUserRole = (roles: string[] | undefined): 'user' | 'admin' => {
  if (!roles || !Array.isArray(roles)) return 'user';
  
  // Check if user has ADMIN role (with or without ROLE_ prefix)
  const hasAdminRole = roles.some(role => 
    role === 'ROLE_ADMIN' || role === 'ADMIN' || role.toLowerCase() === 'admin'
  );
  
  return hasAdminRole ? 'admin' : 'user';
};

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);

  // Effect to check for existing token and validate it on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          // Parse stored user data
          const userData = JSON.parse(storedUser);
          
          // Validate token by making a request to protected endpoint
          const response = await api.get('/users/profile', {
            headers: {
              'Authorization': `Bearer ${storedToken}`
            }
          });

          if (response.data.status === 'success' && response.data.data) {
            const userProfile = response.data.data;
            
            // Create user object with proper role mapping
            const validatedUser: User = {
              id: userProfile.id?.toString() || userData.id,
              email: userProfile.email || userData.email,
              name: userProfile.name || userData.name,
              role: extractUserRole(userProfile.roles || userData.roles) || 'user'
            };

            setState({
              user: validatedUser,
              token: storedToken,
              isAuthenticated: true,
            });

            // Set default Authorization header for all subsequent requests
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          } else {
            throw new Error('Invalid token response');
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          // Clear invalid token and user data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete api.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // --- Login Function ---
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Make actual API call to your Spring Boot backend's login endpoint
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      // Check if login was successful based on your backend response structure
      if (response.data.status === 'success' && response.data.token) {
        const { token } = response.data;

        // Get user profile after successful login
        const profileResponse = await api.get('/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (profileResponse.data.status === 'success' && profileResponse.data.data) {
          const userProfile = profileResponse.data.data;
          
          // Create user object with proper role mapping
          const authenticatedUser: User = {
            id: userProfile.id?.toString() || 'user_' + Date.now(),
            email: userProfile.email || email,
            name: userProfile.name || email.split('@')[0],
            role: extractUserRole(userProfile.roles) || 'user' // Extract role from roles array
          };

          // Store token and user data
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(authenticatedUser));

          setState({
            user: authenticatedUser,
            token,
            isAuthenticated: true,
          });

          // Set default Authorization header for all subsequent requests
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          return true;
        } else {
          throw new Error('Failed to get user profile after login');
        }
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message);
      
      // Clear any existing auth data on failed login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
      });
      
      return false;
    }
  };

  // --- Register Function ---
  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // Make actual API call to your Spring Boot backend's register endpoint
      const response = await api.post('/auth/register', {
        email,
        password,
        name,
      });

      // Check if registration was successful
      if (response.data.status === 'success') {
        // After successful registration, automatically log the user in
        const loginSuccess = await login(email, password);
        return loginSuccess;
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration failed:', error.response?.data || error.message);
      return false;
    }
  };

  // --- Logout Function ---
  const logout = () => {
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Remove default Authorization header on logout
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};