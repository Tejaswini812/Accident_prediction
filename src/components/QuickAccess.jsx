import React from 'react'
import { useNavigate } from 'react-router-dom'

const QuickAccess = () => {
  const navigate = useNavigate()

  const quickActions = [
    {
      id: 1,
      title: 'Book a Lunch',
      icon: '🍽️',
      description: 'Reserve your lunch spot',
      action: () => alert('Lunch booking feature coming soon!')
    },
    {
      id: 2,
      title: 'Find a Stay',
      icon: '🏨',
      description: 'Discover accommodation options',
      action: () => {
        const staysSection = document.getElementById('select-your-stays')
        if (staysSection) {
          staysSection.scrollIntoView({ behavior: 'smooth' })
        }
      }
    },
    {
      id: 3,
      title: 'Host a Property',
      icon: '🏠',
      description: 'List your property for rent',
      action: () => navigate('/dashboard')
    },
    {
      id: 4,
      title: 'Partner with Us',
      icon: '🤝',
      description: 'Join our partner network',
      action: () => alert('Partnership feature coming soon!')
    }
  ]

  return (
    <div className="quick-access-section">
      <div className="quick-access-container">
        <h2 className="quick-access-title">Quick Access</h2>
        <div className="quick-access-grid">
          {quickActions.map((action) => (
            <div 
              key={action.id} 
              className="quick-access-card"
              onClick={action.action}
            >
              <div className="quick-access-icon">
                {action.icon}
              </div>
              <h3 className="quick-access-card-title">{action.title}</h3>
              <p className="quick-access-description">{action.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default QuickAccess
