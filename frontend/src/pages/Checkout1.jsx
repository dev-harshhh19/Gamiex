import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../config/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getCartFromStorage, clearCart } from '../utils/cartUtils.jsx';

const Checkout = () => {
  const [cart, setCart] = useState(() => getCartFromStorage());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [message, setMessage] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  const loadPayPalScript = useCallback(() => {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_PAYPAL_CLIENT_ID}&currency=USD`;
    script.onload = () => {
      if (window.paypal && document.getElementById('paypal-button-container') && cart.totalAmount > 0) {
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: cart.totalAmount.toFixed(2),
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            try {
              const order = await actions.order.capture();
              // Send order details to your backend
              const orderData = {
                userId: user._id,
                items: cart.items,
                totalAmount: cart.totalAmount,
                customerInfo: {
                  name: user.name,
                  email: user.email,
                  address: user.address || '',
                  paymentMethod: 'PayPal',
                },
                paymentDetails: order, // Store PayPal order details
              };
              await api.post('/api/orders', orderData);
              clearCart();
              setCart({ items: [], totalAmount: 0 });
              setOrderPlaced(true);
              setMessage('Payment successful! Redirecting...');
              setTimeout(() => navigate('/'), 3000);
            } catch (err) {
              setError('Payment failed or order could not be placed.');
              console.error('PayPal onApprove error:', err);
            }
          },
          onError: (err) => {
            setError('PayPal error occurred.');
            console.error('PayPal onError:', err);
          },
        }).render('#paypal-button-container');
      }
    };
    script.onerror = () => {
      setError('Failed to load PayPal SDK.');
    };
    document.body.appendChild(script);
  }, [cart.totalAmount, user, navigate, setCart, cart.items]); // Added cart.items to dependencies

  useEffect(() => {
    if (user) {
      setValue('name', user.name || '');
      setValue('email', user.email || '');
    }

    if (selectedPaymentMethod === 'PayPal') {
      loadPayPalScript();
    }

  }, [user, setValue, selectedPaymentMethod, loadPayPalScript]);

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    if (cart.items.length === 0) {
      setError('Your cart is empty');
      setLoading(false);
      return;
    }

    if (data.paymentMethod === 'Credit Card' || data.paymentMethod === 'Debit Card') {
      setError('This payment method is currently under maintenance. Please choose PayPal.');
      setLoading(false);
      return;
    }

    if (data.paymentMethod === 'PayPal') {
      // For PayPal, the actual payment will be handled by the PayPal button
      setMessage('Proceeding to PayPal Sandbox...');
      setLoading(false);
      return;
    }
  };

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
    setValue('paymentMethod', e.target.value);
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-8 text-center animate-fade-in">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-green-500 mb-4">Order Placed Successfully!</h2>
        <p className="text-muted-foreground mb-6">Thank you for your purchase! Redirecting to homepage...</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-4xl font-bold text-foreground mb-8">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Shipping Information</h2>
          {error && <div className="bg-destructive text-destructive-foreground p-4 rounded-md mb-4">{error}</div>}
          {message && <div className="bg-green-100 text-green-800 p-3 rounded-md mb-4">{message}</div>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Form fields here */}
            <InputField label="Full Name" name="name" register={register} errors={errors} required />
            <InputField label="Email" name="email" type="email" register={register} errors={errors} required />
            <InputField label="Address" name="address" register={register} errors={errors} required />
            <SelectField label="Payment Method" name="paymentMethod" register={register} errors={errors} required onChange={handlePaymentMethodChange}>
              <option value="">Select payment method</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="PayPal">PayPal</option>

            </SelectField>

            {(selectedPaymentMethod === 'Credit Card' || selectedPaymentMethod === 'Debit Card') && (
              <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md">
                This payment method is currently under maintenance. Please choose PayPal.
              </div>
            )}

            {selectedPaymentMethod === 'PayPal' && (
              <div id="paypal-button-container"></div>
            )}

            <button
              type="submit"
              disabled={
                loading || selectedPaymentMethod !== 'PayPal'
              } 
              className="w-full bg-primary text-primary-foreground py-3 rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
        <div className="lg:col-span-1 bg-card border border-border rounded-lg p-6 h-fit">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Order Summary</h2>
          <div className="space-y-3 mb-6">
            {cart.items.length === 0 ? (
              <p className="text-muted-foreground">Your cart is empty.</p>
            ) : (
              cart.items.map(item => (
                <div key={item._id} className="flex justify-between items-center">
                  <p className="text-muted-foreground">{item.name} x {item.quantity}</p>
                  <p className="text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))
            )}
          </div>
          <div className="flex justify-between items-center border-t border-border pt-4">
            <p className="text-xl font-semibold text-foreground">Total</p>
            <p className="text-xl font-bold text-primary">${cart.totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </main>
  );
};

const InputField = ({ label, name, type = 'text', register, errors, required }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
    <input {...register(name, { required: required && `${label} is required` })} type={type} id={name} className={`w-full px-3 py-2 bg-input border ${errors[name] ? 'border-destructive' : 'border-border'} rounded-md focus:ring-ring focus:border-ring`} />
    {errors[name] && <p className="text-sm text-destructive mt-1">{errors[name].message}</p>}
  </div>
);

const SelectField = ({ label, name, register, errors, required, children, onChange }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
    <select {...register(name, { required: required && `${label} is required` })} id={name} className={`w-full px-3 py-2 bg-input border ${errors[name] ? 'border-destructive' : 'border-border'} rounded-md focus:ring-ring focus:border-ring`} onChange={onChange}>
      {children}
    </select>
    {errors[name] && <p className="text-sm text-destructive mt-1">{errors[name].message}</p>}
  </div>
);

export default Checkout;