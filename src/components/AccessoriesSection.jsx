import React, { useState, useEffect } from 'react'
import axios from 'axios'

const AccessoriesSection = () => {
  const [accessories, setAccessories] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAccessories()
  }, [])

  const fetchAccessories = async () => {
    try {
      const response = await axios.get('/api/accessories')
      setAccessories(response.data.data || [])
    } catch (error) {
      console.log('API not available, using fallback data')
      // Fallback to static data
      setAccessories([
        {
          id: 1,
          name: "Shakti Technology High Pressure Washer",
          price: "₹199",
          description: "Best seller - High pressure car washer with accessories",
          image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 2,
          name: "Shrida Naturals Lemon & Orange Air Freshener",
          price: "₹199",
          description: "Fresh scent lasting up to 45 days, 60g net content",
          image: "https://images.unsplash.com/photo-1603314585442-ee3b3c16fbcf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 3,
          name: "Premium Car Phone Mount",
          price: "₹450",
          description: "Universal dashboard phone holder with suction cup",
          image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 4,
          name: "LED Headlight Bulbs Set",
          price: "₹1,200",
          description: "Bright white LED bulbs for better night visibility",
          image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 5,
          name: "Leather Steering Wheel Cover",
          price: "₹650",
          description: "Comfortable leather grip cover with anti-slip design",
          image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 6,
          name: "Premium Car Floor Mats",
          price: "₹1,500",
          description: "Heavy-duty rubber floor protection with anti-slip",
          image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 7,
          name: "Motorcycle Helmet",
          price: "₹2,500",
          description: "Full face safety helmet with visor",
          image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 8,
          name: "Car Battery Charger",
          price: "₹3,200",
          description: "12V automatic battery charger for cars",
          image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 9,
          name: "Bike Chain Lubricant",
          price: "₹350",
          description: "High performance motorcycle chain oil",
          image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 10,
          name: "Car Air Filter",
          price: "₹800",
          description: "High flow air filter for better engine performance",
          image: "https://images.unsplash.com/photo-1603314585442-ee3b3c16fbcf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const goToPage = (pageIndex) => {
    setCurrentIndex(pageIndex)
  }

  const buyAccessory = (accessory) => {
    alert(`Added to cart: ${accessory.name}\nPrice: ${accessory.price}`)
  }

  const totalPages = Math.ceil(accessories.length / 3)

  if (loading) {
    return (
      <div className="accessories-section">
        <div className="accessories-header">
          <h3 className="accessories-title">Source From our online stores</h3>

        </div>
        <div className="accessories-container">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="accessories-section">
      <div className="accessories-header">
        <h3 className="accessories-title">Source From our online stores</h3>
        
      </div>
      
      <div className="accessories-container" style={{ margin: '0', padding: '0' }}>
        <div className="accessories-grid" id="accessories-grid" style={{ gap: '0', margin: '0', padding: '0' }}>
          {accessories.map((accessory) => (
            <div key={accessory.id} className="accessory-card" style={{ borderRadius: '0', margin: '0' }}>
              <div className="accessory-content">
                <img
                  src={accessory.image}
                  alt={accessory.name}
                  className="accessory-image"
                  style={{ borderRadius: '0' }}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjhhNzQ1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg=='
                  }}
                />
                <div className="accessory-name" style={{ fontSize: '0.7rem', lineHeight: '1.0' }}>{accessory.name}</div>
                <div className="accessory-price" style={{ fontSize: '0.6rem', color: '#666' }}>{accessory.price}</div>
              </div>
              <button
                className="buy-now-btn"
                onClick={() => buyAccessory(accessory)}
                style={{ 
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: '#22c55e',
                  color: 'white',
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  width: '100%'
                }}
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
        
        <div className="accessories-navigation-dots" id="accessories-navigation-dots">
          {Array.from({ length: totalPages }, (_, i) => (
            <div
              key={i}
              className={`accessory-dot ${i === currentIndex ? 'active' : ''}`}
              onClick={() => goToPage(i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AccessoriesSection
