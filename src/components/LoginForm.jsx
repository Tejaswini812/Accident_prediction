import React, { useState } from 'react'
import apiClient from '../config/axios'

const LoginForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.password) newErrors.password = 'Password is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await apiClient.post('/auth/login', formData)
      
      // Store token and user data in localStorage
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      onSuccess(response.data.user, response.data.token)
      onClose()
    } catch (error) {
      console.error('Login error:', error)
      setErrors({
        submit: error.response?.data?.message || 'Login failed. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-modal" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="login-form" style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        maxWidth: '400px',
        width: '90%'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, color: '#1e293b' }}>Welcome Back</h2>
          <button 
            onClick={onClose}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '1.5rem', 
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors.email ? '#ef4444' : '#d1d5db'}`,
                borderRadius: '4px',
                fontSize: '0.875rem'
              }}
              placeholder="Enter your email"
            />
            {errors.email && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.email}</span>}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors.password ? '#ef4444' : '#d1d5db'}`,
                borderRadius: '4px',
                fontSize: '0.875rem'
              }}
              placeholder="Enter your password"
            />
            {errors.password && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.password}</span>}
          </div>

          {errors.submit && (
            <div style={{ 
              backgroundColor: '#fef2f2', 
              border: '1px solid #fecaca', 
              color: '#dc2626', 
              padding: '0.75rem', 
              borderRadius: '4px', 
              marginBottom: '1rem',
              fontSize: '0.875rem'
            }}>
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: loading ? '#9ca3af' : '#22c55e',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '1rem'
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
            Don't have an account? 
            <span style={{ color: '#22c55e', cursor: 'pointer', marginLeft: '0.25rem' }}>
              Sign up
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
