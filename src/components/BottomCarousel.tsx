import { useState, useEffect } from "react";
import carousel1 from "@/assets/carousel-1.jpeg";
import carousel2 from "@/assets/carousel-2.jpeg";
import carousel3 from "@/assets/carousel-3.jpeg";
import carousel4 from "@/assets/carousel-4.jpeg";
import carousel5 from "@/assets/carousel-5.jpeg";
import carousel6 from "@/assets/carousel-6.jpeg";

export const BottomCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [carousel1, carousel2, carousel3, carousel4, carousel5, carousel6];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="w-full max-w-xl mx-auto px-0 mt-1 mb-2">
      {/* Increased from max-w-lg to max-w-xl for slightly wider view */}
      <div className="relative h-40 overflow-hidden rounded-xl border-2 border-yellow-400/30 shadow-lg">
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div key={index} className="min-w-full h-full flex-shrink-0">
              <img
                src={banner}
                alt={`Advertisement ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.log(`Failed to load image: ${banner}`);
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          ))}
        </div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-40 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-yellow-400 scale-110" : "bg-yellow-400/40"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
