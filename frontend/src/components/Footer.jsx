import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-card text-card-foreground mt-auto p-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Gamiex. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms & Conditions</Link>
          <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link to="/contact-us" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link>
          <Link to="/about-us" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
