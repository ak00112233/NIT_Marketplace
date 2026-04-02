import React, { useState, useEffect, createContext, useContext } from 'react';

// AuthContext: Global login state manager

// Create the context object — starts as null, will be filled by AuthProvider
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialize user from localStorage
  const [user, setUser] = useState(() => {
    const info = localStorage.getItem('userInfo');
    return info ? JSON.parse(info) : null;
  });

  // Save user data to localStorage and React state
  const loginUser = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
  };

  // Clear everything when logging out
  const logoutUser = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  // Merge partial update into user object
  const updateUser = (data) => {
    const merged = { ...user, ...data };
    localStorage.setItem('userInfo', JSON.stringify(merged));
    setUser(merged);
  };

  // Sync state across tabs (logout/login/update)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'userInfo') {
        if (!e.newValue) {
          // If userInfo is cleared in another tab, logout
          setUser(null);
        } else {
          // If userInfo updated in another tab, sync here
          try {
            setUser(JSON.parse(e.newValue));
          } catch (err) {
            console.error('Failed to sync auth state across tabs:', err);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Provide auth state and functions to children
  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — shortcut so components write useAuth() instead of useContext(AuthContext)
export function useAuth() {
  return useContext(AuthContext);
}
