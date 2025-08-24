// URL utility functions for pagination and navigation

/**
 * Generate URL for a specific page (for pagination pages 2+)
 * @param {number} pageNumber - The page number (1-based)
 * @returns {string} - The URL path for the page
 */
export const getPageUrl = (pageNumber) => {
  return `/home/${pageNumber}/`;
};

/**
 * Get the main home URL (landing page)
 * @returns {string} - The main home URL
 */
export const getHomeUrl = () => {
  return '/home';
};

/**
 * Extract page number from URL pathname
 * @param {string} pathname - The URL pathname
 * @returns {number} - The page number (defaults to 1)
 */
export const getPageFromUrl = (pathname) => {
  // Handle /home/1/, /home/2/, etc. with optional trailing slash
  const match = pathname.match(/^\/home\/(\d+)\/?$/);
  if (match) {
    const page = parseInt(match[1], 10);
    return page > 0 ? page : 1;
  }
  // Handle /home as page 1 (landing page)
  if (pathname === '/home' || pathname === '/home/') {
    return 1;
  }
  return 1;
};

/**
 * Check if a URL represents the home page (page 1)
 * @param {string} pathname - The URL pathname
 * @returns {boolean} - True if it's the home page
 */
export const isHomePage = (pathname) => {
  return pathname === '/home' || pathname === '/home/' || pathname === '/home/1' || pathname === '/home/1/';
};

/**
 * Generate pagination metadata for SEO
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {string} baseUrl - Base URL for the site
 * @returns {object} - Pagination metadata
 */
export const getPaginationMeta = (currentPage, totalPages, baseUrl = '') => {
  const meta = {
    currentPage,
    totalPages,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    nextUrl: null,
    prevUrl: null,
    canonicalUrl: `${baseUrl}${getPageUrl(currentPage)}`
  };

  if (meta.hasNext) {
    meta.nextUrl = `${baseUrl}${getPageUrl(currentPage + 1)}`;
  }

  if (meta.hasPrev) {
    meta.prevUrl = `${baseUrl}${getPageUrl(currentPage - 1)}`;
  }

  return meta;
};
