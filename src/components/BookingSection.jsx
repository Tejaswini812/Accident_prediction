import React, { useState, useEffect } from 'react'
import axios from 'axios'

const BookingSection = () => {
  const [hotels, setHotels] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHotels()
  }, [])

  const fetchHotels = async () => {
    try {
      const response = await axios.get('/api/hotels')
      setHotels(response.data.data || [])
    } catch (error) {
      console.log('API not available, using fallback data')
      // Fallback to static data if API fails
      setHotels([
        {
          id: 1,
          name: "Sunset Retreat",
          location: "Goa",
          type: "Cottage",
          price: 2500,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 2,
          name: "Ocean Breeze",
          location: "Goa",
          type: "Tent",
          price: 1500,
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 3,
          name: "Mountain Escape",
          location: "Coorg",
          type: "Luxury Room",
          price: 5000,
          image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 4,
          name: "Green Valley Stay",
          location: "Coorg",
          type: "Hostel Bed",
          price: 900,
          image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 5,
          name: "City Comfort Inn",
          location: "Bangalore",
          type: "Normal Room",
          price: 2200,
          image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 6,
          name: "Riverside Resort",
          location: "Mysore",
          type: "Villa",
          price: 4500,
          image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const goToPage = (pageIndex) => {
    setCurrentIndex(pageIndex)
  }

  const viewHotelDetails = (hotel) => {
    alert(`Hotel: ${hotel.name}\nLocation: ${hotel.location}\nType: ${hotel.type}\nPrice: ₹${hotel.price}/night`)
  }

  const totalPages = Math.ceil(hotels.length / 2)

  if (loading) {
    return (
      <div className="booking-section" id="select-your-stays">
        <div className="rooms-section">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="booking-section" id="select-your-stays">
      <div className="rooms-section">
        <h2 style={{ textAlign: 'left', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem', color: '#1e293b' }}>Find Your Stay</h2>
        <div className="hotels-grid" id="hotels-grid">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="hotel-card">
              <div className="hotel-content">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="hotel-image"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
                <div className="hotel-details" style={{ backgroundColor: 'white', padding: '4px', borderRadius: '4px', marginTop: '2px' }}>
                  <div className="hotel-name" style={{ marginBottom: '1px', fontSize: '0.85rem', lineHeight: '1.2' }}>{hotel.name}</div>
                  <div className="hotel-location" style={{ marginBottom: '1px', fontSize: '0.7rem', lineHeight: '1.1' }}>{hotel.location} • {hotel.type}</div>
                  <div className="hotel-price" style={{ fontWeight: 'normal', fontSize: '0.75rem', marginBottom: '0', lineHeight: '1.1' }}>₹{String(hotel.price).replace(/[₹/night]/g, '')}/night</div>
                </div>
              </div>
              <button
                className="view-details-btn"
                onClick={() => viewHotelDetails(hotel)}
                style={{
                  background: '#22c55e',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.8rem',
                  width: '100%',
                  marginTop: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
        
        <div className="hotel-navigation-dots" id="hotel-navigation-dots">
          {Array.from({ length: totalPages }, (_, i) => (
            <div
              key={i}
              className={`hotel-dot ${i === currentIndex ? 'active' : ''}`}
              onClick={() => goToPage(i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BookingSection
