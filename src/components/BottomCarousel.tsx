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
    <div className="w-full max-w-lg mx-auto px-0 mt-6 mb-20"> 
      {/* Increased from max-w-md to max-w-lg and removed side padding */}
      <div className="relative h-36 overflow-hidden rounded-xl border-2 border-gold/30 shadow-lg">
        {/* Increased height from h-32 to h-36 and rounded corners slightly more */}
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div key={index} className="min-w-full h-full flex-shr
