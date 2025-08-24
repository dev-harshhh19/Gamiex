import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import BackToTopButton from './BackToTopButton.jsx';
import Footer from './Footer.jsx';

const Layout = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis();
    lenisRef.current = lenis;

    // Create cursor spotlight
    const spotlight = document.createElement('div');
    spotlight.className = 'cursor-spotlight';
    document.body.appendChild(spotlight);

    // Smooth following variables
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    const ease = 0.15; // Lower = more delay/smoothness

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      spotlight.classList.add('active');
    };

    const handleMouseLeave = () => {
      spotlight.classList.remove('active');
    };

    // Smooth animation loop
    const animateSpotlight = () => {
      // Lerp (linear interpolation) for smooth following
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      spotlight.style.left = `${currentX}px`;
      spotlight.style.top = `${currentY}px`;

      requestAnimationFrame(animateSpotlight);
    };

    // Start animation loop
    animateSpotlight();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    requestAnimationFrame(raf);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);

      if (spotlight && spotlight.parentNode) {
        spotlight.parentNode.removeChild(spotlight);
      }

      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative" style={{
      background: 'linear-gradient(135deg, #2c2a4a 0%, #3a3660 100%)',
      minHeight: '100vh'
    }} data-lenis-wrapper>


      {/* Animated Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          opacity: 0.5,
          animation: 'gridFlow 20s linear infinite'
        }}
      />

      {/* Secondary Grid Layer */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          opacity: 0.3,
          animation: 'gridFlowSlow 30s linear infinite reverse'
        }}
      />

      <div data-barba="wrapper" className="flex-grow relative z-10" style={{
        background: 'transparent'
      }} data-lenis-content>
        {children}
      </div>
      <BackToTopButton />
      <Footer />
    </div>
  );
};

export default Layout;