const PAYMENT_PROVIDERS = {
  RAZORPAY: 'Razorpay',
  PAYPAL: 'PayPal',
  STRIPE: 'Stripe',
  BASEPAY: 'BasePay',
  CASH_ON_DELIVERY: 'CashOnDelivery',
};

const paymentService = {
  initializeProviders: async () => {
    // Simulate fetching available providers
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: PAYMENT_PROVIDERS.RAZORPAY,
            name: 'Razorpay',
            description: 'Pay securely with UPI, Netbanking, Cards',
            icon: 'https://cdn.razorpay.com/static/assets/pay_with_razorpay.png',
            fees: '0% fees',
            processingTime: 'Instant',
          },
          {
            id: PAYMENT_PROVIDERS.PAYPAL,
            name: 'PayPal',
            description: 'Pay with your PayPal account',
            icon: 'https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_74x46.jpg',
            fees: '2.9% + $0.30',
            processingTime: 'Instant',
          },
          {
            id: PAYMENT_PROVIDERS.STRIPE,
            name: 'Credit/Debit Card',
            description: 'Pay with Visa, Mastercard, Amex',
            icon: 'https://stripe.com/img/v3/home/social.png',
            fees: '2.9% + $0.30',
            processingTime: 'Instant',
          },
          {
            id: PAYMENT_PROVIDERS.BASEPAY,
            name: 'Base Pay (USDC)',
            description: 'Pay with USDC on Base network',
            icon: 'https://base.org/images/base-logo.svg',
            fees: 'Low fees',
            processingTime: 'Instant',
          },

        ]);
      }, 500);
    });
  },

  processPayment: async (paymentDetails, providerId) => {
    // Simulate payment processing
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% success rate
          resolve({
            success: true,
            paymentId: `sim_pay_${Date.now()}`,
            orderId: paymentDetails.orderId,
            amount: paymentDetails.amount,
            currency: paymentDetails.currency,
            status: 'completed',
          });
        } else {
          reject({
            success: false,
            error: 'Simulated payment failed',
            status: 'failed',
          });
        }
      }, 1500);
    });
  },

  verifyPayment: async (verificationDetails) => {
    // Simulate payment verification
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          verified: true,
          message: 'Simulated payment verified',
        });
      }, 500);
    });
  },

  fromRazorpayAmount: (amount) => {
    // Simulate conversion from Razorpay's smallest unit (paise) to INR
    return amount / 100;
  },
};

export default paymentService;
export { PAYMENT_PROVIDERS };
