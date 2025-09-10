import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from './AuthModal'
import { submitProperty } from '../services/formSubmissionService'

const MultiStepPropertyForm = ({ onClose, onAuthRequired }) => {
  const [currentStep, setCurrentStep] = useState('property-name')
  const [formData, setFormData] = useState({})
  const [uploadedImages, setUploadedImages] = useState([])
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, isAuthenticated } = useAuth()

  // Load saved form data on component mount
  useEffect(() => {
    const savedForms = JSON.parse(localStorage.getItem('savedForms') || '{}')
    if (savedForms.property) {
      setFormData(savedForms.property.formData || {})
      setUploadedImages(savedForms.property.images || [])
    }
  }, [])

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    const savedForms = JSON.parse(localStorage.getItem('savedForms') || '{}')
    savedForms.property = { formData, images: uploadedImages }
    localStorage.setItem('savedForms', JSON.stringify(savedForms))
  }, [formData, uploadedImages])

  const handleStepClick = (step) => {
    setCurrentStep(step)
  }

  const handleFormDataChange = (step, data) => {
    setFormData(prev => ({
      ...prev,
      [step]: data
    }))
  }

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files)
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }))
    setUploadedImages(prev => [...prev, ...newImages])
  }

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 'property-name':
        return formData['property-name']?.name && formData['property-name']?.type
      case 'room-types':
        return formData['room-types'] && formData['room-types'].length > 0
      case 'room-pictures':
        return uploadedImages.length > 0
      case 'pricing-range':
        return formData['pricing-range']?.basePrice
      case 'location':
        return formData['location']?.address && formData['location']?.city
      case 'contact-details':
        return formData['contact-details']?.phone && formData['contact-details']?.email
      case 'other-rules':
        return true // Optional step
      default:
        return true
    }
  }

  const handleNext = () => {
    if (!validateCurrentStep()) {
      alert('Please fill in all required fields before proceeding.')
      return
    }
    
    const currentIndex = steps.findIndex(step => step.id === currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id)
    }
  }

  const handleSubmit = () => {
    // Validate all steps
    const isFormValid = steps.every(step => {
      if (step.id === 'other-rules') return true // Optional step
      return validateCurrentStep()
    })

    if (!isFormValid) {
      alert('Please fill in all required fields before submitting.')
      return
    }

    if (uploadedImages.length === 0) {
      alert('Please upload at least one image of your property.')
      return
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    // User is authenticated, proceed with submission
    submitForm()
  }

  const submitForm = async () => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Authentication token not found. Please login again.')
        return
      }

      // Debug: Log the form data structure
      console.log('Form data structure:', formData)
      
      // Transform form data to match backend schema
      const propertyData = {
        title: formData['property-name']?.name || formData.title || 'Property',
        description: formData['property-name']?.description || formData.description || 'Property description',
        price: formData['pricing-range']?.basePrice || formData['pricing-range']?.minPrice || formData.price || 0,
        location: formData['location']?.address || formData.location || 'Location',
        propertyType: formData['property-name']?.type || formData.propertyType || 'apartment',
        bedrooms: formData['room-types']?.[0]?.count || formData.bedrooms || 0,
        bathrooms: formData['room-types']?.[0]?.count || formData.bathrooms || 0,
        area: formData['room-types']?.[0]?.size || formData.area || 0,
        amenities: formData['other-rules']?.amenities || formData.amenities || '',
        contactInfo: formData['contact-details']?.phone || formData.contactInfo || ''
      }
      
      console.log('Transformed property data:', propertyData)

      // Submit to backend
      const result = await submitProperty(propertyData, uploadedImages, token)
      
      // Clear saved form data
      const savedForms = JSON.parse(localStorage.getItem('savedForms') || '{}')
      delete savedForms.property
      localStorage.setItem('savedForms', JSON.stringify(savedForms))

      console.log('Property submitted to MongoDB:', result)
      alert('Property listed successfully and saved to database!')
      onClose()
    } catch (error) {
      console.error('Error submitting property:', error)
      alert('Failed to submit property. Please try again.')
    }
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    submitForm()
  }

  const removeImage = (imageId) => {
    setUploadedImages(prev => {
      const updatedImages = prev.filter(img => img.id !== imageId)
      // Revoke object URL to free memory
      const imageToRemove = prev.find(img => img.id === imageId)
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview)
      }
      return updatedImages
    })
  }

  const steps = [
    { id: 'property-name', icon: 'fas fa-home', label: 'Property Name' },
    { id: 'room-types', icon: 'fas fa-bed', label: 'Room Types' },
    { id: 'room-pictures', icon: 'fas fa-camera', label: 'Room Pictures' },
    { id: 'pricing-range', icon: 'fas fa-dollar-sign', label: 'Pricing Range' },
    { id: 'location', icon: 'fas fa-map-marker-alt', label: 'Location' },
    { id: 'contact-details', icon: 'fas fa-phone', label: 'Contact Details' },
    { id: 'other-rules', icon: 'fas fa-list', label: 'Other Rules' }
  ]

  return (
    <React.Fragment>
      <div className="multistep-form">
        <div className="step-navigation">
        {steps.map(step => (
          <div 
            key={step.id}
            className={`step-item ${currentStep === step.id ? 'active' : ''}`} 
            onClick={() => handleStepClick(step.id)}
          >
            <i className={step.icon}></i>
            <span>{step.label}</span>
          </div>
        ))}
      </div>
      
      <div className="step-content">
        {currentStep === 'property-name' && (
          <div className="step-form">
            <h3>Property Name & Basic Info</h3>
            <div className="form-group">
              <label>Property Name *</label>
              <input 
                type="text" 
                placeholder="Enter property name"
                value={formData['property-name']?.name || ''}
                onChange={(e) => handleFormDataChange('property-name', { ...formData['property-name'], name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Property Type *</label>
              <select 
                value={formData['property-name']?.type || ''}
                onChange={(e) => handleFormDataChange('property-name', { ...formData['property-name'], type: e.target.value })}
              >
                <option value="">Select Property Type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="studio">Studio</option>
                <option value="penthouse">Penthouse</option>
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea 
                placeholder="Describe your property..."
                value={formData['property-name']?.description || ''}
                onChange={(e) => handleFormDataChange('property-name', { ...formData['property-name'], description: e.target.value })}
              ></textarea>
            </div>
          </div>
        )}
        
        {currentStep === 'room-types' && (
          <div className="step-form">
            <h3>Room Types & Details</h3>
            <div className="room-types-list">
              {(formData['room-types'] || []).map((room, index) => (
                <div key={index} className="room-type-item">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Room Type</label>
                      <input 
                        type="text" 
                        placeholder="e.g., Deluxe Room, Suite, etc."
                        value={room.type}
                        onChange={(e) => {
                          const newRooms = [...(formData['room-types'] || [])]
                          newRooms[index].type = e.target.value
                          handleFormDataChange('room-types', newRooms)
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Number of Rooms</label>
                      <input 
                        type="number" 
                        placeholder="1"
                        value={room.count}
                        onChange={(e) => {
                          const newRooms = [...(formData['room-types'] || [])]
                          newRooms[index].count = e.target.value
                          handleFormDataChange('room-types', newRooms)
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Max Occupancy</label>
                      <input 
                        type="number" 
                        placeholder="2"
                        value={room.occupancy}
                        onChange={(e) => {
                          const newRooms = [...(formData['room-types'] || [])]
                          newRooms[index].occupancy = e.target.value
                          handleFormDataChange('room-types', newRooms)
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Room Size (sq ft)</label>
                      <input 
                        type="number" 
                        placeholder="300"
                        value={room.size}
                        onChange={(e) => {
                          const newRooms = [...(formData['room-types'] || [])]
                          newRooms[index].size = e.target.value
                          handleFormDataChange('room-types', newRooms)
                        }}
                      />
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="remove-room-btn"
                    onClick={() => {
                      const newRooms = (formData['room-types'] || []).filter((_, i) => i !== index)
                      handleFormDataChange('room-types', newRooms)
                    }}
                  >
                    <i className="fas fa-trash"></i> Remove
                  </button>
                </div>
              ))}
              <button 
                type="button" 
                className="add-room-btn"
                onClick={() => {
                  const newRooms = [...(formData['room-types'] || []), { type: '', count: 1, occupancy: 2, size: '' }]
                  handleFormDataChange('room-types', newRooms)
                }}
              >
                <i className="fas fa-plus"></i> Add Room Type
              </button>
            </div>
          </div>
        )}
        
        {currentStep === 'room-pictures' && (
          <div className="step-form">
            <h3>Room Pictures</h3>
            <div className="upload-area">
              <div className="upload-zone" onClick={() => document.getElementById('image-upload').click()}>
                <i className="fas fa-cloud-upload-alt"></i>
                <p>Drag & drop images here or click to upload</p>
                <input 
                  id="image-upload"
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>
              <div className="uploaded-images">
                <p>Uploaded Images ({uploadedImages.length})</p>
                <div className="image-grid">
                  {uploadedImages.map(image => (
                    <div key={image.id} className="image-preview-item">
                      <img 
                        src={image.preview} 
                        alt={image.name}
                        className="preview-image"
                      />
                      <button 
                        className="remove-image-btn"
                        onClick={() => removeImage(image.id)}
                        title="Remove image"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {currentStep === 'pricing-range' && (
          <div className="step-form">
            <h3>Pricing Range</h3>
            <div className="pricing-options">
              <div className="form-group">
                <label>Base Price (₹) *</label>
                <input 
                  type="number" 
                  placeholder="1000"
                  value={formData['pricing-range']?.basePrice || ''}
                  onChange={(e) => handleFormDataChange('pricing-range', { ...formData['pricing-range'], basePrice: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Weekend Price (₹)</label>
                  <input 
                    type="number" 
                    placeholder="1500"
                    value={formData['pricing-range']?.weekendPrice || ''}
                    onChange={(e) => handleFormDataChange('pricing-range', { ...formData['pricing-range'], weekendPrice: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Holiday Price (₹)</label>
                  <input 
                    type="number" 
                    placeholder="2000"
                    value={formData['pricing-range']?.holidayPrice || ''}
                    onChange={(e) => handleFormDataChange('pricing-range', { ...formData['pricing-range'], holidayPrice: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Seasonal Pricing</label>
                <div className="seasonal-pricing">
                  <div className="season-item">
                    <label>Summer (Apr-Jun)</label>
                    <input type="number" placeholder="1200" />
                  </div>
                  <div className="season-item">
                    <label>Monsoon (Jul-Sep)</label>
                    <input type="number" placeholder="800" />
                  </div>
                  <div className="season-item">
                    <label>Winter (Oct-Mar)</label>
                    <input type="number" placeholder="1500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {currentStep === 'location' && (
          <div className="step-form">
            <h3>Location Details</h3>
            <div className="form-group">
              <label>Full Address *</label>
              <textarea 
                placeholder="Enter complete address..."
                value={formData['location']?.address || ''}
                onChange={(e) => handleFormDataChange('location', { ...formData['location'], address: e.target.value })}
              ></textarea>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input 
                  type="text" 
                  placeholder="Bangalore"
                  value={formData['location']?.city || ''}
                  onChange={(e) => handleFormDataChange('location', { ...formData['location'], city: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>State *</label>
                <input 
                  type="text" 
                  placeholder="Karnataka"
                  value={formData['location']?.state || ''}
                  onChange={(e) => handleFormDataChange('location', { ...formData['location'], state: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Pincode *</label>
                <input 
                  type="text" 
                  placeholder="560001"
                  value={formData['location']?.pincode || ''}
                  onChange={(e) => handleFormDataChange('location', { ...formData['location'], pincode: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Landmark</label>
                <input 
                  type="text" 
                  placeholder="Near Metro Station"
                  value={formData['location']?.landmark || ''}
                  onChange={(e) => handleFormDataChange('location', { ...formData['location'], landmark: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}
        
        {currentStep === 'contact-details' && (
          <div className="step-form">
            <h3>Contact Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Contact Person *</label>
                <input 
                  type="text" 
                  placeholder="Your Name"
                  value={formData['contact-details']?.name || ''}
                  onChange={(e) => handleFormDataChange('contact-details', { ...formData['contact-details'], name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input 
                  type="tel" 
                  placeholder="+91 98765 43210"
                  value={formData['contact-details']?.phone || ''}
                  onChange={(e) => handleFormDataChange('contact-details', { ...formData['contact-details'], phone: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email *</label>
                <input 
                  type="email" 
                  placeholder="your@email.com"
                  value={formData['contact-details']?.email || ''}
                  onChange={(e) => handleFormDataChange('contact-details', { ...formData['contact-details'], email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>WhatsApp</label>
                <input 
                  type="tel" 
                  placeholder="+91 98765 43210"
                  value={formData['contact-details']?.whatsapp || ''}
                  onChange={(e) => handleFormDataChange('contact-details', { ...formData['contact-details'], whatsapp: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}
        
        {currentStep === 'other-rules' && (
          <div className="step-form">
            <h3>Other Rules & Amenities</h3>
            <div className="amenities-section">
              <h4>Amenities</h4>
              <div className="amenities-grid">
                <label className="amenity-item">
                  <input type="checkbox" />
                  <span>Parking Available</span>
                </label>
                <label className="amenity-item">
                  <input type="checkbox" />
                  <span>Swimming Pool</span>
                </label>
                <label className="amenity-item">
                  <input type="checkbox" />
                  <span>Gym</span>
                </label>
                <label className="amenity-item">
                  <input type="checkbox" />
                  <span>WiFi</span>
                </label>
                <label className="amenity-item">
                  <input type="checkbox" />
                  <span>Air Conditioning</span>
                </label>
                <label className="amenity-item">
                  <input type="checkbox" />
                  <span>Kitchen</span>
                </label>
                <label className="amenity-item">
                  <input type="checkbox" />
                  <span>Laundry</span>
                </label>
                <label className="amenity-item">
                  <input type="checkbox" />
                  <span>Security</span>
                </label>
              </div>
            </div>
            <div className="rules-section">
              <h4>House Rules</h4>
              <div className="form-group">
                <label>Check-in Time</label>
                <input type="time" placeholder="14:00" />
              </div>
              <div className="form-group">
                <label>Check-out Time</label>
                <input type="time" placeholder="11:00" />
              </div>
              <div className="form-group">
                <label>Pet Policy</label>
                <select>
                  <option value="">Select Pet Policy</option>
                  <option value="allowed">Pets Allowed</option>
                  <option value="not-allowed">Pets Not Allowed</option>
                  <option value="conditional">Pets Allowed with Conditions</option>
                </select>
              </div>
              <div className="form-group">
                <label>Additional Rules</label>
                <textarea placeholder="Any additional rules or restrictions..."></textarea>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation and Submit Buttons */}
      <div className="form-navigation">
        <div className="nav-buttons">
          {currentStep === 'other-rules' && (
            <button 
              type="button" 
              className="nav-btn submit-btn"
              onClick={handleSubmit}
            >
              <i className="fas fa-check"></i>
              Submit Property
            </button>
          )}
        </div>
        
        <div className="form-progress">
          <span>Step {steps.findIndex(step => step.id === currentStep) + 1} of {steps.length}</span>
        </div>
      </div>
      </div>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        formData={{ formData, images: uploadedImages }}
        formType="property"
      />
    </React.Fragment>
  )
}

export default MultiStepPropertyForm
