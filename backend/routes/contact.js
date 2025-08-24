const express = require('express');
const router = express.Router();

// @desc    Handle contact form submission
// @route   POST /api/contact
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and message'
      });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // In a real application, you would:
    // 1. Save the contact message to database
    // 2. Send email notification to admin email
    // 3. Send auto-reply to the user from public contact email

    // For now, we'll just log the contact attempt
    console.log('📧 New Contact Form Submission:');
    console.log(`From: ${name} <${email}>`);
    console.log(`Message: ${message}`);
    console.log(`Notification will be sent to: ${process.env.ADMIN_EMAIL}`);
    console.log(`Reply-to address shown to user: ${process.env.PUBLIC_CONTACT_EMAIL}`);
    console.log('---');

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Thank you for your message! We will get back to you within 24 hours.',
      data: {
        contactEmail: process.env.PUBLIC_CONTACT_EMAIL, // Display email for user
        responseTime: '24 hours'
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
  }
});

// @desc    Get contact information
// @route   GET /api/contact/info
// @access  Public
router.get('/info', (req, res) => {
  res.json({
    success: true,
    data: {
      email: process.env.PUBLIC_CONTACT_EMAIL, // Public display email
      responseTime: 'Within 24 hours',
      supportHours: 'Monday - Friday, 9 AM - 6 PM',
      socialMedia: {
        github: 'https://github.com/dev-harshhh19',
        linkedin: 'https://in.linkedin.com/in/harshad-nikam-311734281',
        instagram: 'https://instagram.com/dev.harshhh19/',
        twitter: 'https://twitter.com/not_harshad_19/'
      }
    }
  });
});

module.exports = router;
