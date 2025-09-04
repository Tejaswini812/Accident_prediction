import React from 'react'

const FloatingButtons = () => {
  const openWhatsApp = () => {
    const phoneNumber = '7676558020'
    const message = 'Hello! I would like to know more about your services.'
    const whatsappUrl = `https://api.whatsapp.com/send?phone=91${phoneNumber}&text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const openCart = () => {
    alert('Cart functionality coming soon!')
  }

  return (
    <div className="floating-buttons">
      <button className="cart-button" onClick={openCart}>
        <i className="fas fa-shopping-cart"></i>
      </button>
      <button className="whatsapp-button" onClick={openWhatsApp}>
        <i className="fab fa-whatsapp"></i>
      </button>
    </div>
  )
}

export default FloatingButtons
