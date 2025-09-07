import React, { useState, useEffect } from 'react'
import axios from 'axios'

const PropertySection = () => {
  const [properties, setProperties] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      // Fetch both properties and land properties
      const [propertiesResponse, landPropertiesResponse] = await Promise.all([
        axios.get('/api/properties'),
        axios.get('/api/land-properties')
      ])
      
      console.log('Properties API response:', propertiesResponse.data)
      console.log('Land Properties API response:', landPropertiesResponse.data)
      
      // Transform properties data
      const transformedProperties = propertiesResponse.data?.map(property => ({
        id: property._id,
        name: property.title,
        price: `₹${(property.price / 100000).toFixed(2)} ${property.price >= 10000000 ? 'Crores' : 'Lakhs'}`,
        area: `${property.area} sqft`,
        pricePerSqft: `₹${Math.round(property.price / property.area).toLocaleString()}`,
        image: property.images?.[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        location: property.location || 'Location',
        type: property.propertyType
      })) || []
      
      // Transform land properties data
      const transformedLandProperties = landPropertiesResponse.data?.map(landProperty => ({
        id: `land_${landProperty._id}`,
        name: landProperty.title,
        price: `₹${(landProperty.price / 100000).toFixed(2)} ${landProperty.price >= 10000000 ? 'Crores' : 'Lakhs'}`,
        area: `${landProperty.area} ${landProperty.unit}`,
        pricePerSqft: `₹${Math.round(landProperty.price / landProperty.area).toLocaleString()}`,
        image: landProperty.images?.[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        location: landProperty.location || 'Location',
        type: landProperty.landType
      })) || []
      
      // Combine both types of properties
      const allProperties = [...transformedProperties, ...transformedLandProperties]
      
      // Check if API returned empty array, use fallback data
      if (allProperties.length === 0) {
        console.log('API returned empty array, using fallback data')
        setProperties([
          {
            id: 1,
            name: "Luxury Villa",
            price: "₹1.15 Crores",
            area: "1,500 sqft",
            pricePerSqft: "₹7,666",
            image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
          },
          {
            id: 2,
            name: "Modern Apartment",
            price: "₹1.15 Crores",
            area: "1,500 sqft",
            pricePerSqft: "₹7,666",
            image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
          },
          {
            id: 3,
            name: "Premium House",
            price: "₹1.8 Crores",
            area: "2,000 sqft",
            pricePerSqft: "₹9,000",
            image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
          },
          {
            id: 4,
            name: "Executive Villa",
            price: "₹2.5 Crores",
            area: "2,200 sqft",
            pricePerSqft: "₹11,363",
            image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
          },
          {
            id: 5,
            name: "Cozy Home",
            price: "₹85 Lakhs",
            area: "1,800 sqft",
            pricePerSqft: "₹4,722",
            image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
          }
        ])
      } else {
        setProperties(allProperties)
      }
    } catch (error) {
      console.log('API not available, using fallback data')
      // Fallback to static data if API fails
      setProperties([
        {
          id: 1,
          name: "Luxury Villa",
          price: "₹1.15 Crores",
          area: "1,500 sqft",
          pricePerSqft: "₹7,666",
          image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 2,
          name: "Modern Apartment",
          price: "₹1.15 Crores",
          area: "1,500 sqft",
          pricePerSqft: "₹7,666",
          image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 3,
          name: "Premium House",
          price: "₹1.8 Crores",
          area: "2,000 sqft",
          pricePerSqft: "₹9,000",
          image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 4,
          name: "Executive Villa",
          price: "₹2.5 Crores",
          area: "2,200 sqft",
          pricePerSqft: "₹11,363",
          image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 5,
          name: "Cozy Home",
          price: "₹85 Lakhs",
          area: "1,800 sqft",
          pricePerSqft: "₹4,722",
          image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        }
      ])
    } finally {
      setLoading(false)
    }
  }

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
            <div key={property.id} className="property-card">
              <div className="property-content">
                <img
                  src={property.image}
                  alt={property.name}
                  className="property-image"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
                <div className="property-details">
                  <div className="property-name">{property.name}</div>
                  <div className="property-price">{property.price}</div>
                  <div className="property-area">{property.area} • {property.pricePerSqft}</div>
                </div>
              </div>
              <button
                className="buy-now-btn"
                onClick={() => buyProperty(property)}
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
