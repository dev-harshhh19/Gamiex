import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold text-muted-foreground mt-4">Page Not Found</h2>
      <p className="text-lg text-muted-foreground mt-2">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFound;
