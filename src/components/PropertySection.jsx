import React, { useState, useEffect } from 'react'
import axios from 'axios'

const PropertySection = () => {
  const [properties, setProperties] = useState([
    {
      id: 1,
      price: "₹1.15 Crores",
      area: "1,500 sqft",
      pricePerSqft: "₹7,666",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 2,
      price: "₹1.15 Crores",
      area: "1,500 sqft",
      pricePerSqft: "₹7,666",
      image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 3,
      price: "₹1.8 Crores",
      area: "2,000 sqft",
      pricePerSqft: "₹9,000",
      image: "https://images.unsplash.com/photo-1506905925346-14b1e3dba9b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 4,
      price: "₹2.5 Crores",
      area: "2,200 sqft",
      pricePerSqft: "₹11,363",
      image: "https://images.unsplash.com/photo-1506905925346-14b1e3dba9b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 5,
      price: "₹85 Lakhs",
      area: "1,800 sqft",
      pricePerSqft: "₹4,722",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    }
  ])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Properties are already set in initial state
    console.log('PropertySection: Properties loaded with', properties.length, 'items')
  }, [])

  const goToPage = (pageIndex) => {
    setCurrentIndex(pageIndex)
  }

  const buyProperty = (property) => {
    alert(`Interested in: ${property.name}\nPrice: ${property.price}\nArea: ${property.area}`)
  }

  const totalPages = Math.ceil(properties.length / 2)

  if (loading) {
    return (
      <div className="property-section">
        <div className="property-header">
          <h3 className="property-title">Buy & SELL / lease → Property</h3>
        </div>
        <div className="property-container">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        </div>
      </div>
    )
  }

  console.log('PropertySection: Rendering with', properties.length, 'properties, loading:', loading)
  
  return (
    <div className="property-section" style={{ display: 'block', visibility: 'visible', margin: '0', padding: '0' }}>
      <div className="property-header">
        <h3 className="property-title" style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: 'bold' }}>Buy & SELL / lease → Property</h3>
        <div className="property-location-buttons">
          {['Wayanad', 'Shakaleshwara', 'Hassan', 'Coorg', 'Mysore', 'Chikmagalore', 'BR Hills', 'Shivana Samudra', 'Bandipur'].map((location, index) => (
            <button key={index} className="property-location-btn">
              {location}
            </button>
          ))}
        </div>
      </div>
      
      <div className="property-container" style={{ padding: '0', margin: '0' }}>
        <div className="property-scroll" id="property-scroll" style={{ gap: '0', padding: '0', margin: '0' }}>
          {properties.map((property) => (
            <div key={property.id} className="property-card" style={{ backgroundColor: 'white', padding: '4px', borderRadius: '4px', margin: '0' }}>
              <div className="property-content">
                <img
                  src={property.image}
                  alt={property.name}
                  className="property-image"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
                <div className="property-details" style={{ backgroundColor: 'white', padding: '2px', borderRadius: '2px', marginTop: '1px' }}>
                  <div className="property-price" style={{ marginBottom: '0px', fontSize: '0.7rem', lineHeight: '1.0' }}>{property.price}</div>
                  <div style={{ fontSize: '0.6rem', color: '#666', marginBottom: '0' }}>{property.area} • {property.pricePerSqft}</div>
                </div>
              </div>
              <button
                className="buy-now-btn"
                onClick={() => buyProperty(property)}
                style={{ 
                  padding: '2px 6px', 
                  fontSize: '0.7rem', 
                  marginTop: '2px',
                  borderRadius: '2px',
                  border: 'none',
                  backgroundColor: '#22c55e',
                  color: 'white',
                  width: '100%'
                }}
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
        
        <div className="property-navigation-dots" id="property-navigation-dots">
          {Array.from({ length: totalPages }, (_, i) => (
            <div
              key={i}
              className={`property-dot ${i === currentIndex ? 'active' : ''}`}
              onClick={() => goToPage(i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PropertySection
