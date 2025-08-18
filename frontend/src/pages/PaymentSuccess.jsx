import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background animate-fade-in">
      <div className="max-w-md w-full space-y-8 p-8 bg-card border border-border rounded-lg shadow-lg text-center">
        <div className="text-6xl mb-4 animate-bounce-gentle">🎉</div>
        <h2 className="text-3xl font-bold text-foreground">Payment Successful!</h2>
        <p className="text-muted-foreground">
          Thank you for your purchase. You will be redirected to the homepage shortly.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;