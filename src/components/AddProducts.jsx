import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import apiClient from '../config/axios'

const AddProducts = ({ onClose, onAuthRequired, isInline = false }) => {
  const { isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    condition: '',
    quantity: '',
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
      onAuthRequired('Add Products')
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

      const response = await apiClient.post('/products', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      alert('Product added successfully!')
      onClose()
    } catch (error) {
      console.error('Error adding product:', error)
      alert('Error adding product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={isInline ? "inline-form" : "modal-overlay"}>
      <div className={isInline ? "product-form-inline" : "product-form-modal"}>
        {!isInline && (
          <div className="modal-header">
            <h2>Add Products</h2>
            <button className="close-btn" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-section">
            <h3>Product Information</h3>
            
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="e.g., iPhone 14 Pro"
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
                placeholder="Describe your product..."
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
                  placeholder="e.g., 89999"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                >
                  <option value="">Select Category</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="home">Home & Garden</option>
                  <option value="sports">Sports</option>
                  <option value="books">Books</option>
                  <option value="beauty">Beauty & Health</option>
                  <option value="automotive">Automotive</option>
                  <option value="toys">Toys & Games</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., Apple, Samsung, Nike"
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
                  <option value="new">New</option>
                  <option value="like-new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
                className="form-input"
                min="1"
                placeholder="e.g., 1"
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
                  placeholder="Your name or business name"
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
            <h3>Product Images</h3>
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
                  Adding...
                </>
              ) : (
                <>
                  <i className="fas fa-plus-circle"></i>
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProducts
