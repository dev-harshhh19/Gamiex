import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTransition = (delay = 300) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(useLocation());
  const location = useLocation();

  useEffect(() => {
    if (location !== displayLocation) {
      setIsTransitioning(true);
      
      const timeoutId = setTimeout(() => {
        setDisplayLocation(location);
        setIsTransitioning(false);
      }, delay);

      return () => clearTimeout(timeoutId);
    }
  }, [location, displayLocation, delay]);

  return { isTransitioning, displayLocation };
};

export default usePageTransition;
