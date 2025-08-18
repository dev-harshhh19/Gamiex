// Performance Optimization Utilities for Premion

// Image optimization and lazy loading
export const optimizeImage = (src, width = 400, height = 400, quality = 80) => {
  // For Unsplash images, add optimization parameters
  if (src && src.includes('unsplash.com')) {
    const url = new URL(src);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('h', height.toString());
    url.searchParams.set('q', quality.toString());
    url.searchParams.set('fit', 'crop');
    url.searchParams.set('auto', 'format');
    return url.toString();
  }
  return src;
};

// Lazy loading intersection observer
export const createLazyLoader = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  };

  return new IntersectionObserver(callback, { ...defaultOptions, ...options });
};

// Debounce function for search and input optimization
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll events
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Cache management for API responses
class CacheManager {
  constructor(maxSize = 100, ttl = 300000) { // 5 minutes default TTL
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  set(key, value, customTtl) {
    const expiryTime = Date.now() + (customTtl || this.ttl);
    
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      value,
      expiryTime
    });
  }

  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    if (Date.now() > item.expiryTime) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  has(key) {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expiryTime) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

// Create cache instances
export const apiCache = new CacheManager(50, 300000); // 5 minutes
export const imageCache = new CacheManager(200, 1800000); // 30 minutes

// Optimized API request wrapper
export const cachedFetch = async (url, options = {}, cacheKey = null) => {
  const key = cacheKey || url;
  
  // Check cache first
  if (apiCache.has(key)) {
    return apiCache.get(key);
  }
  
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    // Cache successful responses
    if (response.ok) {
      apiCache.set(key, data);
    }
    
    return data;
  } catch (error) {
    console.error('Cached fetch error:', error);
    throw error;
  }
};

// Resource preloader
export const preloadResources = (resources = []) => {
  resources.forEach(resource => {
    if (resource.type === 'image') {
      const img = new Image();
      img.src = optimizeImage(resource.src, resource.width, resource.height);
    } else if (resource.type === 'script') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.src;
      link.as = 'script';
      document.head.appendChild(link);
    } else if (resource.type === 'style') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.src;
      link.as = 'style';
      document.head.appendChild(link);
    }
  });
};

// Memory usage monitoring (dev mode)
export const monitorMemoryUsage = () => {
  if (process.env.NODE_ENV === 'development' && 'performance' in window && 'memory' in performance) {
    const memory = performance.memory;
    console.log('Memory Usage:', {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB',
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + 'MB',
      limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + 'MB'
    });
  }
};

// Bundle analyzer helper
export const logBundleInfo = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Bundle loaded at:', new Date().toISOString());
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0];
      console.log('Page Load Performance:', {
        domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart) + 'ms',
        loadComplete: Math.round(navigation.loadEventEnd - navigation.loadEventStart) + 'ms',
        totalTime: Math.round(navigation.loadEventEnd - navigation.navigationStart) + 'ms'
      });
    }
  }
};

// Component render optimization
export const shouldComponentUpdate = (prevProps, nextProps, keys = []) => {
  if (keys.length === 0) {
    // Shallow comparison of all props
    const prevKeys = Object.keys(prevProps);
    const nextKeys = Object.keys(nextProps);
    
    if (prevKeys.length !== nextKeys.length) {
      return true;
    }
    
    return prevKeys.some(key => prevProps[key] !== nextProps[key]);
  }
  
  // Check only specified keys
  return keys.some(key => prevProps[key] !== nextProps[key]);
};

// Local storage with compression
export const compressedStorage = {
  set: (key, value) => {
    try {
      const compressed = JSON.stringify(value);
      localStorage.setItem(key, compressed);
    } catch (error) {
      console.error('Storage compression error:', error);
    }
  },
  
  get: (key) => {
    try {
      const compressed = localStorage.getItem(key);
      return compressed ? JSON.parse(compressed) : null;
    } catch (error) {
      console.error('Storage decompression error:', error);
      return null;
    }
  },
  
  remove: (key) => {
    localStorage.removeItem(key);
  }
};

// Viewport optimization
export const getViewportSize = () => ({
  width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
  height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
});

export const isMobile = () => getViewportSize().width < 768;
export const isTablet = () => {
  const width = getViewportSize().width;
  return width >= 768 && width < 1024;
};

// Error boundary helper
export const handleAsyncError = (error, context = '') => {
  console.error(`Async error in ${context}:`, error);
  
  // In production, you might want to send to error reporting service
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry, LogRocket, etc.
    // errorReportingService.captureException(error, { context });
  }
};

// Code splitting helpers
export const dynamicImport = async (importFunc, fallbackComponent = null) => {
  try {
    const module = await importFunc();
    return module.default || module;
  } catch (error) {
    console.error('Dynamic import failed:', error);
    return fallbackComponent;
  }
};

// Performance metrics
export const measurePerformance = (name, fn) => {
  return async (...args) => {
    const start = performance.now();
    const result = await fn(...args);
    const end = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${name} took ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  };
};

const PerformanceUtils = {
  optimizeImage,
  createLazyLoader,
  debounce,
  throttle,
  apiCache,
  imageCache,
  cachedFetch,
  preloadResources,
  monitorMemoryUsage,
  logBundleInfo,
  shouldComponentUpdate,
  compressedStorage,
  getViewportSize,
  isMobile,
  isTablet,
  handleAsyncError,
  dynamicImport,
  measurePerformance
};

export default PerformanceUtils;
