import React from 'react'

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="user-profile">
          <div className="profile-picture">
            <div className="profile-logo">STARTUP VILLAGE COUNTY</div>
            <div className="offline-status">Offline</div>
          </div>
          
          <div className="user-details">
            <h3>Guest User</h3>
            <p>guest@example.com</p>
            <p>+91 00000 00000</p>
          </div>
          
          <div className="status-indicators">
            <div className="status-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>Location not set</span>
            </div>
            <div className="status-item">
              <i className="fas fa-briefcase"></i>
              <span>Not a member yet</span>
            </div>
            <div className="status-item">
              <i className="fas fa-star"></i>
              <span>No rating yet</span>
            </div>
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
          
          <button className="signup-btn">
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
            <button className="action-btn">Get Started</button>
          </div>
          
          <div className="action-card">
            <div className="action-icon">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <div className="action-content">
              <h3>Launch Events</h3>
            </div>
            <button className="action-btn">Create Event</button>
          </div>
          
          <div className="action-card">
            <div className="action-icon">
              <i className="fas fa-map-marked-alt"></i>
            </div>
            <div className="action-content">
              <h3>Host a Land Property</h3>
            </div>
            <button className="action-btn">List Land</button>
          </div>
          
          <div className="action-card">
            <div className="action-icon">
              <i className="fas fa-plus-circle"></i>
            </div>
            <div className="action-content">
              <h3>Add Products</h3>
            </div>
            <button className="action-btn">Add Product</button>
          </div>
          
          <div className="action-card">
            <div className="action-icon">
              <i className="fas fa-suitcase"></i>
            </div>
            <div className="action-content">
              <h3>List Package/Trip</h3>
            </div>
            <button className="action-btn">List Package</button>
          </div>
          
          <div className="action-card">
            <div className="action-icon">
              <i className="fas fa-car"></i>
            </div>
            <div className="action-content">
              <h3>Car Reselling</h3>
            </div>
            <button className="action-btn">Sell Car</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
