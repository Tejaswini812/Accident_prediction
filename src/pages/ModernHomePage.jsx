import React from 'react'
import ModernHeader from '../components/ModernHeader'
import ModernPromotionalCarousel from '../components/ModernPromotionalCarousel'

const ModernHomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Modern Header with Tailwind */}
      <ModernHeader />
      
      {/* Connect with Members Section */}
      <div className="max-w-6xl mx-auto p-4 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <i className="fas fa-comments text-white text-lg"></i>
            </div>
            <h2 className="text-2xl font-bold text-white">Connect with Members</h2>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex gap-3 mb-4">
              <input 
                type="text" 
                placeholder="Enter User ID" 
                className="flex-1 px-4 py-3 rounded-lg border-2 border-white/30 bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-white focus:bg-white transition-all duration-300"
              />
              <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2">
                <i className="fas fa-paper-plane"></i>
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
            
            <p className="text-white/90 text-sm mb-3">Welcome to Startup Village County</p>
            
            <button className="w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
              Activate your UserID
            </button>
          </div>
        </div>
      </div>

      {/* Modern Promotional Carousel with Swiper */}
      <ModernPromotionalCarousel />

      {/* Floating Action Buttons */}
      <div className="fixed right-4 bottom-4 flex flex-col gap-3 z-50">
        <button className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center">
          <i className="fas fa-shopping-cart text-lg"></i>
        </button>
        <button className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center">
          <i className="fab fa-whatsapp text-lg"></i>
        </button>
      </div>
    </div>
  )
}

export default ModernHomePage
