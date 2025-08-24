import React, { useState, lazy, Suspense, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { LoadingProvider } from './context/LoadingContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
import FullScreenSearch from './components/FullScreenSearch.jsx';
import GamingLoader from './components/GamingLoader.jsx';
import PageTransition from './components/PageTransition.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import Toast from './components/Toast.jsx';
import CartNotification from './components/CartNotification.jsx';
import { useCart } from './context/CartContext.jsx';

const Landing = lazy(() => import('./pages/Landing.jsx'));
const Home = lazy(() => import('./pages/Home.jsx'));
const ProductDetails = lazy(() => import('./pages/ProductDetails.jsx'));
const Cart = lazy(() => import('./pages/Cart.jsx'));
const Checkout = lazy(() => import('./pages/Checkout.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const OrderDetails = lazy(() => import('./pages/OrderDetails.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const TermsOfService = lazy(() => import('./pages/TermsOfService.jsx'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.jsx'));
const ContactUs = lazy(() => import('./pages/ContactUs.jsx'));
const AboutUs = lazy(() => import('./pages/AboutUs.jsx'));
const Help = lazy(() => import('./pages/Help.jsx'));

function AppContent() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showToast, setShowToast] = useState(false);
  const { cartNotification, hideCartNotification } = useCart();

  const handleSearch = (term) => {
    setSearchTerm(term);
    setIsSearchOpen(false);
  };

  return (
    <LoadingProvider>
      <AuthProvider>
        <Router>
          <AppRouter
            isSearchOpen={isSearchOpen}
            setIsSearchOpen={setIsSearchOpen}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showToast={showToast}
            setShowToast={setShowToast}
            handleSearch={handleSearch}
            cartNotification={cartNotification}
            hideCartNotification={hideCartNotification}
          />
        </Router>
      </AuthProvider>
    </LoadingProvider>
  );
}

function AppRouter({
  isSearchOpen,
  setIsSearchOpen,
  searchTerm,
  setSearchTerm,
  showToast,
  setShowToast,
  handleSearch,
  cartNotification,
  hideCartNotification
}) {
  const navigate = useNavigate();

  const handleGoHome = useCallback(() => {
    const hadSearchTerm = searchTerm.length > 0;
    setSearchTerm(''); // Clear any search results
    setIsSearchOpen(false); // Close search if open
    navigate('/home'); // Navigate to home landing page

    // Show toast only if there was a search term to clear
    if (hadSearchTerm) {
      setShowToast(true);
    }
  }, [searchTerm, setSearchTerm, setIsSearchOpen, navigate, setShowToast]);

  // Keyboard shortcut: Alt + H to go home and clear search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        handleGoHome();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGoHome]);

  return (
    <Layout>
      <div className="min-h-screen text-foreground">
        <Navbar
          onOpenSearch={() => setIsSearchOpen(true)}
          onGoHome={handleGoHome}
          hasActiveSearch={searchTerm.length > 0}
          searchTerm={searchTerm}
        />
        <main data-barba="container" data-barba-namespace="home">
          <Suspense fallback={<GamingLoader variant="page" text="Loading Page" />}>
            <PageTransition>
              <Routes>
                {/* Redirect root to /home */}
                <Route path="/" element={<Navigate to="/home" replace />} />
                {/* Main home landing page */}
                <Route path="/home" element={<Landing />} />
                {/* Paginated home pages with optional trailing slash */}
                <Route path="/home/:page" element={<Home searchTerm={searchTerm} />} />
                <Route path="/home/:page/" element={<Home searchTerm={searchTerm} />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order/:id"
                  element={
                    <ProtectedRoute>
                      <OrderDetails />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/help" element={<Help />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageTransition>
          </Suspense>
        </main>
      </div>
      <FullScreenSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearch}
      />
      <Toast
        message="Search cleared! Showing all games"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type="info"
      />
      <CartNotification
        isVisible={cartNotification.isVisible}
        onClose={hideCartNotification}
        product={cartNotification.product}
        quantity={cartNotification.quantity}
      />
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ErrorBoundary>
  );
}

export default App;