const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const validateEnvironment = require('./config/validateEnv.js');

// Load environment variables
dotenv.config({ path: './.env' });

// Validate environment variables
validateEnvironment();

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Auth rate limiting (more restrictive)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: 'Too many authentication attempts, please try again later.'
});

// Middleware - CORS Configuration
const allowedOrigins = [
  'https://gamiex.vercel.app',
  'https://gamiex-q0tr01fmz-dev-harshhh18s-projects.vercel.app',
  'https://gamiex-4szwzzpoq-dev-harshhh18s-projects.vercel.app',
  'https://gamiex-6kowqrvka-dev-harshhh18s-projects.vercel.app',
  'https://gamiex-1g2t29zqr-dev-harshhh18s-projects.vercel.app',
  'https://gamiex-3g7newwqu-dev-harshhh18s-projects.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001'
];

// Add FRONTEND_URL from environment if specified
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin contains any of our allowed domains
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      return origin === allowedOrigin || 
             origin.startsWith('https://gamiex') ||
             origin.startsWith('http://localhost');
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Simple E-commerce API is running!' });
});

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/contact', require('./routes/contact'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});