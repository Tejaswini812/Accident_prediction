import React from 'react'

const LocationButtons = () => {
  const locations = [
    'Wayanad', 'Shakaleshwara', 'Hassan', 'Coorg', 'Mysore',
    'Chikmagalore', 'BR Hills', 'Shivana Samudra', 'Bandipur'
  ]

  const handleLocationClick = (location) => {
    console.log(`Selected location: ${location}`)
    // You can add filtering logic here later
  }

  return (
    <div>
      <h3 className="location-title">Popular Destinations</h3>
      <div className="location-buttons-section">
        <div className="location-buttons">
          {locations.map((location, index) => (
            <button
              key={index}
              className="location-btn"
              onClick={() => handleLocationClick(location)}
            >
              {location}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LocationButtons
