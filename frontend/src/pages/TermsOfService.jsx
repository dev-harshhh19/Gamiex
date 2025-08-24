import React from 'react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms & Conditions</h1>
          <div className="w-24 h-1 bg-charcoal-light mx-auto rounded-full"></div>
        </div>

        <div className="product-card p-8">
          <div className="mb-6 p-4 rounded-lg bg-warning-orange/20 border border-warning-orange/30 text-warning-orange">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <strong>Important Notice:</strong> Gamiex is a hobby/educational project. Do not make real payments.
              </div>
            </div>
          </div>

          <p className="text-gray-text mb-6">Last updated: August 18, 2025</p>
          <p className="text-white mb-8">Please read these terms and conditions carefully before using Our Service.</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-charcoal-light rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                Acknowledgment
              </h2>
              <p className="text-gray-text mb-4">These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company.</p>
              <p className="text-gray-text mb-4">By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-charcoal-light rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </div>
                Orders & Payments
              </h2>
              <p className="text-gray-text mb-4">This is a demonstration project. No real transactions are processed. All payment information is for educational purposes only.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-charcoal-light rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                Privacy & Data
              </h2>
              <p className="text-gray-text mb-4">We respect your privacy and are committed to protecting your personal data. Please review our Privacy Policy for detailed information.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-charcoal-light rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Contact Information
              </h2>
              <p className="text-gray-text mb-4">If you have any questions about these Terms and Conditions, please contact us at:</p>
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

export default TermsOfService;
