import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        {/* Animated Checkmark */}
        <div className={`success-checkmark mb-8 ${showAnimation ? 'checkmark-animation' : 'opacity-0'}`}>
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Success Message */}
        <div className={`transition-all duration-1000 delay-500 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-5xl font-bold text-white mb-4">
            Payment Successful!
          </h1>

          <p className="text-xl text-gray-text mb-8 leading-relaxed">
            Your order has been confirmed and your games are ready to be claimed.
            Check your email for the order details and redemption codes.
          </p>

          {/* Order Info Card */}
          <div className="modern-card mb-8 text-left">
            <h3 className="text-lg font-semibold text-white mb-4">What's Next?</h3>
            <div className="space-y-3 text-gray-text">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-neon-blue rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-charcoal-bg text-sm font-bold">1</span>
                </div>
                <p>Check your email for order confirmation and game codes</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-neon-blue rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-charcoal-bg text-sm font-bold">2</span>
                </div>
                <p>Visit your profile to view order details and download instructions</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-neon-blue rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-charcoal-bg text-sm font-bold">3</span>
                </div>
                <p>Redeem your codes in the respective game launchers</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/profile"
              className="neon-button primary px-8 py-3 text-lg font-semibold"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                View My Orders
              </span>
            </Link>

            <Link
              to="/"
              className="neon-button px-8 py-3 text-lg font-semibold"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                Continue Shopping
              </span>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-12 modern-card">
            <h4 className="text-white font-semibold mb-2">Need Help?</h4>
            <p className="text-gray-text text-sm mb-3">
              If you have any issues with your order or need assistance with game redemption,
              our support team is here to help.
            </p>
            <Link
              to="/contact-us"
              className="text-neon hover:text-white transition-colors text-sm font-medium"
            >
              Contact Support →
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-neon-blue rounded-full opacity-20 gentle-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PaymentSuccess;