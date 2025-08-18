import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import barba from '@barba/core';
import { gsap } from 'gsap';
import BackToTopButton from './BackToTopButton.jsx';
import Footer from './Footer.jsx';

const Layout = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis();
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Initialize Barba.js for page transitions
    barba.init({
      sync: true,
      transitions: [
        {
          name: 'default-transition',
          leave(data) {
            return gsap.to(data.current.container, {
              opacity: 0,
              duration: 0.5,
            });
          },
          enter(data) {
            return gsap.from(data.next.container, {
              opacity: 0,
              duration: 0.5,
            });
          },
        },
      ],
    });

    return () => {
      barba.destroy();
      lenis.destroy();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div data-barba="wrapper" className="flex-grow">
        {children}
      </div>
      <BackToTopButton />
      <Footer />
    </div>
  );
};

export default Layout;
