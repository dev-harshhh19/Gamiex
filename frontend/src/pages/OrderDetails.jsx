import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../config/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const OrderDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const { data } = await api.get(`/api/orders/${id}`);
        setOrder(data.data);
      } catch (err) {
        setError('Failed to fetch order details.');
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user && localStorage.getItem('token')) {
      fetchOrderDetails();
    }
  }, [id, user]);

  if (loading) {
    return <div className="text-center py-16">Loading order details...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-destructive">{error}</div>;
  }

  if (!order) {
    return <div className="text-center py-16">No order details found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-foreground mb-6">Order Details</h1>
      <div className="bg-card p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Order ID</p>
            <p className="text-lg font-semibold text-foreground">{order._id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Date</p>
            <p className="text-lg font-semibold text-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p className="text-lg font-semibold text-foreground">{order.status}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total</p>
            <p className="text-lg font-semibold text-foreground">${order.totalAmount.toFixed(2)}</p>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.productId} className="p-4 border border-border rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <p className="text-lg font-semibold text-foreground">${item.price.toFixed(2)}</p>
                </div>
                {Array.isArray(item.codes) && item.codes.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-foreground mb-1">Redeem Codes:</p>
                    <ul className="list-disc ml-6 space-y-1">
                      {item.codes.map((code, idx) => (
                        <li key={idx} className="font-mono bg-muted px-2 py-1 rounded">
                          {code}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-muted-foreground mt-2">Use these codes in your game launcher or the redemption portal to claim your game.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
