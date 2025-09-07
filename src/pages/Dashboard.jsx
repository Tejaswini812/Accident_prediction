import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import LoginForm from '../components/LoginForm'
import SignupForm from '../components/SignupForm'
import HostProperty from '../components/HostProperty'
import LaunchEvents from '../components/LaunchEvents'
import HostLandProperty from '../components/HostLandProperty'
import AddProducts from '../components/AddProducts'
import ListPackage from '../components/ListPackage'
import CarReselling from '../components/CarReselling'

const Dashboard = () => {
  const { user, login, logout, isAuthenticated } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [showAuthRequiredModal, setShowAuthRequiredModal] = useState(false)
  const [showEditProfileModal, setShowEditProfileModal] = useState(false)
  const [showHostProperty, setShowHostProperty] = useState(false)
  const [showLaunchEvents, setShowLaunchEvents] = useState(false)
  const [showHostLandProperty, setShowHostLandProperty] = useState(false)
  const [showAddProducts, setShowAddProducts] = useState(false)
  const [showListPackage, setShowListPackage] = useState(false)
  const [showCarReselling, setShowCarReselling] = useState(false)
  const [selectedAction, setSelectedAction] = useState('')

  const handleActionClick = (action) => {
    if (isAuthenticated) {
      // User is already logged in, open the form directly
      if (action === 'Host a Property') {
        setShowHostProperty(true)
      } else if (action === 'Launch Events') {
        setShowLaunchEvents(true)
      } else if (action === 'Host a Land Property') {
        setShowHostLandProperty(true)
      } else if (action === 'Add Products') {
        setShowAddProducts(true)
      } else if (action === 'List Package/Trip') {
        setShowListPackage(true)
      } else if (action === 'Car Reselling') {
        setShowCarReselling(true)
      }
    } else {
      // User not logged in, show auth required modal
      setSelectedAction(action)
      setShowAuthRequiredModal(true)
    }
  }

  const handleLoginSuccess = (userData, token) => {
    login(userData, token)
    setShowLoginModal(false)
    // After successful login, show the appropriate form
    if (selectedAction === 'Host a Property') {
      setShowHostProperty(true)
    } else if (selectedAction === 'Launch Events') {
      setShowLaunchEvents(true)
    } else if (selectedAction === 'Host a Land Property') {
      setShowHostLandProperty(true)
    } else if (selectedAction === 'Add Products') {
      setShowAddProducts(true)
    } else if (selectedAction === 'List Package/Trip') {
      setShowListPackage(true)
    } else if (selectedAction === 'Car Reselling') {
      setShowCarReselling(true)
    }
    setSelectedAction('')
  }

  const handleSignupSuccess = (userData, token) => {
    login(userData, token)
    setShowSignupModal(false)
    // After successful signup, show the appropriate form
    if (selectedAction === 'Host a Property') {
      setShowHostProperty(true)
    } else if (selectedAction === 'Launch Events') {
      setShowLaunchEvents(true)
    } else if (selectedAction === 'Host a Land Property') {
      setShowHostLandProperty(true)
    } else if (selectedAction === 'Add Products') {
      setShowAddProducts(true)
    } else if (selectedAction === 'List Package/Trip') {
      setShowListPackage(true)
    } else if (selectedAction === 'Car Reselling') {
      setShowCarReselling(true)
    }
    setSelectedAction('')
  }
        return (
    <div className="dashboard-page">
      {/* Top Header */}
      <header className="top-header">
        <div className="header-content">
          <img src="/image.jpg.jpg" alt="Startup Village County Logo" className="header-logo" />
          <h1 className="header-title">Dashboard</h1>
        </div>
        <div className="header-actions">
          {isAuthenticated ? (
            <div className="user-info">
              <span className="user-name">Welcome, {user?.name}</span>
              <button className="header-logout-btn" onClick={logout}>
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </div>
          ) : (
            <>
              <button className="header-login-btn" onClick={() => setShowLoginModal(true)}>
                <i className="fas fa-sign-in-alt"></i>
                Login
              </button>
              <button className="header-signup-btn" onClick={() => setShowSignupModal(true)}>
                <i className="fas fa-user-plus"></i>
                Sign Up
              </button>
            </>
          )}
        </div>
      </header>

      <div className="dashboard-container">
        <div className="dashboard-sidebar">
          <div className="user-profile-card">
            <div className="profile-picture">
              <div className="profile-logo">STARTUP VILLAGE COUNTY</div>
              <div className="online-status">Online</div>
            </div>
            
            <div className="user-details">
              <h3>John Doe</h3>
              <p>john.doe@example.com</p>
              <p>+91 98765 43210</p>
            </div>
            
            <div className="status-indicators">
              <div className="status-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>Bangalore, Karnataka</span>
              </div>
              <div className="status-item">
                <i className="fas fa-calendar"></i>
                <span>Member since Jan 2024</span>
              </div>
              <div className="status-item">
                <i className="fas fa-star"></i>
                <span>4.8 Rating</span>
              </div>
            </div>
            
            <div className="verification-section">
              <h4>Identity Verification</h4>
              <div className="verification-item">
                <i className="fas fa-check-circle" style={{color: '#22c55e'}}></i>
                <span>Email Verified</span>
              </div>
              <div className="verification-item">
                <i className="fas fa-clock" style={{color: '#f59e0b'}}></i>
                <span>Phone Pending</span>
              </div>
              <div className="verification-item">
                <i className="fas fa-times-circle" style={{color: '#ef4444'}}></i>
                <span>ID Not Verified</span>
              </div>
            </div>
            
            <button className="verify-identity-btn" onClick={() => setShowSignupModal(true)}>
              <i className="fas fa-shield-alt"></i>
              Verify Identity
            </button>
            
            <div className="profile-actions">
              <button className="edit-profile-btn" onClick={() => setShowEditProfileModal(true)}>
                <i className="fas fa-pencil-alt"></i>
                Edit Profile
              </button>
              <button className="settings-btn" onClick={() => setShowSignupModal(true)}>
                <i className="fas fa-cog"></i>
                Settings
              </button>
            </div>
            
            <div className="signup-required">
              <h4>Sign Up Required</h4>
              <div className="requirement-item">
                <i className="fas fa-times"></i>
                <span>Not Signed Up</span>
              </div>
              <div className="requirement-item">
                <i className="fas fa-times"></i>
                <span>No Profile</span>
              </div>
              <div className="requirement-item">
                <i className="fas fa-times"></i>
                <span>No Verification</span>
              </div>
            </div>
            
            <button className="signup-btn" onClick={() => setShowSignupModal(true)}>
              <i className="fas fa-user-plus"></i>
              Sign Up Now
            </button>
          </div>
        </div>

          <div className="dashboard-main">
        <div className="action-cards">
          <div className="action-card">
            <div className="action-icon">
              <i className="fas fa-home"></i>
            </div>
            <div className="action-content">
              <h3>Host a Property</h3>
            </div>
            <button className="action-btn" onClick={() => handleActionClick('Host a Property')}>Get Started</button>
          </div>

          <div className="action-card">
            <div className="action-icon">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <div className="action-content">
              <h3>Launch Events</h3>
            </div>
            <button className="action-btn" onClick={() => handleActionClick('Launch Events')}>Create Event</button>
          </div>

          <div className="action-card">
            <div className="action-icon">
              <i className="fas fa-map-marked-alt"></i>
            </div>
            <div className="action-content">
              <h3>Host a Land Property</h3>
            </div>
            <button className="action-btn" onClick={() => handleActionClick('Host a Land Property')}>List Land</button>
          </div>

          <div className="action-card">
            <div className="action-icon">
              <i className="fas fa-plus-circle"></i>
            </div>
            <div className="action-content">
              <h3>Add Products</h3>
            </div>
            <button className="action-btn" onClick={() => handleActionClick('Add Products')}>Add Product</button>
          </div>

          <div className="action-card">
              <div className="action-icon">
                <i className="fas fa-suitcase"></i>
              </div>
              <div className="action-content">
              <h3>List Package/Trip</h3>
            </div>
            <button className="action-btn" onClick={() => handleActionClick('List Package/Trip')}>List Package</button>
          </div>

          <div className="action-card">
              <div className="action-icon">
                <i className="fas fa-car"></i>
              </div>
              <div className="action-content">
              <h3>Car Reselling</h3>
            </div>
            <button className="action-btn" onClick={() => handleActionClick('Car Reselling')}>Sell Car</button>
          </div>
        </div>
      </div>
    </div>

    {/* Login Modal */}
      {showLoginModal && (
        <LoginForm
          onClose={() => setShowLoginModal(false)}
          onSuccess={handleLoginSuccess}
        />
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <SignupForm
          onClose={() => setShowSignupModal(false)}
          onSuccess={handleSignupSuccess}
        />
      )}

      {/* Authentication Required Modal */}
      {showAuthRequiredModal && (
        <div className="modal-overlay">
          <div className="auth-required-modal">
            <div className="modal-header">
              <h2>Authentication Required</h2>
              <button 
                className="close-btn" 
                onClick={() => setShowAuthRequiredModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="auth-icon">
                <i className="fas fa-lock"></i>
              </div>
              <h3>Login Required</h3>
              <p>You need to be logged in to {selectedAction.toLowerCase()}.</p>
              <p>Please sign up or login to continue.</p>
              <div className="modal-actions">
                <button 
                  className="login-btn"
                  onClick={() => {
                    setShowAuthRequiredModal(false)
                    setShowLoginModal(true)
                  }}
                >
                  <i className="fas fa-sign-in-alt"></i>
                  Login
                </button>
                <button 
                  className="signup-btn-modal"
                  onClick={() => {
                    setShowAuthRequiredModal(false)
                    setShowSignupModal(true)
                  }}
                >
                  <i className="fas fa-user-plus"></i>
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="modal-overlay">
          <div className="edit-profile-modal">
            <div className="modal-header">
              <h2>Edit Profile</h2>
              <button 
                className="close-btn" 
                onClick={() => setShowEditProfileModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <form className="edit-profile-form">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input 
                    type="text" 
                    id="fullName" 
                    defaultValue="John Doe"
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    defaultValue="john.doe@example.com"
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    defaultValue="+91 98765 43210"
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input 
                    type="text" 
                    id="location" 
                    defaultValue="Bangalore, Karnataka"
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea 
                    id="bio" 
                    rows="3"
                    placeholder="Tell us about yourself..."
                    className="form-textarea"
                  ></textarea>
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setShowEditProfileModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="save-btn"
                    onClick={(e) => {
                      e.preventDefault()
                      alert('Profile updated successfully!')
                      setShowEditProfileModal(false)
                    }}
                  >
                    <i className="fas fa-save"></i>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Feature Form Modals */}
      {showHostProperty && (
        <HostProperty onClose={() => setShowHostProperty(false)} />
      )}

      {showLaunchEvents && (
        <LaunchEvents onClose={() => setShowLaunchEvents(false)} />
      )}

      {showHostLandProperty && (
        <HostLandProperty onClose={() => setShowHostLandProperty(false)} />
      )}

      {showAddProducts && (
        <AddProducts onClose={() => setShowAddProducts(false)} />
      )}

      {showListPackage && (
        <ListPackage onClose={() => setShowListPackage(false)} />
      )}

      {showCarReselling && (
        <CarReselling onClose={() => setShowCarReselling(false)} />
      )}
    </div>
  )
}

export default Dashboard