import React, { useState } from 'react'
import apiClient from '../config/axios'

const LaunchEvents = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    eventType: '',
    date: '',
    time: '',
    duration: '',
    capacity: '',
    organizer: '',
    contactInfo: ''
  })
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    
    // Check file size (max 5MB per image)
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 5MB.`)
        return false
      }
      return true
    })

    // Check total number of images (max 10)
    if (images.length + validFiles.length > 10) {
      alert('Maximum 10 images allowed')
      return
    }

    setImages(prev => [...prev, ...validFiles])
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      
      // Add form data
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key])
      })

      // Add images
      images.forEach((image, index) => {
        formDataToSend.append(`images`, image)
      })

      const response = await apiClient.post('/events', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      alert('Event created successfully!')
      onClose()
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Error creating event. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="event-form-modal">
        <div className="modal-header">
          <h2>Launch Events</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-section">
            <h3>Event Information</h3>
            
            <div className="form-group">
              <label htmlFor="title">Event Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="e.g., Tech Conference 2024"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="form-textarea"
                rows="4"
                placeholder="Describe your event..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price (₹) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="0 for free events"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="eventType">Event Type *</label>
                <select
                  id="eventType"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                >
                  <option value="">Select Type</option>
                  <option value="conference">Conference</option>
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="meetup">Meetup</option>
                  <option value="party">Party</option>
                  <option value="concert">Concert</option>
                  <option value="exhibition">Exhibition</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Event Details</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Event Date *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="time">Event Time *</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="duration">Duration (hours)</label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0.5"
                  step="0.5"
                  placeholder="e.g., 2.5"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="e.g., Bangalore Convention Center"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="capacity">Capacity</label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="form-input"
                  min="1"
                  placeholder="e.g., 100"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Organizer Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="organizer">Organizer Name *</label>
                <input
                  type="text"
                  id="organizer"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Your name or organization"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="contactInfo">Contact Details *</label>
                <input
                  type="text"
                  id="contactInfo"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Phone number or email"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Event Images</h3>
            <p className="image-upload-info">Upload up to 10 images (Max 5MB each)</p>
            
            <div className="image-upload-area">
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input"
              />
              <label htmlFor="images" className="file-input-label">
                <i className="fas fa-cloud-upload-alt"></i>
                <span>Choose Images</span>
              </label>
            </div>

            {images.length > 0 && (
              <div className="image-preview-grid">
                {images.map((image, index) => (
                  <div key={index} className="image-preview-item">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="preview-image"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="remove-image-btn"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-calendar-alt"></i>
                  Create Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LaunchEvents
