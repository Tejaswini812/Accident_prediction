import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import apiClient from '../config/axios'

const CarReselling = ({ onClose, onAuthRequired, isInline = false }) => {
  const { isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    fuelType: '',
    transmission: '',
    color: '',
    condition: '',
    location: '',
    description: '',
    seller: '',
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
      onAuthRequired('Car Reselling')
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

      const response = await apiClient.post('/cars', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      alert('Car listed successfully!')
      onClose()
    } catch (error) {
      console.error('Error listing car:', error)
      alert('Error listing car. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={isInline ? "inline-form" : "modal-overlay"}>
      <div className={isInline ? "car-form-inline" : "car-form-modal"}>
        {!isInline && (
          <div className="modal-header">
            <h2>Car Reselling</h2>
            <button className="close-btn" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="car-form">
          <div className="form-section">
            <h3>Car Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="make">Make *</label>
                <input
                  type="text"
                  id="make"
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="e.g., Toyota, Honda, BMW"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="model">Model *</label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="e.g., Camry, Civic, X3"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="year">Year *</label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  min="1990"
                  max="2024"
                  placeholder="e.g., 2020"
                />
              </div>
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
                  placeholder="e.g., 500000"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="mileage">Mileage (km) *</label>
                <input
                  type="number"
                  id="mileage"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="e.g., 50000"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="fuelType">Fuel Type *</label>
                <select
                  id="fuelType"
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                >
                  <option value="">Select Fuel Type</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="cng">CNG</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="transmission">Transmission *</label>
                <select
                  id="transmission"
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                >
                  <option value="">Select Transmission</option>
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                  <option value="cvt">CVT</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="color">Color *</label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="e.g., White, Black, Silver"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="condition">Condition *</label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                >
                  <option value="">Select Condition</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
            </div>

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
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="form-textarea"
                rows="4"
                placeholder="Describe your car..."
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Seller Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="seller">Seller Name *</label>
                <input
                  type="text"
                  id="seller"
                  name="seller"
                  value={formData.seller}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Your name"
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
            <h3>Car Images</h3>
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
                  <i className="fas fa-car"></i>
                  Sell Car
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CarReselling
