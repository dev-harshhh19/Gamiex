import React from 'react';

const GamingLoader = ({ size = 'medium', text = 'Loading...', variant = 'default' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xl: 'text-xl'
  };

  if (variant === 'fullscreen') {
    return (
      <div className="fixed inset-0 bg-charcoal-base/95 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-center">
          {/* Modern Gaming Console */}
          <div className="mb-8">
            <div className="relative">
              {/* Console with Border Loading */}
              <div className="w-32 h-20 mx-auto relative">
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div className="console-border-loader"></div>
                </div>

                {/* Console Body */}
                <div className="w-full h-full bg-charcoal-light rounded-2xl flex items-center justify-center relative border-2 border-charcoal-card">
                  {/* Modern Controller Shape */}
                  <div className="w-28 h-16 bg-charcoal-card rounded-xl relative shadow-inner">
                    {/* Central Screen/Display */}
                    <div className="w-12 h-8 bg-charcoal-base rounded-lg absolute top-2 left-1/2 transform -translate-x-1/2">
                      <div className="w-full h-full rounded-lg" style={{ animation: 'modernConsoleScreen 2s ease-in-out infinite' }}></div>
                      {/* Loading dots on screen */}
                      <div className="absolute inset-0 flex items-center justify-center gap-1">
                        <div className="w-1 h-1 bg-white/80 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-1 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>

                    {/* Left Analog Stick */}
                    <div className="absolute top-3 left-2">
                      <div className="w-3 h-3 bg-charcoal-base rounded-full border border-white/30 relative">
                        <div className="w-2 h-2 bg-white/60 rounded-full absolute top-0.5 left-0.5" style={{ animation: 'analogStick 3s ease-in-out infinite' }}></div>
                      </div>
                    </div>

                    {/* Right Analog Stick */}
                    <div className="absolute top-3 right-2">
                      <div className="w-3 h-3 bg-charcoal-base rounded-full border border-white/30 relative">
                        <div className="w-2 h-2 bg-white/60 rounded-full absolute top-0.5 left-0.5" style={{ animation: 'analogStick 3s ease-in-out infinite 1.5s' }}></div>
                      </div>
                    </div>

                    {/* D-Pad */}
                    <div className="absolute bottom-2 left-3">
                      <div className="w-4 h-4 relative">
                        <div className="w-1 h-4 bg-white/50 absolute left-1.5" style={{ animation: 'dpadPulse 2s ease-in-out infinite' }}></div>
                        <div className="w-4 h-1 bg-white/50 absolute top-1.5" style={{ animation: 'dpadPulse 2s ease-in-out infinite 0.5s' }}></div>
                      </div>
                    </div>

                    {/* Action Buttons (ABXY) */}
                    <div className="absolute bottom-2 right-3">
                      <div className="w-4 h-4 relative">
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full absolute top-0 left-1.5" style={{ animation: 'actionButton 1.5s ease-in-out infinite' }}></div>
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full absolute bottom-0 left-1.5" style={{ animation: 'actionButton 1.5s ease-in-out infinite 0.3s' }}></div>
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full absolute top-1.5 left-0" style={{ animation: 'actionButton 1.5s ease-in-out infinite 0.6s' }}></div>
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full absolute top-1.5 right-0" style={{ animation: 'actionButton 1.5s ease-in-out infinite 0.9s' }}></div>
                      </div>
                    </div>

                    {/* Shoulder Buttons */}
                    <div className="absolute -top-1 left-4 w-6 h-2 bg-charcoal-base rounded-t-lg">
                      <div className="w-full h-full bg-white/30 rounded-t-lg" style={{ animation: 'shoulderButton 2.5s ease-in-out infinite' }}></div>
                    </div>
                    <div className="absolute -top-1 right-4 w-6 h-2 bg-charcoal-base rounded-t-lg">
                      <div className="w-full h-full bg-white/30 rounded-t-lg" style={{ animation: 'shoulderButton 2.5s ease-in-out infinite 1.25s' }}></div>
                    </div>

                    {/* Power LED */}
                    <div className="absolute top-1 left-1 w-1 h-1 bg-success-green rounded-full" style={{ animation: 'powerLED 2s ease-in-out infinite' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gaming Loading Animation */}
          <div className="relative mb-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>

          {/* Loading Text */}
          <h2 className="text-2xl font-bold text-white mb-2">{text}</h2>
          <p className="text-gray-text">Preparing your gaming experience...</p>

          {/* Progress Bar */}
          <div className="w-64 h-2 bg-charcoal-light rounded-full mx-auto mt-6 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-white to-gray-300 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'page') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          {/* Modern Gaming Console - Page Size */}
          <div className="relative mb-8">
            <div className="w-24 h-16 mx-auto relative">
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <div className="console-border-loader"></div>
              </div>

              {/* Console Body */}
              <div className="w-full h-full bg-charcoal-light rounded-xl flex items-center justify-center relative border-2 border-charcoal-card">
                <div className="w-20 h-12 bg-charcoal-card rounded-lg relative">
                  {/* Central Screen */}
                  <div className="w-8 h-6 bg-charcoal-base rounded-md absolute top-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-full h-full rounded-md" style={{ animation: 'modernConsoleScreen 2s ease-in-out infinite' }}></div>
                    <div className="absolute inset-0 flex items-center justify-center gap-0.5">
                      <div className="w-0.5 h-0.5 bg-white/80 rounded-full animate-bounce"></div>
                      <div className="w-0.5 h-0.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-0.5 h-0.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>

                  {/* Left Analog */}
                  <div className="absolute top-2 left-1">
                    <div className="w-2 h-2 bg-charcoal-base rounded-full border border-white/30 relative">
                      <div className="w-1 h-1 bg-white/60 rounded-full absolute top-0.5 left-0.5" style={{ animation: 'analogStick 3s ease-in-out infinite' }}></div>
                    </div>
                  </div>

                  {/* Right Analog */}
                  <div className="absolute top-2 right-1">
                    <div className="w-2 h-2 bg-charcoal-base rounded-full border border-white/30 relative">
                      <div className="w-1 h-1 bg-white/60 rounded-full absolute top-0.5 left-0.5" style={{ animation: 'analogStick 3s ease-in-out infinite 1.5s' }}></div>
                    </div>
                  </div>

                  {/* D-Pad */}
                  <div className="absolute bottom-1 left-2">
                    <div className="w-2 h-2 relative">
                      <div className="w-0.5 h-2 bg-white/50 absolute left-0.5" style={{ animation: 'dpadPulse 2s ease-in-out infinite' }}></div>
                      <div className="w-2 h-0.5 bg-white/50 absolute top-0.5" style={{ animation: 'dpadPulse 2s ease-in-out infinite 0.5s' }}></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute bottom-1 right-2">
                    <div className="w-2 h-2 relative">
                      <div className="w-0.5 h-0.5 bg-white/60 rounded-full absolute top-0 left-0.5" style={{ animation: 'actionButton 1.5s ease-in-out infinite' }}></div>
                      <div className="w-0.5 h-0.5 bg-white/60 rounded-full absolute bottom-0 left-0.5" style={{ animation: 'actionButton 1.5s ease-in-out infinite 0.3s' }}></div>
                    </div>
                  </div>

                  {/* Power LED */}
                  <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-success-green rounded-full" style={{ animation: 'powerLED 2s ease-in-out infinite' }}></div>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-2">{text}</h3>
          <p className="text-gray-text">Loading content...</p>
        </div>
      </div>
    );
  }

  // Default inline loader with modern console
  return (
    <div className="flex items-center justify-center space-x-3">
      <div className="relative">
        {/* Modern Console with Border Loading */}
        <div className={`${sizeClasses[size]} relative`}>
          {/* Animated Border */}
          <div className="absolute inset-0 rounded-lg overflow-hidden">
            <div className="console-border-loader" style={{ borderRadius: '0.5rem' }}></div>
          </div>

          {/* Console Body */}
          <div className="w-full h-full bg-charcoal-light rounded-lg flex items-center justify-center relative border border-charcoal-card">
            <div className="w-3/4 h-3/4 bg-charcoal-card rounded-md relative">
              {/* Mini Screen */}
              <div className="w-1/2 h-1/2 bg-charcoal-base rounded-sm absolute top-1 left-1/2 transform -translate-x-1/2">
                <div className="w-full h-full rounded-sm" style={{ animation: 'modernConsoleScreen 2s ease-in-out infinite' }}></div>
              </div>

              {/* Mini Controls */}
              <div className="absolute bottom-1 left-1">
                <div className="w-1 h-1 bg-white/50" style={{ animation: 'dpadPulse 2s ease-in-out infinite' }}></div>
              </div>

              <div className="absolute bottom-1 right-1">
                <div className="w-1 h-1 bg-white/60 rounded-full" style={{ animation: 'actionButton 1.5s ease-in-out infinite' }}></div>
              </div>

              {/* Power LED */}
              <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-success-green rounded-full" style={{ animation: 'powerLED 2s ease-in-out infinite' }}></div>
            </div>
          </div>
        </div>
      </div>
      {text && (
        <span className={`${textSizes[size]} text-white font-medium`}>{text}</span>
      )}
    </div>
  );
};

export default GamingLoader;
