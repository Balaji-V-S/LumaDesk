// src/context/AuthContext.jsx
import * as React from 'react';
import { loginUser as apiLogin } from '../api/authService';

const AuthContext = React.createContext(undefined);

export const AuthProvider = ({ children }) => {
  // --- UPDATE 1: Initialize user state from localStorage ---
  // This keeps the user logged in on page refresh.
  const [user, setUser] = React.useState(
    () => JSON.parse(localStorage.getItem('user')) || null,
  );

  // --- UPDATE 2: Fixed localStorage key mismatch ---
  // Your login function saved 'token', but you were loading 'luma_token'.
  // I've made them both use 'token'.
  const [token, setToken] = React.useState(
    () => localStorage.getItem('token'), 
  );
  
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const login = async (email, password) => { // <-- You have the email right here
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiLogin(email, password);
      
      const { token, userId, role, fullName } = response.data;

      // --- THIS IS THE FIX ---
      // Add the 'email' from the function argument to the user object
      const userToStore = { userId, fullName, role, email: email }; 
      // --- END FIX ---

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userToStore));
      
      setToken(token);
      setUser(userToStore); // 'user' in state now has the email
      
      console.log('Login successful:', userToStore);
      return true;

    } catch (err) {
      // ... (rest of your error handling)
      return false;
    } finally {
      setIsLoading(false);
    }
  };


  const logout = () => {
    setUser(null);
    setToken(null);
    
    // Using clear() is safest to ensure no stray data
    localStorage.clear(); 
    
    // Redirect to login
    window.location.href = '/login'; 
  };

  // We add isLoading to the value so other components can show a spinner
  const value = { user, token, login, logout, isLoading, error };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Helper hook
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};