const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  items: [{
    productId: {
      type: String,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    // Redeem codes generated per item (one per quantity)
    codes: {
      type: [String],
      default: []
    }
  }],
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  customerInfo: {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Customer address is required'],
      trim: true
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: ['Credit Card', 'Debit Card', 'PayPal', 'Cash on Delivery']
    }
  },
  paymentDetails: {
    type: Object, // To store PayPal transaction details
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);