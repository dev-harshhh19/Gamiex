import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GamingLoader from './GamingLoader';

const PageTransition = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Start transition when location changes
    setIsLoading(true);
    setIsVisible(false);

    // Simulate loading time for smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsVisible(true);
    }, 800); // Adjust timing as needed

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (isLoading) {
    return <GamingLoader variant="fullscreen" text="Loading Page" />;
  }

  return (
    <div 
      className={`transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {children}
    </div>
  );
};

export default PageTransition;
