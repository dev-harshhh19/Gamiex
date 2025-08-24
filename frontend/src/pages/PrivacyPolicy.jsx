import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <div className="w-24 h-1 bg-charcoal-light mx-auto rounded-full"></div>
        </div>
        
        <div className="product-card p-8">
          <p className="text-gray-text mb-6">Last updated: August 18, 2025</p>
          <p className="text-white mb-6">This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
          <p className="text-gray-text mb-8">We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.</p>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-charcoal-light rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Information We Collect
              </h2>
              <p className="text-gray-text mb-4">We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
              <div className="space-y-3">
                <div className="p-4 bg-charcoal-light/50 rounded-lg border border-white/10">
                  <p className="text-white"><strong>Personal Information:</strong> Name, email address, phone number, and billing information.</p>
                </div>
                <div className="p-4 bg-charcoal-light/50 rounded-lg border border-white/10">
                  <p className="text-white"><strong>Usage Data:</strong> Information about how you use our website and services.</p>
                </div>
                <div className="p-4 bg-charcoal-light/50 rounded-lg border border-white/10">
                  <p className="text-white"><strong>Device Information:</strong> Browser type, operating system, and IP address.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-charcoal-light rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                How We Use Your Information
              </h2>
              <p className="text-gray-text mb-4">We use the information we collect to provide, maintain, and improve our services.</p>
              <ul className="space-y-2 text-gray-text">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-white mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Process transactions and send related information
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-white mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Send you technical notices and support messages
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-white mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Improve our website and services
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-charcoal-light rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                Data Security
              </h2>
              <p className="text-gray-text mb-4">We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-charcoal-light rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Contact Us
              </h2>
              <p className="text-gray-text mb-4">If you have any questions about this Privacy Policy, please contact us at:</p>
              <div className="p-4 bg-charcoal-light/50 rounded-lg border border-white/10">
                <a href="mailto:nikamharshadnikam@gmail.com" className="accent" style={{fontSize: '1.1rem'}}>Email: contact@gamiex.com</a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
