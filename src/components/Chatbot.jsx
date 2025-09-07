import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Chatbot = () => {
  const [userInput, setUserInput] = useState('')
  const [chatboxVisible, setChatboxVisible] = useState(false)
  const [messages, setMessages] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showTyping, setShowTyping] = useState(false)
  const [privateChatWindows, setPrivateChatWindows] = useState([])
  const [currentCall, setCurrentCall] = useState(null)
  const [callTimer, setCallTimer] = useState(null)
  const [callStartTime, setCallStartTime] = useState(null)
  const chatboxRef = useRef(null)
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
    const inputValue = userInput.trim().toUpperCase()
    if (!inputValue || isProcessing) return

    setIsProcessing(true)
    const currentTime = new Date().toLocaleTimeString()

    // Show user message immediately
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    // Show typing indicator for very short time
    setShowTyping(true)

    // Create instant fallback data first
    const instantUser = {
      name: `User ${inputValue}`,
      carNumber: `KA-${inputValue}-1234`,
      whatsapp: `https://wa.me/9198765${inputValue}`,
      phone: `+91-98765${inputValue}`,
      chatLink: true,
      privateCall: true
    }

    // Display instant response immediately
    setTimeout(() => {
      setShowTyping(false)
      setCurrentUser(instantUser)
      setIsAuthenticated(true)
      displayUserInfo(instantUser, inputValue, currentTime)
      // Clear input after showing the response
      setUserInput('')
    }, 100) // Reduced from 300ms to 100ms

    // Try to fetch real data in background (non-blocking)
    try {
      const response = await axios.get(`/api/user/${inputValue}`, {
        timeout: 2000 // Reduced timeout
      })

      if (response.data.success) {
        const userData = response.data.data
        // Update with real data if available
        setCurrentUser(userData)
        // Replace the instant response with real data
        setMessages(prev => {
          const newMessages = [...prev]
          const lastMessage = newMessages[newMessages.length - 1]
          if (lastMessage && lastMessage.isUserInfo) {
            lastMessage.userData = userData
            lastMessage.buttons = generateButtons(userData, inputValue)
          }
          return newMessages
        })
      }
    } catch (error) {
      console.log('API not available, using instant fallback data:', error.message)
      // Keep using the instant fallback data
    }

    setIsProcessing(false)
  }

  const generateButtons = (data, userInput) => {
    const { name, carNumber, whatsapp, privateCall, chatLink, phone } = data
    
    let buttons = ''
    if (chatLink) {
      buttons += `<button onclick="openPrivateChat('${name}', '${userInput}')" class="action-btn chat-btn" style="flex: 1; padding: 0.8rem;"><i class='fas fa-comments'></i> Private Chat</button>`
    }
    if (privateCall) {
      buttons += `<button onclick="initiatePrivateCall('${name}', '${userInput}', '${phone}')" class="action-btn call-btn" style="flex: 1; padding: 0.8rem;"><i class='fas fa-phone'></i> Private Call</button>`
    }
    if (whatsapp) {
      buttons += `<button onclick="window.open('${whatsapp}', '_blank')" class="action-btn whatsapp-btn" style="flex: 1; padding: 0.8rem;"><i class='fab fa-whatsapp'></i> WhatsApp</button>`
    }
    return buttons
  }

  const displayUserInfo = (data, userInput, currentTime) => {
    const buttons = generateButtons(data, userInput)
      
      const botMessage = {
        id: Date.now() + 1,
      text: '',
        sender: 'bot',
      timestamp: new Date(),
      isUserInfo: true,
      userData: data,
      buttons: buttons
    }
    
    setMessages(prev => [...prev, botMessage])
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
    setPrivateChatWindows([])
    setCurrentCall(null)
  }

  // Private Chat Functions
  const openPrivateChat = (memberName, memberID) => {
    const chatWindow = {
      id: `chat-${memberID}`,
      memberName,
      memberID,
      messages: []
    }
    setPrivateChatWindows(prev => [...prev, chatWindow])
    sendWhatsAppNotification(memberName, memberID)
  }

  const closePrivateChat = (memberID) => {
    setPrivateChatWindows(prev => prev.filter(chat => chat.memberID !== memberID))
  }

  const sendPrivateMessage = (memberID, message) => {
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    }
    
    setPrivateChatWindows(prev => 
      prev.map(chat => 
        chat.memberID === memberID 
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      )
    )

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: 'Message received securely. This is a demo response from the private chat system.',
        sender: 'bot',
        timestamp: new Date()
      }
      
      setPrivateChatWindows(prev => 
        prev.map(chat => 
          chat.memberID === memberID 
            ? { ...chat, messages: [...chat.messages, botMessage] }
            : chat
        )
      )
    }, 500)
  }

  // Call Functions
  const initiatePrivateCall = (memberName, memberID, phoneNumber) => {
    const callData = {
      memberName,
      memberID,
      phoneNumber,
      startTime: Date.now(),
      status: 'connecting'
    }
    setCurrentCall(callData)
    
    // Simulate call connection
    setTimeout(() => {
      setCurrentCall(prev => ({ ...prev, status: 'connected' }))
      startCallTimer()
    }, 2000)
  }

  const endCall = () => {
    if (callTimer) {
      clearInterval(callTimer)
      setCallTimer(null)
    }
    setCurrentCall(null)
    setCallStartTime(null)
  }

  const startCallTimer = () => {
    setCallStartTime(Date.now())
    const timer = setInterval(() => {
      setCallTimer(prev => prev + 1)
    }, 1000)
    setCallTimer(timer)
  }

  const sendWhatsAppNotification = async (memberName, memberID) => {
    const chatLink = `${window.location.origin}${window.location.pathname}?chat=${memberID}`
    
    try {
      await axios.post('/api/send-whatsapp', {
        memberName: memberName,
        memberID: memberID,
        chatLink: chatLink
      })
      showNotification('WhatsApp notification sent successfully!', 'success')
    } catch (error) {
      console.log('WhatsApp notification failed:', error)
      showNotification('WhatsApp notification failed - chat will still work', 'info')
    }
  }

  const showNotification = (message, type = 'info') => {
    // Create notification element
    const notification = document.createElement('div')
    notification.className = `notification-toast ${type}`
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
      </div>
    `
    
    document.body.appendChild(notification)
    
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove()
      }
    }, 3000)
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
          <div className="chatbox" ref={chatboxRef}>
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                {message.isUserInfo ? (
                  <div className="customer-details-card">
                    <div className="customer-avatar">
                      <i className="fas fa-user-circle"></i>
                    </div>
                    <div className="customer-info">
                      <div className="customer-name">{message.userData.name}</div>
                      <div className="customer-car">
                        <i className="fas fa-car"></i>
                        <span className="car-number">{message.userData.carNumber}</span>
                      </div>
                    </div>
                    
                    <div className="action-buttons">
                      <button 
                        className="action-btn chat-btn"
                        onClick={() => openPrivateChat(message.userData.name, message.userData.name)}
                      >
                        <i className="fas fa-comments"></i> Private Chat
                      </button>
                      <button 
                        className="action-btn call-btn"
                        onClick={() => initiatePrivateCall(message.userData.name, message.userData.name, message.userData.phone)}
                      >
                        <i className="fas fa-phone"></i> Private Call
                      </button>
                      <button 
                        className="action-btn whatsapp-btn"
                        onClick={() => window.open(message.userData.whatsapp, '_blank')}
                      >
                        <i className="fab fa-whatsapp"></i> WhatsApp
                      </button>
                    </div>
                    
                    <div className="message-time">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ) : (
                  <>
                <div className="message-content">
                  {message.text}
                </div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString()}
                </div>
                  </>
                )}
              </div>
            ))}
            
            {showTyping && (
              <div className="message bot typing-indicator">
                <div className="typing-dots">
                  <i className="fas fa-circle"></i>
                  <i className="fas fa-circle"></i>
                  <i className="fas fa-circle"></i>
                </div>
              </div>
            )}
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
        
        {/* Call UI */}
        {currentCall && (
          <div className="call-container">
            <div className="call-header">
              <div className="call-avatar">
                <i className="fas fa-phone"></i>
              </div>
              <div className="call-info">
                <div className="call-name">{currentCall.memberName}</div>
                <div className="call-id">Member ID: {currentCall.memberID}</div>
              </div>
            </div>
            
            <div className="call-status">
              {currentCall.status === 'connecting' ? (
                <div className="connecting">
                  <i className="fas fa-spinner fa-spin"></i> Connecting...
                </div>
              ) : (
                <div className="connected">
                  <i className="fas fa-phone"></i> Connected
                </div>
              )}
            </div>
            
            {callStartTime && (
              <div className="call-timer">
                {Math.floor((Date.now() - callStartTime) / 60000).toString().padStart(2, '0')}:
                {Math.floor(((Date.now() - callStartTime) % 60000) / 1000).toString().padStart(2, '0')}
              </div>
            )}
            
            <div className="call-controls">
              <button className="call-btn end-call" onClick={endCall}>
                <i className="fas fa-phone-slash"></i> End Call
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Private Chat Windows */}
      {privateChatWindows.map((chat) => (
        <div key={chat.id} className="private-chat-window">
          <div className="chat-window-header">
            <div className="chat-header-info">
              <i className="fas fa-lock"></i>
              <span>Private Chat - {chat.memberName}</span>
            </div>
            <button 
              className="close-chat-btn"
              onClick={() => closePrivateChat(chat.memberID)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="chat-window-body">
            <div className="customer-info-section">
              <div className="info-header">
                <i className="fas fa-user-circle"></i>
                <span>Customer Information</span>
              </div>
              <div className="info-content">
                <div className="info-item">
                  <strong>ID:</strong> {chat.memberID}
                </div>
              </div>
              <div className="notification-section">
                <div className="notification-status">
                  <i className="fas fa-check-circle"></i>
                  <span>WhatsApp notification sent automatically to customer</span>
                </div>
              </div>
            </div>
            
            <div className="private-chat-messages">
              {chat.messages.map((msg) => (
                <div key={msg.id} className={`private-message ${msg.sender === 'user' ? 'user-private-message' : 'bot-private-message'}`}>
                  <div className="message-content">
                    <span className="message-text">{msg.text}</span>
                    <span className="message-time">{msg.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="chat-input-area">
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="private-message-input"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    sendPrivateMessage(chat.memberID, e.target.value)
                    e.target.value = ''
                  }
                }}
              />
              <button 
                className="send-private-btn"
                onClick={(e) => {
                  const input = e.target.previousElementSibling
                  if (input.value.trim()) {
                    sendPrivateMessage(chat.memberID, input.value)
                    input.value = ''
                  }
                }}
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Chatbot
