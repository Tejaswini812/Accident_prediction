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
    // Always use fallback data for now
    console.log('Using fallback hotel data')
    const fallbackHotels = [
      {
        id: 1,
        name: "Sunset Retreat",
        location: "Goa",
        type: "Cottage",
        price: 2500,
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&h=300&fit=crop"
      },
      {
        id: 2,
        name: "Ocean Breeze",
        location: "Goa",
        type: "Tent",
        price: 1500,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop"
      },
      {
        id: 3,
        name: "Mountain Escape",
        location: "Coorg",
        type: "Luxury Room",
        price: 5000,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop"
      },
      {
        id: 4,
        name: "Green Valley Stay",
        location: "Coorg",
        type: "Hostel Bed",
        price: 900,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&h=300&fit=crop"
      },
      {
        id: 5,
        name: "City Comfort Inn",
        location: "Bangalore",
        type: "Normal Room",
        price: 2200,
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&h=300&fit=crop"
      },
      {
        id: 6,
        name: "Riverside Resort",
        location: "Mysore",
        type: "Villa",
        price: 4500,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop"
      }
    ]
    console.log('Setting hotels:', fallbackHotels)
    setHotels(fallbackHotels)
    setLoading(false)
  }

  const goToPage = (pageIndex) => {
    setCurrentIndex(pageIndex)
  }

  const viewHotelDetails = (hotel) => {
    alert(`Hotel: ${hotel.name}\nLocation: ${hotel.location}\nType: ${hotel.type}\nPrice: ₹${hotel.price}/night`)
  }

  const totalPages = Math.ceil(hotels.length / 2)

  console.log('BookingSection render - hotels:', hotels, 'loading:', loading, 'totalPages:', totalPages)

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
      <h2 className="rooms-title">Find Your Stay</h2>
      <div className="rooms-section">
        <div className="hotels-grid" id="hotels-grid">
          {hotels.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
              No hotels available
            </div>
          ) : (
            hotels.map((hotel) => (
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
                  <div className="hotel-details">
                    <div className="hotel-name">{hotel.name}</div>
                    <div className="hotel-location">{hotel.location} • {hotel.type}</div>
                    <div className="hotel-price">₹{String(hotel.price).replace(/[₹/night]/g, '')}/night</div>
                  </div>
                </div>
                <button
                  className="view-details-btn"
                  onClick={() => viewHotelDetails(hotel)}
                >
                  View Details
                </button>
              </div>
            ))
          )}
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
