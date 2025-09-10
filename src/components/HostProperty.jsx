import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import apiClient from '../config/axios'

const HostProperty = ({ onClose, onAuthRequired, isInline = false }) => {
  const { isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    amenities: '',
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
    
    // Check if user is authenticated before submitting
    if (!isAuthenticated) {
      onAuthRequired('Host a Property')
      return
    }
    
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

      const response = await apiClient.post('/properties', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      alert('Property listed successfully!')
      onClose()
    } catch (error) {
      console.error('Error listing property:', error)
      alert('Error listing property. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={isInline ? "inline-form" : "modal-overlay"}>
      <div className={isInline ? "property-form-inline" : "property-form-modal"}>
        {!isInline && (
          <div className="modal-header">
            <h2>Host a Property</h2>
            <button className="close-btn" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="property-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Property Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="e.g., Beautiful 3BHK Apartment"
                />
              </div>
              
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
                  placeholder="e.g., 25000"
                />
              </div>
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
                placeholder="Describe your property..."
              />
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
                  placeholder="e.g., Bangalore, Karnataka"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="propertyType">Property Type *</label>
                <select
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                >
                  <option value="">Select Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="studio">Studio</option>
                  <option value="pg">PG/Hostel</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Property Details</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bedrooms">Bedrooms</label>
                <input
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bathrooms">Bathrooms</label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="area">Area (sq ft)</label>
                <input
                  type="number"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="amenities">Amenities</label>
              <input
                type="text"
                id="amenities"
                name="amenities"
                value={formData.amenities}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., Parking, Gym, Swimming Pool, Security"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Contact Information</h3>
            
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

          <div className="form-section">
            <h3>Property Images</h3>
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
                  Listing...
                </>
              ) : (
                <>
                  <i className="fas fa-home"></i>
                  List Property
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HostProperty
