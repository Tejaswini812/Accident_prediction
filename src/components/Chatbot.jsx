import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Chatbot = () => {
  const [userInput, setUserInput] = useState('')
  const [chatboxVisible, setChatboxVisible] = useState(false)
  const [messages, setMessages] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  // Clear all data on component mount (page refresh)
  useEffect(() => {
    setMessages([])
    setCurrentUser(null)
    setIsAuthenticated(false)
    setChatboxVisible(false)
  }, [])

  useEffect(() => {
    if (userInput.length > 0) {
      setChatboxVisible(true)
    } else {
      setChatboxVisible(false)
    }
  }, [userInput])

  const sendMessage = async () => {
    if (!userInput.trim()) return

    const newMessage = {
      id: Date.now(),
      text: userInput,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])

    try {
      const response = await axios.post('/api/auth/login', { userId: userInput })
      const { user } = response.data
      
      if (response.data.success) {
        // Set current user for this session only
        setCurrentUser(user)
        setIsAuthenticated(true)
        
        const botMessage = {
          id: Date.now() + 1,
          text: `Welcome ${user.name}! You are now connected.`,
          sender: 'bot',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, botMessage])
      } else {
        const botMessage = {
          id: Date.now() + 1,
          text: response.data.message || 'User not found. Please check your User ID.',
          sender: 'bot',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, botMessage])
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Connection failed. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    }

    setUserInput('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  const clearAllData = () => {
    setMessages([])
    setCurrentUser(null)
    setIsAuthenticated(false)
    setUserInput('')
    setChatboxVisible(false)
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-box">
        <div className="chatbot-title">
          <i className="fas fa-comments"></i> Connect with Members
        </div>
        
        <div className="search-container">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="search-input"
            placeholder="Enter User ID"
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="characters"
          />
          <button onClick={sendMessage} className="send-btn">
            <i className="fas fa-paper-plane"></i>
          </button>
          {(isAuthenticated || messages.length > 0) && (
            <button onClick={clearAllData} className="clear-btn" title="Clear all data">
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        <p className="welcome-text">Welcome to Startup Village County</p>
        
        {chatboxVisible && (
          <div className="chatbox">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-content">
                  {message.text}
                </div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="chatbox-signup">
          <a 
            href="#" 
            className="chatbox-signup-btn"
            onClick={(e) => {
              e.preventDefault()
              navigate('/signup')
            }}
          >
            Activate your UserID
          </a>
        </div>
        
        {/* User Info Display */}
        {isAuthenticated && currentUser && (
          <div className="user-info-display">
            <div className="user-welcome">
              <div className="customer-avatar">
                <i className="fas fa-user-circle"></i>
              </div>
              <div className="customer-name">{currentUser.name}</div>
              <div className="customer-car">
                <i className="fas fa-car"></i>
                <span className="car-number">{currentUser.carNumber}</span>
              </div>
            </div>
            
            <div className="action-buttons">
              <button className="action-btn chat-btn">
                <i className="fas fa-comments"></i>
                Chat
              </button>
              <button className="action-btn call-btn">
                <i className="fas fa-phone"></i>
                Call
              </button>
              <button className="action-btn whatsapp-btn">
                <i className="fab fa-whatsapp"></i>
                WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chatbot
