# Gamiex - Premium E-commerce Platform

A modern e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js) offering a premium shopping experience.

## Features

- **Product Browsing**: View all products with filtering by category and price range
- **Product Details**: Detailed product information with add to cart functionality
- **Shopping Cart**: Add, remove, and update quantities of items
- **User Authentication**: Register, login, and logout with JWT tokens
- **Checkout Process**: Simple checkout form for placing orders
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 (JSX), React Router, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT tokens with bcrypt password hashing
- **Styling**: Tailwind CSS for responsive design
- **Forms**: React Hook Form for form validation and validation
- **File Structure**: JSX components for better organization

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (free tier available)
- npm or yarn package manager

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd simple-ecommerce
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/simple-ecommerce
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Database Setup (MongoDB Atlas)

**📋 For detailed MongoDB Atlas setup instructions, see [MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md)**

**Quick Setup:**
1. Create free MongoDB Atlas account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a cluster and database user
3. Get your connection string
4. Update your `backend/.env` file:
   ```env
   MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/simple-ecommerce?retryWrites=true&w=majority
   ```

5. **Seed the database with sample products:**
   ```bash
   cd backend
   npm run data:import
   ```

   To clear the database:
   ```bash
   npm run data:destroy
   ```

## Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:5000

### Start Frontend Development Server
```bash
cd frontend
npm start
```
Frontend will run on http://localhost:3000

## API Endpoints

### Products
- `GET /api/products` - Get all products (with optional filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Add new product

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Orders
- `POST /api/orders` - Create new order (protected)
- `GET /api/orders` - Get user orders (protected)

## Project Structure

```
primeekart/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── data/
│   │   └── products.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Product.js
│   │   ├── User.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── products.js
│   │   ├── auth.js
│   │   └── orders.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env
│   ├── package.json
│   ├── seeder.js
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── FilterBar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   └── Register.jsx
│   │   ├── utils/
│   │   │   └── cartUtils.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── index.js
│   └── package.json
└── README.md
```

## Usage

1. **Browse Products**: Visit the home page to see all products
2. **Filter Products**: Use the filter bar to search by category or price range
3. **View Product Details**: Click on any product to see detailed information
4. **Add to Cart**: Add products to your shopping cart
5. **Register/Login**: Create an account or login to access checkout
6. **Checkout**: Complete your purchase with the checkout form

## Sample Data

The application comes with 6 sample products across different categories:
- Electronics (Headphones, Smartphone Case)
- Clothing (T-Shirt)
- Books (JavaScript Programming Book)
- Home (Coffee Maker)
- Sports (Yoga Mat)

## Development Notes

- This is a learning project and not production-ready
- No real payment processing is implemented
- Images are hosted on Unsplash
- Cart data is stored in localStorage
- JWT tokens expire in 30 days

## License

This project is for educational purposes only.