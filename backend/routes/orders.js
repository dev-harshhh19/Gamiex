const express = require('express');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { items, totalAmount, customerInfo } = req.body;

    // Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items'
      });
    }

    if (!customerInfo || !customerInfo.name || !customerInfo.address || !customerInfo.paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Customer information is required'
      });
    }

    // Generate redeem codes for each item based on quantity
    const generatedItems = items.map((it) => {
      const codes = Array.from({ length: it.quantity }, () =>
        // Simple readable code: 4-4-4 alphanumeric
        Math.random().toString(36).slice(2, 6).toUpperCase() + '-' +
        Math.random().toString(36).slice(2, 6).toUpperCase() + '-' +
        Math.random().toString(36).slice(2, 6).toUpperCase()
      );
      return { ...it, codes };
    });

    // Create order
    const order = await Order.create({
      userId: req.user._id,
      items: generatedItems,
      totalAmount,
      customerInfo
    });

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Get order by id (includes codes)
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Create PayPal order
// @route   POST /api/orders/paypal-create-order
// @access  Private
router.post('/paypal-create-order', protect, async (req, res) => {
  try {
    // Placeholder for PayPal order creation logic
    // In a real application, you would interact with PayPal API here
    // using process.env.PAYPAL_CLIENT_ID and process.env.PAYPAL_CLIENT_SECRET
    console.log('PayPal Create Order Placeholder', req.body);
    res.status(200).json({
      success: true,
      orderId: 'ORDER_ID_FROM_PAYPAL' // Replace with actual PayPal order ID
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Capture PayPal order
// @route   POST /api/orders/paypal-capture-order
// @access  Private
router.post('/paypal-capture-order', protect, async (req, res) => {
  try {
    const { orderId } = req.body;
    // Placeholder for PayPal order capture logic
    // In a real application, you would interact with PayPal API here
    console.log('PayPal Capture Order Placeholder', orderId);
    res.status(200).json({
      success: true,
      message: 'Payment captured successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

module.exports = router;