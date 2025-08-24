const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// @desc    Get all products with optional filtering
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, brand } = req.query;
    const limit = parseInt(req.query.limit) || 30; // Default limit to 30
    const skip = parseInt(req.query.skip) || 0;   // Default skip to 0

    // Build filter object
    let filter = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    // Add other filters if they are implemented (category, minPrice, maxPrice, brand)
    // if (category) { filter.category = category; }
    // if (minPrice) { filter.price = { ...filter.price, $gte: parseFloat(minPrice) }; }
    // if (maxPrice) { filter.price = { ...filter.price, $lte: parseFloat(maxPrice) }; }
    // if (brand) { filter.brand = brand; }


    // Get total count of products matching the query (without pagination)
    const totalProducts = await Product.countDocuments(filter);

    // Fetch products with pagination
    const products = await Product.find(filter)
                                  .skip(skip)
                                  .limit(limit);

    res.json({
      success: true,
      count: products.length, // This will be the count of products on the current page
      totalProducts: totalProducts, // Send total count to frontend
      data: products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Add new product
// @route   POST /api/products
// @access  Public (for seeding purposes)
router.post('/', async (req, res) => {
  try {
    const {
      _id,
      name,
      price,
      description,
      imageUrl,
      category,
      publisher,
      developer,
      platforms,
      tags,
      releaseDate,
      ageRating,
      trailerUrl,
      screenshots,
      requirements
    } = req.body;

    const product = await Product.create({
      _id: _id || `product_${Date.now()}`,
      name,
      price,
      description,
      imageUrl,
      category,
      publisher: publisher || 'Unknown Publisher',
      developer: developer || 'Unknown Developer',
      platforms: platforms || ['PC'],
      tags: tags || [],
      releaseDate: releaseDate || new Date(),
      ageRating: ageRating || 'E',
      trailerUrl,
      screenshots: screenshots || [],
      requirements: requirements || {}
    });

    res.status(201).json({
      success: true,
      data: product
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

// @desc    Create Base Pay payment link
// @route   POST /api/payments/create-basepay-link
// @access  Public (or Private, depending on security needs)
router.post('/create-basepay-link', async (req, res) => {
  try {
    const { amount, currency } = req.body;

    // In a real application, you would integrate with the Base Pay API here
    // to generate a real payment link or QR code.
    // This is a placeholder for demonstration purposes.

    if (!amount || !currency) {
      return res.status(400).json({
        success: false,
        message: 'Amount and currency are required.'
      });
    }

    // Simulate a payment link generation
    const simulatedPaymentLink = `https://example.com/basepay-checkout?amount=${amount}&currency=${currency}&orderId=${Date.now()}`;
    const simulatedQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(simulatedPaymentLink)}`;

    res.status(200).json({
      success: true,
      url: simulatedPaymentLink,
      qrCodeUrl: simulatedQrCodeUrl,
      message: 'Simulated Base Pay link created successfully.'
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