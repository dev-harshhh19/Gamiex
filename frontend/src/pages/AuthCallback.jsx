import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

const AuthCallback = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session) {
          // Update the user's email_confirmed status in your backend
          // You'll need to implement this API endpoint
          await fetch('/api/auth/confirm-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: session.user.email,
              supabaseId: session.user.id,
            }),
          });

          // Show success message and redirect
          navigate('/login', { 
            state: { 
              message: 'Email verified successfully! You can now log in.' 
            }
          });
        }
      } catch (err) {
        setError(err.message || 'Something went wrong during email verification.');
      }
    };

    handleEmailConfirmation();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background animate-fade-in auth-container">
      <div className="max-w-md w-full space-y-8 p-8 rounded-lg auth-card">
        <div className="text-center">
          {error ? (
            <>
              <h2 className="text-4xl font-bold text-red-500 mb-4">Verification Failed</h2>
              <p className="text-gray-400">{error}</p>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-bold auth-title mb-4">Verifying Email</h2>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ffc8]"></div>
              </div>
              <p className="mt-4 text-gray-400">Please wait while we verify your email...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
