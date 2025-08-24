import React, { useState, useEffect, useRef } from 'react';

const FullScreenSearch = ({ isOpen, onClose, loading, onSearch }) => {
  const [localSearch, setLocalSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
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
    setSelectedIndex(-1); // Reset selection when typing
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
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSuggestionClick(suggestions[selectedIndex].name);
      } else {
        onSearch(localSearch);
        setShowSuggestions(false);
        onClose();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-charcoal-base/90 backdrop-blur-lg flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl product-card overflow-hidden animate-fade-in">
        {/* Gaming Header */}
        <div className="bg-charcoal-light p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Gaming Search Icon */}
              <div className="w-12 h-12 bg-charcoal-card rounded-xl flex items-center justify-center relative">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {/* Glowing effect */}
                <div className="absolute inset-0 bg-white/10 rounded-xl animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Search Games</h2>
                <p className="text-gray-text text-sm">Find your next gaming adventure</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-text hover:text-white transition-all duration-300 p-3 rounded-xl hover:bg-charcoal-card group"
              aria-label="Close search"
            >
              <svg className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Gaming Search Input */}
        <div className="p-8">
          <div className="relative">
            {/* Search Input Container */}
            <div className="relative group">
              <input
                type="text"
                ref={searchInputRef}
                value={localSearch}
                onChange={handleLocalSearchChange}
                onKeyDown={handleKeyDown}
                placeholder="Search for games, genres, platforms..."
                className="w-full px-6 py-5 text-lg bg-charcoal-light border-2 border-white/20 rounded-xl focus:border-white/50 focus:bg-charcoal-card transition-all duration-300 outline-none pr-16 text-white placeholder-gray-text group-hover:border-white/30"
              />

              {/* Search Icon */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Clear Button */}
              {localSearch && (
                <button
                  onClick={handleClearLocalSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-text hover:text-white p-2 rounded-lg hover:bg-charcoal-card transition-all duration-300 group"
                  aria-label="Clear search"
                >
                  <svg className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              {/* Loading Indicator */}
              {loading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
              )}

              {/* Gaming Input Glow Effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>

            {/* Search Hints */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-gray-text text-sm">Try:</span>
              {['Action', 'RPG', 'Strategy', 'Indie', 'Multiplayer'].map((hint) => (
                <button
                  key={hint}
                  onClick={() => {
                    setLocalSearch(hint);
                    onSearch(hint);
                    onClose();
                  }}
                  className="px-3 py-1 bg-charcoal-card text-gray-text text-sm rounded-lg hover:bg-charcoal-light hover:text-white transition-all duration-300"
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
          {/* Gaming Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-20 w-full bg-charcoal-card border border-white/20 rounded-xl shadow-2xl mt-2 max-h-80 overflow-y-auto animate-slide-up">
              <div className="p-2">
                <div className="text-gray-text text-sm px-3 py-2 border-b border-white/10 mb-2">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Quick Results
                  </span>
                </div>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion._id}
                    className={`px-4 py-3 cursor-pointer rounded-lg transition-all duration-300 group flex items-center gap-3 ${
                      selectedIndex === index
                        ? 'bg-charcoal-light border border-white/20'
                        : 'hover:bg-charcoal-light'
                    }`}
                    onClick={() => handleSuggestionClick(suggestion.name)}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Game Icon */}
                    <div className="w-8 h-8 bg-charcoal-light rounded-lg flex items-center justify-center group-hover:bg-charcoal-base transition-colors">
                      <svg className="w-4 h-4 text-gray-text group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>

                    {/* Game Info */}
                    <div className="flex-1">
                      <div className="text-white group-hover:text-white font-medium">{suggestion.name}</div>
                      {suggestion.genre && (
                        <div className="text-gray-text text-sm">{suggestion.genre}</div>
                      )}
                    </div>

                    {/* Price */}
                    {suggestion.price && (
                      <div className="text-white font-bold">
                        ${suggestion.price}
                      </div>
                    )}

                    {/* Arrow */}
                    <div className="text-gray-text group-hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>

              {/* Search All Results Footer */}
              <div className="border-t border-white/10 p-3">
                <button
                  onClick={() => {
                    onSearch(localSearch);
                    onClose();
                  }}
                  className="w-full px-4 py-2 bg-charcoal-light hover:bg-charcoal-base text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search all results for "{localSearch}"
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Gaming Footer */}
        <div className="px-8 pb-6">
          <div className="flex items-center justify-between text-gray-text text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7" />
              </svg>
              <span>Press Enter to search</span>
            </div>
            <div className="flex items-center gap-2">
              <span>ESC to close</span>
              <div className="w-6 h-6 bg-charcoal-card rounded border border-white/20 flex items-center justify-center text-xs">
                ⎋
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenSearch;
