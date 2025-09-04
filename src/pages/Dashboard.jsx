import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import SignupForm from '../components/SignupForm'

const Dashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [expandedCard, setExpandedCard] = useState(null)
  const [showAuthPopup, setShowAuthPopup] = useState(false)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const requireAuth = (action) => {
    if (!user) {
      setShowLoginModal(true)
      return false
    }
    return true
  }
  const [formData, setFormData] = useState({
    hostProperty: {
      propertyType: '',
      location: '',
      priceWithRoomType: '',
      description: '',
      amenities: '',
      images: []
    },
    launchEvents: {
      eventName: '',
      eventDate: '',
      eventTime: '',
      location: '',
      description: '',
      ticketPrice: '',
      images: []
    },
    hostLandProperty: {
      landType: '',
      area: '',
      location: '',
      price: '',
      description: '',
      purpose: '',
      images: []
    },
    addProducts: {
      productName: '',
      category: '',
      price: '',
      description: '',
      stock: '',
      images: []
    },
    listPackageTrip: {
      packageName: '',
      destination: '',
      duration: '',
      price: '',
      startDate: '',
      endDate: '',
      description: '',
      inclusions: '',
      maxPeople: '',
      images: []
    },
    carReselling: {
      carModel: '',
      year: '',
      mileage: '',
      price: '',
      location: '',
      fuelType: '',
      transmission: '',
      description: '',
      condition: '',
      images: []
    }
  })
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    location: 'Bangalore, Karnataka',
    memberSince: 'Jan 2024',
    rating: '4.8',
    profilePicture: '/image.jpg.jpg'
  })



  const handleAction = (action) => {
    // Check if user needs to be authenticated for this action
    const authRequiredActions = ['hostProperty', 'launchEvents', 'hostLandProperty', 'addProducts', 'listPackageTrip', 'carReselling']
    
    if (authRequiredActions.includes(action) && !user) {
      setShowAuthPopup(true)
      return
    }
    
    setExpandedCard(expandedCard === action ? null : action)
  }

  const handleFormInputChange = (action, field, value) => {
    setFormData(prev => ({
      ...prev,
      [action]: {
        ...prev[action],
        [field]: value
      }
    }))
  }

  const handleSubmitForm = async (action) => {
    console.log(`Submitting ${action}:`, formData[action])
    
    try {
      if (action === 'launchEvents') {
        // Create event via API
        const eventData = {
          name: formData[action].eventName,
          description: formData[action].description,
          date: formData[action].eventDate + 'T' + formData[action].eventTime,
          location: formData[action].location,
          price: parseFloat(formData[action].ticketPrice) || 0,
          category: 'General',
          organizer: user ? user.name : 'Unknown'
        }
        
        console.log('Event data being sent:', eventData)
        
        console.log('Creating event:', eventData)
        
        // Create FormData for file upload
        const formDataToSend = new FormData()
        formDataToSend.append('name', eventData.name)
        formDataToSend.append('description', eventData.description)
        formDataToSend.append('date', eventData.date)
        formDataToSend.append('location', eventData.location)
        formDataToSend.append('price', eventData.price)
        formDataToSend.append('category', eventData.category)
        formDataToSend.append('organizer', eventData.organizer)
        
        // Add image if available (only one image for events)
        console.log('Form data images:', formData[action].images)
        console.log('Images length:', formData[action].images ? formData[action].images.length : 'undefined')
        
        if (formData[action].images && formData[action].images.length > 0) {
          console.log('Adding event image:', formData[action].images[0])
          console.log('Image file:', formData[action].images[0].file)
          formDataToSend.append('eventImage', formData[action].images[0].file)
        } else {
          console.log('No event image provided')
        }
        
        const response = await fetch('/api/events', {
          method: 'POST',
          body: formDataToSend
        })
        
        console.log('Response status:', response.status)
        console.log('Response ok:', response.ok)
        
        if (response.ok) {
          const result = await response.json()
          console.log('Event created successfully:', result)
          alert('Event created successfully!')
          
          // Trigger events refresh in EventsSection
          window.dispatchEvent(new CustomEvent('eventCreated'))
        } else {
          const errorText = await response.text()
          console.error('Error response:', errorText)
          throw new Error(`Failed to create event: ${response.status} - ${errorText}`)
        }
      } else if (action === 'carReselling') {
        // Create car via API
        const carData = {
          name: formData[action].carModel,
          year: formData[action].year,
          price: formData[action].price,
          description: formData[action].description || '',
          mileage: formData[action].mileage || '',
          fuelType: formData[action].fuelType || ''
        }
        
        console.log('Car data being sent:', carData)
        
        // Create FormData for file upload
        const formDataToSend = new FormData()
        formDataToSend.append('name', carData.name)
        formDataToSend.append('year', carData.year)
        formDataToSend.append('price', carData.price)
        formDataToSend.append('description', carData.description)
        formDataToSend.append('mileage', carData.mileage)
        formDataToSend.append('fuelType', carData.fuelType)
        
        // Add image if available
        if (formData[action].images && formData[action].images.length > 0) {
          console.log('Adding car image:', formData[action].images[0])
          formDataToSend.append('carImage', formData[action].images[0].file)
        }
        
        const response = await fetch('/api/cars', {
          method: 'POST',
          body: formDataToSend
        })
        
        if (response.ok) {
          const result = await response.json()
          console.log('Car created successfully:', result)
          alert('Car listed successfully!')
          
          // Trigger cars refresh in CarResellingSection
          window.dispatchEvent(new CustomEvent('carCreated'))
        } else {
          const errorText = await response.text()
          console.error('Error response:', errorText)
          throw new Error(`Failed to create car: ${response.status} - ${errorText}`)
        }
      } else {
        // For other actions, just show alert for now
        alert(`${action} form submitted successfully!`)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert(`Error submitting ${action}: ${error.message}`)
    }
    
    setExpandedCard(null)
    // Reset form data
    setFormData(prev => ({
      ...prev,
      [action]: Object.keys(prev[action]).reduce((acc, key) => {
        if (key === 'images') {
          acc[key] = []
        } else {
          acc[key] = ''
        }
        return acc
      }, {})
    }))
  }

  const handleImageUpload = (action, files) => {
    const currentImages = formData[action].images || []
    const remainingSlots = 5 - currentImages.length
    
    if (remainingSlots <= 0) {
      alert('Maximum 5 images allowed. Please remove some images before uploading more.')
      return
    }

    const newImages = Array.from(files).slice(0, remainingSlots).map(file => {
      if (file.type.startsWith('image/')) {
        return {
          file: file,
          preview: URL.createObjectURL(file),
          name: file.name
        }
      }
      return null
    }).filter(Boolean)

    if (newImages.length < Array.from(files).length) {
      alert(`Only ${newImages.length} images were added. Maximum 5 images allowed.`)
    }

    setFormData(prev => ({
      ...prev,
      [action]: {
        ...prev[action],
        images: [...prev[action].images, ...newImages]
      }
    }))
  }

  const removeImage = (action, index) => {
    setFormData(prev => ({
      ...prev,
      [action]: {
        ...prev[action],
        images: prev[action].images.filter((_, i) => i !== index)
      }
    }))
  }

  const addAnotherProperty = () => {
    // Reset the form to allow adding another property
    setFormData(prev => ({
      ...prev,
      hostProperty: {
        propertyType: '',
        location: '',
        priceWithRoomType: '',
        description: '',
        amenities: '',
        images: []
      }
    }))
    alert('Form cleared! You can now add another property.')
  }

  const handleEditProfile = () => {
    setShowEditModal(true)
  }

  const handleCloseModal = () => {
    setShowEditModal(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveProfile = () => {
    // Here you would typically save to backend
    console.log('Saving profile:', profileData)
    alert('Profile updated successfully!')
    setShowEditModal(false)
  }

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          profilePicture: e.target.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const renderForm = (action) => {
    const data = formData[action]
    
    switch (action) {
      case 'hostProperty':
        return (
          <div className="expanded-form">
            <h4>Host a Property</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Property Type</label>
                <select value={data.propertyType} onChange={(e) => handleFormInputChange(action, 'propertyType', e.target.value)}>
                  <option value="">Select Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="studio">Studio</option>
                </select>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" value={data.location} onChange={(e) => handleFormInputChange(action, 'location', e.target.value)} placeholder="Enter location" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Price with Room Type</label>
                <input type="text" value={data.priceWithRoomType} onChange={(e) => handleFormInputChange(action, 'priceWithRoomType', e.target.value)} placeholder="e.g., ₹15,000/month - 2BHK" />
              </div>
              <div className="form-group">
                <label>Amenities</label>
                <input type="text" value={data.amenities} onChange={(e) => handleFormInputChange(action, 'amenities', e.target.value)} placeholder="WiFi, AC, Parking, etc." />
              </div>
            </div>
            <div className="form-group">
              <label>Property Gallery ({data.images.length}/5)</label>
              <div className="image-upload-section">
                <input
                  type="file"
                  id="propertyImages"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(action, e.target.files)}
                  className="file-input"
                  style={{ display: 'none' }}
                />
                <label htmlFor="propertyImages" className="upload-gallery-btn">
                  <i className="fas fa-camera"></i>
                  Upload Images
                </label>
                <div className="image-preview-grid">
                  {data.images.map((image, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={image.preview} alt={`Property ${index + 1}`} />
                      <button 
                        type="button" 
                        className="remove-image-btn"
                        onClick={() => removeImage(action, index)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={data.description} onChange={(e) => handleFormInputChange(action, 'description', e.target.value)} placeholder="Describe your property" rows="3"></textarea>
            </div>
          </div>
        )
      
      case 'launchEvents':
        return (
          <div className="expanded-form">
            <h4>Launch Events</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Event Name</label>
                <input type="text" value={data.eventName} onChange={(e) => handleFormInputChange(action, 'eventName', e.target.value)} placeholder="Enter event name" />
              </div>
              <div className="form-group">
                <label>Event Date</label>
                <input type="date" value={data.eventDate} onChange={(e) => handleFormInputChange(action, 'eventDate', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Event Time</label>
                <input type="time" value={data.eventTime} onChange={(e) => handleFormInputChange(action, 'eventTime', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" value={data.location} onChange={(e) => handleFormInputChange(action, 'location', e.target.value)} placeholder="Enter venue" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Ticket Price (₹)</label>
                <input type="number" value={data.ticketPrice} onChange={(e) => handleFormInputChange(action, 'ticketPrice', e.target.value)} placeholder="Enter ticket price" />
              </div>
            </div>
            <div className="form-group">
              <label>Event Gallery ({data.images.length}/5)</label>
              <div className="image-upload-section">
                <input
                  type="file"
                  id="eventImages"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(action, e.target.files)}
                  className="file-input"
                  style={{ display: 'none' }}
                />
                <label htmlFor="eventImages" className="upload-gallery-btn">
                  <i className="fas fa-camera"></i>
                  Upload Images
                </label>
                <div className="image-preview-grid">
                  {data.images.map((image, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={image.preview} alt={`Event ${index + 1}`} />
                      <button 
                        type="button" 
                        className="remove-image-btn"
                        onClick={() => removeImage(action, index)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={data.description} onChange={(e) => handleFormInputChange(action, 'description', e.target.value)} placeholder="Describe your event" rows="3"></textarea>
            </div>
          </div>
        )
      
      case 'hostLandProperty':
        return (
          <div className="expanded-form">
            <h4>Host a Land Property</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Land Type</label>
                <select value={data.landType} onChange={(e) => handleFormInputChange(action, 'landType', e.target.value)}>
                  <option value="">Select Type</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="agricultural">Agricultural</option>
                  <option value="industrial">Industrial</option>
                </select>
              </div>
              <div className="form-group">
                <label>Area (sq ft)</label>
                <input type="number" value={data.area} onChange={(e) => handleFormInputChange(action, 'area', e.target.value)} placeholder="Enter area" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Location</label>
                <input type="text" value={data.location} onChange={(e) => handleFormInputChange(action, 'location', e.target.value)} placeholder="Enter location" />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input type="number" value={data.price} onChange={(e) => handleFormInputChange(action, 'price', e.target.value)} placeholder="Enter price" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Purpose</label>
                <input type="text" value={data.purpose} onChange={(e) => handleFormInputChange(action, 'purpose', e.target.value)} placeholder="Sale, Lease, etc." />
              </div>
            </div>
            <div className="form-group">
              <label>Land Gallery ({data.images.length}/5)</label>
              <div className="image-upload-section">
                <input
                  type="file"
                  id="landImages"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(action, e.target.files)}
                  className="file-input"
                  style={{ display: 'none' }}
                />
                <label htmlFor="landImages" className="upload-gallery-btn">
                  <i className="fas fa-camera"></i>
                  Upload Images
                </label>
                <div className="image-preview-grid">
                  {data.images.map((image, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={image.preview} alt={`Land ${index + 1}`} />
                      <button 
                        type="button" 
                        className="remove-image-btn"
                        onClick={() => removeImage(action, index)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={data.description} onChange={(e) => handleFormInputChange(action, 'description', e.target.value)} placeholder="Describe your land" rows="3"></textarea>
            </div>
          </div>
        )
      
      case 'addProducts':
        return (
          <div className="expanded-form">
            <h4>Add Products</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" value={data.productName} onChange={(e) => handleFormInputChange(action, 'productName', e.target.value)} placeholder="Enter product name" />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={data.category} onChange={(e) => handleFormInputChange(action, 'category', e.target.value)}>
                  <option value="">Select Category</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="home">Home & Garden</option>
                  <option value="sports">Sports</option>
                  <option value="books">Books</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Price (₹)</label>
                <input type="number" value={data.price} onChange={(e) => handleFormInputChange(action, 'price', e.target.value)} placeholder="Enter price" />
              </div>
              <div className="form-group">
                <label>Stock Quantity</label>
                <input type="number" value={data.stock} onChange={(e) => handleFormInputChange(action, 'stock', e.target.value)} placeholder="Enter stock" />
              </div>
            </div>
            <div className="form-group">
              <label>Product Gallery ({data.images.length}/5)</label>
              <div className="image-upload-section">
                <input
                  type="file"
                  id="productImages"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(action, e.target.files)}
                  className="file-input"
                  style={{ display: 'none' }}
                />
                <label htmlFor="productImages" className="upload-gallery-btn">
                  <i className="fas fa-camera"></i>
                  Upload Images
                </label>
                <div className="image-preview-grid">
                  {data.images.map((image, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={image.preview} alt={`Product ${index + 1}`} />
                      <button 
                        type="button" 
                        className="remove-image-btn"
                        onClick={() => removeImage(action, index)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={data.description} onChange={(e) => handleFormInputChange(action, 'description', e.target.value)} placeholder="Describe your product" rows="3"></textarea>
            </div>
          </div>
        )
      
      case 'listPackageTrip':
        return (
          <div className="expanded-form">
            <h4>List Package/Trip</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Package Name</label>
                <input type="text" value={data.packageName} onChange={(e) => handleFormInputChange(action, 'packageName', e.target.value)} placeholder="Enter package name" />
              </div>
              <div className="form-group">
                <label>Destination</label>
                <input type="text" value={data.destination} onChange={(e) => handleFormInputChange(action, 'destination', e.target.value)} placeholder="Enter destination" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Duration (days)</label>
                <input type="number" value={data.duration} onChange={(e) => handleFormInputChange(action, 'duration', e.target.value)} placeholder="Enter duration" />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input type="number" value={data.price} onChange={(e) => handleFormInputChange(action, 'price', e.target.value)} placeholder="Enter price" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" value={data.startDate} onChange={(e) => handleFormInputChange(action, 'startDate', e.target.value)} />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input type="date" value={data.endDate} onChange={(e) => handleFormInputChange(action, 'endDate', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Max People</label>
                <input type="number" value={data.maxPeople} onChange={(e) => handleFormInputChange(action, 'maxPeople', e.target.value)} placeholder="Enter max people" />
              </div>
              <div className="form-group">
                <label>Inclusions</label>
                <input type="text" value={data.inclusions} onChange={(e) => handleFormInputChange(action, 'inclusions', e.target.value)} placeholder="Hotel, Meals, Transport, etc." />
              </div>
            </div>
            <div className="form-group">
              <label>Package Gallery ({data.images.length}/5)</label>
              <div className="image-upload-section">
                <input
                  type="file"
                  id="packageImages"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(action, e.target.files)}
                  className="file-input"
                  style={{ display: 'none' }}
                />
                <label htmlFor="packageImages" className="upload-gallery-btn">
                  <i className="fas fa-camera"></i>
                  Upload Images
                </label>
                <div className="image-preview-grid">
                  {data.images.map((image, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={image.preview} alt={`Package ${index + 1}`} />
                      <button 
                        type="button" 
                        className="remove-image-btn"
                        onClick={() => removeImage(action, index)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={data.description} onChange={(e) => handleFormInputChange(action, 'description', e.target.value)} placeholder="Describe your package/trip" rows="3"></textarea>
            </div>
          </div>
        )
      
      case 'carReselling':
        return (
          <div className="expanded-form">
            <h4>Car Reselling</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Car Model</label>
                <input type="text" value={data.carModel} onChange={(e) => handleFormInputChange(action, 'carModel', e.target.value)} placeholder="Enter car model" />
              </div>
              <div className="form-group">
                <label>Year</label>
                <input type="number" value={data.year} onChange={(e) => handleFormInputChange(action, 'year', e.target.value)} placeholder="Enter year" min="1990" max="2024" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Mileage (km)</label>
                <input type="number" value={data.mileage} onChange={(e) => handleFormInputChange(action, 'mileage', e.target.value)} placeholder="Enter mileage" />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input type="number" value={data.price} onChange={(e) => handleFormInputChange(action, 'price', e.target.value)} placeholder="Enter price" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Location</label>
                <input type="text" value={data.location} onChange={(e) => handleFormInputChange(action, 'location', e.target.value)} placeholder="Enter location" />
              </div>
              <div className="form-group">
                <label>Fuel Type</label>
                <select value={data.fuelType} onChange={(e) => handleFormInputChange(action, 'fuelType', e.target.value)}>
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
                <label>Transmission</label>
                <select value={data.transmission} onChange={(e) => handleFormInputChange(action, 'transmission', e.target.value)}>
                  <option value="">Select Transmission</option>
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                  <option value="cvt">CVT</option>
                </select>
              </div>
              <div className="form-group">
                <label>Condition</label>
                <select value={data.condition} onChange={(e) => handleFormInputChange(action, 'condition', e.target.value)}>
                  <option value="">Select Condition</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Car Gallery ({data.images.length}/5)</label>
              <div className="image-upload-section">
                <input
                  type="file"
                  id="carImages"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(action, e.target.files)}
                  className="file-input"
                  style={{ display: 'none' }}
                />
                <label htmlFor="carImages" className="upload-gallery-btn">
                  <i className="fas fa-camera"></i>
                  Upload Images
                </label>
                <div className="image-preview-grid">
                  {data.images.map((image, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={image.preview} alt={`Car ${index + 1}`} />
                      <button 
                        type="button" 
                        className="remove-image-btn"
                        onClick={() => removeImage(action, index)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={data.description} onChange={(e) => handleFormInputChange(action, 'description', e.target.value)} placeholder="Describe your car" rows="3"></textarea>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }



  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: white;
          border-bottom: 1px solid #e5e7eb;
        }
        .dashboard-logo-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .dashboard-auth-section {
          display: flex;
          align-items: center;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
      <header className="dashboard-header">
        <div className="dashboard-logo-section">
          <img src="/image.jpg.jpg" alt="Startup Village County Logo" className="dashboard-logo" />
          <h1 className="dashboard-title">Dashboard</h1>
        </div>
        
        <div className="dashboard-auth-section">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                Welcome, {user.name}
              </span>
              <button 
                onClick={handleLogout}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button 
                onClick={() => setShowLoginModal(true)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'transparent',
                  color: '#22c55e',
                  border: '1px solid #22c55e',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Login
              </button>
              <button 
                onClick={() => setShowSignupModal(true)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#22c55e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-layout">
          {/* Left Sidebar - Profile Section */}
          <div className="dashboard-sidebar">
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-picture">
                  <img src={user ? profileData.profilePicture : "/image.jpg.jpg"} alt="Profile" className="profile-img" />
                  <div className="profile-status">
                    <span className="status-dot"></span>
                    <span className="status-text">{user ? "Online" : "Offline"}</span>
                  </div>
                </div>
                <div className="profile-info">
                  <h3 className="profile-name">{user ? profileData.name : "Guest User"}</h3>
                  <p className="profile-email">{user ? profileData.email : "guest@example.com"}</p>
                  <p className="profile-phone">{user ? profileData.phone : "+91 00000 00000"}</p>
                </div>
              </div>
              
              <div className="profile-details">
                <div className="detail-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{user ? profileData.location : "Location not set"}</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-calendar"></i>
                  <span>{user ? `Member since ${profileData.memberSince}` : "Not a member yet"}</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-star"></i>
                  <span>{user ? `${profileData.rating} Rating` : "No rating yet"}</span>
                </div>
              </div>

              {user ? (
                <div className="verification-section">
                  <h4 className="verification-title">Identity Verification</h4>
                  <div className="verification-status">
                    <div className="verification-item verified">
                      <i className="fas fa-check-circle"></i>
                      <span>Email Verified</span>
                    </div>
                    <div className="verification-item pending">
                      <i className="fas fa-clock"></i>
                      <span>Phone Pending</span>
                    </div>
                    <div className="verification-item not-verified">
                      <i className="fas fa-times-circle"></i>
                      <span>ID Not Verified</span>
                    </div>
                  </div>
                  <button className="verify-btn">
                    <i className="fas fa-shield-alt"></i>
                    Verify Identity
                  </button>
                </div>
              ) : (
                <div className="verification-section">
                  <h4 className="verification-title">Sign Up Required</h4>
                  <div className="verification-status">
                    <div className="verification-item not-verified">
                      <i className="fas fa-times-circle"></i>
                      <span>Not Signed Up</span>
                    </div>
                    <div className="verification-item not-verified">
                      <i className="fas fa-times-circle"></i>
                      <span>No Profile</span>
                    </div>
                    <div className="verification-item not-verified">
                      <i className="fas fa-times-circle"></i>
                      <span>No Verification</span>
                    </div>
                  </div>
                  <button 
                    className="verify-btn"
                    onClick={() => setShowSignupModal(true)}
                  >
                    <i className="fas fa-user-plus"></i>
                    Sign Up Now
                  </button>
                </div>
              )}

              {user && (
                <div className="profile-actions">
                  <button className="profile-action-btn" onClick={handleEditProfile}>
                    <i className="fas fa-edit"></i>
                    Edit Profile
                  </button>
                  <button className="profile-action-btn">
                    <i className="fas fa-cog"></i>
                    Settings
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="dashboard-main">
            <div className="dashboard-actions">
          <div className={`action-card ${expandedCard === 'hostProperty' ? 'expanded' : ''}`}>
            <div className="action-header" onClick={() => handleAction('hostProperty')}>
            <div className="action-icon">
              <i className="fas fa-home"></i>
            </div>
            <div className="action-content">
              <h3 className="action-title">Host a Property</h3>
              </div>
              <button className="action-btn">{expandedCard === 'hostProperty' ? 'Close' : 'Get Started'}</button>
            </div>
                        {expandedCard === 'hostProperty' && (
              <div className="action-form">
                {renderForm('hostProperty')}
                <div className="form-actions">
                  <button className="form-btn cancel-btn" onClick={() => setExpandedCard(null)}>Cancel</button>
                  <button className="form-btn add-another-btn" onClick={addAnotherProperty}>
                    <i className="fas fa-plus"></i>
                    Add Another Property
                  </button>
                  <button className="form-btn submit-btn" onClick={() => handleSubmitForm('hostProperty')}>Submit</button>
                </div>
            </div>
            )}
          </div>

          <div className={`action-card ${expandedCard === 'launchEvents' ? 'expanded' : ''}`}>
            <div className="action-header" onClick={() => handleAction('launchEvents')}>
            <div className="action-icon">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <div className="action-content">
              <h3 className="action-title">Launch Events</h3>
              </div>
              <button className="action-btn">{expandedCard === 'launchEvents' ? 'Close' : 'Create Event'}</button>
            </div>
            {expandedCard === 'launchEvents' && (
              <div className="action-form">
                {renderForm('launchEvents')}
                <div className="form-actions">
                  <button className="form-btn cancel-btn" onClick={() => setExpandedCard(null)}>Cancel</button>
                  <button className="form-btn submit-btn" onClick={() => handleSubmitForm('launchEvents')}>Submit</button>
                </div>
            </div>
            )}
          </div>

          <div className={`action-card ${expandedCard === 'hostLandProperty' ? 'expanded' : ''}`}>
            <div className="action-header" onClick={() => handleAction('hostLandProperty')}>
            <div className="action-icon">
              <i className="fas fa-map-marked-alt"></i>
            </div>
            <div className="action-content">
              <h3 className="action-title">Host a Land Property</h3>
              </div>
              <button className="action-btn">{expandedCard === 'hostLandProperty' ? 'Close' : 'List Land'}</button>
            </div>
            {expandedCard === 'hostLandProperty' && (
              <div className="action-form">
                {renderForm('hostLandProperty')}
                <div className="form-actions">
                  <button className="form-btn cancel-btn" onClick={() => setExpandedCard(null)}>Cancel</button>
                  <button className="form-btn submit-btn" onClick={() => handleSubmitForm('hostLandProperty')}>Submit</button>
                </div>
            </div>
            )}
          </div>

          <div className={`action-card ${expandedCard === 'addProducts' ? 'expanded' : ''}`}>
            <div className="action-header" onClick={() => handleAction('addProducts')}>
            <div className="action-icon">
              <i className="fas fa-plus-circle"></i>
            </div>
            <div className="action-content">
              <h3 className="action-title">Add Products</h3>
              </div>
              <button className="action-btn">{expandedCard === 'addProducts' ? 'Close' : 'Add Product'}</button>
            </div>
            {expandedCard === 'addProducts' && (
              <div className="action-form">
                {renderForm('addProducts')}
                <div className="form-actions">
                  <button className="form-btn cancel-btn" onClick={() => setExpandedCard(null)}>Cancel</button>
                  <button className="form-btn submit-btn" onClick={() => handleSubmitForm('addProducts')}>Submit</button>
                </div>
              </div>
            )}
          </div>

          <div className={`action-card ${expandedCard === 'listPackageTrip' ? 'expanded' : ''}`}>
            <div className="action-header" onClick={() => handleAction('listPackageTrip')}>
              <div className="action-icon">
                <i className="fas fa-suitcase"></i>
              </div>
              <div className="action-content">
                <h3 className="action-title">List Package/Trip</h3>
              </div>
              <button className="action-btn">{expandedCard === 'listPackageTrip' ? 'Close' : 'List Package'}</button>
            </div>
            {expandedCard === 'listPackageTrip' && (
              <div className="action-form">
                {renderForm('listPackageTrip')}
                <div className="form-actions">
                  <button className="form-btn cancel-btn" onClick={() => setExpandedCard(null)}>Cancel</button>
                  <button className="form-btn submit-btn" onClick={() => handleSubmitForm('listPackageTrip')}>Submit</button>
                </div>
              </div>
            )}
          </div>

          <div className={`action-card ${expandedCard === 'carReselling' ? 'expanded' : ''}`}>
            <div className="action-header" onClick={() => handleAction('carReselling')}>
              <div className="action-icon">
                <i className="fas fa-car"></i>
              </div>
              <div className="action-content">
                <h3 className="action-title">Car Reselling</h3>
              </div>
              <button className="action-btn">{expandedCard === 'carReselling' ? 'Close' : 'Sell Car'}</button>
            </div>
            {expandedCard === 'carReselling' && (
              <div className="action-form">
                {renderForm('carReselling')}
                <div className="form-actions">
                  <button className="form-btn cancel-btn" onClick={() => setExpandedCard(null)}>Cancel</button>
                  <button className="form-btn submit-btn" onClick={() => handleSubmitForm('carReselling')}>Submit</button>
                </div>
            </div>
            )}
          </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Profile</h3>
              <button className="modal-close" onClick={handleCloseModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              {/* Profile Picture Upload Section */}
              <div className="profile-picture-upload">
                <div className="current-picture">
                  <img src={profileData.profilePicture} alt="Current Profile" className="preview-img" />
                </div>
                <div className="upload-section">
                  <input
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    className="file-input"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="profilePicture" className="upload-btn">
                    <i className="fas fa-camera"></i>
                    Change Photo
                  </label>
                  <p className="upload-hint">JPG, PNG or GIF. Max size 5MB</p>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={profileData.location}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="memberSince">Member Since</label>
                <input
                  type="text"
                  id="memberSince"
                  name="memberSince"
                  value={profileData.memberSince}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="rating">Rating</label>
                <input
                  type="text"
                  id="rating"
                  name="rating"
                  value={profileData.rating}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="modal-btn cancel-btn" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="modal-btn save-btn" onClick={handleSaveProfile}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginForm
          onClose={() => setShowLoginModal(false)}
          onSuccess={(userData) => {
            setUser(userData)
            setShowLoginModal(false)
          }}
        />
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <SignupForm
          onClose={() => setShowSignupModal(false)}
          onSuccess={(message) => {
            alert(message)
            setShowSignupModal(false)
          }}
        />
      )}

      {/* Authentication Required Popup */}
      {showAuthPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            animation: 'slideIn 0.3s ease-out'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#fef3c7',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <i className="fas fa-lock" style={{ fontSize: '24px', color: '#f59e0b' }}></i>
            </div>
            
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '0.5rem'
            }}>
              Authentication Required
            </h3>
            
            <p style={{
              fontSize: '1rem',
              color: '#6b7280',
              marginBottom: '2rem',
              lineHeight: '1.5'
            }}>
              You need to sign up or log in to your account to access this feature. Create your account to start hosting properties, launching events, and more!
            </p>
            
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => {
                  setShowAuthPopup(false)
                  setShowLoginModal(true)
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'transparent',
                  color: '#22c55e',
                  border: '2px solid #22c55e',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#22c55e'
                  e.target.style.color = 'white'
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.color = '#22c55e'
                }}
              >
                Login
              </button>
              
              <button
                onClick={() => {
                  setShowAuthPopup(false)
                  setShowSignupModal(true)
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#22c55e',
                  color: 'white',
                  border: '2px solid #22c55e',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#16a34a'
                  e.target.style.borderColor = '#16a34a'
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#22c55e'
                  e.target.style.borderColor = '#22c55e'
                }}
              >
                Sign Up
              </button>
            </div>
            
            <button
              onClick={() => setShowAuthPopup(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                color: '#9ca3af',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                lineHeight: '1'
              }}
              onMouseOver={(e) => {
                e.target.style.color = '#6b7280'
                e.target.style.backgroundColor = '#f3f4f6'
              }}
              onMouseOut={(e) => {
                e.target.style.color = '#9ca3af'
                e.target.style.backgroundColor = 'transparent'
              }}
              title="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
