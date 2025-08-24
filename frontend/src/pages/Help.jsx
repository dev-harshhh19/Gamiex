import React, { useEffect } from 'react';

const Help = () => {
  // Update page title
  useEffect(() => {
    document.title = 'Help - Gaming Store Guide';
  }, []);

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Welcome to <span className="text-neon-blue">Gaming Store</span>
          </h1>
          <p className="text-xl text-gray-text max-w-3xl mx-auto">
            New to our platform? This guide will help you navigate and make the most of your gaming experience.
          </p>
        </div>

        {/* Quick Start */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-neon-blue/10 to-charcoal-card border border-neon-blue/30 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">🎯 Quick Start</h2>
            <p className="text-gray-text mb-6">Ready to dive in? Here's the fastest way to get started:</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/home"
                className="neon-button primary text-lg px-8 py-3 font-semibold transform hover:scale-105 transition-all duration-300"
              >
                🏠 Go to Home
              </a>
              <span className="text-gray-text">or</span>
              <a
                href="/home/1/"
                className="neon-button secondary text-lg px-8 py-3 font-semibold transform hover:scale-105 transition-all duration-300"
              >
                🎮 Browse All Games
              </a>
            </div>
          </div>
        </section>

        {/* Getting Started Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="text-4xl mr-4">🚀</span>
            Getting Started
          </h2>
          <div className="bg-charcoal-card border border-white/20 rounded-xl p-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-neon-blue text-charcoal-dark rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg flex-shrink-0">1</div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Browse Our Collection</h3>
                  <p className="text-gray-text">Start at our <strong>Home page</strong> to see featured games, or click <strong>"Explore All Games"</strong> to browse our complete collection of 53+ premium titles.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-neon-blue text-charcoal-dark rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg flex-shrink-0">2</div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Search & Filter</h3>
                  <p className="text-gray-text">Use the <strong>search icon</strong> in the top navigation to find specific games, or browse by categories like Action, RPG, Racing, and more.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-neon-blue text-charcoal-dark rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg flex-shrink-0">3</div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">View Game Details</h3>
                  <p className="text-gray-text">Click on any game card to see detailed information including screenshots, system requirements, pricing, and more.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-neon-blue text-charcoal-dark rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg flex-shrink-0">4</div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Add to Cart & Purchase</h3>
                  <p className="text-gray-text">Found a game you love? Add it to your cart and proceed to checkout. Create an account to track your orders and manage your library.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Guide */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="text-4xl mr-4">🧭</span>
            Navigation Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-charcoal-card border border-white/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="text-2xl mr-3">🏠</span>
                Home Button
              </h3>
              <p className="text-gray-text">Click the logo or home icon to return to the main landing page. Use <kbd className="bg-charcoal-light px-2 py-1 rounded text-neon-blue">Alt + H</kbd> as a keyboard shortcut.</p>
            </div>
            <div className="bg-charcoal-card border border-white/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="text-2xl mr-3">🔍</span>
                Search Function
              </h3>
              <p className="text-gray-text">Click the search icon or press <kbd className="bg-charcoal-light px-2 py-1 rounded text-neon-blue">Ctrl + K</kbd> to open the search overlay and find games quickly.</p>
            </div>
            <div className="bg-charcoal-card border border-white/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="text-2xl mr-3">📄</span>
                Pagination
              </h3>
              <p className="text-gray-text">Navigate through pages using the numbered buttons at the bottom. Each page shows 20 games, and URLs are bookmarkable.</p>
            </div>
            <div className="bg-charcoal-card border border-white/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="text-2xl mr-3">🛒</span>
                Shopping Cart
              </h3>
              <p className="text-gray-text">Your cart icon shows the number of items. Click it to review your selections before checkout.</p>
            </div>
          </div>
        </section>

        {/* Game Categories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="text-4xl mr-4">🎮</span>
            Game Categories
          </h2>
          <div className="bg-charcoal-card border border-white/20 rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">⚔️</div>
                <h3 className="text-lg font-semibold text-white mb-2">Action</h3>
                <p className="text-gray-text text-sm">Fast-paced adventures and epic battles</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🧙‍♂️</div>
                <h3 className="text-lg font-semibold text-white mb-2">RPG</h3>
                <p className="text-gray-text text-sm">Immersive stories and character progression</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🏎️</div>
                <h3 className="text-lg font-semibold text-white mb-2">Racing</h3>
                <p className="text-gray-text text-sm">High-speed thrills and competitive racing</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">👻</div>
                <h3 className="text-lg font-semibold text-white mb-2">Horror</h3>
                <p className="text-gray-text text-sm">Spine-chilling survival experiences</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">💎</div>
                <h3 className="text-lg font-semibold text-white mb-2">Indie</h3>
                <p className="text-gray-text text-sm">Creative masterpieces and unique gameplay</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🥊</div>
                <h3 className="text-lg font-semibold text-white mb-2">Fighting</h3>
                <p className="text-gray-text text-sm">Competitive combat and martial arts</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tips & Tricks */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="text-4xl mr-4">💡</span>
            Tips & Tricks
          </h2>
          <div className="space-y-4">
            <div className="bg-charcoal-card border border-white/20 rounded-xl p-6 flex items-start space-x-4">
              <div className="text-2xl">⭐</div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Bookmark Your Favorites</h3>
                <p className="text-gray-text">All our URLs are bookmarkable! Save specific pages or search results for quick access later.</p>
              </div>
            </div>
            <div className="bg-charcoal-card border border-white/20 rounded-xl p-6 flex items-start space-x-4">
              <div className="text-2xl">🔄</div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Use Browser Back/Forward</h3>
                <p className="text-gray-text">Our pagination works with your browser's back and forward buttons for seamless navigation.</p>
              </div>
            </div>
            <div className="bg-charcoal-card border border-white/20 rounded-xl p-6 flex items-start space-x-4">
              <div className="text-2xl">📱</div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Mobile Friendly</h3>
                <p className="text-gray-text">Our platform works great on mobile devices with touch-friendly controls and responsive design.</p>
              </div>
            </div>
            <div className="bg-charcoal-card border border-white/20 rounded-xl p-6 flex items-start space-x-4">
              <div className="text-2xl">🎯</div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">System Requirements</h3>
                <p className="text-gray-text">Check each game's system requirements before purchasing to ensure compatibility with your setup.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="text-4xl mr-4">❓</span>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="bg-charcoal-card border border-white/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">How many games are available?</h3>
              <p className="text-gray-text">We currently have 53+ premium games across 6 different categories, all carefully curated for quality.</p>
            </div>
            <div className="bg-charcoal-card border border-white/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Are there any free games?</h3>
              <p className="text-gray-text">No, we focus exclusively on premium titles. Every game in our collection is a paid, high-quality experience.</p>
            </div>
            <div className="bg-charcoal-card border border-white/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">How do I create an account?</h3>
              <p className="text-gray-text">Click the "Login" button in the top navigation, then select "Create Account" to register for order tracking and library management.</p>
            </div>
            <div className="bg-charcoal-card border border-white/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Can I search for specific games?</h3>
              <p className="text-gray-text">Yes! Use the search icon in the navigation or press Ctrl+K to open the search overlay and find games by name.</p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center">
          <div className="bg-charcoal-card border border-white/20 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Still Need Help?</h2>
            <p className="text-gray-text mb-6">
              Can't find what you're looking for? Our support team is here to help!
            </p>
            <a 
              href="/contact-us" 
              className="neon-button primary text-lg px-8 py-3 font-semibold inline-block transform hover:scale-105 transition-all duration-300"
            >
              Contact Support
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Help;
