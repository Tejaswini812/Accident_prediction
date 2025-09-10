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
      console.log('Fetching hotels from API...')
      const response = await axios.get('/api/hotels')
      console.log('Hotels API response:', response.data)
      
      // Handle both array and object response formats
      const hotelsData = response.data.data || response.data
      
      if (hotelsData && Array.isArray(hotelsData) && hotelsData.length > 0) {
        // Transform API hotels to match the expected format
        const apiHotels = hotelsData.map(hotel => {
          // Extract city name from full address
          const extractCity = (address) => {
            if (!address) return 'Location TBD'
            // Split by comma and get the last part (usually city, state)
            const parts = address.split(',').map(part => part.trim())
            // Look for common city patterns
            for (let i = parts.length - 1; i >= 0; i--) {
              const part = parts[i]
              // Check if it contains common city names
              if (part.includes('Bangalore') || part.includes('Bengaluru') || 
                  part.includes('Mysore') || part.includes('Hassan') || 
                  part.includes('Mangalore') || part.includes('Hubli') ||
                  part.includes('Belgaum') || part.includes('Gulbarga') ||
                  part.includes('Dharwad') || part.includes('Bellary') ||
                  part.includes('Tumkur') || part.includes('Shimoga') ||
                  part.includes('Bidar') || part.includes('Raichur') ||
                  part.includes('Hampi') || part.includes('Udupi') ||
                  part.includes('Chikmagalur') || part.includes('Coorg') ||
                  part.includes('Madikeri') || part.includes('Chitradurga') ||
                  part.includes('Kolar') || part.includes('Mandya') ||
                  part.includes('Haveri') || part.includes('Gadag') ||
                  part.includes('Koppal') || part.includes('Bagalkot') ||
                  part.includes('Bijapur') || part.includes('Yadgir') ||
                  part.includes('Chamrajanagar') || part.includes('Dakshina Kannada') ||
                  part.includes('Uttara Kannada') || part.includes('Kodagu') ||
                  part.includes('Chikkaballapur') || part.includes('Chitradurga') ||
                  part.includes('Davangere') || part.includes('Hassan') ||
                  part.includes('Haveri') || part.includes('Koppal') ||
                  part.includes('Mandya') || part.includes('Mysore') ||
                  part.includes('Raichur') || part.includes('Shimoga') ||
                  part.includes('Tumkur') || part.includes('Udupi') ||
                  part.includes('Vijayapura') || part.includes('Yadgir')) {
                return part
              }
            }
            // If no city found, return the last part
            return parts[parts.length - 1] || 'Location TBD'
          }

          // Debug price handling
          console.log('Hotel price from API:', hotel.price, 'Type:', typeof hotel.price)
          
          // Better price handling - if price is 0, empty, or invalid, use default
          let displayPrice = hotel.price
          if (!displayPrice || displayPrice === '0' || displayPrice === 0 || displayPrice === '' || displayPrice === null || displayPrice === undefined) {
            displayPrice = '1000' // Default price
          }
          
          return {
            id: hotel._id || hotel.id,
            name: hotel.name,
            location: extractCity(hotel.location),
            type: hotel.type || 'Hotel',
            price: displayPrice,
            image: hotel.image && !hotel.image.startsWith('http') ? `http://localhost:5000/${hotel.image}` : hotel.image || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&h=300&fit=crop",
            description: hotel.description || '',
            amenities: hotel.amenities || ''
          }
        })
        
        console.log('Transformed API hotels:', apiHotels)
        setHotels(apiHotels)
      } else {
        throw new Error('No hotels in API response')
      }
    } catch (error) {
      console.error('Error fetching hotels:', error)
    console.log('Using fallback hotel data')
      // Fallback to static data
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
      console.log('Setting fallback hotels:', fallbackHotels)
    setHotels(fallbackHotels)
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
      <h2 className="rooms-title">Find Your Stay</h2>
        <a href="#" className="view-all-link" onClick={(e) => {
          e.preventDefault()
          alert(`Viewing all ${hotels.length} hotels:\n\n${hotels.map(h => `• ${h.name} - ${h.location} - ₹${h.price}/night`).join('\n')}`)
        }}>View All →</a>
      </div>
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
                    <div className="hotel-price">₹{hotel.price}/night</div>
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
