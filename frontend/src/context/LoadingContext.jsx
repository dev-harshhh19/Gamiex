import React, { createContext, useContext, useState } from 'react';
import GamingLoader from '../components/GamingLoader';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading...');

  const showLoading = (text = 'Loading...') => {
    setLoadingText(text);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

  const value = {
    isLoading,
    showLoading,
    hideLoading,
    setLoadingText
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {isLoading && (
        <GamingLoader 
          variant="fullscreen" 
          text={loadingText} 
        />
      )}
    </LoadingContext.Provider>
  );
};

export default LoadingContext;
