import React from 'react'

const Footer = () => {
  return (
    <footer className="footer-section" style={{ 
      position: 'fixed', 
      bottom: '0', 
      left: '0', 
      right: '0', 
      backgroundColor: 'white', 
      borderTop: '1px solid #e5e7eb',
      padding: '8px 0',
      zIndex: '1000'
    }}>
      <div className="footer-navigation" style={{ 
        display: 'flex', 
        justifyContent: 'space-around', 
        alignItems: 'center',
        maxWidth: '100%'
      }}>
        <div className="nav-item" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          cursor: 'pointer',
          padding: '4px 8px'
        }}>
          <div style={{ fontSize: '20px', marginBottom: '2px' }}>🏠</div>
          <div style={{ fontSize: '10px', color: '#666' }}>Home</div>
        </div>
        <div className="nav-item" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          cursor: 'pointer',
          padding: '4px 8px'
        }}>
          <div style={{ fontSize: '20px', marginBottom: '2px' }}>📋</div>
          <div style={{ fontSize: '10px', color: '#666' }}>Menu</div>
        </div>
        <div className="nav-item" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          cursor: 'pointer',
          padding: '4px 8px'
        }}>
          <div style={{ fontSize: '20px', marginBottom: '2px' }}>🛒</div>
          <div style={{ fontSize: '10px', color: '#666' }}>Cart</div>
        </div>
        <div className="nav-item" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          cursor: 'pointer',
          padding: '4px 8px'
        }}>
          <div style={{ fontSize: '20px', marginBottom: '2px' }}>💬</div>
          <div style={{ fontSize: '10px', color: '#666' }}>Message</div>
        </div>
        <div className="nav-item" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          cursor: 'pointer',
          padding: '4px 8px'
        }}>
          <div style={{ fontSize: '20px', marginBottom: '2px' }}>👤</div>
          <div style={{ fontSize: '10px', color: '#666' }}>Profile</div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
