import React, { useState, useEffect } from 'react'

const PromotionalSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const slides = [
    { id: 1, image: '/image1.png', alt: 'Promotional Banner 1' },
    { id: 2, image: '/image2.png', alt: 'Promotional Banner 2' },
    { id: 3, image: '/image3.png', alt: 'Promotional Banner 3' },
    { id: 4, image: '/image4.png', alt: 'Promotional Banner 4' },
    { id: 5, image: '/image5.png', alt: 'Promotional Banner 5' },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const goToSlide = (index) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide(index)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  return (
    <div className="w-full py-4 bg-transparent">
      <div className="relative w-full max-w-full mx-auto bg-transparent overflow-hidden h-[700px] md:h-[600px] sm:h-[500px]">
        <div className="relative w-full h-full" id="slider-track">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`slide-item absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
          ))}
        </div>
        
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <div className="flex space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`dot-btn w-3 h-3 md:w-2.5 md:h-2.5 sm:w-2 sm:h-2 rounded-full border-2 border-gray-300 transition-all duration-300 hover:scale-110 ${
                  index === currentSlide ? 'bg-gray-800' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromotionalSlider
