import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  // Update page title
  useEffect(() => {
    document.title = 'Gaming Store - Premium Games Collection';
  }, []);

  const handleExploreGames = () => {
    navigate('/home/1/');
  };

  const handleViewCategory = (category) => {
    // For now, navigate to page 1 - category filtering can be implemented later
    navigate('/home/1/');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-dark via-charcoal to-charcoal-light opacity-90"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 text-white">
            Your Next Gaming
            <span className="block text-neon-blue glow-text">Obsession</span>
          </h1>
          <p className="text-xl md:text-3xl text-gray-text max-w-4xl mx-auto mb-16 leading-relaxed">
            Discover <span className="text-neon-blue font-semibold">53 premium games</span> that redefine immersion and challenge your skills in a universe of endless play.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={handleExploreGames}
              className="neon-button primary text-xl px-12 py-4 font-bold transform hover:scale-105 transition-all duration-300"
            >
              🎮 Explore All Games
            </button>
            <div className="text-gray-text text-lg">
              or browse by category below
            </div>
          </div>
        </div>

        {/* Floating game icons animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 text-4xl opacity-20 animate-bounce" style={{ animationDelay: '0s' }}>🎯</div>
          <div className="absolute top-40 right-20 text-3xl opacity-15 animate-bounce" style={{ animationDelay: '1s' }}>🏆</div>
          <div className="absolute bottom-40 left-20 text-5xl opacity-10 animate-bounce" style={{ animationDelay: '2s' }}>⚔️</div>
          <div className="absolute bottom-20 right-10 text-4xl opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}>🚀</div>
        </div>
      </section>

      {/* Game Categories Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">
            Browse by <span className="text-neon-blue">Category</span>
          </h2>
          <p className="text-gray-text text-xl max-w-2xl mx-auto">
            Jump straight to your favorite genre and discover your next gaming adventure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Action Games */}
          <div 
            onClick={() => handleViewCategory('Action')}
            className="group bg-charcoal-card border border-white/20 rounded-xl p-8 hover:border-neon-blue/50 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-2xl"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">⚔️</div>
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-neon-blue transition-colors">Action</h3>
            <p className="text-gray-text mb-4">Fast-paced adventures, epic battles, and adrenaline-pumping gameplay</p>
            <div className="text-neon-blue font-semibold">15+ Games →</div>
          </div>

          {/* RPG Games */}
          <div 
            onClick={() => handleViewCategory('RPG')}
            className="group bg-charcoal-card border border-white/20 rounded-xl p-8 hover:border-neon-blue/50 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-2xl"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🧙‍♂️</div>
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-neon-blue transition-colors">RPG</h3>
            <p className="text-gray-text mb-4">Immersive stories, character progression, and vast fantasy worlds</p>
            <div className="text-neon-blue font-semibold">12+ Games →</div>
          </div>

          {/* Racing Games */}
          <div 
            onClick={() => handleViewCategory('Racing')}
            className="group bg-charcoal-card border border-white/20 rounded-xl p-8 hover:border-neon-blue/50 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-2xl"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🏎️</div>
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-neon-blue transition-colors">Racing</h3>
            <p className="text-gray-text mb-4">High-speed thrills, stunning cars, and competitive racing action</p>
            <div className="text-neon-blue font-semibold">9+ Games →</div>
          </div>

          {/* Horror Games */}
          <div 
            onClick={() => handleViewCategory('Horror')}
            className="group bg-charcoal-card border border-white/20 rounded-xl p-8 hover:border-neon-blue/50 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-2xl"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">👻</div>
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-neon-blue transition-colors">Horror</h3>
            <p className="text-gray-text mb-4">Spine-chilling experiences, survival challenges, and atmospheric terror</p>
            <div className="text-neon-blue font-semibold">5+ Games →</div>
          </div>

          {/* Indie Games */}
          <div 
            onClick={() => handleViewCategory('Indie')}
            className="group bg-charcoal-card border border-white/20 rounded-xl p-8 hover:border-neon-blue/50 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-2xl"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">💎</div>
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-neon-blue transition-colors">Indie</h3>
            <p className="text-gray-text mb-4">Creative masterpieces, unique gameplay, and artistic innovation</p>
            <div className="text-neon-blue font-semibold">8+ Games →</div>
          </div>

          {/* Fighting Games */}
          <div 
            onClick={() => handleViewCategory('Fighting')}
            className="group bg-charcoal-card border border-white/20 rounded-xl p-8 hover:border-neon-blue/50 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-2xl"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🥊</div>
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-neon-blue transition-colors">Fighting</h3>
            <p className="text-gray-text mb-4">Competitive combat, martial arts mastery, and tournament action</p>
            <div className="text-neon-blue font-semibold">4+ Games →</div>
          </div>
        </div>
      </section>

      {/* Featured Stats Section */}
      <section className="bg-charcoal-light py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="text-5xl font-bold text-neon-blue mb-2 group-hover:scale-110 transition-transform duration-300">53+</div>
              <div className="text-xl text-white font-semibold mb-2">Premium Games</div>
              <div className="text-gray-text">Carefully curated collection</div>
            </div>
            <div className="group">
              <div className="text-5xl font-bold text-neon-blue mb-2 group-hover:scale-110 transition-transform duration-300">6</div>
              <div className="text-xl text-white font-semibold mb-2">Game Categories</div>
              <div className="text-gray-text">Something for every gamer</div>
            </div>
            <div className="group">
              <div className="text-5xl font-bold text-neon-blue mb-2 group-hover:scale-110 transition-transform duration-300">100%</div>
              <div className="text-xl text-white font-semibold mb-2">Premium Quality</div>
              <div className="text-gray-text">No free games, only the best</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
          Ready to Start Your
          <span className="block text-neon-blue glow-text">Gaming Journey?</span>
        </h2>
        <p className="text-xl text-gray-text max-w-3xl mx-auto mb-12">
          Browse through our complete collection of premium games and find your next obsession. 
          From indie gems to AAA blockbusters, we have something special waiting for you.
        </p>
        
        <button
          onClick={handleExploreGames}
          className="neon-button primary text-2xl px-16 py-6 font-bold transform hover:scale-105 transition-all duration-300"
        >
          🚀 Start Exploring Now
        </button>
      </section>
    </div>
  );
};

export default Landing;
