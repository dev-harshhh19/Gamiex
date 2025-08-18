import React, { useState, useEffect, useRef } from 'react';

const FullScreenSearch = ({ isOpen, onClose, loading, onSearch }) => {
  const [localSearch, setLocalSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Debounce search input and fetch suggestions
  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const newAbortController = new AbortController();
    abortControllerRef.current = newAbortController;

    const handler = setTimeout(() => {
      if (localSearch.length > 1) { // Fetch suggestions only if search term is at least 2 characters
        const fetchSuggestions = async () => {
          try {
            const response = await fetch(`/api/products?search=${localSearch}`, { signal: newAbortController.signal });
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setSuggestions(data.data);
            setShowSuggestions(true);
          } catch (error) {
            if (error.name === 'AbortError') {
              console.log('Fetch aborted');
            } else {
              console.error('Error fetching suggestions:', error);
              setSuggestions([]);
            }
          }
        };
        fetchSuggestions();
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500); // 500ms debounce time

    return () => {
      clearTimeout(handler);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [localSearch]);

  useEffect(() => {
    if (isOpen) {
      setLocalSearch(''); // Clear search when opening
      searchInputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setShowSuggestions(false); // Hide suggestions when closing
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLocalSearchChange = (e) => {
    setLocalSearch(e.target.value);
  };

  const handleClearLocalSearch = () => {
    setLocalSearch('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestionName) => {
    onSearch(suggestionName);
    setShowSuggestions(false);
    onClose(); // Close the search panel
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(localSearch);
      setShowSuggestions(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fade-in">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-foreground text-3xl p-2 rounded-full hover:bg-accent transition-colors"
      >
        &times;
      </button>

      <div className="w-full max-w-3xl mb-8 relative">
        <input
          type="text"
          ref={searchInputRef}
          value={localSearch}
          onChange={handleLocalSearchChange}
          onKeyDown={handleKeyDown}
          placeholder="Search for games..."
          className="w-full px-6 py-4 text-2xl bg-input border border-border rounded-full focus:ring-ring focus:border-ring transition-colors outline-none pr-12" // Added pr-12 for clear button space
        />
        {localSearch && (
          <button
            onClick={handleClearLocalSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-2 rounded-full"
            aria-label="Clear search"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        )}
        {loading && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-popover border border-border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion._id}
                className="px-4 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleSuggestionClick(suggestion.name)}
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FullScreenSearch;
