import { useState, useEffect } from "react";
import ad1 from "@/assets/ad-1.jpeg";
import ad2 from "@/assets/ad-2.jpeg";
import ad3 from "@/assets/ad-3.jpeg";
import ad4 from "@/assets/ad-4.jpeg";
import ad5 from "@/assets/ad-5.jpeg";
import ad6 from "@/assets/ad-6.jpeg";

export const BottomCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [ad1, ad2, ad3, ad4, ad5, ad6];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="relative w-full h-40 mb-4 overflow-hidden rounded-2xl shadow-lg">
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div key={index} className="min-w-full h-full flex-shrink-0">
            <img
              src={banner}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log(`Failed to load image: ${banner}`);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Carousel indicators */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white scale-110" : "bg-white/60"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};