import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    carNumber: '',
    referral: '',
    companyLink: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      alert('Signup successful! Your UserID has been activated.')
      navigate('/')
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="auth-wrapper">
      <div className="header-section">
        <img src="/image.jpg.jpg" alt="Startup Village Club Logo" className="logo" />
        <h1 className="club-title">Startup Village Club</h1>
      </div>

      <div className="auth-container">
        <h2 className="form-title">Create an Account</h2>
        <form onSubmit={handleSubmit} id="signupForm">
          <div className="form-group">
            <label htmlFor="name">Name <span className="required">*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address <span className="required">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number <span className="required">*</span></label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="carNumber">Car Number <span className="required">*</span></label>
            <input
              type="text"
              id="carNumber"
              name="carNumber"
              value={formData.carNumber}
              onChange={handleChange}
              required
              placeholder="Enter your car number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="referral">Referral ID</label>
            <input
              type="text"
              id="referral"
              name="referral"
              value={formData.referral}
              onChange={handleChange}
              placeholder="Enter referral ID(optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="companyLink">Company/LinkedIn Link</label>
            <input
              type="url"
              id="companyLink"
              name="companyLink"
              value={formData.companyLink}
              onChange={handleChange}
              placeholder="Enter company or LinkedIn link(optional)"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Sign Up'}
          </button>
        </form>

        <div className="links">
          <a href="#" onClick={() => navigate('/')}>Go to Dashboard</a>
        </div>
      </div>
    </div>
  )
}

export default Signup
