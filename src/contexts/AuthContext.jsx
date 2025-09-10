import React, { createContext, useContext, useState, useEffect } from 'react'
import apiClient from '../config/axios'

const AuthContext = createContext()

export const useAuth = () => {
  try {
    const context = useContext(AuthContext)
    if (!context) {
      console.error('useAuth must be used within an AuthProvider')
      // Return a default context to prevent crashes
      return {
        user: null,
        login: () => {},
        logout: () => {},
        loading: false,
        isAuthenticated: false
      }
    }
    return context
  } catch (error) {
    console.error('Error in useAuth:', error)
    return {
      user: null,
      login: () => {},
      logout: () => {},
      loading: false,
      isAuthenticated: false
    }
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      
      if (token && userData) {
        try {
          // Verify token is still valid
          const response = await apiClient.get('/auth/verify')
          setUser(JSON.parse(userData))
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setUser(null)
        }
      } else {
        // No token or user data, set user to null
        setUser(null)
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}