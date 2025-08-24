import React, { useState, useEffect } from 'react';

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="back-to-top-container">
      <button
        onClick={scrollToTop}
        className="
          group relative overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 text-white
          w-10 h-10 sm:w-11 sm:h-11
          rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30
          transition-all duration-500 ease-out transform hover:scale-105 shadow-lg hover:shadow-xl
          opacity-100 translate-y-0
        "
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>

        {/* Button content */}
        <div className="relative flex items-center justify-center w-full h-full">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:-translate-y-0.5 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
          </svg>
        </div>

        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
      </button>
    </div>
  );
};

export default BackToTopButton;
