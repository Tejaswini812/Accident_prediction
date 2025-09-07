import React, { useState } from 'react'
import apiClient from '../config/axios'

const ListPackage = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    destination: '',
    duration: '',
    packageType: '',
    includes: '',
    excludes: '',
    itinerary: '',
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

      const response = await apiClient.post('/packages', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      alert('Package listed successfully!')
      onClose()
    } catch (error) {
      console.error('Error listing package:', error)
      alert('Error listing package. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="package-form-modal">
        <div className="modal-header">
          <h2>List Package/Trip</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="package-form">
          <div className="form-section">
            <h3>Package Information</h3>
            
            <div className="form-group">
              <label htmlFor="title">Package Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="e.g., Goa Beach Package 3D/2N"
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
                placeholder="Describe your package..."
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
                  placeholder="e.g., 15000"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="destination">Destination *</label>
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="e.g., Goa, India"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="duration">Duration *</label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="e.g., 3 Days / 2 Nights"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="packageType">Package Type *</label>
                <select
                  id="packageType"
                  name="packageType"
                  value={formData.packageType}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                >
                  <option value="">Select Type</option>
                  <option value="domestic">Domestic</option>
                  <option value="international">International</option>
                  <option value="adventure">Adventure</option>
                  <option value="leisure">Leisure</option>
                  <option value="business">Business</option>
                  <option value="honeymoon">Honeymoon</option>
                  <option value="family">Family</option>
                  <option value="group">Group</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Package Details</h3>
            
            <div className="form-group">
              <label htmlFor="includes">What's Included *</label>
              <textarea
                id="includes"
                name="includes"
                value={formData.includes}
                onChange={handleInputChange}
                required
                className="form-textarea"
                rows="3"
                placeholder="e.g., Accommodation, Meals, Transportation, Guide"
              />
            </div>

            <div className="form-group">
              <label htmlFor="excludes">What's Not Included</label>
              <textarea
                id="excludes"
                name="excludes"
                value={formData.excludes}
                onChange={handleInputChange}
                className="form-textarea"
                rows="3"
                placeholder="e.g., Personal expenses, Tips, Optional activities"
              />
            </div>

            <div className="form-group">
              <label htmlFor="itinerary">Day-wise Itinerary</label>
              <textarea
                id="itinerary"
                name="itinerary"
                value={formData.itinerary}
                onChange={handleInputChange}
                className="form-textarea"
                rows="5"
                placeholder="Day 1: Arrival and check-in&#10;Day 2: Sightseeing tour&#10;Day 3: Departure"
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
            <h3>Package Images</h3>
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
                  <i className="fas fa-suitcase"></i>
                  List Package
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ListPackage
