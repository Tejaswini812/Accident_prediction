import React, { useRef, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'

const ModernPromotionalCarousel = () => {
  const swiperRef = useRef(null)

  const carouselData = [
    {
      id: 1,
      title: "Discovery Village Trials",
      subtitle: "BATCH NO: 25",
      price: "Explore 6,850/- Package",
      features: ["FREE LUNCH", "LUCKY Draw", "Smart QR Code"],
      image: "/image1.png",
      description: "Experience the ultimate adventure with our premium package"
    },
    {
      id: 2,
      title: "Wild Life Safari",
      subtitle: "Open Jeep Drive",
      price: "Adventure Package",
      features: ["Wildlife Spotting", "Professional Guide", "Safety Equipment"],
      image: "/image2.png",
      description: "Get up close with nature in our guided safari experience"
    },
    {
      id: 3,
      title: "Shivana Samudrum",
      subtitle: "2 hr drive, 100KM",
      price: "Scenic Route Package",
      features: ["Beautiful Views", "Photo Spots", "Refreshments"],
      image: "/image3.png",
      description: "Discover breathtaking landscapes on this scenic journey"
    }
  ]

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center">
            Discovery Village Trials
          </h2>
          <p className="text-center text-green-100 mt-2 text-sm sm:text-base">
            BATCH NO: 25
          </p>
        </div>

        {/* Swiper Carousel */}
        <div className="p-4 sm:p-6">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
            spaceBetween={20}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            pagination={{
              clickable: true,
              el: '.swiper-pagination-custom',
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            effect="coverflow"
            coverflowEffect={{
              rotate: 30,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            className="w-full"
          >
            {carouselData.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className="relative">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-lg sm:text-xl font-bold mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-200">{item.subtitle}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 sm:p-6">
                    <div className="text-center mb-4">
                      <p className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
                        {item.price}
                      </p>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {item.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                      Book Now
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button className="swiper-button-prev-custom w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-300 shadow-lg">
              <i className="fas fa-chevron-left"></i>
            </button>
            
            <div className="swiper-pagination-custom flex gap-2"></div>
            
            <button className="swiper-button-next-custom w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-300 shadow-lg">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModernPromotionalCarousel
