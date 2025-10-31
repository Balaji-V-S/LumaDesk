import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      // --- MODIFIED: Read individual items ---
      const storedToken = localStorage.getItem('authToken');
      const storedUserId = localStorage.getItem('authUserId');
      const storedRole = localStorage.getItem('authRole');
      const storedFullName = localStorage.getItem('authFullName');

      // Check if all essential items are present
      if (storedToken && storedUserId && storedRole && storedFullName) {
        
        // Re-create the user object for React state
        const parsedUser = {
          userId: Number(storedUserId), // Assuming userId is a number
          role: storedRole,
          fullName: storedFullName,
        };
        
        setToken(storedToken);
        setUser(parsedUser); // Set state with the re-built object
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
    } catch (error) {
      console.error("Failed to parse auth data from localStorage", error);
      // Clear all items on error
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUserId');
      localStorage.removeItem('authRole');
      localStorage.removeItem('authFullName');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (authData) => {
    const { token, userId, role, fullName } = authData;
    
    // The user object for React state (this is good)
    const userToStore = { userId, role, fullName };

    setToken(token);
    setUser(userToStore);

    // --- MODIFIED: Store items separately ---
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUserId', userId);
    localStorage.setItem('authRole', role);
    localStorage.setItem('authFullName', fullName);
    
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    // --- MODIFIED: Remove items separately ---
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUserId');
    localStorage.removeItem('authRole');
    localStorage.removeItem('authFullName');
    
    delete axiosInstance.defaults.headers.common['Authorization'];
  };

  const authValue = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    isLoading,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook is unchanged
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};