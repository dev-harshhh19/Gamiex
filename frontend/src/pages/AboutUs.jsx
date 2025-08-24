import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Us</h1>
          <div className="w-24 h-1 bg-charcoal-light mx-auto rounded-full"></div>
          <p className="text-gray-text mt-4 text-lg">Discover the story behind Gamiex</p>
        </div>

        <div className="space-y-8">
          {/* Main Story */}
          <div className="product-card p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-charcoal-light rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">Our Story</h2>
            </div>
            
            <div className="space-y-6 text-gray-text text-lg leading-relaxed">
              <p>
                Welcome to <span className="text-white font-semibold">Gamiex</span>, your premium destination for games and gaming accessories. We're dedicated to curating great titles, gear, and deals with a focus on quality, customer service, and a smooth shopping experience.
              </p>
              <p>
                Founded in 2025, Gamiex has come a long way from its beginnings. When we first started out, our passion for providing the best products drove us to do intense research and gave us the impetus to turn hard work and inspiration into a booming online store.
              </p>
              <p>
                We now serve customers all over the world, and are thrilled to be a part of the gaming community. Our mission is to bring you the latest and greatest in gaming, from indie gems to AAA blockbusters.
              </p>
            </div>
          </div>

          {/* Mission & Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="product-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-charcoal-light rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Our Mission</h3>
              </div>
              <p className="text-gray-text">
                To provide gamers worldwide with access to the best gaming experiences, from cutting-edge hardware to the most engaging software, all while maintaining the highest standards of customer service.
              </p>
            </div>

            <div className="product-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-charcoal-light rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Our Values</h3>
              </div>
              <ul className="space-y-2 text-gray-text">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Quality products and services
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Customer satisfaction first
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Innovation and excellence
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Community and connection
                </li>
              </ul>
            </div>
          </div>

          {/* Team Message */}
          <div className="product-card p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-6">A Message from Our Team</h3>
              <p className="text-gray-text text-lg mb-6">
                We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us. We're here to help make your gaming experience extraordinary.
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 bg-charcoal-light rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold text-lg">Sincerely,</p>
                  <p className="text-white font-bold text-xl">The Gamiex Team</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
